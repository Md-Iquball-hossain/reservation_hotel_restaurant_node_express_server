import {
  ICreateCategoryPayload,
  IUpdateCategoryPayload,
} from "../../appRestaurant/utils/interfaces/category.interface";
import {
  ICreateIngredientPayload,
  IUpdateIngredientPayload,
} from "../../appRestaurant/utils/interfaces/ingredient.interface";
import {
  ICreatePurchaseItemPayload,
  ICreatePurchasePayload,
} from "../../appRestaurant/utils/interfaces/purchase.interface";
import {
  ICreateSupplierPayload,
  IUpdateSupplierPayload,
} from "../../appRestaurant/utils/interfaces/supplier.interface";
import { TDB } from "../../common/types/commontypes";
import Schema from "../../utils/miscellaneous/schema";
import {
  ICreateFoodBody,
  ICreateFoodItemsBody,
  IinsertSubTables,
  IupdateFoodBody,
  IupdateSubTableStatusBody,
} from "../../appRestaurant/utils/interfaces/food.interface";
import {
  IinsertLedger,
  IinsertSupplierLedger,
  IupdateAccount,
} from "../../appAdmin/utlis/interfaces/account.interface";
import {
  IAccountResCreateBody,
  IinsertResTransaction,
} from "../../appRestaurant/utils/interfaces/account.interface";
import {
  ICreateResExpenseHeadPayload,
  ICreateResExpensePayload,
  IUpdateResExpenseHeadPayload,
} from "../../appRestaurant/utils/interfaces/expense.interface";
import {
  ICreateOrderBody,
  ICreateOrderItemsPayload,
  ICreateSubTablePayload,
  ICreateTablePayload,
  IUpdateKitchenStatusPayload,
  IUpdateOrderStatus,
  IUpdatePayStatusPayload,
  IUpdateTableName,
  IUpdateTableStatus,
  IupdateOrderBody,
} from "../../appRestaurant/utils/interfaces/order.interface";
import {
  IinsertinvoiceItemPayload,
  IinsertinvoicePayload,
} from "../../appRestaurant/utils/interfaces/invoice.interface";
import {
  ICreateResAdminPayload,
  IUpdateResAdminPayload,
  IcreateResRolePermission,
} from "../../appRestaurant/utils/interfaces/admin-role.interface";
import { IsingleHotelUserPayload } from "../../appM360/utlis/interfaces/mUserHotel.interface";
import { ICreateRestaurantPayload } from "../../appAdmin/utlis/interfaces/restaurant.hotel.interface";

class RestaurantModel extends Schema {
  private db: TDB;

  constructor(db: TDB) {
    super();
    this.db = db;
  }

  //=================== Admin Role Permission ======================//

  // create Res permission
  public async addedResPermission(
    payload: {
      res_id: number;
      permission_id: number;
    }[]
  ) {
    return await this.db("res_permission")
      .withSchema(this.RESTAURANT_SCHEMA)
      .insert(payload);
  }

  // create module
  public async rolePermissionGroup(body: any) {
    return await this.db("permission_group")
      .withSchema(this.RESTAURANT_SCHEMA)
      .insert(body);
  }

  // get permission group
  public async getPermissionGroup(payload?: { name?: string; ids?: number[] }) {
    const { ids, name } = payload || {};
    return await this.db("permission_group")
      .withSchema(this.RESTAURANT_SCHEMA)
      .select("id", "name")
      .where(function () {
        if (name) {
          this.where("name", "like", `%${name}%`);
        }
        if (ids) {
          this.whereIn("id", ids);
        }
      })
      .orderBy("id", "desc");
  }

  // create permission
  public async createPermission({
    permission_group_id,
    name,
    created_by,
    res_id,
  }: {
    permission_group_id: number;
    name: string[];
    created_by: number;
    res_id: number;
  }) {
    const insertObj = name.map((item: string) => {
      return {
        permission_group_id,
        name: item,
        created_by,
        res_id,
      };
    });

    return await this.db("permission")
      .withSchema(this.RESTAURANT_SCHEMA)
      .insert(insertObj);
  }

  // create hotel permission
  public async addedPermission(
    payload: {
      res_id: number;
      permission_id: number;
    }[]
  ) {
    return await this.db("res_permission")
      .withSchema(this.RESTAURANT_SCHEMA)
      .insert(payload);
  }

  // get all hotel permission
  public async getAllResPermission(payload: {
    ids?: number[];
    res_id?: number;
  }) {
    const { res_id, ids } = payload;
    console.log({ ids, res_id });

    return await this.db("res_permission")
      .withSchema(this.RESTAURANT_SCHEMA)
      .select("id", "res_id", "permission_grp_id")
      .where(function () {
        if (ids?.length) {
          this.whereIn("id", ids);
        }
        if (res_id) {
          this.where({ res_id });
        }
      });
  }

  // v2 get all Res permission code
  public async getAllResPermissions(payload: { res_id?: number }) {
    const { res_id } = payload;
    return await this.db("res_permission_view")
      .withSchema(this.RESTAURANT_SCHEMA)
      .select("res_id", "permissions")
      .where(function () {
        if (res_id) {
          this.where({ res_id });
        }
      });
  }

  // create role permission
  public async createRolePermission(insertObj: IcreateResRolePermission[]) {
    return await this.db("role_permission")
      .withSchema(this.RESTAURANT_SCHEMA)
      .insert(insertObj);
  }

  // delete role perimission
  public async deleteRolePermission(
    r_permission_id: number,
    permission_type: string,
    res_id: number
  ) {
    const res = await this.db("role_permission")
      .withSchema(this.RESTAURANT_SCHEMA)
      .andWhere("r_permission_id", r_permission_id)
      .andWhere("permission_type", permission_type)
      .andWhere("res_id", res_id)
      .delete();

    return res;
  }

  // create role
  public async createRole(payload: { res_id: number; name: string }) {
    const res = await this.db("role")
      .withSchema(this.RESTAURANT_SCHEMA)
      .insert(payload);
    return res;
  }

  // get role
  public async getAllRole(res_id: number) {
    return await this.db("role")
      .withSchema(this.RESTAURANT_SCHEMA)
      .select("*")
      .where({ res_id });
  }

  // get single role
  public async getSingleRole(id: number, res_id: number) {
    const res = await this.db("role_permission_view")
      .withSchema(this.RESTAURANT_SCHEMA)
      .select("*")
      .where("role_id", id)
      .andWhere({ res_id });

    return res;
  }

  // update role
  public async updateSingleRole(id: number, body: any, res_id: number) {
    const res = await this.db("role AS r")
      .withSchema(this.RESTAURANT_SCHEMA)
      .update(body)
      .where({ id })
      .andWhere({ res_id });

    return res;
  }

  // get role by name
  public async getRoleByName(name: string, res_id: number) {
    const res = await this.db("role")
      .withSchema(this.RESTAURANT_SCHEMA)
      .select("*")
      .where({ res_id })
      .andWhere(function () {
        if (name) {
          this.where("name", "like", `${name}%`);
        }
      });

    return res;
  }

  // get admins role permission
  public async getAdminRolePermission(payload: {
    email?: string;
    id?: Number;
  }) {
    const { id, email } = payload;
    return await this.db("admin_permissions")
      .withSchema(this.RESTAURANT_SCHEMA)
      .where(function () {
        if (id) {
          this.where({ id });
        } else {
          this.where({ email });
        }
      });
  }

  // get admins role permission
  public async getAdminsRolePermission(id: Number) {
    const res = await this.db("res_admin_permissions")
      .withSchema(this.RESTAURANT_SCHEMA)
      .where({ id });
    return res;
  }

  //=================== Admin  ======================//

  // get  Res admin by email
  public async getResAdminByEmail(email: string) {
    return await this.db("res_admin AS ra")
      .withSchema(this.RESTAURANT_SCHEMA)
      .select(
        "ra.id",
        "ra.email",
        "ra.password",
        "ra.name",
        "ra.avatar",
        "ra.phone",
        "ra.status",
        "r.id As roleId",
        "r.name As roleName",
        "ra.created_at"
      )
      .leftJoin("role AS r", "ra.role", "r.id")
      .where({ email });
  }

  // insert user admin
  public async insertUserAdmin(payload: ICreateResAdminPayload) {
    return await this.db("res_admin")
      .withSchema(this.RESTAURANT_SCHEMA)
      .insert(payload);
  }

  public async getSingleAdmin(where: { email?: string; id?: number }) {
    const { email, id } = where;
    return await this.db("res_admin AS ra")
      .select(
        "ra.hotel_id",
        "ra.id",
        "ra.email",
        "ra.password",
        "ra.name",
        "ra.avatar",
        "ra.phone",
        "ra.status",
        "r.id As role_id",
        "r.name As role_name",
        "ra.created_at"
      )
      .withSchema(this.RESTAURANT_SCHEMA)
      .leftJoin("role AS r", "ra.res_id", "r.res_id")
      .where(function () {
        if (id) {
          this.where("ra.id", id);
        }
        if (email) {
          this.where("ra.email", email);
        }
      });
  }

