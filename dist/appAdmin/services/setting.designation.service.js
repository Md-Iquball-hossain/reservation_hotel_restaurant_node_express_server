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
class DesignationSettingService extends abstract_service_1.default {
    constructor() {
        super();
    }
    //=================== designation service ======================//
    // create designation
    createDesignation(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { hotel_id } = req.hotel_admin;
                const { name } = req.body;
                // designation check
                const settingModel = this.Model.settingModel();
                const { data } = yield settingModel.getAllDesignation({ name, hotel_id });
                if (data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Designation name already exists, give another unique designation name",
                    };
                }
                // model
                const model = new Setting_Model_1.default(trx);
                const res = yield model.createDesignation({
                    hotel_id,
                    name,
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: "Designation created successfully.",
                };
            }));
        });
    }
    // Get all designation
    getAllDesignation(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotel_id } = req.hotel_admin;
            const { limit, skip, name } = req.query;
            const model = this.Model.settingModel();
            const { data, total } = yield model.getAllDesignation({
                limit: limit,
                skip: skip,
                name: name,
                hotel_id,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total,
                data,
            };
        });
    }
    // Update Designation
    updateDesignation(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { hotel_id } = req.hotel_admin;
                const { id } = req.params;
                const updatePayload = req.body;
                const model = this.Model.settingModel(trx);
                const res = yield model.updateDesignation(parseInt(id), {
                    hotel_id,
                    name: updatePayload.name,
                });
                if (res === 1) {
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_OK,
                        message: "Designation name updated successfully",
                    };
                }
                else {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "Designation didn't find  from this ID",
                    };
                }
            }));
        });
    }
    // Delete Designation
    deleteDesignation(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.params;
                const model = this.Model.settingModel(trx);
                const res = yield model.deleteDesignation(parseInt(id));
                if (res === 1) {
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_OK,
                        message: "Designation deleted successfully",
                    };
                }
                else {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "Designation didn't find from this ID",
                    };
                }
            }));
        });
    }
}
exports.default = DesignationSettingService;
//# sourceMappingURL=setting.designation.service.js.map