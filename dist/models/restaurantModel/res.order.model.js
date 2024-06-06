"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = __importDefault(require("../../utils/miscellaneous/schema"));
class ResOrderModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    //=================== order  ======================//
    // Create Order
    createOrder(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("order")
                .withSchema(this.RESTAURANT_SCHEMA)
                .insert(payload);
        });
    }
    // update Order Payment
    updateOrderPayment(id, res_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("order as o")
                .withSchema(this.RESTAURANT_SCHEMA)
                .where({ id })
                .andWhere({ res_id })
                .update(payload);
        });
    }
    // update Order
    updateOrder(orderid, res_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("order as o")
                .withSchema(this.RESTAURANT_SCHEMA)
                .where({ id: orderid })
                .andWhere({ res_id })
                .update(payload);
        });
    }
    // Create Order Items
    insertOrderItems(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("order_item")
                .withSchema(this.RESTAURANT_SCHEMA)
                .insert(payload);
        });
    }
    // Delete order Items
    deleteOrderItems(order_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("order_item")
                .withSchema(this.RESTAURANT_SCHEMA)
                .delete()
                .where({ order_id });
        });
    }
    // get all Order last id
    getAllTableOrderForLastId(tab_id, res_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("table_order as to")
                .withSchema(this.RESTAURANT_SCHEMA)
                .select("to.id", "rt.name")
                .join("res_table as rt", "to.tab_id", "rt.id")
                .where("to.res_id", res_id)
                .where("to.tab_id", tab_id)
                .andWhere("to.status", "booked")
                .orderBy("to.id", "desc")
                .limit(1);
        });
    }
    // get all Order last id
    getAllIOrderForLastId() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("order")
                .select("id")
                .withSchema(this.RESTAURANT_SCHEMA)
                .orderBy("id", "desc")
                .limit(1);
        });
    }
    // get all order
    getAllOrder(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, res_id, staff_name, kitchen_status, is_paid, status, from_date, to_date, tab_id, } = payload;
            console.log({ status });
            const dtbs = this.db("order_view");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const endDate = new Date(to_date);
            endDate.setDate(endDate.getDate() + 1);
            const data = yield dtbs
                .withSchema(this.RESTAURANT_SCHEMA)
                .select("*")
                .from("order_view")
                .where("res_id", res_id)
                .andWhere((qb) => {
                if (tab_id) {
                    qb.andWhereRaw("JSON_CONTAINS(order_items, JSON_OBJECT('table_id', ?), '$')", [tab_id]);
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
            const total = yield this.db("order_view")
                .withSchema(this.RESTAURANT_SCHEMA)
                .count("id as total")
                .where("res_id", res_id)
                .andWhere((qb) => {
                if (tab_id) {
                    qb.andWhereRaw("JSON_CONTAINS(order_items, JSON_OBJECT('table_id', ?), '$')", [tab_id]);
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
        });
    }
    //   insert in table order
    insertInTableOrder(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("table_order")
                .withSchema(this.RESTAURANT_SCHEMA)
                .insert(payload);
        });
    }
    // get single order
    getSingleOrder(id, res_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("order_view as ov")
                .withSchema(this.RESTAURANT_SCHEMA)
                .select("*")
                .where("ov.id", id)
                .andWhere("ov.res_id", res_id);
        });
    }
    // update order status
    updateOrderStatus(id, res_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("order")
                .withSchema(this.RESTAURANT_SCHEMA)
                .where({ id })
                .andWhere({ res_id })
                .update(payload);
        });
    }
    // update payment status
    updatePaymentStatus(id, res_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("order as o")
                .withSchema(this.RESTAURANT_SCHEMA)
                .where("o.id", id)
                .andWhere("o.res_id", res_id)
                .update(payload);
        });
    }
    //=================== Kitchen ======================//
    // get all Kitchen
    getAllKitchenOrder(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { res_id, order_no, table_name, limit, skip, kitchen_status } = payload;
            const dtbs = this.db("order_view as ov");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.RESTAURANT_SCHEMA)
                .select("ov.id", "ov.order_no", "ov.sub_table_name as table_name", "ov.staff_name", "ov.order_type", "ov.kitchen_status", "ov.order_date", "ov.order_items")
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
            const total = yield this.db("order_view as ov")
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
        });
    }
    // Update Kitchen Status
    updateKitchenStatus(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const expenseHeadUpdate = yield this.db("order")
                .withSchema(this.RESTAURANT_SCHEMA)
                .where({ id })
                .update(payload);
            return expenseHeadUpdate;
        });
    }
    // Update pay status
    updatePayStatus(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const payStatusUpdate = yield this.db("order")
                .withSchema(this.RESTAURANT_SCHEMA)
                .where({ id })
                .update(payload);
            return payStatusUpdate;
        });
    }
    //=================== table  ======================//
    // Create Table Model
    createTable(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("res_table")
                .withSchema(this.RESTAURANT_SCHEMA)
                .insert(payload);
        });
    }
    // Get All Table Name
    getAllTableName(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { res_id, name } = payload;
            const dtbs = this.db("res_table as rt");
            const data = yield dtbs
                .withSchema(this.RESTAURANT_SCHEMA)
                .select("rt.id", "rt.name")
                .where("rt.res_id", res_id)
                .andWhere("rt.name", name)
                .orderBy("rt.id", "desc");
            return { data };
        });
    }
    // Get All Table Name
    getAllSubTableName(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { res_id, name } = payload;
            const dtbs = this.db("sub_table as st");
            const data = yield dtbs
                .withSchema(this.RESTAURANT_SCHEMA)
                .select("st.id", "st.name")
                .where("st.res_id", res_id)
                .andWhere("st.name", name)
                .orderBy("st.id", "desc");
            return { data };
        });
    }
    // Create Sub Table Model
    createSubTable(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("sub_table")
                .withSchema(this.RESTAURANT_SCHEMA)
                .insert(payload);
        });
    }
    // get all table with sub table
    getAllTable(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { res_id, name, category, limit, skip } = payload;
            const dtbs = this.db("table_view as tv");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
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
            const total = yield this.db("table_view as tv")
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
        });
    }
    // update table status
    updateTable(tab_id, res_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("res_table")
                .withSchema(this.RESTAURANT_SCHEMA)
                .where("id", tab_id)
                .andWhere("res_id", res_id)
                .update(payload);
        });
    }
    // get single table
    getSingleTable(id, res_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const dtbs = this.db("table_view as tv");
            const data = yield dtbs
                .withSchema(this.RESTAURANT_SCHEMA)
                .select("*")
                .where("tv.id", id)
                .andWhere("tv.res_id", res_id);
            return data.length > 0 ? data[0] : [];
        });
    }
    // get single table with sub table
    getSingleTableWithSubTable(tab_id, res_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const dtbs = this.db("table_view as tv");
            const data = yield dtbs
                .withSchema(this.RESTAURANT_SCHEMA)
                .select("*")
                .where("tv.id", tab_id)
                .andWhere("tv.res_id", res_id);
            return data.length > 0 ? data[0] : [];
        });
    }
    // get single order sub table
    getOrderSubTable(id, res_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const dtbs = this.db("order_st_view as osv");
            const data = yield dtbs
                .withSchema(this.RESTAURANT_SCHEMA)
                .select("*")
                .where("osv.id", id)
                .andWhere("osv.res_id", res_id);
            return data.length > 0 ? data[0] : [];
        });
    }
    // delete table
    deleteTable(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("res_table")
                .withSchema(this.RESTAURANT_SCHEMA)
                .where({ id })
                .del();
        });
    }
    // update table
    updateTableName(id, res_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("res_table")
                .withSchema(this.RESTAURANT_SCHEMA)
                .where({ id })
                .andWhere({ res_id })
                .update(payload);
        });
    }
    // get all sub table
    getAllSubTable(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { res_id, name, limit, skip, status } = payload;
            const dtbs = this.db("sub_table_view as stv");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
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
            const total = yield this.db("sub_table_view as stv")
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
        });
    }
    // delete Sub table
    deleteSubTable(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("sub_table")
                .withSchema(this.RESTAURANT_SCHEMA)
                .where({ id })
                .del();
        });
    }
    // get single Sub table
    getSingleSubTable(id, res_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const dtbs = this.db("sub_table as st");
            const data = yield dtbs
                .withSchema(this.RESTAURANT_SCHEMA)
                .select("*")
                .where("st.id", id)
                .andWhere("st.res_id", res_id);
            return data.length > 0 ? data[0] : [];
        });
    }
    // update Sub Tables Status
    updateSubTable(ids, res_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("sub_table")
                .withSchema(this.RESTAURANT_SCHEMA)
                .where("res_id", res_id)
                .whereIn("sub_table.id", ids)
                .update(payload);
        });
    }
    insertSubTable(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("bk_sub_table")
                .withSchema(this.RESTAURANT_SCHEMA)
                .insert(payload);
        });
    }
}
exports.default = ResOrderModel;
//# sourceMappingURL=res.order.model.js.map