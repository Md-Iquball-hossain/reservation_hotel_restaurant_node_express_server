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
class MaintenanceService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // Create Maintenance
    createMaintenance(req) {
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
                const vehicleID = yield Model.getSingleVehicle(vehicle_id, hotel_id);
                if (!vehicleID.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Vehicle information is not valid",
                    };
                }
                // Owners create
                yield Model.createMaintenance(Object.assign(Object.assign({}, body), { hotel_id, created_by: admin_id }));
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: "Maintenance created successfully.",
                };
            }));
        });
    }
    // Get all Maintenance
    getAllMaintenance(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotel_id } = req.hotel_admin;
            const { limit, skip, key, from_date, to_date } = req.query;
            const model = this.Model.vehicleModel();
            const { data, total } = yield model.getAllMaintenance({
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
    // udate Maintenance
    updateMaintenance(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id: admin_id } = req.hotel_admin;
                const { id } = req.params;
                const updatePayload = req.body;
                const files = req.files || [];
                let documents = updatePayload.documents;
                if (files.length) {
                    documents = files[0].filename;
                }
                const model = this.Model.vehicleModel(trx);
                yield model.updateMaintenance(parseInt(id), {
                    vehicle_id: updatePayload.vehicle_id,
                    maintenance_by: updatePayload.maintenance_by,
                    workshop_name: updatePayload.workshop_name,
                    maintenance_date: updatePayload.maintenance_date,
                    maintenance_type: updatePayload.maintenance_type,
                    maintenance_cost: updatePayload.maintenance_cost,
                    documents: documents,
                    updated_by: admin_id
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: "Maintenance updated successfully",
                };
            }));
        });
    }
}
exports.default = MaintenanceService;
//# sourceMappingURL=maintenance.service.js.map