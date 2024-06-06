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
class FuelService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // Create Fuel Refill
    createFuelRefill(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { hotel_id, id: admin_id } = req.hotel_admin;
                const body = req.body;
                const Model = this.Model.vehicleModel(trx);
                const files = req.files || [];
                if (files.length) {
                    body["documents"] = files[0].filename;
                }
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
                const totalAmount = parseFloat(body.fuel_quantity) *
                    (body.per_quantity_amount);
                // Owners create
                yield Model.createFuelRefill(Object.assign(Object.assign({}, body), { total_amount: totalAmount, hotel_id, created_by: admin_id }));
                const update_fuel_quantity = (parseFloat(fuel_quantity) +
                    parseFloat(body.fuel_quantity)).toFixed(2);
                // update vehicle fuel
                yield Model.updateVehicle(id, {
                    fuel_quantity: update_fuel_quantity
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: "Fuel created successfully.",
                };
            }));
        });
    }
    // Get all Fuel
    getAllFuelRefill(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotel_id } = req.hotel_admin;
            const { limit, skip, key, from_date, to_date } = req.query;
            const model = this.Model.vehicleModel();
            const { data, total } = yield model.getAllFuelRefill({
                from_date: from_date,
                to_date: to_date,
                key: key,
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
exports.default = FuelService;
//# sourceMappingURL=fuel.service.js.map