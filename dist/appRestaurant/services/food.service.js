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
const abstract_service_1 = __importDefault(require("../../abstarcts/abstract.service"));
class FoodService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // create food
    createFood(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id, res_id } = req.rest_user;
                const { food_items, name, category_id, retail_price } = req.body;
                const model = this.Model.restaurantModel(trx);
                const { data } = yield model.getAllFood({
                    res_id,
                    key: name,
                });
                if (data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Food already exist",
                    };
                }
                const createdFood = yield model.createFood({
                    res_id,
                    name,
                    category_id,
                    retail_price,
                    created_by: id,
                });
                const foodItemsPayload = [];
                for (let i = 0; i < food_items.length; i++) {
                    let found = false;
                    for (let j = 0; j < foodItemsPayload.length; j++) {
                        if (food_items[i].ingredient_id == foodItemsPayload[j].ingredient_id) {
                            found = true;
                            foodItemsPayload[j].ing_quantity += food_items[i].ing_quantity;
                            break;
                        }
                    }
                    if (!found) {
                        foodItemsPayload.push({
                            food_id: createdFood[0],
                            ing_quantity: food_items[i].ing_quantity,
                            ingredient_id: food_items[i].ingredient_id,
                        });
                    }
                }
                yield model.createFoodItems(foodItemsPayload);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: "Food created",
                };
            }));
        });
    }
    // Get All Food
    getAllFood(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { res_id } = req.rest_user;
            const { limit, skip, key, category } = req.query;
            const model = this.Model.restaurantModel();
            const { data, total } = yield model.getAllFood({
                limit: limit,
                skip: skip,
                key: key,
                category: category,
                res_id,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total,
                data,
            };
        });
    }
    // Get Single Food
    getSingleFood(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { res_id } = req.rest_user;
            const { id } = req.params;
            const data = yield this.Model.restaurantModel().getSingleFood({
                id: parseInt(id),
                res_id,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: data[0],
            };
        });
    }
    // Get All Purchase Ing Item
    getAllPurchaseIngItem(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { res_id } = req.rest_user;
            const model = this.Model.restaurantModel();
            const { data } = yield model.getAllPurchaseIngItem({
                res_id,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data,
            };
        });
    }
    // Update Food
    updateFood(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { res_id, id: res_admin } = req.rest_user;
                const { id } = req.params;
                const { name, category_id, retail_price, status } = req.body;
                const model = this.Model.restaurantModel(trx);
                const getSingleFood = yield this.Model.restaurantModel().getSingleFood({
                    id: parseInt(id),
                    res_id,
                });
                console.log({ getSingleFood }, "food");
                if (!getSingleFood.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: this.ResMsg.HTTP_NOT_FOUND,
                    };
                }
                yield model.updateFood(parseInt(id), {
                    name: name,
                    category_id: category_id,
                    retail_price: retail_price,
                    status: status,
                    updated_by: res_admin,
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: "Food updated successfully",
                };
            }));
        });
    }
}
exports.default = FoodService;
//# sourceMappingURL=food.service.js.map