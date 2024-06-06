"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const driver_router_1 = __importDefault(require("./driver.router"));
const fuel_router_1 = __importDefault(require("./fuel.router"));
const maintenance_router_1 = __importDefault(require("./maintenance.router"));
const owner_router_1 = __importDefault(require("./owner.router"));
const parking_router_1 = __importDefault(require("./parking.router"));
const trip_router_1 = __importDefault(require("./trip.router"));
const vehicle_router_1 = __importDefault(require("./vehicle.router"));
class FleetRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.callRouter();
    }
    callRouter() {
        // driver
        this.router.use("/owner", new owner_router_1.default().router);
        // driver
        this.router.use("/driver", new driver_router_1.default().router);
        // vehicle
        this.router.use("/vehicle", new vehicle_router_1.default().router);
        // parking
        this.router.use("/parking", new parking_router_1.default().router);
        // maintenance
        this.router.use("/maintenance", new maintenance_router_1.default().router);
        // fuel
        this.router.use("/fuel", new fuel_router_1.default().router);
        // trips
        this.router.use("/trip", new trip_router_1.default().router);
    }
}
exports.default = FleetRouter;
//# sourceMappingURL=fleet.router.js.map