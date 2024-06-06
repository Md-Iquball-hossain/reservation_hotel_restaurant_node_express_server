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
class IngredientService extends abstract_service_1.default {
    constructor() {
        super();
    }
    //=================== Ingredient service ======================//
    // create Ingredient
    createIngredient(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id, res_id } = req.rest_user;
                const { name, measurement } = req.body;
                // Ingredient name check
                const Model = this.Model.restaurantModel();
                const { data } = yield Model.getAllIngredient({ name, measurement, res_id });
                if (data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Ingredientname already exists, give another unique Ingredient",
                    };
                }
                yield Model.createIngredient({
                    res_id,
                    name,
                    measurement,
                    created_by: id
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: "Ingredient created successfully.",
                };
            }));
        });
    }
    // Get all Ingredient
    getAllIngredient(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { res_id } = req.rest_user;
            const { limit, skip, name, measurement } = req.query;
            const model = this.Model.restaurantModel();
            const { data, total } = yield model.getAllIngredient({
                limit: limit,
                skip: skip,
                name: name,
                measurement: measurement,
                res_id,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total,
                data
            };
        });
    }
    // Update Ingredient
    updateIngredient(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { res_id } = req.rest_user;
                const { id } = req.params;
                const updatePayload = req.body;
                const model = this.Model.restaurantModel(trx);
                const res = yield model.updateIngredient(parseInt(id), {
                    res_id,
                    name: updatePayload.name,
                    measurement: updatePayload.measurement
                });
                if (res === 1) {
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_OK,
                        message: "Ingredient updated successfully",
                    };
                }
                else {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "Ingredient didn't find  from this ID",
                    };
                }
            }));
        });
    }
    // Delete Ingredient
    deleteIngredient(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.params;
                const model = this.Model.restaurantModel(trx);
                const res = yield model.deleteIngredient(parseInt(id));
                if (res === 1) {
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_OK,
                        message: "Ingredient deleted successfully",
                    };
                }
                else {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "Ingredient didn't find from this ID",
                    };
                }
            }));
        });
    }
}
exports.default = IngredientService;
//# sourceMappingURL=ingredient.service.js.map