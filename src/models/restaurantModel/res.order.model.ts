
import { TDB } from "../../common/types/commontypes";
import Schema from "../../utils/miscellaneous/schema";

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
    IinsertSubTables, 
    IupdateSubTableStatusBody 
} from "../../appRestaurant/utils/interfaces/food.interface";


class ResOrderModel extends Schema {
private db: TDB;

constructor(db: TDB) {
    super();
    this.db = db;
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
    kitchen_status,
    is_paid,
    status,
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
        qb.andWhereRaw(
            "JSON_CONTAINS(order_items, JSON_OBJECT('table_id', ?), '$')",
            [tab_id]
        );

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

    // Update pay status
    public async updatePayStatus(id: number, payload: IUpdatePayStatusPayload) {
        const payStatusUpdate = await this.db("order")
        .withSchema(this.RESTAURANT_SCHEMA)
        .where({ id })
        .update(payload);

        return payStatusUpdate;
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



}
export default ResOrderModel;
