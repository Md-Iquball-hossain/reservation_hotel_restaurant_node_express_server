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
class ParkingService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // Create Parking
    createParking(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotel_id, id: admin_id } = req.hotel_admin;
            const body = req.body;
            const model = this.Model.parkingModel();
            // Check
            const { data } = yield model.getAllParking({
                key: body.par_slot_number,
                hotel_id,
            });
            if (data.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_CONFLICT,
                    message: "Parking slot already exists, give another unique one",
                };
            }
            // Parking create
            yield model.createParking(Object.assign(Object.assign({}, body), { hotel_id, created_by: admin_id }));
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: "Parking created successfully.",
            };
        });
    }
    // Get all Parking
    getAllParking(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotel_id } = req.hotel_admin;
            const { limit, skip, key, status } = req.query;
            const model = this.Model.parkingModel();
            const { data, total } = yield model.getAllParking({
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
    // Get Single Vehicle
    getSingleParking(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { hotel_id } = req.hotel_admin;
            const model = this.Model.parkingModel();
            const data = yield model.getSingleParking(parseInt(id), hotel_id);
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
    // update Parking
    updateParking(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id: admin_id } = req.hotel_admin;
                const { id } = req.params;
                const updatePayload = req.body;
                const model = this.Model.parkingModel(trx);
                yield model.updateParking(parseInt(id), {
                    parking_area: updatePayload.parking_area,
                    parking_size: updatePayload.parking_size,
                    par_slot_number: updatePayload.par_slot_number,
                    status: updatePayload.status,
                    updated_by: admin_id
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: "Parking updated successfully",
                };
            }));
        });
    }
    // Assign Vehicle into parking
    createVehicleParking(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { hotel_id, id: admin_id } = req.hotel_admin;
                const body = req.body;
                const model = this.Model.parkingModel(trx);
                const Model = this.Model.vehicleModel(trx);
                const vehicle_id = body.vehicle_id;
                const vehicleID = yield Model.getSingleVehicle(vehicle_id, hotel_id);
                if (!vehicleID.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Invalid vehicle information",
                    };
                }
                const id = body.parking_id;
                const data = yield model.getSingleParking(id, hotel_id);
                if (!data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Invalid parking information",
                    };
                }
                const status = data[0].status;
                if (status === 1) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Parking slot Already Booked.Choose anoter one",
                    };
                }
                if (body.assigned_time && vehicleID.length) {
                    // Assign vehicle in parking
                    yield model.createVehicleParking(Object.assign(Object.assign({}, body), { created_by: admin_id, status: 1 }));
                    const parking_id = Number(body.parking_id);
                    // Update parking status
                    yield model.updateParking(parking_id, {
                        status: 1,
                        updated_by: admin_id
                    });
                    const id = Number(body.vehicle_id);
                    // Update vehicle's parking status
                    if (id) {
                        yield Model.updateVehicle(id, { parking_status: 1 });
                    }
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: "Parking Slot Assigned successfully.",
                };
            }));
        });
    }
    // Get all Vehicle Parking
    getAllVehicleParking(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const {} = req.hotel_admin;
            const { limit, skip, status, from_date, vehicle_id, to_date } = req.query;
            const model = this.Model.parkingModel();
            const { data, total } = yield model.getAllVehicleParking({
                from_date: from_date,
                to_date: to_date,
                vehicle_id: vehicle_id,
                status: status,
                limit: limit,
                skip: skip,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total,
                data
            };
        });
    }
    // update Vehicle into parking
    updateVehicleParking(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id: admin_id } = req.hotel_admin;
                const { id } = req.params;
                const body = req.body;
                const parkingModel = this.Model.parkingModel(trx);
                const vehicleModel = this.Model.vehicleModel(trx);
                const singleParkingVehicle = yield parkingModel
                    .getSingleVehicleParking(parseInt(id));
                const status = singleParkingVehicle[0].status;
                if (body.left_time && status === 1) {
                    const vehicleId = singleParkingVehicle[0].vehicle_id;
                    yield vehicleModel.updateVehicle(vehicleId, {
                        parking_status: 0
                    });
                    const parking_id = singleParkingVehicle[0].parking_id;
                    yield parkingModel.updateParking(parking_id, {
                        status: 0,
                        updated_by: admin_id
                    });
                    // Update parking
                    yield parkingModel.updateVehiceInParking(parseInt(id), {
                        left_time: body.left_time,
                        updated_by: admin_id,
                        status: 0
                    });
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: "Parking status updated successfully.",
                };
            }));
        });
    }
}
exports.default = ParkingService;
//# sourceMappingURL=parking.service.js.map