  // get all admin
  public async getAllAdmin(payload: {
    res_id: number;
    limit: string;
    skip: string;
    status?: string;
  }) {
    const { limit, skip, status, res_id } = payload;
    const dtbs = this.db("res_admin AS ra");
    if (limit && skip) {
      dtbs.limit(parseInt(limit as string));
      dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs
      .withSchema(this.RESTAURANT_SCHEMA)
      .select(
        "ra.id",
        "ra.email",
        "ra.name",
        "ra.avatar",
        "ra.phone",
        "ra.status",
        "r.id As role_id",
        "r.name As role_name",
        "ra.created_at"
      )
      .leftJoin("role AS r", "ra.role", "r.id")
      .where(function () {
        if (status) {
          this.where("ra.status", status);
        }
        this.andWhere("ra.res_id", res_id);
      });

    const total = await this.db("res_admin AS ra")
      .withSchema(this.RESTAURANT_SCHEMA)
      .count("ra.id As total")
      .leftJoin("role AS r", "ra.role", "r.id")
      .where(function () {
        if (status) {
          this.where("ra.status", status);
        }
        this.andWhere("ra.res_id", res_id);
      });

    return { data, total: total[0].total };
  }

  // update admin model
  public async updateAdmin(
    payload: IUpdateResAdminPayload,
    where: { email: string }
  ) {
    return await this.db("res_admin")
      .withSchema(this.RESTAURANT_SCHEMA)
      .update(payload)
      .where({ email: where.email });
  }

  //=================== Report  ======================//

  // get Profit loss
  public async getProfitLoss(payload: {
    from_date: string;
    to_date: string;
    res_id: number;
  }) {
    const { from_date, to_date, res_id } = payload;

    const endDatePlusOneDay = new Date(to_date);
    endDatePlusOneDay.setDate(endDatePlusOneDay.getDate() + 1);

    const endDate = new Date(to_date as string);
    endDate.setDate(endDate.getDate());

    const total_Sales = await this.db("order_view as ov")
      .withSchema(this.RESTAURANT_SCHEMA)
      .sum("ov.grand_total as total_Sales")
      .where("ov.res_id", res_id)
      .andWhere({ status: "finished" })
      .andWhere(function () {
        if (from_date && to_date) {
          this.andWhereBetween("ov.created_at", [from_date, endDatePlusOneDay]);
        }
      })
      .first();

    const total_office_expense = await this.db("expense_view as ev")
      .withSchema(this.RESTAURANT_SCHEMA)
      .sum("ev.total as total_office_expense")
      .where("ev.res_id", res_id)
      .andWhere(function () {
        if (from_date && to_date) {
          this.andWhereBetween("ev.created_at", [from_date, endDatePlusOneDay]);
        }
      })
      .first();

    const total_food_expense = await this.db("expense_view as ev")
      .withSchema(this.RESTAURANT_SCHEMA)
      .count("ev.total as total_food_expense")
      .where("ev.res_id", res_id)
      .andWhere(function () {
        if (from_date && to_date) {
          this.andWhereBetween("ev.created_at", [from_date, endDatePlusOneDay]);
        }
      })
      .first();

    const total_fixed_expense = await this.db("expense_view as ev")
      .withSchema(this.RESTAURANT_SCHEMA)
      .count("ev.total as total_fixed_expense")
      .where("ev.res_id", res_id)
      .andWhere(function () {
        if (from_date && to_date) {
          this.andWhereBetween("ev.created_at", [from_date, endDatePlusOneDay]);
        }
      })
      .first();

    return {
      total_Sales: total_Sales ? total_Sales.total_Sales : 0,
      total_office_expense: total_office_expense
        ? total_office_expense.total_office_expense
        : 0,
      total_food_expense: total_food_expense
        ? total_food_expense.total_food_expense
        : 0,
      total_fixed_expense: total_fixed_expense
        ? total_fixed_expense.total_fixed_expense
        : 0,
    };
  }

  // Expense Report
  public async getExpenseReport(payload: {
    limit?: string;
    skip?: string;
    name: string;
    from_date?: string;
    to_date?: string;
    res_id: number;
  }) {
    const { limit, skip, res_id, name, from_date, to_date } = payload;

    const dtbs = this.db("expense_item as ei");

    if (limit && skip) {
      dtbs.limit(parseInt(limit));
      dtbs.offset(parseInt(skip));
    }

    const endDate = new Date(to_date as string);
    endDate.setDate(endDate.getDate());

    const data = await dtbs
      .withSchema(this.RESTAURANT_SCHEMA)
      .select(
        "ei.id",
        "ei.created_at as expense_date",
        "ei.name as expense_item",
        "ei.amount"
      )
      .join("expense as e", "ei.expense_id", "e.id")
      .where("e.res_id", res_id)
      .andWhere(function () {
        if (from_date && to_date) {
          this.andWhereBetween("ei.created_at", [from_date, endDate]);
        }
        if (name) {
          this.andWhere("ei.name", "like", `%${name}%`);
        }
      })
      .orderBy("ei.id", "desc");

    const total = await this.db("expense_item as ei")
      .withSchema(this.RESTAURANT_SCHEMA)
      .count("ei.id as total")
      .join("expense as e", "ei.expense_id", "e.id")
      .where("e.res_id", res_id)
      .andWhere(function () {
        if (from_date && to_date) {
          this.andWhereBetween("ei.created_at", [from_date, endDate]);
        }
        if (name) {
          this.andWhere("ei.name", "like", `%${name}%`);
        }
      });

    const totalAmount = await this.db("expense_item as ei")
      .withSchema(this.RESTAURANT_SCHEMA)
      .sum("ei.amount as totalAmount")
      .count("ei.id as total")
      .join("expense as e", "ei.expense_id", "e.id")
      .where("e.res_id", res_id)
      .andWhere(function () {
        if (from_date && to_date) {
          this.andWhereBetween("ei.created_at", [from_date, endDate]);
        }
        if (name) {
          this.andWhere("ei.name", "like", `%${name}%`);
        }
      });

    return {
      data,
      totalAmount: totalAmount[0]?.totalAmount || 0,
      total: total[0]?.total || 0,
    };
  }

  // Sales Report
  public async getSalesReport(payload: {
    limit?: string;
    skip?: string;
    name: string;
    from_date?: string;
    to_date?: string;
    res_id: number;
  }) {
    const { limit, skip, res_id, name, from_date, to_date } = payload;

    const dtbs = this.db("order_item as oi");

    if (limit && skip) {
      dtbs.limit(parseInt(limit));
      dtbs.offset(parseInt(skip));
    }

    const endDate = new Date(to_date as string);
    endDate.setDate(endDate.getDate());

    const data = await dtbs
      .withSchema(this.RESTAURANT_SCHEMA)
      .select(
        "oi.id",
        "oi.name as product_name",
        "oi.quantity as sold_quantity",
        "oi.rate as product_price",
        "oi.total as sold_amount",
        "oi.created_at as sold_date"
      )
      .join("order as o", "oi.order_id", "o.id")
      .where("o.res_id", res_id)
      .andWhere(function () {
        if (from_date && to_date) {
          this.andWhereBetween("oi.created_at", [from_date, endDate]);
        }
        if (name) {
          this.andWhere("oi.name", "like", `%${name}%`);
        }
      })
      .orderBy("oi.id", "desc");

    const total = await this.db("order_item as oi")
      .withSchema(this.RESTAURANT_SCHEMA)
      .join("order as o", "oi.order_id", "o.id")
      .where("o.res_id", res_id)
      .count("oi.id as total")
      .andWhere(function () {
        if (from_date && to_date) {
          this.andWhereBetween("oi.created_at", [from_date, endDate]);
        }
        if (name) {
          this.andWhere("oi.name", "like", `%${name}%`);
        }
      });

    const totalAmount = await this.db("order_item as oi")
      .withSchema(this.RESTAURANT_SCHEMA)
      .join("order as o", "oi.order_id", "o.id")
      .where("o.res_id", res_id)
      .sum("oi.total as totalAmount")
      .count("oi.id as total")
      .andWhere(function () {
        if (from_date && to_date) {
          this.andWhereBetween("oi.created_at", [from_date, endDate]);
        }
        if (name) {
          this.andWhere("oi.name", "like", `%${name}%`);
        }
      });

    const totalSold = await this.db("order_item as oi")
      .withSchema(this.RESTAURANT_SCHEMA)
      .join("order as o", "oi.order_id", "o.id")
      .where("o.res_id", res_id)
      .sum("oi.quantity as totalSold")
      .count("oi.id as total")
      .andWhere(function () {
        if (from_date && to_date) {
          this.andWhereBetween("oi.created_at", [from_date, endDate]);
        }
        if (name) {
          this.andWhere("oi.name", "like", `%${name}%`);
        }
      });

    return {
      data,
      totalAmount: totalAmount[0]?.totalAmount || 0,
      totalSold: totalSold[0]?.totalSold || 0,
      total: total[0]?.total || 0,
    };
  }

  // Food
  public async getFoodCategoryReport(payload: {
    limit?: string;
    skip?: string;
    food_name?: string;
    category_name?: string;
    from_date?: string;
    to_date?: string;
    res_id: number;
  }) {
    const {
      limit,
      skip,
      res_id,
      category_name,
      food_name,
      from_date,
      to_date,
    } = payload;

    const dtbs = this.db("order_item as oi");

    if (limit && skip) {
      dtbs.limit(parseInt(limit));
      dtbs.offset(parseInt(skip));
    }

    const endDate = new Date(to_date as string);
    endDate.setDate(endDate.getDate());

    const data = await dtbs
      .withSchema(this.RESTAURANT_SCHEMA)
      .select(
        "oi.id",
        "fv.name as food_name",
        "fv.category_name",
        "fv.retail_price as price"
      )
      .join("order as o", "oi.order_id", "o.id")
      .join("food_view as fv", "oi.food_id", "fv.id")
      .where("o.res_id", res_id)
      .andWhere(function () {
        if (from_date && to_date) {
          this.andWhereBetween("oi.created_at", [from_date, endDate]);
        }
        if (food_name) {
          this.andWhere("fv.name", "like", `%${food_name}%`);
        }
        if (category_name) {
          this.andWhere("fv.category_name", "like", `%${category_name}%`);
        }
      })
      .orderBy("oi.id", "desc");

    const total = await this.db("order_item as oi")
      .withSchema(this.RESTAURANT_SCHEMA)
      .join("order as o", "oi.order_id", "o.id")
      .join("food_view as fv", "oi.food_id", "fv.id")
      .where("o.res_id", res_id)
      .count("oi.id as total")
      .andWhere(function () {
        if (from_date && to_date) {
          this.andWhereBetween("oi.created_at", [from_date, endDate]);
        }
        if (food_name) {
          this.andWhere("fv.name", "like", `%${food_name}%`);
        }
        if (category_name) {
          this.andWhere("fv.category_name", "like", `%${category_name}%`);
        }
      });

    const totalSoldQuantity = await this.db("order_item as oi")
      .withSchema(this.RESTAURANT_SCHEMA)
      .join("order as o", "oi.order_id", "o.id")
      .join("food_view as fv", "oi.food_id", "fv.id")
      .where("o.res_id", res_id)
      .sum("fv.retail_price as totalSoldQuantity")
      .count("oi.id as total")
      .andWhere(function () {
        if (from_date && to_date) {
          this.andWhereBetween("oi.created_at", [from_date, endDate]);
        }
        if (food_name) {
          this.andWhere("fv.name", "like", `%${food_name}%`);
        }
        if (category_name) {
          this.andWhere("fv.category_name", "like", `%${category_name}%`);
        }
      });

    return {
      data,
      totalSoldQuantity: totalSoldQuantity[0]?.totalSoldQuantity || 0,
      total: total[0]?.total || 0,
    };
  }

  // Purchase
  public async getPurchaseReport(payload: {
    limit?: string;
    skip?: string;
    from_date?: string;
    to_date?: string;
    res_id: number;
  }) {
    const { limit, skip, res_id, from_date, to_date } = payload;

    const dtbs = this.db("purchase_view as pv");

    if (limit && skip) {
      dtbs.limit(parseInt(limit));
      dtbs.offset(parseInt(skip));
    }

    const endDate = new Date(to_date as string);
    endDate.setDate(endDate.getDate());

    const data = await dtbs
      .withSchema(this.RESTAURANT_SCHEMA)
      .select(
        "pv.id",
        "pv.purchase_date",
        "pv.supplier_name",
        "pv.grand_total",
        "pv.account_name",
        "pv.ac_type",
        "pv.purchase_items"
      )
      .where("pv.res_id", res_id)
      .andWhere(function () {
        if (from_date && to_date) {
          this.andWhereBetween("pv.purchase_date", [from_date, endDate]);
        }
      })
      .orderBy("pv.id", "desc");

    const total = await this.db("purchase_view as pv")
      .withSchema(this.RESTAURANT_SCHEMA)
      .count("pv.id as total")
      .where("pv.res_id", res_id)
      .andWhere(function () {
        if (from_date && to_date) {
          this.andWhereBetween("pv.purchase_date", [from_date, endDate]);
        }
      });

    const totalAmount = await this.db("purchase_view as pv")
      .withSchema(this.RESTAURANT_SCHEMA)
      .sum("pv.grand_total as totalAmount")
      .where("pv.res_id", res_id)
      .andWhere(function () {
        if (from_date && to_date) {
          this.andWhereBetween("pv.purchase_date", [from_date, endDate]);
        }
      });

    return {
      data,
      totalAmount: totalAmount[0]?.totalAmount || 0,
      total: total[0]?.total || 0,
    };
  }

  // supplier
  public async getSupplierReport(payload: {
    limit?: string;
    skip?: string;
    supplier_id: string;
    from_date?: string;
    to_date?: string;
    res_id: number;
  }) {
    const {
      limit,
      skip,
      res_id,
      supplier_id,

      from_date,
      to_date,
    } = payload;

    const dtbs = this.db("supplier_ledger_view as slv");

    if (limit && skip) {
      dtbs.limit(parseInt(limit));
      dtbs.offset(parseInt(skip));
    }

    const endDate = new Date(to_date as string);
    endDate.setDate(endDate.getDate());

    const data = await dtbs
      .withSchema(this.RESTAURANT_SCHEMA)
      .select(
        "slv.id",
        "slv.restaurant_name",
        "slv.restaurant_phone",
        "slv.supplier_name",
        "slv.account_name",
        "slv.supplier_id",
        "slv.ac_tr_ac_id",
        "slv.ledger_debit_amount",
        "slv.ledger_credit_amount",
        "slv.created_at"
      )
      .where("slv.res_id", res_id)
      .andWhere(function () {
        if (from_date && to_date) {
          this.andWhereBetween("slv.created_at", [from_date, endDate]);
        }
        if (supplier_id) {
          this.andWhere("slv.supplier_id", "like", `%${supplier_id}%`);
        }
      })
      .orderBy("slv.id", "desc");

    const total = await this.db("supplier_ledger_view as slv")
      .withSchema(this.RESTAURANT_SCHEMA)
      .count("slv.id as total")
      .where("slv.res_id", res_id)
      .andWhere(function () {
        if (from_date && to_date) {
          this.andWhereBetween("slv.created_at", [from_date, endDate]);
        }
        if (supplier_id) {
          this.andWhere("slv.supplier_id", "like", `%${supplier_id}%`);
        }
      });

    const totalCreditAmount = await this.db("supplier_ledger_view as slv")
      .withSchema(this.RESTAURANT_SCHEMA)
      .sum("slv.ledger_credit_amount as totalCreditAmount")
      .count("slv.id as total")
      .where("slv.res_id", res_id)
      .andWhere(function () {
        if (from_date && to_date) {
          this.andWhereBetween("slv.created_at", [from_date, endDate]);
        }
        if (supplier_id) {
          this.andWhere("slv.supplier_id", "like", `%${supplier_id}%`);
        }
      });

    return {
      data,
      totalCreditAmount: totalCreditAmount[0]?.totalCreditAmount || 0,
      total: total[0]?.total || 0,
    };
  }

  //=================== invoice  ======================//

  // Get all invoice
  public async getAllInvoice(payload: {
    key?: string;
    res_id: number;
    from_date?: string;
    to_date?: string;
    limit?: string;
    skip?: string;
    due_inovice?: string;
  }) {
    const { key, res_id, from_date, to_date, limit, skip, due_inovice } =
      payload;
    const endDate = new Date(to_date as string);
    endDate.setDate(endDate.getDate() + 1);

    const dtbs = this.db("inv_view as iv");

    if (limit && skip) {
      dtbs.limit(parseInt(limit as string));
      dtbs.offset(parseInt(skip as string));
    }
    const data = await dtbs
      .withSchema(this.RESTAURANT_SCHEMA)
      .select(
        "iv.id",
        "iv.user_name",
        "iv.invoice_no",
        "iv.type",
        "iv.discount_amount",
        "iv.tax_amount",
        "iv.sub_total",
        "iv.grand_total",
        "iv.due",
        "iv.created_at"
      )
      .leftJoin("res_admin as ra", "iv.created_by", "ra.id")
      .where("iv.res_id", res_id)
      .andWhere(function () {
        if (key) {
          this.andWhere("invoice_no", "like", `%${key}%`).orWhere(
            "u.name",
            "like",
            `%${key}%`
          );
        }
      })
      .andWhere(function () {
        if (from_date && to_date) {
          this.andWhereBetween("iv.created_at", [from_date, endDate]);
        }
        if (due_inovice) {
          this.andWhere("iv.due", ">", 0);
        }
      })
      .orderBy("iv.id", "desc");

    const total = await this.db("inv_view as iv")
      .withSchema(this.RESTAURANT_SCHEMA)
      .count("iv.id as total")
      .leftJoin("res_admin as ra", "iv.created_by", "ra.id")
      .where("iv.res_id", res_id)
      .andWhere(function () {
        if (key) {
          this.andWhere("invoice_no", "like", `%${key}%`).orWhere(
            "u.name",
            "like",
            `%${key}%`
          );
        }
      })
      .andWhere(function () {
        if (due_inovice) {
          this.andWhere("iv.due", ">", 0);
        }
      });

    return { data, total: total[0].total };
  }

  // get all invoice for last id
  public async getAllInvoiceForLastId() {
    return await this.db("invoice")
      .select("id")
      .withSchema(this.RESTAURANT_SCHEMA)
      .orderBy("id", "desc")
      .limit(1);
  }

  // Get single invoice
  public async getSingleInvoice(payload: { res_id: number; id: number }) {
    const { res_id, id } = payload;
    return await this.db("inv_view")
      .withSchema(this.RESTAURANT_SCHEMA)
      .select(
        "id",
        "invoice_no",
        "res_address",
        "res_email",
        "res_phone",
        "res_logo",
        "user_name",
        "created_by_name as created_by",
        "type",
        "discount_amount",
        "tax_amount",
        "sub_total",
        "grand_total",
        "due",
        "description",
        "created_at",
        "invoice_items"
      )
      .where({ res_id: res_id })
      .andWhere({ id: id });
  }

  // insert hotel invoice
  public async insertResInvoice(payload: IinsertinvoicePayload) {
    return await this.db("invoice")
      .withSchema(this.RESTAURANT_SCHEMA)
      .insert(payload);
  }

  // update hotel invoice
  public async updateResInvoice(
    payload: { due: number },
    where: { id: number; hotel_id: number }
  ) {
    const { due } = payload;
    const { hotel_id, id } = where;

    return await this.db("invoice")
      .withSchema(this.RESTAURANT_SCHEMA)
      .update(payload)
      .where({ id })
      .andWhere({ hotel_id });
  }

  // insert hotel invoice item
  public async insertResInvoiceItem(payload: IinsertinvoiceItemPayload[]) {
    return await this.db("invoice_item")
      .withSchema(this.RESTAURANT_SCHEMA)
      .insert(payload);
  }

  // Update Kitchen Status
  public async updatePayStatus(id: number, payload: IUpdatePayStatusPayload) {
    const payStatusUpdate = await this.db("order")
      .withSchema(this.RESTAURANT_SCHEMA)
      .where({ id })
      .update(payload);

    return payStatusUpdate;
  }

  //=================== order  ======================//

  // Create Order
  public async createOrder(payload: ICreateOrderBody) {
    return await this.db("order")
      .withSchema(this.RESTAURANT_SCHEMA)
      .insert(payload);
  }

  // update Order Payment
  public async updateOrderPayment(
    id: number,
    res_id: number,
    payload: IupdateOrderBody
  ) {
    return await this.db("order as o")
      .withSchema(this.RESTAURANT_SCHEMA)
      .where({ id })
      .andWhere({ res_id })
      .update(payload);
  }

  // update Order
  public async updateOrder(
    orderid: number,
    res_id: number,
    payload: IupdateOrderBody
  ) {
    return await this.db("order as o")
      .withSchema(this.RESTAURANT_SCHEMA)
      .where({ id: orderid })
      .andWhere({ res_id })
      .update(payload);
  }

  // Create Order Items
  public async insertOrderItems(payload: ICreateOrderItemsPayload[]) {
    return await this.db("order_item")
      .withSchema(this.RESTAURANT_SCHEMA)
      .insert(payload);
  }

  // Delete order Items
  public async deleteOrderItems(order_id: number) {
    return await this.db("order_item")
      .withSchema(this.RESTAURANT_SCHEMA)
      .delete()
      .where({ order_id });
  }

  // get all Order last id
  public async getAllTableOrderForLastId(tab_id: number, res_id: number) {
    return await this.db("table_order as to")
      .withSchema(this.RESTAURANT_SCHEMA)
      .select("to.id", "rt.name")
      .join("res_table as rt", "to.tab_id", "rt.id")
      .where("to.res_id", res_id)
      .where("to.tab_id", tab_id)
      .andWhere("to.status", "booked")
      .orderBy("to.id", "desc")
      .limit(1);
  }
  // get all Order last id
  public async getAllIOrderForLastId() {
    return await this.db("order")
      .select("id")
      .withSchema(this.RESTAURANT_SCHEMA)
      .orderBy("id", "desc")
      .limit(1);
  }

  // get all order
  public async getAllOrder(payload: {
    limit?: string;
    skip?: string;
    order_category?: string;
    status?: string;
    staff_name?: string;
    tab_id: number;
    is_paid?: string;
    kitchen_status?: string;
    key?: string;
    from_date?: string;
    to_date?: string;
    res_id: number;
  }) {
    const {
      limit,
      skip,
      res_id,
      staff_name,
      order_category,
      kitchen_status,
      is_paid,
      status,
      key,
      from_date,
      to_date,
      tab_id,
    } = payload;
    console.log({ status });
    const dtbs = this.db("order_view");

    if (limit && skip) {
      dtbs.limit(parseInt(limit));
      dtbs.offset(parseInt(skip));
    }

    const endDate = new Date(to_date as string);
    endDate.setDate(endDate.getDate() + 1);

    const data = await dtbs
      .withSchema(this.RESTAURANT_SCHEMA)
      .select("*")
      .from("order_view")
      .where("res_id", res_id)
      .andWhere((qb) => {
        if (tab_id) {
          // qb.andWhereRaw(
          //   "JSON_CONTAINS(order_items, JSON_OBJECT('table_id', ?), '$')",
          //   [tab_id]
          // );

          qb.andWhere("table_id", tab_id);
        }
        if (status) {
          qb.andWhere("status", status);
        }
        if (kitchen_status) {
          qb.andWhere("kitchen_status", "like", `%${kitchen_status}%`);
        }
        if (is_paid) {
          qb.andWhere("is_paid", is_paid);
        }
        if (staff_name) {
          qb.andWhere("staff_name", "like", `%${staff_name}%`);
        }
        if (from_date && to_date) {
          qb.andWhereBetween("order_date", [from_date, to_date]);
        }
      })
      .orderBy("id", "desc");

    const total = await this.db("order_view")
      .withSchema(this.RESTAURANT_SCHEMA)
      .count("id as total")
      .where("res_id", res_id)
      .andWhere((qb) => {
        if (tab_id) {
          qb.andWhereRaw(
            "JSON_CONTAINS(order_items, JSON_OBJECT('table_id', ?), '$')",
            [tab_id]
          );
        }
        if (status) {
          qb.andWhere("status", status);
        }
        if (kitchen_status) {
          qb.andWhere("kitchen_status", "like", `%${kitchen_status}%`);
        }
        if (is_paid) {
          qb.andWhere("is_paid", is_paid);
        }
        if (staff_name) {
          qb.andWhere("staff_name", "like", `%${staff_name}%`);
        }
        if (from_date && to_date) {
          qb.andWhereBetween("order_date", [from_date, to_date]);
        }
      });

    return { total: total[0].total, data };
  }

  //   insert in table order
  public async insertInTableOrder(payload: any) {
    return await this.db("table_order")
      .withSchema(this.RESTAURANT_SCHEMA)
      .insert(payload);
  }

  // get single order
  public async getSingleOrder(id: number, res_id: number) {
    return await this.db("order_view as ov")
      .withSchema(this.RESTAURANT_SCHEMA)
      .select("*")
      .where("ov.id", id)
      .andWhere("ov.res_id", res_id);
  }

  // update order status
  public async updateOrderStatus(
    id: number,
    res_id: number,
    payload: IUpdateOrderStatus
  ) {
    return await this.db("order")
      .withSchema(this.RESTAURANT_SCHEMA)
      .where({ id })
      .andWhere({ res_id })
      .update(payload);
  }

  // update payment status
  public async updatePaymentStatus(
    id: number,
    res_id: number,
    payload: IUpdatePayStatusPayload
  ) {
    return await this.db("order as o")
      .withSchema(this.RESTAURANT_SCHEMA)
      .where("o.id", id)
      .andWhere("o.res_id", res_id)
      .update(payload);
  }

  //=================== Kitchen ======================//

  // get all Kitchen
  public async getAllKitchenOrder(payload: {
    res_id: number;
    order_no?: string;
    table_name?: string;
    kitchen_status?: string;
    limit?: string;
    skip?: string;
  }) {
    const { res_id, order_no, table_name, limit, skip, kitchen_status } =
      payload;

    const dtbs = this.db("order_view as ov");

    if (limit && skip) {
      dtbs.limit(parseInt(limit));
      dtbs.offset(parseInt(skip));
    }

    const data = await dtbs
      .withSchema(this.RESTAURANT_SCHEMA)
      .select(
        "ov.id",
        "ov.order_no",
        "ov.sub_table_name as table_name",
        "ov.staff_name",
        "ov.order_type",
        "ov.kitchen_status",
        "ov.order_date",
        "ov.order_items"
      )
      .where("ov.res_id", res_id)
      .andWhere(function () {
        if (order_no) {
          this.andWhere("ov.order_no", "like", `%${order_no}%`);
        }
        if (table_name) {
          this.andWhere("ov.sub_table_name", "like", `%${table_name}%`);
        }
        if (kitchen_status) {
          this.andWhere("ov.kitchen_status", kitchen_status);
        }
      })
      .orderBy("ov.id", "desc");

    const total = await this.db("order_view as ov")
      .withSchema(this.RESTAURANT_SCHEMA)
      .count("ov.id as total")
      .where("ov.res_id", res_id)
      .andWhere(function () {
        if (order_no) {
          this.andWhere("ov.order_no", "like", `%${order_no}%`);
        }
        if (table_name) {
          this.andWhere("ov.sub_table_name", "like", `%${table_name}%`);
        }
        if (kitchen_status) {
          this.andWhere("ov.kitchen_status", kitchen_status);
        }
      });

    return { total: total[0].total, data };
  }

  // Update Kitchen Status
  public async updateKitchenStatus(
    id: number,
    payload: IUpdateKitchenStatusPayload
  ) {
    const expenseHeadUpdate = await this.db("order")
      .withSchema(this.RESTAURANT_SCHEMA)
      .where({ id })
      .update(payload);

    return expenseHeadUpdate;
  }

  //=================== table  ======================//

  // Create Table Model
  public async createTable(payload: ICreateTablePayload) {
    return await this.db("res_table")
      .withSchema(this.RESTAURANT_SCHEMA)
      .insert(payload);
  }

  // Get All Table Name
  public async getAllTableName(payload: { name: string; res_id: number }) {
    const { res_id, name } = payload;

    const dtbs = this.db("res_table as rt");

    const data = await dtbs
      .withSchema(this.RESTAURANT_SCHEMA)
      .select("rt.id", "rt.name")
      .where("rt.res_id", res_id)
      .andWhere("rt.name", name)
      .orderBy("rt.id", "desc");

    return { data };
  }

  // Get All Table Name
  public async getAllSubTableName(payload: { name: string; res_id: number }) {
    const { res_id, name } = payload;

    const dtbs = this.db("sub_table as st");

    const data = await dtbs
      .withSchema(this.RESTAURANT_SCHEMA)
      .select("st.id", "st.name")
      .where("st.res_id", res_id)
      .andWhere("st.name", name)
      .orderBy("st.id", "desc");

    return { data };
  }

  // Create Sub Table Model
  public async createSubTable(payload: ICreateSubTablePayload) {
    return await this.db("sub_table")
      .withSchema(this.RESTAURANT_SCHEMA)
      .insert(payload);
  }

  // get all table with sub table
  public async getAllTable(payload: {
    res_id: number;
    name: string;
    category: string;
    limit?: string;
    skip?: string;
  }) {
    const { res_id, name, category, limit, skip } = payload;

    const dtbs = this.db("table_view as tv");

    if (limit && skip) {
      dtbs.limit(parseInt(limit));
      dtbs.offset(parseInt(skip));
    }

    const data = await dtbs
      .withSchema(this.RESTAURANT_SCHEMA)
      .select("*")
      .where("tv.res_id", res_id)
      .andWhere(function () {
        if (name) {
          this.andWhere("tv.table_name", "like", `%${name}%`);
        }
        if (category) {
          this.andWhere("tv.category", "like", `%${category}%`);
        }
      });

    const total = await this.db("table_view as tv")
      .withSchema(this.RESTAURANT_SCHEMA)
      .count("tv.id as total")
      .where("tv.res_id", res_id)
      .andWhere(function () {
        if (name) {
          this.andWhere("tv.table_name", "like", `%${name}%`);
        }
        if (category) {
          this.andWhere("tv.category", "like", `%${category}%`);
        }
      })

      .orderBy("tv.id", "asc");

    return { data, total: total[0].total };
  }

  // update table status
  public async updateTable(
    tab_id: number,
    res_id: number,
    payload: IUpdateTableStatus
  ) {
    return await this.db("res_table")
      .withSchema(this.RESTAURANT_SCHEMA)
      .where("id", tab_id)
      .andWhere("res_id", res_id)
      .update(payload);
  }

  // get single table
  public async getSingleTable(id: number, res_id: number) {
    const dtbs = this.db("table_view as tv");
    const data = await dtbs
      .withSchema(this.RESTAURANT_SCHEMA)
      .select("*")
      .where("tv.id", id)
      .andWhere("tv.res_id", res_id);

    return data.length > 0 ? data[0] : [];
  }

  // get single table with sub table
  public async getSingleTableWithSubTable(tab_id: number, res_id: number) {
    const dtbs = this.db("table_view as tv");
    const data = await dtbs
      .withSchema(this.RESTAURANT_SCHEMA)
      .select("*")
      .where("tv.id", tab_id)
      .andWhere("tv.res_id", res_id);

    return data.length > 0 ? data[0] : [];
  }

  // get single order sub table
  public async getOrderSubTable(id: number, res_id: number) {
    const dtbs = this.db("order_st_view as osv");
    const data = await dtbs
      .withSchema(this.RESTAURANT_SCHEMA)
      .select("*")
      .where("osv.id", id)
      .andWhere("osv.res_id", res_id);

    return data.length > 0 ? data[0] : [];
  }

  // delete table
  public async deleteTable(id: number) {
    return await this.db("res_table")
      .withSchema(this.RESTAURANT_SCHEMA)
      .where({ id })
      .del();
  }

  // update table
  public async updateTableName(
    id: number,
    res_id: number,
    payload: IUpdateTableName
  ) {
    return await this.db("res_table")
      .withSchema(this.RESTAURANT_SCHEMA)
      .where({ id })
      .andWhere({ res_id })
      .update(payload);
  }

  // get all sub table
  public async getAllSubTable(payload: {
    res_id: number;
    name: string;
    status: string;
    limit?: string;
    skip?: string;
  }) {
    const { res_id, name, limit, skip, status } = payload;

    const dtbs = this.db("sub_table_view as stv");

    if (limit && skip) {
      dtbs.limit(parseInt(limit));
      dtbs.offset(parseInt(skip));
    }

    const data = await dtbs
      .withSchema(this.RESTAURANT_SCHEMA)
      .select("*")
      .where("stv.res_id", res_id)
      .andWhere(function () {
        if (name) {
          this.andWhere("stv.table_name", "like", `%${name}%`);
        }
        if (status) {
          this.andWhere("stv.table_status", "like", `%${status}%`);
        }
      });

    const total = await this.db("sub_table_view as stv")
      .withSchema(this.RESTAURANT_SCHEMA)
      .count("stv.id as total")
      .where("stv.res_id", res_id)
      .andWhere(function () {
        if (name) {
          this.andWhere("stv.table_name", "like", `%${name}%`);
        }
        if (status) {
          this.andWhere("stv.table_status", "like", `%${status}%`);
        }
      })

      .orderBy("stv.id", "asc");

    return { data, total: total[0].total };
  }

  // delete Sub table
  public async deleteSubTable(id: number) {
    return await this.db("sub_table")
      .withSchema(this.RESTAURANT_SCHEMA)
      .where({ id })
      .del();
  }

  // get single Sub table
  public async getSingleSubTable(id: number, res_id: number) {
    const dtbs = this.db("sub_table as st");
    const data = await dtbs
      .withSchema(this.RESTAURANT_SCHEMA)
      .select("*")
      .where("st.id", id)
      .andWhere("st.res_id", res_id);

    return data.length > 0 ? data[0] : [];
  }

  // update Sub Tables Status
  public async updateSubTable(
    ids: number[],
    res_id: number,
    payload: IupdateSubTableStatusBody
  ) {
    return await this.db("sub_table")
      .withSchema(this.RESTAURANT_SCHEMA)
      .where("res_id", res_id)
      .whereIn("sub_table.id", ids)
      .update(payload);
  }

  public async insertSubTable(payload: IinsertSubTables) {
    return await this.db("bk_sub_table")
      .withSchema(this.RESTAURANT_SCHEMA)
      .insert(payload);
  }

  //=================== Employee  ======================//

  // get all Employee
  public async getAllEmployee(payload: {
    limit?: string;
    skip?: string;
    key?: string;
    hotel_id: number;
    res_id: number;
  }) {
  const {
    limit,
    skip,
    hotel_id,
    res_id,

    key,
  } = payload;

  const dtbs = this.db("employee_view as ev");

  if (limit && skip) {
    dtbs.limit(parseInt(limit as string));
    dtbs.offset(parseInt(skip as string));
  }

  const data = await dtbs
    .withSchema(this.RESTAURANT_SCHEMA)
    .select("*")
    .where("ev.hotel_id", hotel_id)
    .andWhere("ev.res_id", res_id)
    .andWhere(function () {
      if (key) {
        this.andWhere("ev.department", "like", `%${key}%`)
          .orWhere("ev.designation", "like", `%${key}%`)
          .orWhere("ev.name", "like", `%${key}%`);
      }
    })
    .orderBy("ev.id", "desc");

  const total = await this.db("employee_view as ev")
    .withSchema(this.RESTAURANT_SCHEMA)
    .count("ev.id as total")
    .where("ev.hotel_id", hotel_id)
    .andWhere("ev.res_id", res_id)
    .andWhere(function () {
      if (key) {
        this.andWhere("ev.department", "like", `%${key}%`)
          .orWhere("ev.designation", "like", `%${key}%`)
          .orWhere("ev.name", "like", `%${key}%`);
      }
    });

    return { total: total[0].total, data };
  }

  //=================== Expense  ======================//

  // insert in inventory
  public async insertInInventory(
    payload: {
      res_id: number;
      ing_id: number;
      available_quantity: number;
    }[]
  ) {
    return await this.db("inventory")
      .withSchema(this.RESTAURANT_SCHEMA)
      .insert(payload);
  }

  // update in inventory
  public async updateInInventory(
    payload: {
      available_quantity: number;
    },
    where: { id: number }
  ) {
    return await this.db("inventory")
      .withSchema(this.RESTAURANT_SCHEMA)
      .update(payload)
      .where("id", where.id);
  }

  // get all inventory
  public async getAllInventory(where: { res_id: number; ing_ids: number[] }) {
    const { ing_ids, res_id } = where;
    return await this.db("inventory")
      .withSchema(this.RESTAURANT_SCHEMA)
      .select("*")
      .where("res_id", res_id)
      .andWhere(function () {
        if (ing_ids) {
          this.whereIn("ing_id", ing_ids);
        }
      });
  }

  // Create Expense Head Model
  public async createExpenseHead(payload: ICreateResExpenseHeadPayload) {
    return await this.db("expense_head")
      .withSchema(this.RESTAURANT_SCHEMA)
      .insert(payload);
  }

  // Get All Expense Head Model
  public async getAllExpenseHead(payload: {
    limit?: string;
    skip?: string;
    name: string;
    res_id: number;
  }) {
  const { limit, skip, res_id, name } = payload;

  const dtbs = this.db("expense_head as eh");

  if (limit && skip) {
    dtbs.limit(parseInt(limit as string));
    dtbs.offset(parseInt(skip as string));
  }

  const data = await dtbs
    .withSchema(this.RESTAURANT_SCHEMA)
    .select("eh.id", "eh.name")
    .where("res_id", res_id)
    .andWhere(function () {
      if (name) {
        this.andWhere("eh.name", "like", `%${name}%`);
      }
    })
    .orderBy("eh.id", "desc");

  const total = await this.db("expense_head as eh")
    .withSchema(this.RESTAURANT_SCHEMA)
    .count("eh.id as total")
    .where("eh.res_id", res_id)
    .andWhere(function () {
      if (name) {
        this.andWhere("eh.name", "like", `%${name}%`);
      }
    });

    return { total: total[0].total, data };
  }

  // Update Expense Head Model
  public async updateExpenseHead(
    id: number,
    payload: IUpdateResExpenseHeadPayload
  ) {
    const expenseHeadUpdate = await this.db("expense_head")
      .withSchema(this.RESTAURANT_SCHEMA)
      .where({ id })
      .update(payload);

    return expenseHeadUpdate;
  }

  // Delete Expense Head Model
  public async deleteExpenseHead(id: number) {
    return await this.db("expense_head")
      .withSchema(this.RESTAURANT_SCHEMA)
      .where({ id })
      .del();
  }

  // Create Expense Model
  public async createExpense(payload: ICreateResExpensePayload) {
    return await this.db("expense")
      .withSchema(this.RESTAURANT_SCHEMA)
      .insert(payload);
  }

  // create expense item
  public async createExpenseItem(
    payload: {
      name: string;
      amount: number;
      expense_id: number;
    }[]
  ) {
    return await this.db("expense_item")
      .withSchema(this.RESTAURANT_SCHEMA)
      .insert(payload);
  }

  // get all expense for last id
  public async getAllExpenseForLastId() {
    return await this.db("expense")
      .select("id")
      .withSchema(this.RESTAURANT_SCHEMA)
      .orderBy("id", "desc")
      .limit(1);
  }

  // get All Expense Model
  public async getAllExpense(payload: {
    from_date: string;
    to_date: string;
    limit: string;
    skip: string;
    key: string;
    expense_category: string;
    res_id: number;
  }) {
  const { limit, skip, res_id, from_date, to_date, key, expense_category } =
    payload;

  const endDate = new Date(to_date as string);
  endDate.setDate(endDate.getDate() + 1);

  const dtbs = this.db("expense_view as ev");

  if (limit && skip) {
    dtbs.limit(parseInt(limit as string));
    dtbs.offset(parseInt(skip as string));
  }

  const data = await dtbs
    .withSchema(this.RESTAURANT_SCHEMA)
    .select(
      "ev.id",
      "ev.voucher_no",
      "ev.name as expense_name",
      "a.name as account_name",
      "a.ac_type",
      "ev.total as expense_amount",
      "ev.expense_category",
      "ev.expense_date as expense_date"
    )
    .where("ev.res_id", res_id)
    .leftJoin("account as a", "ev.ac_tr_ac_id", "a.id")
    .andWhere(function () {
      if (from_date && to_date) {
        this.andWhereBetween("ev.expense_date", [from_date, endDate]);
      }
      if (expense_category) {
        this.andWhere({ expense_category });
      }
      if (key) {
        this.andWhere((builder) => {
          builder
            .orWhere("ev.name", "like", `%${key}%`)
            .orWhere("a.name", "like", `%${key}%`);
        });
      }
    })
    .groupBy("ev.id")
    .orderBy("ev.id", "desc");

  const total = await this.db("expense_view as ev")
    .withSchema(this.RESTAURANT_SCHEMA)
    .countDistinct("ev.id as total")
    .leftJoin("account as a", "ev.ac_tr_ac_id", "a.id")
    .where("ev.res_id", res_id)
    .andWhere(function () {
      if (from_date && to_date) {
        this.andWhereBetween("ev.expense_date", [from_date, endDate]);
      }
      if (expense_category) {
        this.andWhere({ expense_category });
      }
      if (key) {
        this.andWhere((builder) => {
          builder
            .orWhere("ev.name", "like", `%${key}%`)
            .orWhere("a.name", "like", `%${key}%`);
        });
      }
    })
    .first();

    return { data, total: total ? total.total : 0 };
  }

  // get single Expense Model
  public async getSingleExpense(id: number, res_id: number) {
    const dtbs = this.db("expense_view as ev");
    const data = await dtbs
      .withSchema(this.RESTAURANT_SCHEMA)
      .select("*")
      .where("ev.id", id)
      .andWhere("ev.res_id", res_id);

    return data.length > 0 ? data[0] : [];
  }

  //=================== Guest  ======================//

  // Get All Guest Model
  public async getAllGuest(payload: {
    limit?: string;
    skip?: string;
    key?: string;
    user_type?: string;
    email: string;
    hotel_id: number;
  }) {
    const { key, hotel_id, limit, skip, user_type } = payload;

    const dtbs = this.db("user_view");

    if (limit && skip) {
      dtbs.limit(parseInt(limit as string));
      dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs
      .select(
        "id",
        "name",
        "email",
        "country",
        "city",
        "status",
        "last_balance",
        "created_at",
        "user_type"
      )
      .withSchema(this.RESTAURANT_SCHEMA)
      .where({ hotel_id })
      .andWhere(function () {
        if (key) {
          this.andWhere("name", "like", `%${key}%`)
            .orWhere("email", "like", `%${key}%`)
            .orWhere("country", "like", `%${key}%`)
            .orWhere("city", "like", `%${key}%`);
        }

        if (user_type) {
          this.andWhereRaw(
            `JSON_CONTAINS(user_type, '[{"user_type": "${user_type}"}]')`
          );
        }
      })
      .orderBy("id", "desc");

    const total = await this.db("user_view")
      .withSchema(this.RESTAURANT_SCHEMA)
      .count("id as total")
      .where({ hotel_id })
      .andWhere(function () {
        if (key) {
          this.andWhere("name", "like", `%${key}%`)
            .orWhere("email", "like", `%${key}%`)
            .orWhere("country", "like", `%${key}%`)
            .orWhere("city", "like", `%${key}%`);
        }

        if (user_type) {
          this.andWhereRaw(
            `JSON_CONTAINS(user_type, '[{"user_type": "${user_type}"}]')`
          );
        }
      });

    return { data, total: total[0].total };
  }

  //=================== Account  ======================//

  // create account
  public async createAccount(payload: IAccountResCreateBody) {
    return await this.db("account")
      .withSchema(this.RESTAURANT_SCHEMA)
      .insert(payload);
  }

  // update account
  public async upadateSingleAccount(
    payload: IupdateAccount,
    where: { res_id: number; id: number }
  ) {
    const { res_id, id } = where;
    return await this.db("account")
      .withSchema(this.RESTAURANT_SCHEMA)
      .update(payload)
      .where({ res_id })
      .andWhere({ id });
  }

  // get all account
  public async getAllAccounts(payload: {
    res_id: number;
    status?: string;
    ac_type?: string;
    key?: string;
    limit?: string;
    skip?: string;
    admin_id?: number;
    acc_ids?: number[];
  }) {
    const { status, res_id, ac_type, key, limit, skip, admin_id, acc_ids } =
      payload;

    const dtbs = this.db("account as a");

    if (limit && skip) {
      dtbs.limit(parseInt(limit as string));
      dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs
      .select(
        "a.id",
        "a.res_id",
        "a.name",
        "a.ac_type",
        "a.bank",
        "a.branch",
        "a.account_number",
        "a.details",
        "a.status",
        "a.last_balance as available_balance",
        "a.created_at"
      )
      .withSchema(this.RESTAURANT_SCHEMA)
      .where("a.res_id", res_id)
      .andWhere(function () {
        if (status) {
          this.where({ status });
        }
        if (ac_type) {
          this.andWhere({ ac_type });
        }
        if (admin_id) {
          this.andWhere({ created_by: admin_id });
        }
        if (acc_ids) {
          this.whereIn("id", acc_ids);
        }
      })
      .andWhere(function () {
        if (key) {
          this.andWhere("a.name", "like", `%${key}%`)
            .orWhere("a.account_number", "like", `%${key}%`)
            .orWhere("a.bank", "like", `%${key}%`);
        }
      })
      .orderBy("a.id", "desc");

    const total = await this.db("account as a")
      .withSchema(this.RESTAURANT_SCHEMA)
      .count("a.id as total")
      .where("a.res_id", res_id)
      .andWhere(function () {
        if (status) {
          this.where({ status });
        }
        if (ac_type) {
          this.andWhere({ ac_type });
        }
        if (admin_id) {
          this.andWhere({ created_by: admin_id });
        }
        if (acc_ids) {
          this.whereIn("id", acc_ids);
        }
      })
      .andWhere(function () {
        if (key) {
          this.andWhere("a.name", "like", `%${key}%`)
            .orWhere("a.account_number", "like", `%${key}%`)
            .orWhere("a.bank", "like", `%${key}%`);
        }
      });

    return { total: total[0].total, data };
  }

  // get single account
  public async getSingleAccount(payload: {
    res_id: number;
    id: number;
    type?: string;
  }) {
    const { id, type, res_id } = payload;
    return await this.db("account_view")
      .withSchema(this.RESTAURANT_SCHEMA)
      .select("*")
      .where("res_id", res_id)
      .andWhere(function () {
        if (id) {
          this.andWhere({ id });
        }
        if (type) {
          this.andWhere("ac_type", "like", `%${type}%`);
        }
      });
  }

  // insert in account transaction
  public async insertAccountTransaction(payload: IinsertResTransaction) {
    return await this.db("acc_transaction")
      .withSchema(this.RESTAURANT_SCHEMA)
      .insert(payload);
  }

  // insert in account ledger
  public async insertAccountLedger(payload: IinsertLedger) {
    return await this.db("acc_ledger")
      .withSchema(this.RESTAURANT_SCHEMA)
      .insert(payload);
  }

  // insert in supplier ledger
  public async insertSupplierLedger(payload: IinsertSupplierLedger) {
    return await this.db("sup_ledger")
      .withSchema(this.RESTAURANT_SCHEMA)
      .insert(payload);
  }

  // get ledeger by account id
  public async getAllLedgerLastBalanceByAccount(payload: {
    res_id: number;
    ledger_account_id: number;
  }) {
    const { res_id, ledger_account_id } = payload;
    const result = await this.db.raw(
      `SELECT ${this.RESTAURANT_SCHEMA}.get_ledger_balance(?, ?) AS remaining_balance`,
      [res_id, ledger_account_id]
    );
    const remainingBalance = result[0][0].remaining_balance;
    return remainingBalance;
  }

  //=================== Inventory  ======================//

  // get all purchase ingredient item
  public async getInventoryList(payload: {
    key: string;
    res_id: number;
    limit: string;
    skip: string;
  }) {
    const { limit, skip, res_id, key } = payload;

    const dtbs = this.db("inventory as inv");

    if (limit && skip) {
      dtbs.limit(parseInt(limit as string));
      dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs
      .withSchema(this.RESTAURANT_SCHEMA)
      .select(
        "inv.id",
        "inv.ing_id",
        "ing.name",
        "ing.measurement",
        "inv.available_quantity",
        "inv.quantity_sold"
      )
      .leftJoin("ingredient as ing", "inv.ing_id", "ing.id")
      .where({ "inv.res_id": res_id })
      .andWhere(function () {
        if (key) {
          this.andWhere((builder) => {
            builder.where("ing.name", "like", `%${key}%`);
          });
        }
      });
    return { data };
  }

  // get all Inventory
  // public async getInventory(payload: {
  //   from_date?: string;
  //   limit?: string;
  //   skip?: string;
  //   to_date: string;
  //   res_id: number;
  // }) {
  //   const { from_date, limit, skip, to_date, res_id } = payload;

  //   const endDatePlusOneDay = new Date(to_date);
  //   endDatePlusOneDay.setDate(endDatePlusOneDay.getDate() + 1);

  //   const dtbs = this.db("purchase_item as pi");

  //   if (limit && skip) {
  //     dtbs.limit(parseInt(limit as string));
  //     dtbs.offset(parseInt(skip as string));
  //   }

  //   await dtbs
  //     .withSchema(this.RESTAURANT_SCHEMA)
  //     .select("pi.id")
  //     .where({ "pi.res_id": res_id })
  //     .groupBy("pi.ingredient_id")
  //     .orderBy("pi.id", "desc");

  //   // for total_inventory
  //   const total_inventory = await this.db("purchase_item as pi")
  //     .withSchema(this.RESTAURANT_SCHEMA)
  //     .where({ "iv.res_id": res_id })
  //     .count("pi.id as total")
  //     .andWhere(function () {
  //       if (from_date && to_date) {
  //         this.andWhereBetween("pi.created_at", [from_date, endDatePlusOneDay]);
  //       }
  //     })
  //     .where({ "pi.res_id": res_id })
  //     .groupBy("pi.ingredient_id")
  //     .orderBy("pi.id", "desc");

  //   // for total_pur_quantiy
  //   const total_pur_quantiy = await this.db("purchase_item as pi")
  //     .withSchema(this.RESERVATION_SCHEMA)
  //     .sum("pi.quantity as total_pur_quantiy")
  //     .where({ res_id })
  //     .andWhere(function () {
  //       if (from_date && to_date) {
  //         this.andWhereBetween("pi.created_at", [from_date, endDatePlusOneDay]);
  //       }
  //     })
  //     .where({ "pi.res_id": res_id })
  //     .groupBy("pi.ingredient_id")
  //     .orderBy("pi.id", "desc");

  //   // for total_used_pur_quantiy
  //   const total_used_quantity = await this.db("food_items as fi")
  //     .withSchema(this.RESERVATION_SCHEMA)
  //     .sum("fi.ing_quantity as total_pur_quantiy")
  //     .where({ res_id })
  //     .andWhere(function () {
  //       if (from_date && to_date) {
  //         this.andWhereBetween("fi.created_at", [from_date, endDatePlusOneDay]);
  //       }
  //     })
  //     .where({ "fi.res_id": res_id })
  //     .groupBy("fi.ingredient_id");

  //   return {
  //     total_pur_quantiy: total_pur_quantiy[0].total_pur_quantiy,
  //     total_used_quantity: total_used_quantity[0].total_used_quantity,
  //     total_inventory: total_inventory[0].total_inventory,
  //   };
  // }

  //=================== Food  ======================//

  // create food
  public async createFood(payload: ICreateFoodBody) {
    return await this.db("food")
      .withSchema(this.RESTAURANT_SCHEMA)
      .insert(payload);
  }

  // create food items
  public async createFoodItems(payload: ICreateFoodItemsBody[]) {
    return await this.db("food_items")
      .withSchema(this.RESTAURANT_SCHEMA)
      .insert(payload);
  }

  // get all purchase ingredient item
  public async getAllPurchaseIngItem(payload: { res_id: number }) {
    const { res_id } = payload;

    const dtbs = this.db("purchase_item_view as i");

    const data = await dtbs
      .withSchema(this.RESTAURANT_SCHEMA)
      .where({ "i.res_id": res_id })
      .orderBy("id", "desc");

    return { data };
  }

  // get All Food
  public async getAllFood(payload: {
    limit?: string;
    skip?: string;
    key?: string;
    category?: string;
    res_id: number;
    ids?: number[];
  }) {
    const { key, limit, skip, res_id, ids, category } = payload;

    console.log({ category });

    const dtbs = this.db("food_view as fv");

    if (limit && skip) {
      dtbs.limit(parseInt(limit as string));
      dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs
      .withSchema(this.RESTAURANT_SCHEMA)
      .select(
        "fv.id",
        "fv.name as food_name",
        "fv.category_id",
        "fv.category_name",
        "fv.production_price",
        "fv.retail_price",
        "fv.status",
        "fv.food_items"
      )
      .where("fv.res_id", res_id)
      .andWhere((qb) => {
        if (key) {
          qb.andWhere("fv.name", "like", `%${key}%`).orWhere(
            "fv.category_name",
            "like",
            `%${key}%`
          );
        }

        if (category) {
          qb.andWhere(
            this.db.raw("LOWER(fv.category_name)"),
            "like",
            `%${category.toLowerCase()}%`
          );
        }

        if (ids) {
          qb.whereIn("id", ids);
        }
      })
      .orderBy("fv.id", "desc");

    const total = await this.db("food_view as fv")
      .withSchema(this.RESTAURANT_SCHEMA)
      .count("fv.id as total")
      .where("fv.res_id", res_id)
      .andWhere((qb) => {
        if (key) {
          qb.andWhere("fv.name", "like", `%${key}%`).orWhere(
            "fv.category_name",
            "like",
            `%${key}%`
          );
        }

        if (category) {
          qb.andWhere(
            this.db.raw("LOWER(fv.category_name)"),
            "like",
            `%${category.toLowerCase()}%`
          );
        }

        if (ids) {
          qb.whereIn("id", ids);
        }
      });

    return { total: total[0].total, data };
  }

  // get Single Food
  public async getSingleFood(payload: { id: number; res_id: number }) {
    const { id, res_id } = payload;

    return await this.db("food_view")
      .select("*")
      .withSchema(this.RESTAURANT_SCHEMA)
      .where({ id, res_id });
  }

  // get Single Food
  public async getSingleOrderFood(payload: {
    foodID: number[];
    res_id: number;
  }) {
    const { foodID, res_id } = payload;

    const data = await this.db("food_view")
      .select("*")
      .withSchema(this.RESTAURANT_SCHEMA)
      .where({ id: foodID, res_id });

    return data.length > 0 ? data[0] : 0;
  }

  // update Food
  public async updateFood(id: number, payload: IupdateFoodBody) {
    return await this.db("food")
      .withSchema(this.RESTAURANT_SCHEMA)
      .where({ id })
      .update(payload);
  }

  //=================== Restaurant  ======================//

  // get single hotel
  public async getSingleRes(payload: IsingleHotelUserPayload) {
    const { id, email } = payload;
    return await this.db("Res_view")
      .withSchema(this.RESERVATION_SCHEMA)
      .select("*")
      .where(function () {
        if (id) {
          this.andWhere({ id });
        }
        if (email) {
          this.andWhere({ email });
        }
      });
  }

  // create Restaurant
  public async createRestaurant(payload: ICreateRestaurantPayload) {
    return await this.db("restaurant")
      .withSchema(this.RESTAURANT_SCHEMA)
      .insert(payload);
  }

  // create Restaurant user
  public async createResAdmin(payload: ICreateResAdminPayload) {
    return await this.db("res_admin")
      .withSchema(this.RESTAURANT_SCHEMA)
      .insert(payload);
  }

  // get Restaurant email
  public async getAllResAdminEmail(payload: {
    email: string;
    hotel_id: number;
  }) {
    const { email, hotel_id } = payload;

    const dtbs = this.db("res_admin as ra");

    const data = await dtbs
      .withSchema(this.RESTAURANT_SCHEMA)
      .where({ "ra.hotel_id": hotel_id })
      .andWhere({ "ra.email": email })
      .orderBy("id", "desc");

    return data.length > 0 ? data[0] : null;
  }

  // get all Restaurant of a hotel
  public async getAllRestaurant(payload: {
    limit?: string;
    skip?: string;
    email?: string;
    res_email?: string;
    name?: string;
    key?: string;
    hotel_id: number;
  }) {
    const { key, limit, skip, hotel_id, res_email } = payload;

    const dtbs = this.db("restaurant as r");

    if (limit && skip) {
      dtbs.limit(parseInt(limit as string));
      dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs
      .withSchema(this.RESTAURANT_SCHEMA)
      .select(
        "r.id as res_id",
        "r.name",
        "r.email as res_email",
        "r.status as res_status",
        "r.phone"
      )
      .where("r.hotel_id", hotel_id)
      .andWhere(function () {
        if (key) {
          this.andWhere("r.name", "like", `%${key}%`).orWhere(
            "r.email",
            "like",
            `%${key}%`
          );
        }
      })
      .orderBy("r.id", "desc");

    const total = await this.db("restaurant as r")
      .withSchema(this.RESTAURANT_SCHEMA)
      .count("r.id as total")
      .where("r.hotel_id", hotel_id)
      .andWhere(function () {
        if (key) {
          this.andWhere("r.name", "like", `%${key}%`).orWhere(
            "r.email",
            "like",
            `%${key}%`
          );
        }
      })
      .orderBy("r.id", "desc");

    return { total: total[0].total, data };
  }

  // Get single Restaurant profile
  public async getResAdmin(where: { res_id: number; hotel_id: number }) {
    const { res_id, hotel_id } = where;
    return await this.db("res_admin as ra")
      .select(
        "ra.id",
        "ra.res_id",
        "r.photo as logo",
        "r.name as res_name",
        "r.email as res_email",
        "r.phone as res_phone",
        "r.address as res_address",
        "r.city as res_city",
        "r.country as res_country",
        "r.bin_no as trade_licence",
        "r.status as res_status",
        "ra.name as admin_name",
        "ra.avatar as admin_photo",
        "ra.phone as admin_phone",
        "ra.email as admin_email",
        "ra.status as admin_status"
      )
      .withSchema(this.RESTAURANT_SCHEMA)
      .leftJoin("restaurant as r", "ra.res_id", "r.id")
      .where("ra.hotel_id", hotel_id)
      .andWhere("ra.res_id", res_id);
  }

  // Get single Restaurant Admin
  public async getSingleResAdmin(where: {
    email?: string;
    id?: number;
    hotel_id?: number;
  }) {
    const { email, id, hotel_id } = where;
    return await this.db("res_admin as ra")
      .select("*")
      .withSchema(this.RESTAURANT_SCHEMA)
      .where(function () {
        if (id) {
          this.where("ra.id", id);
        }
        if (email) {
          this.where("ra.email", email);
        }
        if (hotel_id) {
          this.andWhere("ra.hotel_id", hotel_id);
        }
      });
  }

  public async updateRestaurant(id: number, 
    payload: IupdateRestaurantPayload) {
    return await this.db("restaurant as r")
      .withSchema(this.RESTAURANT_SCHEMA)
      .where("r.id", id)
      .update(payload);
  }

  public async updateResAdmin(id: number, payload: IupdateRestAdminPayload) {
    return await this.db("res_admin")
      .withSchema(this.RESTAURANT_SCHEMA)
      .update(payload)
      .where({ id });
  }

  //=================== Ingredient  ======================//

  // create Ingredient
  public async createIngredient(payload: ICreateIngredientPayload) {
    return await this.db("ingredient")
      .withSchema(this.RESTAURANT_SCHEMA)
      .insert(payload);
  }

  // create purchase item
  public async createPurchaseItem(payload: ICreatePurchaseItemPayload[]) {
    return await this.db("purchase_item")
      .withSchema(this.RESTAURANT_SCHEMA)
      .insert(payload);
  }

  // Get All Ingredient
  public async getAllIngredient(payload: {
    limit?: string;
    skip?: string;
    name: string;
    measurement: string;
    res_id: number;
  }) {
    const { limit, skip, res_id, name } = payload;

    const dtbs = this.db("ingredient as i");

    if (limit && skip) {
      dtbs.limit(parseInt(limit as string));
      dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs
      .withSchema(this.RESTAURANT_SCHEMA)
      .select("i.id", "i.name", "i.measurement")
      .where("i.res_id", res_id)
      .andWhere(function () {
        if (name) {
          this.andWhere("i.name", "like", `%${name}%`);
        }
      })
      .orderBy("i.id", "desc");

    const total = await this.db("ingredient as i")
      .withSchema(this.RESTAURANT_SCHEMA)
      .count("i.id as total")
      .where("i.res_id", res_id)
      .andWhere(function () {
        if (name) {
          this.andWhere("i.name", "like", `%${name}%`);
        }
      });

    return { total: total[0].total, data };
  }

  // Single Ingredint
  public async getSingleIngredient(ing_id: number, res_id: number) {
    const dtbs = this.db("ingredient as i");
    const data = await dtbs
      .withSchema(this.RESTAURANT_SCHEMA)
      .select("*")
      .where("i.id", ing_id)
      .andWhere("i.res_id", res_id);

    return data.length > 0 ? data[0] : [];
  }

  // Update Ingredient
  public async updateIngredient(id: number, payload: IUpdateIngredientPayload) {
    return await this.db("ingredient")
      .withSchema(this.RESTAURANT_SCHEMA)
      .where({ id })
      .update(payload);
  }

  // Delete Ingredient
  public async deleteIngredient(id: number) {
    return await this.db("ingredient")
      .withSchema(this.RESTAURANT_SCHEMA)
      .where({ id })
      .del();
  }

  //=================== Supplier  ======================//

  // create Supplier
  public async createSupplier(payload: ICreateSupplierPayload) {
    return await this.db("supplier")
      .withSchema(this.RESTAURANT_SCHEMA)
      .insert(payload);
  }

  // Get All Supplier
  public async getAllSupplier(payload: {
    limit?: string;
    skip?: string;
    name: string;
    status?: string;
    res_id: number;
  }) {
    const { limit, skip, res_id, name, status } = payload;

    const dtbs = this.db("supplier as s");

    if (limit && skip) {
      dtbs.limit(parseInt(limit as string));
      dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs
      .withSchema(this.RESTAURANT_SCHEMA)
      .select("s.id", "s.name", "s.phone", "s.status")
      .where("s.res_id", res_id)
      .andWhere(function () {
        if (name) {
          this.andWhere("s.name", "like", `%${name}%`);
        }
        if (status) {
          this.andWhere("s.status", "like", `%${status}%`);
        }
      })
      .orderBy("s.id", "desc");

    const total = await this.db("supplier as s")
      .withSchema(this.RESTAURANT_SCHEMA)
      .count("s.id as total")
      .where("s.res_id", res_id)
      .andWhere(function () {
        if (name) {
          this.andWhere("s.name", "like", `%${name}%`);
        }
        if (status) {
          this.andWhere("s.status", "like", `%${status}%`);
        }
      });

    return { total: total[0].total, data };
  }

    // get single supplier
    public async getSingleSupplier(id: number, res_id: number) {
      return await this.db("supplier as s")
      .withSchema(this.RESTAURANT_SCHEMA)
      .select("*")
      .where("s.id", id)
      .andWhere("s.res_id", res_id);
  }

  // Update supplier
  public async updateSupplier(id: number, payload: IUpdateSupplierPayload) {
    return await this.db("supplier")
      .withSchema(this.RESTAURANT_SCHEMA)
      .where({ id })
      .update(payload);
  }

  // Delete supplier
  public async deleteSupplier(id: number) {
    return await this.db("supplier")
      .withSchema(this.RESTAURANT_SCHEMA)
      .where({ id })
      .del();
  }

  //=================== Category  ======================//

  // create Category
  public async createCategory(payload: ICreateCategoryPayload) {
    return await this.db("category")
      .withSchema(this.RESTAURANT_SCHEMA)
      .insert(payload);
  }

  // Get All Category
  public async getAllCategory(payload: {
    limit?: string;
    skip?: string;
    name: string;
    status?: string;
    res_id: number;
  }) {
    const { limit, skip, res_id, name, status } = payload;

    const dtbs = this.db("category as c");

    if (limit && skip) {
      dtbs.limit(parseInt(limit as string));
      dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs
      .withSchema(this.RESTAURANT_SCHEMA)
      .select("c.id", "c.name", "c.status")
      .where("c.res_id", res_id)
      .andWhere(function () {
        if (name) {
          this.andWhere("c.name", "like", `%${name}%`);
        }
        if (status) {
          this.andWhere("c.status", "like", `%${status}%`);
        }
      })
      .orderBy("c.id", "desc");

    const total = await this.db("category as c")
      .withSchema(this.RESTAURANT_SCHEMA)
      .count("c.id as total")
      .where("c.res_id", res_id)
      .andWhere(function () {
        if (name) {
          this.andWhere("c.name", "like", `%${name}%`);
        }
        if (status) {
          this.andWhere("c.status", "like", `%${status}%`);
        }
      });

    return { total: total[0].total, data };
  }

  // Update Category
  public async updateCategory(id: number, payload: IUpdateCategoryPayload) {
    return await this.db("category")
      .withSchema(this.RESTAURANT_SCHEMA)
      .where({ id })
      .update(payload);
  }

  // Delete Category
  public async deleteCategory(id: number) {
    return await this.db("category")
      .withSchema(this.RESTAURANT_SCHEMA)
      .where({ id })
      .del();
  }

  //=================== purchase  ======================//

  // create purchase
  public async createPurchase(payload: ICreatePurchasePayload) {
    return await this.db("purchase")
      .withSchema(this.RESTAURANT_SCHEMA)
      .insert(payload);
  }

  // Get All purchase
  public async getAllpurchase(payload: {
    limit?: string;
    skip?: string;
    res_id: number;
  }) {
    const { limit, skip, res_id } = payload;

    const dtbs = this.db("purchase_view as pv");

    if (limit && skip) {
      dtbs.limit(parseInt(limit as string));
      dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs
      .withSchema(this.RESTAURANT_SCHEMA)
      .select(
        "id",
        "purchase_date",
        "supplier_name",
        "supplier_phone",
        "sub_total",
        "discount_amount",
        "grand_total"
      )
      .where("pv.res_id", res_id)
      .orderBy("pv.id", "desc");

    const total = await this.db("purchase_view as pv")
      .withSchema(this.RESTAURANT_SCHEMA)
      .count("pv.id as total")
      .where("pv.res_id", res_id);

    return { total: total[0].total, data };
  }

  // get single Purchase
  public async getSinglePurchase(id: number, res_id: number) {
    const dtbs = this.db("purchase_view as pv");
    const data = await dtbs
      .withSchema(this.RESTAURANT_SCHEMA)
      .select(
        "pv.id",
        "pv.res_id",
        "pv.purchase_date",
        "pv.supplier_name",
        "pv.supplier_phone",
        "pv.sub_total",
        "pv.discount_amount",
        "pv.grand_total",
        "av.account_name",
        "av.ac_type as account_type",
        "av.last_balance",
        "pv.purchase_items"
      )
      .leftJoin("account_view as av", "pv.ac_tr_ac_id", "av.id")
      .where("pv.id", id)
      .andWhere("pv.res_id", res_id);

    return data.length > 0 ? data[0] : [];
  }

  //=================== account  ======================//

  // Get All Account
  public async getAllAccount(payload: {
    res_id: number;
    status?: string;
    ac_type?: string;
    key?: string;
    limit?: string;
    skip?: string;
    admin_id?: number;
    acc_ids?: number[];
  }) {
    const { status, res_id, ac_type, key, limit, skip, admin_id, acc_ids } =
      payload;

    const dtbs = this.db("account_view as av");

    if (limit && skip) {
      dtbs.limit(parseInt(limit as string));
      dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs
      .withSchema(this.RESTAURANT_SCHEMA)
      .select("*")
      .where("av.res_id", res_id)
      .andWhere(function () {
        if (status) {
          this.where({ status });
        }
        if (ac_type) {
          this.andWhere({ ac_type });
        }
        if (admin_id) {
          this.andWhere({ created_by: admin_id });
        }
        if (acc_ids) {
          this.whereIn("id", acc_ids);
        }
      })
      .andWhere(function () {
        if (key) {
          this.andWhere("a.name", "like", `%${key}%`)
            .orWhere("a.account_number", "like", `%${key}%`)
            .orWhere("a.bank", "like", `%${key}%`);
        }
      })
      .orderBy("av.id", "desc");

    const total = await this.db("account_view as av")
      .withSchema(this.RESTAURANT_SCHEMA)
      .count("av.id as total")
      .where("av.res_id", res_id)
      .andWhere(function () {
        if (status) {
          this.where({ status });
        }
        if (ac_type) {
          this.andWhere({ ac_type });
        }
        if (admin_id) {
          this.andWhere({ created_by: admin_id });
        }
        if (acc_ids) {
          this.whereIn("id", acc_ids);
        }
      })
      .andWhere(function () {
        if (key) {
          this.andWhere("a.name", "like", `%${key}%`)
            .orWhere("a.account_number", "like", `%${key}%`)
            .orWhere("a.bank", "like", `%${key}%`);
        }
      });

    return { total: total[0].total, data };
  }
}
export default RestaurantModel;
