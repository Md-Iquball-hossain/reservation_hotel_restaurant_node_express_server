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
class SupplierService extends abstract_service_1.default {
    constructor() {
        super();
    }
    //=================== Supplier service ======================//
    // create Supplier
    createSupplier(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { res_id } = req.rest_user;
                const { name, phone } = req.body;
                // Supplier name check
                const Model = this.Model.restaurantModel();
                const { data } = yield Model.getAllSupplier({ name, res_id });
                if (data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Supplier name already exists, give another unique Supplier",
                    };
                }
                yield Model.createSupplier({
                    res_id,
                    name,
                    phone
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: "Supplier created successfully.",
                };
            }));
        });
    }
    // Get all Supplier
    getAllSupplier(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { res_id } = req.rest_user;
            const { limit, skip, name, status } = req.query;
            const model = this.Model.restaurantModel();
            const { data, total } = yield model.getAllSupplier({
                name: name,
                status: status,
                limit: limit,
                skip: skip,
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
    // Update Supplier
    updateSupplier(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { res_id } = req.rest_user;
                const { id } = req.params;
                const updatePayload = req.body;
                const model = this.Model.restaurantModel(trx);
                const res = yield model.updateSupplier(parseInt(id), {
                    res_id,
                    name: updatePayload.name,
                    phone: updatePayload.phone,
                    status: updatePayload.status,
                });
                if (res === 1) {
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_OK,
                        message: "Supplier updated successfully",
                    };
                }
                else {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "Supplier didn't find  from this ID",
                    };
                }
            }));
        });
    }
    // Delete Supplier
    deleteSupplier(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.params;
                const model = this.Model.restaurantModel(trx);
                const res = yield model.deleteSupplier(parseInt(id));
                if (res === 1) {
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_OK,
                        message: "Supplier deleted successfully",
                    };
                }
                else {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "Supplier didn't find from this ID",
                    };
                }
            }));
        });
    }
}
exports.default = SupplierService;
//# sourceMappingURL=supplier.service.js.map