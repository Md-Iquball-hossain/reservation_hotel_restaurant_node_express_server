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
class TripService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // Create Trip
    createTrip(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { hotel_id, id: admin_id } = req.hotel_admin;
                const body = req.body;
                const Model = this.Model.vehicleModel(trx);
                const vehicle_id = body.vehicle_id;
                const getSingleVehicle = yield Model.getSingleVehicle(vehicle_id, hotel_id);
                if (!getSingleVehicle.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "Invalid vehicle information",
                    };
                }
                const { id, fuel_quantity } = getSingleVehicle[0];
                const update_fuel_quantity = (parseFloat(fuel_quantity) -
                    parseFloat(body.fuel_usage)).toFixed(2);
                yield Model.updateVehicle(id, {
                    fuel_quantity: update_fuel_quantity
                });
                const driver_id = body.driver_id;
                const dModel = this.Model.fleetCommonModel(trx);
                const driverID = yield dModel.getSingleDriver(driver_id, hotel_id);
                if (!driverID.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Invalid Driver information",
                    };
                }
                // Owners create
                yield Model.createTrip(Object.assign(Object.assign({}, body), { hotel_id, created_by: admin_id }));
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: "Trip created successfully.",
                };
            }));
        });
    }
    // Get all Trip
    getAllTrip(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotel_id } = req.hotel_admin;
            const { limit, skip, key, from_date, to_date, } = req.query;
            const model = this.Model.vehicleModel();
            const { data, total } = yield model.getAllTrip({
                key: key,
                from_date: from_date,
                to_date: to_date,
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
}
exports.default = TripService;
//# sourceMappingURL=trip.service.js.map