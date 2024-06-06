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
class ResReportModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    //=================== Report  ======================//
    // Expense Report
    getExpenseReport(payload) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, res_id, name, from_date, to_date } = payload;
            const dtbs = this.db("expense_item as ei");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const endDate = new Date(to_date);
            endDate.setDate(endDate.getDate());
            const data = yield dtbs
                .withSchema(this.RESTAURANT_SCHEMA)
                .select("ei.id", "ei.created_at as expense_date", "ei.name as expense_item", "ei.amount")
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
            const total = yield this.db("expense_item as ei")
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
            const totalAmount = yield this.db("expense_item as ei")
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
                totalAmount: ((_a = totalAmount[0]) === null || _a === void 0 ? void 0 : _a.totalAmount) || 0,
                total: ((_b = total[0]) === null || _b === void 0 ? void 0 : _b.total) || 0,
            };
        });
    }
    // Sales Report
    getSalesReport(payload) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, res_id, name, from_date, to_date } = payload;
            const dtbs = this.db("order_item as oi");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const endDate = new Date(to_date);
            endDate.setDate(endDate.getDate());
            const data = yield dtbs
                .withSchema(this.RESTAURANT_SCHEMA)
                .select("oi.id", "oi.name as product_name", "oi.quantity as sold_quantity", "oi.rate as product_price", "oi.total as sold_amount", "oi.created_at as sold_date")
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
            const total = yield this.db("order_item as oi")
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
            const totalAmount = yield this.db("order_item as oi")
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
            const totalSold = yield this.db("order_item as oi")
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
                totalAmount: ((_a = totalAmount[0]) === null || _a === void 0 ? void 0 : _a.totalAmount) || 0,
                totalSold: ((_b = totalSold[0]) === null || _b === void 0 ? void 0 : _b.totalSold) || 0,
                total: ((_c = total[0]) === null || _c === void 0 ? void 0 : _c.total) || 0,
            };
        });
    }
    // Food
    getFoodCategoryReport(payload) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, res_id, category_name, food_name, from_date, to_date, } = payload;
            const dtbs = this.db("order_item as oi");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const endDate = new Date(to_date);
            endDate.setDate(endDate.getDate());
            const data = yield dtbs
                .withSchema(this.RESTAURANT_SCHEMA)
                .select("oi.id", "fv.name as food_name", "fv.category_name", "fv.retail_price as price")
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
            const total = yield this.db("order_item as oi")
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
            const totalSoldQuantity = yield this.db("order_item as oi")
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
                totalSoldQuantity: ((_a = totalSoldQuantity[0]) === null || _a === void 0 ? void 0 : _a.totalSoldQuantity) || 0,
                total: ((_b = total[0]) === null || _b === void 0 ? void 0 : _b.total) || 0,
            };
        });
    }
    // Purchase
    getPurchaseReport(payload) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, res_id, from_date, to_date } = payload;
            const dtbs = this.db("purchase_view as pv");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const endDate = new Date(to_date);
            endDate.setDate(endDate.getDate());
            const data = yield dtbs
                .withSchema(this.RESTAURANT_SCHEMA)
                .select("pv.id", "pv.purchase_date", "pv.supplier_name", "pv.grand_total", "pv.account_name", "pv.ac_type", "pv.purchase_items")
                .where("pv.res_id", res_id)
                .andWhere(function () {
                if (from_date && to_date) {
                    this.andWhereBetween("pv.purchase_date", [from_date, endDate]);
                }
            })
                .orderBy("pv.id", "desc");
            const total = yield this.db("purchase_view as pv")
                .withSchema(this.RESTAURANT_SCHEMA)
                .count("pv.id as total")
                .where("pv.res_id", res_id)
                .andWhere(function () {
                if (from_date && to_date) {
                    this.andWhereBetween("pv.purchase_date", [from_date, endDate]);
                }
            });
            const totalAmount = yield this.db("purchase_view as pv")
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
                totalAmount: ((_a = totalAmount[0]) === null || _a === void 0 ? void 0 : _a.totalAmount) || 0,
                total: ((_b = total[0]) === null || _b === void 0 ? void 0 : _b.total) || 0,
            };
        });
    }
    // supplier
    getSupplierReport(payload) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, res_id, supplier_id, from_date, to_date, } = payload;
            const dtbs = this.db("supplier_ledger_view as slv");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const endDate = new Date(to_date);
            endDate.setDate(endDate.getDate());
            const data = yield dtbs
                .withSchema(this.RESTAURANT_SCHEMA)
                .select("slv.id", "slv.restaurant_name", "slv.restaurant_phone", "slv.supplier_name", "slv.account_name", "slv.supplier_id", "slv.ac_tr_ac_id", "slv.ledger_debit_amount", "slv.ledger_credit_amount", "slv.created_at")
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
            const total = yield this.db("supplier_ledger_view as slv")
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
            const totalCreditAmount = yield this.db("supplier_ledger_view as slv")
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
                totalCreditAmount: ((_a = totalCreditAmount[0]) === null || _a === void 0 ? void 0 : _a.totalCreditAmount) || 0,
                total: ((_b = total[0]) === null || _b === void 0 ? void 0 : _b.total) || 0,
            };
        });
    }
}
exports.default = ResReportModel;
//# sourceMappingURL=res.report.model.js.map