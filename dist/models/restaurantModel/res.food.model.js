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
class ResFoodModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    //=================== Category  ======================//
    // create Category
    createCategory(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("category")
                .withSchema(this.RESTAURANT_SCHEMA)
                .insert(payload);
        });
    }
    // Get All Category
    getAllCategory(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, res_id, name, status } = payload;
            const dtbs = this.db("category as c");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
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
            const total = yield this.db("category as c")
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
        });
    }
    // Update Category
    updateCategory(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("category")
                .withSchema(this.RESTAURANT_SCHEMA)
                .where({ id })
                .update(payload);
        });
    }
    // Delete Category
    deleteCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("category")
                .withSchema(this.RESTAURANT_SCHEMA)
                .where({ id })
                .del();
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
    //=================== Ingredient  ======================//
    // create Ingredient
    createIngredient(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("ingredient")
                .withSchema(this.RESTAURANT_SCHEMA)
                .insert(payload);
        });
    }
    // create purchase item
    createPurchaseItem(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("purchase_item")
                .withSchema(this.RESTAURANT_SCHEMA)
                .insert(payload);
        });
    }
    // Get All Ingredient
    getAllIngredient(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, res_id, name } = payload;
            const dtbs = this.db("ingredient as i");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.RESTAURANT_SCHEMA)
                .select("i.id", "i.name", "i.measurement")
                .where("i.res_id", res_id)
                .andWhere(function () {
                if (name) {
                    this.andWhere("i.name", "like", `%${name}%`);
                }
            })
                .orderBy("i.id", "desc");
            const total = yield this.db("ingredient as i")
                .withSchema(this.RESTAURANT_SCHEMA)
                .count("i.id as total")
                .where("i.res_id", res_id)
                .andWhere(function () {
                if (name) {
                    this.andWhere("i.name", "like", `%${name}%`);
                }
            });
            return { total: total[0].total, data };
        });
    }
    // Single Ingredint
    getSingleIngredient(ing_id, res_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const dtbs = this.db("ingredient as i");
            const data = yield dtbs
                .withSchema(this.RESTAURANT_SCHEMA)
                .select("*")
                .where("i.id", ing_id)
                .andWhere("i.res_id", res_id);
            return data.length > 0 ? data[0] : [];
        });
    }
    // Update Ingredient
    updateIngredient(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("ingredient")
                .withSchema(this.RESTAURANT_SCHEMA)
                .where({ id })
                .update(payload);
        });
    }
    // Delete Ingredient
    deleteIngredient(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("ingredient")
                .withSchema(this.RESTAURANT_SCHEMA)
                .where({ id })
                .del();
        });
    }
    //=================== Inventory  ======================//
    // insert in inventory
    insertInInventory(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("inventory")
                .withSchema(this.RESTAURANT_SCHEMA)
                .insert(payload);
        });
    }
    // update in inventory
    updateInInventory(payload, where) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("inventory")
                .withSchema(this.RESTAURANT_SCHEMA)
                .update(payload)
                .where("id", where.id);
        });
    }
    // get all inventory
    getAllInventory(where) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ing_ids, res_id } = where;
            return yield this.db("inventory")
                .withSchema(this.RESTAURANT_SCHEMA)
                .select("*")
                .where("res_id", res_id)
                .andWhere(function () {
                if (ing_ids) {
                    this.whereIn("ing_id", ing_ids);
                }
            });
        });
    }
    // get all purchase ingredient item
    getInventoryList(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, res_id, key } = payload;
            const dtbs = this.db("inventory as inv");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.RESTAURANT_SCHEMA)
                .select("inv.id", "inv.ing_id", "ing.name", "ing.measurement", "inv.available_quantity", "inv.quantity_sold")
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
        });
    }
    //=================== Food  ======================//
    // create food
    createFood(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("food")
                .withSchema(this.RESTAURANT_SCHEMA)
                .insert(payload);
        });
    }
    // create food items
    createFoodItems(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("food_items")
                .withSchema(this.RESTAURANT_SCHEMA)
                .insert(payload);
        });
    }
    // get all purchase ingredient item
    getAllPurchaseIngItem(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { res_id } = payload;
            const dtbs = this.db("purchase_item_view as i");
            const data = yield dtbs
                .withSchema(this.RESTAURANT_SCHEMA)
                .where({ "i.res_id": res_id })
                .orderBy("id", "desc");
            return { data };
        });
    }
    // get All Food
    getAllFood(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, limit, skip, res_id, ids, category } = payload;
            console.log({ category });
            const dtbs = this.db("food_view as fv");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.RESTAURANT_SCHEMA)
                .select("fv.id", "fv.name as food_name", "fv.category_id", "fv.category_name", "fv.production_price", "fv.retail_price", "fv.status", "fv.food_items")
                .where("fv.res_id", res_id)
                .andWhere((qb) => {
                if (key) {
                    qb.andWhere("fv.name", "like", `%${key}%`).orWhere("fv.category_name", "like", `%${key}%`);
                }
                if (category) {
                    qb.andWhere(this.db.raw("LOWER(fv.category_name)"), "like", `%${category.toLowerCase()}%`);
                }
                if (ids) {
                    qb.whereIn("id", ids);
                }
            })
                .orderBy("fv.id", "desc");
            const total = yield this.db("food_view as fv")
                .withSchema(this.RESTAURANT_SCHEMA)
                .count("fv.id as total")
                .where("fv.res_id", res_id)
                .andWhere((qb) => {
                if (key) {
                    qb.andWhere("fv.name", "like", `%${key}%`).orWhere("fv.category_name", "like", `%${key}%`);
                }
                if (category) {
                    qb.andWhere(this.db.raw("LOWER(fv.category_name)"), "like", `%${category.toLowerCase()}%`);
                }
                if (ids) {
                    qb.whereIn("id", ids);
                }
            });
            return { total: total[0].total, data };
        });
    }
    // get Single Food
    getSingleFood(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, res_id } = payload;
            return yield this.db("food_view")
                .select("*")
                .withSchema(this.RESTAURANT_SCHEMA)
                .where({ id, res_id });
        });
    }
    // get Single Food
    getSingleOrderFood(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { foodID, res_id } = payload;
            const data = yield this.db("food_view")
                .select("*")
                .withSchema(this.RESTAURANT_SCHEMA)
                .where({ id: foodID, res_id });
            return data.length > 0 ? data[0] : 0;
        });
    }
    // update Food
    updateFood(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("food")
                .withSchema(this.RESTAURANT_SCHEMA)
                .where({ id })
                .update(payload);
        });
    }
}
exports.default = ResFoodModel;
//# sourceMappingURL=res.food.model.js.map