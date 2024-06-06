import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";
import { ICreateExpenseItemsPayload } from "../utils/interfaces/expense.interface";
import {
  ICreatePurchaseBody,
  ICreatePurchaseItemBody,
  ICreatePurchaseItemPayload,
} from "../utils/interfaces/purchase.interface";

class PurchaseService extends AbstractServices {
  constructor() {
    super();
  }

  // create purchase
  public async createPurchase(req: Request) {
    return await this.db.transaction(async (trx) => {
      const { res_id, id: res_admin, name } = req.rest_user;
      const {
        purchase_items,
        purchase_date,
        supplier_id,
        ac_tr_ac_id,
        discount_amount,
      } = req.body as ICreatePurchaseBody;

      // Check account
      const model = this.Model.restaurantModel(trx);

      const checkSupplier = await model.getSingleSupplier(
        supplier_id,
        res_id
      );

      if (!checkSupplier.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_NOT_FOUND,
          message: "Invalid Supplier Information",
        };
      }
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

      const last_balance = checkAccount[0].last_balance;

      const sub_total = purchase_items.reduce((acc: any, curr) => {
        return acc + curr.quantity * curr.price;
      }, 0);

      const grand_total = sub_total - discount_amount;

      if (last_balance < grand_total) {
        return {
          success: false,
          code: this.StatusCode.HTTP_BAD_REQUEST,
          message: "Insufficient balance in this account for payment",
        };
      }

      if (discount_amount > grand_total) {
        return {
          success: false,
          code: this.StatusCode.HTTP_BAD_REQUEST,
          message: "Discount amount cannot be greater than grand total",
        };
      }

      // Account transaction
      const transactionRes = await model.insertAccountTransaction({
        res_id,
        ac_tr_ac_id: ac_tr_ac_id,
        ac_tr_cash_out: grand_total,
      });

      // Get last ledger balance
      const ledgerLastBalance = await model.getAllLedgerLastBalanceByAccount({
        res_id,
        ledger_account_id: ac_tr_ac_id,
      });

      const available_balance = parseFloat(ledgerLastBalance) - grand_total;

      // Insert account ledger
      await model.insertAccountLedger({
        ac_tr_id: transactionRes[0],
        ledger_debit_amount: grand_total,
        ledger_details: `Balance Debited by Purchase`,
        ledger_balance: available_balance,
      });

      // Insert supplier ledger
      await model.insertSupplierLedger({
        ac_tr_ac_id,
        supplier_id,
        res_id,
        ac_tr_id: transactionRes[0],
        ledger_credit_amount: grand_total,
        ledger_details: `Balance credited for sell something`,
      });

      // Update account last balance
      await model.upadateSingleAccount(
        { last_balance: available_balance },
        { res_id, id: ac_tr_ac_id }
      );

      //   insert purchase
      const createdPurchase = await model.createPurchase({
        res_id,
        ac_tr_id: transactionRes[0],
        purchase_date,
        supplier_id,
        ac_tr_ac_id,
        sub_total,
        discount_amount,
        grand_total,
      });

      const purchaseId = createdPurchase[0];

      const purchaseItemsPayload: ICreatePurchaseItemPayload[] = [];

      console.log({ purchase_items });

      for (let i = 0; i < purchase_items.length; i++) {
        let found = false;

        for (let j = 0; j < purchaseItemsPayload.length; j++) {
          if (
            purchase_items[i].ingredient_id ==
            purchaseItemsPayload[j].ingredient_id
          ) {
            found = true;
            purchaseItemsPayload[j].quantity += purchase_items[i].quantity;
            purchaseItemsPayload[j].price +=
              purchase_items[i].price * purchase_items[i].quantity;
            break;
          }
        }

        if (!found) {
          purchaseItemsPayload.push({
            ingredient_id: purchase_items[i].ingredient_id,
            name: purchase_items[i].name,
            purchase_id: purchaseId,
            price: purchase_items[i].price * purchase_items[i].quantity,
            quantity: purchase_items[i].quantity,
          });
        }
      }

      //   insert purchase item
      await model.createPurchaseItem(purchaseItemsPayload);

      // =================== inventory step =================//

      const modifyInventoryIngredient: {
        id: number;
        available_quantity: number;
      }[] = [];

      const addedInventoryIngredient: {
        res_id: number;
        ing_id: number;
        available_quantity: number;
      }[] = [];

      const purchase_ing_ids = purchase_items.map((item) => item.ingredient_id);

      const getInventoryIngredient = await model.getAllInventory({
        res_id,
        ing_ids: purchase_ing_ids,
      });

      for (let i = 0; i < purchaseItemsPayload.length; i++) {
        let found = false;
        for (let j = 0; j < getInventoryIngredient?.length; j++) {
          if (
            purchaseItemsPayload[i].ingredient_id ==
            getInventoryIngredient[j].ing_id
          ) {
            found = true;
            modifyInventoryIngredient.push({
              available_quantity:
                getInventoryIngredient[j].available_quantity +
                purchaseItemsPayload[i].quantity,
              id: getInventoryIngredient[j].id,
            });
            break;
          }
        }
        if (!found) {
          addedInventoryIngredient.push({
            res_id,
            available_quantity: purchaseItemsPayload[i].quantity,
            ing_id: purchaseItemsPayload[i].ingredient_id,
          });
        }
      }

      // insert in inventory

      if (addedInventoryIngredient.length) {
        await model.insertInInventory(addedInventoryIngredient);
      }

      console.log({ modifyInventoryIngredient });

      if (modifyInventoryIngredient.length) {
        Promise.all(
          modifyInventoryIngredient.map(async (item) => {
            await model.updateInInventory(
              { available_quantity: item.available_quantity },
              { id: item.id }
            );
          })
        );
      }

      // =================== inventory step end =================//

      const year = new Date().getFullYear();

      // Get the last voucher ID
      const voucherData = await model.getAllExpenseForLastId();
      const voucherNo = voucherData.length ? voucherData[0].id + 1 : 1;

      // Insert expense record
      const expenseRes = await model.createExpense({
        res_id,
        name,
        ac_tr_ac_id,
        remarks: "Expense for purchase product",
        expense_category: "food",
        expense_date: purchase_date,
        voucher_no: `EXP-${year}${voucherNo}-p${purchaseId}`,
        created_by: res_admin,
        total: grand_total,
      });

      const ExpenseItems: ICreateExpenseItemsPayload[] = purchase_items.map(
        (item: ICreatePurchaseItemBody) => ({
          name: item.name,
          amount: item.price * item.quantity,
          expense_id: expenseRes[0],
        })
      );
      await model.createExpenseItem(ExpenseItems);

      return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: "Purchase created successfully.",
      };
    });
  }

  // Get all Purchase
  public async getAllPurchase(req: Request) {
    const { res_id } = req.rest_user;
    const { limit, skip } = req.query;

    const model = this.Model.restaurantModel();

    const { data, total } = await model.getAllpurchase({
      limit: limit as string,
      skip: skip as string,
      res_id,
    });
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total,
      data,
    };
  }

  // Get Single Purchase
  public async getSinglePurchase(req: Request) {
    const { id } = req.params;
    const { res_id } = req.rest_user;

    const data = await this.Model.restaurantModel().getSinglePurchase(
      parseInt(id),
      res_id
    );
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data,
    };
  }

  // Get all Account
  public async getAllAccount(req: Request) {
    const { hotel_id } = req.hotel_admin;

    const { ac_type, key, status, limit, skip, admin_id } = req.query;

    // model
    const model = this.Model.accountModel();

    const { data, total } = await model.getAllAccounts({
      hotel_id,
      status: status as string,
      ac_type: ac_type as string,
      key: key as string,
      limit: limit as string,
      skip: skip as string,
      admin_id: parseInt(admin_id as string),
    });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total,
      data,
    };
  }
}
export default PurchaseService;
