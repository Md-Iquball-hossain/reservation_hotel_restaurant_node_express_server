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
class VehicleService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // Create Vehicle
    createVehicle(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotel_id, id: admin_id } = req.hotel_admin;
            const body = req.body;
            const model = this.Model.vehicleModel();
            // Check
            const { data } = yield model.getAllVehicles({
                key: body.reg_number,
                hotel_id,
            });
            if (data.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_CONFLICT,
                    message: "Registration already exists, give another unique one",
                };
            }
            const files = req.files || [];
            if (files.length) {
                body["vehicle_photo"] = files[0].filename;
            }
            // Vehicle create
            yield model.createVehicle(Object.assign(Object.assign({}, body), { hotel_id, created_by: admin_id }));
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: "Vehicle created successfully.",
            };
        });
    }
    // Get all Vehicle
    getAllVehicle(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotel_id } = req.hotel_admin;
            const { limit, skip, key, status } = req.query;
            const model = this.Model.vehicleModel();
            const { data, total } = yield model.getAllVehicles({
                key: key,
                status: status,
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
    // Get Single Vehicle
    getSingleVehicle(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { hotel_id } = req.hotel_admin;
            const model = this.Model.vehicleModel();
            const data = yield model.getSingleVehicle(parseInt(id), hotel_id);
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
    // update Vehicle
    updateVehicle(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id: admin_id, hotel_id } = req.hotel_admin;
                const { id } = req.params;
                const updatePayload = req.body;
                const files = req.files || [];
                let vehicle_photo = updatePayload.vehicle_photo;
                if (files.length) {
                    vehicle_photo = files[0].filename;
                }
                // Check if owner exists
                const Model = this.Model.fleetCommonModel(trx);
                if (updatePayload.owner_id) {
                    const CheckOwnerID = yield Model.getSingleOwner(updatePayload.owner_id, hotel_id);
                    if (!CheckOwnerID.length) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_NOT_FOUND,
                            message: "Invalid owner information",
                        };
                    }
                }
                const model = this.Model.vehicleModel(trx);
                yield model.updateVehicle(parseInt(id), {
                    owner_id: updatePayload.owner_id,
                    reg_number: updatePayload.reg_number,
                    model: updatePayload.model,
                    mileage: updatePayload.mileage,
                    manufacturer: updatePayload.manufacturer,
                    vehicle_photo: vehicle_photo,
                    manufacture_year: updatePayload.manufacture_year,
                    license_plate: updatePayload.license_plate,
                    tax_token: updatePayload.tax_token,
                    token_expired: updatePayload.token_expired,
                    insurance_number: updatePayload.insurance_number,
                    insurance_expired: updatePayload.insurance_expired,
                    vehicle_type: updatePayload.vehicle_type,
                    fuel_type: updatePayload.fuel_type,
                    status: updatePayload.status,
                    vehicle_color: updatePayload.vehicle_color,
                    updated_by: admin_id
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: "Vehicle updated successfully",
                };
            }));
        });
    }
}
exports.default = VehicleService;
//# sourceMappingURL=vehicle.service.js.map