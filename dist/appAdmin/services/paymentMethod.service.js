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
const Setting_Model_1 = __importDefault(require("../../models/settingModel/Setting.Model"));
class PaymentMethodService extends abstract_service_1.default {
    constructor() {
        super();
    }
    //=================== Payment Method Service  ======================//
    // create Payment Method
    createPaymentMethod(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { hotel_id } = req.hotel_admin;
                const { name } = req.body;
                // Payment Method name check
                const settingModel = this.Model.settingModel();
                const { data } = yield settingModel.getAllPaymentMethod({ name, hotel_id });
                if (data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Payment Method name already exists, give another unique name",
                    };
                }
                // model
                const model = new Setting_Model_1.default(trx);
                const res = yield model.createPaymentMethod({
                    hotel_id,
                    name,
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: "Payment Method created successfully.",
                };
            }));
        });
    }
    // Get All Payment Method
    getAllPaymentMethod(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotel_id } = req.hotel_admin;
            const { limit, skip, name } = req.query;
            const model = this.Model.settingModel();
            const { data, total } = yield model.getAllPaymentMethod({
                limit: limit,
                skip: skip,
                name: name,
                hotel_id,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total,
                data
            };
        });
    }
    // Update Payment Method
    updatePaymentMethod(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { hotel_id } = req.hotel_admin;
                const { id } = req.params;
                const updatePayload = req.body;
                const model = this.Model.settingModel(trx);
                const res = yield model.updatePaymentMethod(parseInt(id), {
                    hotel_id,
                    name: updatePayload.name,
                });
                if (res === 1) {
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_OK,
                        message: "Payment Method updated successfully",
                    };
                }
                else {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "Payment Method didn't find  from this ID",
                    };
                }
            }));
        });
    }
    // Delete Payment Method
    deletePaymentMethod(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.params;
                const model = this.Model.settingModel(trx);
                const res = yield model.deletePaymentMethod(parseInt(id));
                if (res === 1) {
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_OK,
                        message: "Payment Method deleted successfully",
                    };
                }
                else {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "Payment Method didn't find from this ID",
                    };
                }
            }));
        });
    }
}
exports.default = PaymentMethodService;
//# sourceMappingURL=paymentMethod.service.js.map