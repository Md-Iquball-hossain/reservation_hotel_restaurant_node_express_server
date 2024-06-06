import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";
import {
  ICreateOrderItemsPayload,
  IUpdateKitchenStatusPayload,
  IUpdateOrderItemsPayload,
  IUpdateOrderStatus,
  IUpdateTableName,
  IupdateOrderBody,
} from "../utils/interfaces/order.interface";

export class ResOrderService extends AbstractServices {
  constructor() {
    super();
  }

  // ============== Create Order =============== //

  // Create Order
  public async createOrder(req: Request) {
    return await this.db.transaction(async (trx) => {
      const { id: res_admin, res_id, hotel_id } = req.rest_user;
      const {
        order_items,
        tab_id,
        note,
        email,
        name,
        staff_id,
        order_type,
        sub_tab_name,
      } = req.body;

      const model = this.Model.restaurantModel(trx);
      const guestModel = this.Model.guestModel(trx);

      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      const day = new Date().getDate();

      let userID = null;
      let userLastBalance = 0;

      if (email) {
        const checkUser = await guestModel.getSingleGuest({ email, hotel_id });

        if (checkUser.length) {
          userID = checkUser[0].id;
          userLastBalance = checkUser[0].last_balance;
        } else {
          const userRes = await guestModel.createGuest({
            name,
            email,
            hotel_id,
          });
          userID = userRes[0];
        }

        await guestModel.createUserType({
          user_id: userID,
          user_type: "res-guest",
        });
      }

      const orderItemIds = order_items.map((item: any) => item.food_id);

      // get all food order
      const { data: getAllFood } = await model.getAllFood({
        res_id,
        ids: orderItemIds,
      });

      if (orderItemIds.length !== getAllFood.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_BAD_REQUEST,
          message: "Invalid food id",
        };
      }

      let grand_total = 0;
      const orderData = await model.getAllIOrderForLastId();
      const orderNo = orderData.length ? orderData[0].id + 1 : 1;

      for (let i = 0; i < order_items.length; i++) {
        for (let j = 0; j < getAllFood.length; j++) {
          if (order_items[i].food_id == getAllFood[j].id) {
            grand_total += order_items[i].quantity * getAllFood[i].retail_price;
          }
        }
      }

      const createdOrderRes = await model.createOrder({
        res_id,
        user_id: userID,
        token_no: `${year}${month}${day}-${orderNo}`,
        order_no: `ORD-F${year}-${orderNo}`,
        staff_id,
        order_category: "front-desk",
        status: "confirmed",
        kitchen_status: "preparing",
        order_type,
        note,
        grand_total,
        sub_total: grand_total,
        created_by: res_admin,
      });

      const orderItems: {
        order_id: number;
        food_id: number;
        name: string;
        quantity: number;
        rate: number;
        total: number;
      }[] = [];

      for (let i = 0; i < order_items.length; i++) {
        for (let j = 0; j < getAllFood.length; j++) {
          if (order_items[i].food_id == getAllFood[j].id) {
            orderItems.push({
              food_id: order_items[i].food_id,
              name: getAllFood[j].food_name,
              order_id: createdOrderRes[0],
              quantity: order_items[i].quantity,
              rate: getAllFood[i].retail_price,
              total: order_items[i].quantity * getAllFood[i].retail_price,
            });
          }
        }
      }

      // insert order items
      await model.insertOrderItems(orderItems);

      const table_order_pld = {
        res_id,
        order_id: createdOrderRes[0],
        tab_id,
        name: sub_tab_name,
        status: "booked",
      };

      // insert in table order
      await model.insertInTableOrder(table_order_pld);

      // update res table status
      await model.updateTable(tab_id, res_id, { status: "booked" });

      return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: "Order Confirmed successfully.",
      };
    });
  }

  // Update Order
  public async updateOrder(req: Request) {
    return await this.db.transaction(async (trx) => {
      const { res_id } = req.rest_user;
      const { id } = req.params;
      const { order_items_modify } = req.body;

      const model = this.Model.restaurantModel(trx);

      const getSingleOrder = await model.getSingleOrder(parseInt(id), res_id);

      if (!getSingleOrder.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_NOT_FOUND,
          message: this.ResMsg.HTTP_NOT_FOUND,
        };
      }

      const orderItemIds = order_items_modify.map((item: any) => item.food_id);

      // get all food order
      const { data: getAllFood } = await model.getAllFood({
        res_id,
        ids: orderItemIds,
      });

      if (orderItemIds.length !== getAllFood.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_BAD_REQUEST,
          message: "Invalid food id",
        };
      }

      let grand_total = 0;
      for (let i = 0; i < order_items_modify.length; i++) {
        for (let j = 0; j < getAllFood.length; j++) {
          if (order_items_modify[i].food_id == getAllFood[j].id) {
            grand_total +=
              order_items_modify[i].quantity * getAllFood[i].retail_price;
          }
        }
      }

      // delete past order items
      await model.deleteOrderItems(parseInt(id));

      const orderItems: {
        order_id: number;
        food_id: number;
        name: string;
        quantity: number;
        rate: number;
        total: number;
      }[] = [];

      for (let i = 0; i < order_items_modify.length; i++) {
        for (let j = 0; j < getAllFood.length; j++) {
          if (order_items_modify[i].food_id == getAllFood[j].id) {
            orderItems.push({
              food_id: order_items_modify[i].food_id,
              name: getAllFood[j].food_name,
              order_id: parseInt(id),
              quantity: order_items_modify[i].quantity,
              rate: getAllFood[i].retail_price,
              total:
                order_items_modify[i].quantity * getAllFood[i].retail_price,
            });
          }
        }
      }

      // insert order items
      await model.insertOrderItems(orderItems);

      // update order
      await model.updateOrder(parseInt(id), res_id, {
        grand_total,
        sub_total: grand_total,
      });

      return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: "Order Updated successfully.",
      };
    });
  }

  //order payment
  public async OrderPayment(req: Request) {
    return await this.db.transaction(async (trx) => {
      const { res_id, id: res_admin, hotel_id } = req.rest_user;
      const { id } = req.params;
      console.log(req.body);
      const { discount, vat, ac_tr_ac_id, include_with_hotel, paid_amount } =
        req.body;

      const model = this.Model.restaurantModel(trx);
      const guestModel = this.Model.guestModel(trx);

      const getSingleOrder = await model.getSingleOrder(parseInt(id), res_id);

      if (!getSingleOrder.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_NOT_FOUND,
          message: this.ResMsg.HTTP_NOT_FOUND,
        };
      }

      const { guest_id, grand_total, table_id } = getSingleOrder[0];

      console.log({ getSingleOrder });

      let nowPayableAmount = 0;
      nowPayableAmount = parseFloat(grand_total) + vat - discount;
      if (guest_id) {
        const getSingleGuest = await guestModel.getSingleGuest({
          id: guest_id,
        });

        const { last_balance } = getSingleGuest[0];

        if (include_with_hotel) {
          // order update
          await model.updateOrder(parseInt(id), res_id, {
            include_with_hotel: 1,
            payable_amount: nowPayableAmount,
            vat,
            status: "finished",
          });

          // get user last ledger balance
          const userLastBalance = await guestModel.getLedgerLastBalanceByUser({
            hotel_id,
            user_id: guest_id,
          });

          const nowUserLastBalance = userLastBalance - nowPayableAmount;
          // insert in user ledger
          await guestModel.insertGuestLedger({
            hotel_id,
            user_id: guest_id,
            amount: nowPayableAmount,
            pay_type: "debit",
            name: `FOOD-O-${id}`,
            last_balance: nowUserLastBalance,
          });
        } else {
          if (paid_amount < nowPayableAmount)
            return {
              success: false,
              code: this.StatusCode.HTTP_BAD_REQUEST,
              message: "Paid amount is less than payable amount",
            };

          // changeable amount step
          const extra_amount = paid_amount - nowPayableAmount;

          // Check account
          const checkAccount = await model.getSingleAccount({
            res_id,
            id: ac_tr_ac_id,
          });

          if (!checkAccount.length) {
            return {
              success: false,
              code: this.StatusCode.HTTP_NOT_FOUND,
              message: "Account not found",
            };
          }

          // order update
          await model.updateOrder(parseInt(id), res_id, {
            is_paid: 1,
            ac_tr_ac_id,
            status: "finished",
            payable_amount: nowPayableAmount,
            vat,
            changeable_amount: extra_amount,
          });

          //================= last balance for debit ============ //

          // get user last ledger balance
          const userLastBalance = await guestModel.getLedgerLastBalanceByUser({
            hotel_id,
            user_id: guest_id,
          });

          const nowUserLastBalance = userLastBalance - nowPayableAmount;

          // insert in user ledger
          await guestModel.insertGuestLedger({
            hotel_id,
            user_id: guest_id,
            amount: nowPayableAmount,
            pay_type: "debit",
            name: `FOOD-O-${id}`,
            last_balance: nowUserLastBalance,
          });

          // =========================== last balance for credit =============== //

          const nowUserLasttBalance = nowUserLastBalance + nowPayableAmount;

          // insert in user ledger
          await guestModel.insertGuestLedger({
            hotel_id,
            user_id: guest_id,
            amount: nowPayableAmount,
            pay_type: "credit",
            name: `FOOD-O-${id}`,
            last_balance: nowUserLasttBalance,
          });
        }
      } else {
        if (include_with_hotel && !guest_id) {
          return {
            success: false,
            code: this.StatusCode.HTTP_BAD_REQUEST,
            message:
              "You cannot include with hotel cause this user has no account",
          };
        }

        if (paid_amount < nowPayableAmount)
          return {
            success: false,
            code: this.StatusCode.HTTP_BAD_REQUEST,
            message: "Paid amount is less than payable amount",
          };

        // Check account
        const checkAccount = await model.getSingleAccount({
          res_id,
          id: ac_tr_ac_id,
        });

        if (!checkAccount.length) {
          return {
            success: false,
            code: this.StatusCode.HTTP_NOT_FOUND,
            message: "Account not found",
          };
        }

        // changeable amount step
        const extra_amount = paid_amount - nowPayableAmount;

        // order update
        await model.updateOrder(parseInt(id), res_id, {
          is_paid: 1,
          ac_tr_ac_id,
          vat,
          status: "finished",
          payable_amount: nowPayableAmount,
          changeable_amount: extra_amount,
        });
      }

      //==============================//

      if (!include_with_hotel) {
        // Insert account transaction
        const transactionRes = await model.insertAccountTransaction({
          res_id,
          ac_tr_ac_id,
          ac_tr_cash_in: nowPayableAmount,
        });

        // Get last ledger balance
        const ledgerLastBalance = await model.getAllLedgerLastBalanceByAccount({
          res_id,
          ledger_account_id: ac_tr_ac_id,
        });

        const available_balance =
          parseFloat(ledgerLastBalance) + nowPayableAmount;

        // Insert account ledger
        await model.insertAccountLedger({
          ac_tr_id: transactionRes[0],
          ledger_credit_amount: nowPayableAmount,
          ledger_details: `Balance Credited by Restaurant order`,
          ledger_balance: available_balance,
        });

        // Update account last balance
        await model.upadateSingleAccount(
          { last_balance: available_balance },
          { res_id, id: ac_tr_ac_id }
        );
      }

      // check if any sub table booked or not, if not then main res table status will be changed
      const { data: orderExistOrNot } = await model.getAllOrder({
        res_id,
        tab_id: table_id,
        limit: "1",
        skip: "0",
        status: "confirmed",
      });

      if (!orderExistOrNot.length) {
        await model.updateTable(table_id, res_id, { status: "available" });
      }

      return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: "Order Payment successfully",
      };
    });
  }

  // Get all Order
  public async getAllOrder(req: Request) {
    const { res_id } = req.rest_user;

    const {
      limit,
      skip,
      status,
      kitchen_status,
      order_category,
      staff_name,
      is_paid,
      from_date,
      to_date,
      key,
      tab_id,
    } = req.query;

    const model = this.Model.restaurantModel();

    const { data, total } = await model.getAllOrder({
      kitchen_status: kitchen_status as string,
      order_category: order_category as string,
      is_paid: is_paid as string,
      staff_name: staff_name as string,
      tab_id: parseInt(tab_id as string),
      status: status as string,
      key: key as string,
      limit: limit as string,
      skip: skip as string,
      from_date: from_date as string,
      to_date: to_date as string,
      res_id,
    });
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total,
      data,
    };
  }

  // get single Order
  public async getSingleOrder(req: Request) {
    const { id } = req.params;
    const { res_id } = req.rest_user;

    const data = await this.Model.restaurantModel().getSingleOrder(
      parseInt(id),
      res_id
    );

    if (!data.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data: data[0],
    };
  }

  // Get all Kitchen order
  public async getAllKitchenOrder(req: Request) {
    const { res_id } = req.rest_user;

    const model = this.Model.restaurantModel();
    const { limit, skip, order_no, table_name, kitchen_status } = req.query;

    const { data, total } = await model.getAllKitchenOrder({
      res_id,
      order_no: order_no as string,
      table_name: table_name as string,
      kitchen_status: kitchen_status as string,
      limit: limit as string,
      skip: skip as string,
    });
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total,
      data,
    };
  }

  // Update kitchen status
  public async updateKitchenStatus(req: Request) {
    return await this.db.transaction(async (trx) => {
      const { res_id } = req.rest_user;
      const { id } = req.params;
      const model = this.Model.restaurantModel(trx);
      const getSingleOrder = await model.getSingleOrder(parseInt(id), res_id);

      if (!getSingleOrder.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_NOT_FOUND,
          message: "Order not found",
        };
      }

      const { kitchen_status, order_items } = getSingleOrder[0];

      if (kitchen_status == "completed") {
        return {
          success: false,
          code: this.StatusCode.HTTP_CONFLICT,
          message: "Already updated",
        };
      }

      const food_ids = order_items.map((item: any) => item.food_id);

      // get all food
      const { data: getAllFood } = await model.getAllFood({
        res_id,
        ids: food_ids,
      });

      let allFoodIngredients: {
        ingredient_id: number;
        ing_quantity: number;
      }[] = [];

      for (let i = 0; i < getAllFood.length; i++) {
        allFoodIngredients = [
          ...allFoodIngredients,
          ...getAllFood[i].food_items,
        ];
      }

      let bundleAllFoodIngredients: {
        ingredient_id: number;
        ing_quantity: number;
      }[] = [];

      for (let i = 0; i < allFoodIngredients.length; i++) {
        let found = false;
        for (let j = 0; j < bundleAllFoodIngredients.length; j++) {
          if (
            allFoodIngredients[i].ingredient_id ==
            bundleAllFoodIngredients[j].ingredient_id
          ) {
            bundleAllFoodIngredients[j].ing_quantity +=
              allFoodIngredients[i].ing_quantity;
            found = true;
            break;
          }
        }

        if (!found) {
          bundleAllFoodIngredients.push({
            ingredient_id: allFoodIngredients[i].ingredient_id,
            ing_quantity: allFoodIngredients[i].ing_quantity,
          });
        }
      }

      const ing_ids = allFoodIngredients.map((item: any) => item.ingredient_id);

      // get ingredients from inventory
      const getInventoryIngredients = await model.getAllInventory({
        res_id,
        ing_ids,
      });

      const remainIngredient: { id: number; available_quantity: number }[] = [];

      for (let i = 0; i < getInventoryIngredients.length; i++) {
        for (let j = 0; j < bundleAllFoodIngredients.length; j++) {
          if (
            getInventoryIngredients[i].ing_id ==
            bundleAllFoodIngredients[j].ingredient_id
          ) {
            remainIngredient.push({
              id: getInventoryIngredients[i].id,
              available_quantity:
                getInventoryIngredients[i].available_quantity -
                bundleAllFoodIngredients[j].ing_quantity,
            });
          }
        }
      }

      // now inventory update
      Promise.all(
        remainIngredient.map(async (item) => {
          await model.updateInInventory(
            { available_quantity: item.available_quantity },
            { id: item.id }
          );
        })
      );

      const res = await model.updateKitchenStatus(parseInt(id), {
        kitchen_status: req.body.kitchen_status,
      });

      return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: "Kitchen Status updated successfully",
      };
    });
  }

  // get All guest service
  public async getAllGuest(req: Request) {
    const { key, email, limit, skip, user_type } = req.query;
    const { hotel_id } = req.rest_user;

    // model
    const model = this.Model.restaurantModel();

    const { data, total } = await model.getAllGuest({
      key: key as string,
      email: email as string,
      user_type: user_type as string,
      limit: limit as string,
      skip: skip as string,
      hotel_id,
    });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total,
      data,
    };
  }

  // create table Service
  public async createTable(req: Request) {
    return await this.db.transaction(async (trx) => {
      const { id, res_id } = req.rest_user;
      const { name, category } = req.body;

      const Model = this.Model.restaurantModel();

      // table check

      const { data: checkName } = await Model.getAllTableName({
        name,
        res_id,
      });

      if (checkName.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_CONFLICT,
          message: "Table Name already exists, give another unique name",
        };
      }

      await Model.createTable({
        res_id,
        name,
        category,
        created_by: id,
      });

      return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: "Table created successfully.",
      };
    });
  }

  // Get all Table
  public async getAllTable(req: Request) {
    const { res_id } = req.rest_user;

    const { limit, skip, name, category } = req.query;

    const model = this.Model.restaurantModel();

    const { data, total } = await model.getAllTable({
      res_id,
      name: name as string,
      category: category as string,
      limit: limit as string,
      skip: skip as string,
    });
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total,
      data,
    };
  }

  // Update table
  public async updateTableName(req: Request) {
    return await this.db.transaction(async (trx) => {
      const { res_id } = req.rest_user;
      const { id } = req.params;

      const updatePayload = req.body as IUpdateTableName;

      const model = this.Model.restaurantModel(trx);

      const getSingleTable = await model.getSingleTable(parseInt(id), res_id);

      const table_status = getSingleTable.table_status;

      if (table_status != "booked") {
        await model.updateTableName(parseInt(id), res_id, {
          name: updatePayload.name,
          status: updatePayload.status,
        });
        return {
          success: true,
          code: this.StatusCode.HTTP_OK,
          message: "Table updated successfully",
        };
      } else {
        return {
          success: false,
          code: this.StatusCode.HTTP_NOT_FOUND,
          message: "Table Status is Booked so can't update",
        };
      }
    });
  }

  // Get all Employee
  public async getAllEmployee(req: Request) {
    const { hotel_id, res_id } = req.rest_user;

    const { limit, skip, key } = req.query;

    const model = this.Model.restaurantModel();

    const { data, total } = await model.getAllEmployee({
      key: key as string,
      limit: limit as string,
      skip: skip as string,
      hotel_id,
      res_id,
    });
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total,
      data,
    };
  }
}
export default ResOrderService;
