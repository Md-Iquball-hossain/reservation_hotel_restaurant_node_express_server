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
class DriverService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // Create Driver
    createDriver(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotel_id, id: admin_id } = req.hotel_admin;
            const body = req.body;
            const model = this.Model.fleetCommonModel();
            const { data } = yield model.getAllDriver({
                key: body.phone,
                hotel_id,
            });
            if (data.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_CONFLICT,
                    message: "Phone number already exists, give another unique Phone number",
                };
            }
            const files = req.files || [];
            if (files.length) {
                body["photo"] = files[0].filename;
            }
            if (files.length) {
                body["licence_photo"] = files[1].filename;
            }
            // Owners create
            yield model.createDriver(Object.assign(Object.assign({}, body), { hotel_id, created_by: admin_id }));
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: "Driver Profile created successfully.",
            };
        });
    }
    // Get all Driver
    getAllDriver(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotel_id } = req.hotel_admin;
            const { limit, skip, key, status } = req.query;
            const model = this.Model.fleetCommonModel();
            const { data, total } = yield model.getAllDriver({
                key: key,
                status: parseInt(status),
                limit: limit,
                skip: skip,
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
    // Get Single Driver
    getSingleDriver(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { hotel_id } = req.hotel_admin;
            const model = this.Model.fleetCommonModel();
            const data = yield model.getSingleDriver(parseInt(id), hotel_id);
            if (!data.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: data[0],
            };
        });
    }
    // udate Driver
    updateDriver(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id: admin_id } = req.hotel_admin;
                const { id } = req.params;
                const updatePayload = req.body;
                const files = req.files || [];
                let photo = updatePayload.photo;
                let licence_photo = updatePayload.licence_photo;
                if (files.length) {
                    photo = files[0].filename;
                }
                if (files.length) {
                    licence_photo = files[1].filename;
                }
                const model = this.Model.fleetCommonModel(trx);
                yield model.updateDriver(parseInt(id), {
                    name: updatePayload.name,
                    email: updatePayload.email,
                    phone: updatePayload.phone,
                    address: updatePayload.address,
                    blood_group: updatePayload.blood_group,
                    photo: photo,
                    date_of_birth: updatePayload.date_of_birth,
                    licence_number: updatePayload.licence_number,
                    licence_photo: licence_photo,
                    license_class: updatePayload.license_class,
                    expiry_date: updatePayload.expiry_date,
                    year_of_experience: updatePayload.year_of_experience,
                    emr_contact_name: updatePayload.emr_contact_name,
                    emr_contact_number: updatePayload.emr_contact_number,
                    updated_by: admin_id,
                    status: updatePayload.status
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: "Diver Profile updated successfully",
                };
            }));
        });
    }
}
exports.default = DriverService;
//# sourceMappingURL=driver.service.js.map