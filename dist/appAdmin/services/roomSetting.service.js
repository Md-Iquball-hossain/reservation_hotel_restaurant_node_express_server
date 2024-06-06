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
class RoomSettingService extends abstract_service_1.default {
    constructor() {
        super();
    }
    //=================== Room Type ======================//
    // create room type
    createRoomType(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { hotel_id } = req.hotel_admin;
                const { room_type } = req.body;
                // room type check
                const settingModel = this.Model.settingModel();
                const { data } = yield settingModel.getAllRoomType({ room_type, hotel_id });
                if (data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Same Room Type already exists, give another unique room type name",
                    };
                }
                // model
                const model = new Setting_Model_1.default(trx);
                const res = yield model.createRoomType({
                    hotel_id,
                    room_type,
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: "Room Type created successfully.",
                };
            }));
        });
    }
    // Get all room type
    getAllRoomType(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotel_id } = req.hotel_admin;
            const { limit, skip, room_type } = req.query;
            const model = this.Model.settingModel();
            const { data, total } = yield model.getAllRoomType({
                limit: limit,
                skip: skip,
                room_type: room_type,
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
    // Update room type
    updateRoomType(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { hotel_id } = req.hotel_admin;
                const { id } = req.params;
                const updatePayload = req.body;
                const model = this.Model.settingModel(trx);
                const res = yield model.updateRoomType(parseInt(id), {
                    hotel_id,
                    room_type: updatePayload.room_type,
                });
                if (res === 1) {
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_OK,
                        message: "Room Type updated successfully",
                    };
                }
                else {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "Room Type didn't find  from this ID",
                    };
                }
            }));
        });
    }
    // Delete room type
    deleteRoomType(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.params;
                const model = this.Model.settingModel(trx);
                const res = yield model.deleteRoomType(parseInt(id));
                if (res === 1) {
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_OK,
                        message: "Room Type deleted successfully",
                    };
                }
                else {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "Room Type didn't find from this ID",
                    };
                }
            }));
        });
    }
    //=================== Bed Type ======================//
    // create bed type
    createBedType(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { hotel_id } = req.hotel_admin;
                const { bed_type } = req.body;
                // bed type check
                const settingModel = this.Model.settingModel();
                const { data } = yield settingModel.getAllBedType({ bed_type, hotel_id });
                if (data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Similar Bed Type already exists, give another unique bed type name",
                    };
                }
                // model
                const model = new Setting_Model_1.default(trx);
                const res = yield model.createBedType({
                    hotel_id,
                    bed_type,
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: "Bed Type created successfully.",
                };
            }));
        });
    }
    // Get all bed type
    getAllBedType(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotel_id } = req.hotel_admin;
            const { limit, skip, bed_type } = req.query;
            const model = this.Model.settingModel();
            const { data, total } = yield model.getAllBedType({
                limit: limit,
                skip: skip,
                bed_type: bed_type,
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
    // Update bed type
    updateBedType(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { hotel_id } = req.hotel_admin;
                const { id } = req.params;
                const updatePayload = req.body;
                const model = this.Model.settingModel(trx);
                const res = yield model.updateBedType(parseInt(id), {
                    hotel_id,
                    bed_type: updatePayload.bed_type,
                });
                if (res === 1) {
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_OK,
                        message: "Bed Type updated successfully",
                    };
                }
                else {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "Bed Type didn't find  from this ID",
                    };
                }
            }));
        });
    }
    // Delete bed type
    deleteBedType(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.params;
                const model = this.Model.settingModel(trx);
                const res = yield model.deleteBedType(parseInt(id));
                if (res === 1) {
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_OK,
                        message: "Bed Type deleted successfully",
                    };
                }
                else {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "Bed Type didn't find from this ID",
                    };
                }
            }));
        });
    }
    //=================== Room Amenities ======================//
    // create Room Amenities
    createRoomAmenities(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { hotel_id } = req.hotel_admin;
                const { room_amenities } = req.body;
                // room amenities check
                const settingModel = this.Model.settingModel();
                const { data } = yield settingModel.getAllRoomAmenities({ room_amenities, hotel_id });
                if (data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: " Same Room Amenities already exists, give another unique room amenities name",
                    };
                }
                // model
                const model = new Setting_Model_1.default(trx);
                const res = yield model.createRoomAmenities({
                    hotel_id,
                    room_amenities,
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: "Room Amenities created successfully.",
                };
            }));
        });
    }
    // Get All Room Amenities
    getAllRoomAmenities(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotel_id } = req.hotel_admin;
            const { limit, skip, room_amenities } = req.query;
            const model = this.Model.settingModel();
            const { data, total } = yield model.getAllRoomAmenities({
                limit: limit,
                skip: skip,
                room_amenities: room_amenities,
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
    // Update Room Amenities
    updateRoomAmenities(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { hotel_id } = req.hotel_admin;
                const { id } = req.params;
                const updatePayload = req.body;
                const model = this.Model.settingModel(trx);
                const res = yield model.updateRoomAmenities(parseInt(id), {
                    hotel_id,
                    room_amenities: updatePayload.room_amenities,
                });
                if (res === 1) {
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_OK,
                        message: "Room Amenities updated successfully",
                    };
                }
                else {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "Room Amenities didn't find  from this ID",
                    };
                }
            }));
        });
    }
    // Delete bed type
    deleteRoomAmenities(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.params;
                const model = this.Model.settingModel(trx);
                const res = yield model.deleteRoomAmenities(parseInt(id));
                if (res === 1) {
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_OK,
                        message: "Room Amenities deleted successfully",
                    };
                }
                else {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "Room Amenities didn't find from this ID",
                    };
                }
            }));
        });
    }
}
exports.default = RoomSettingService;
//# sourceMappingURL=roomSetting.service.js.map