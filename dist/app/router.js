"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mAdmin_router_1 = __importDefault(require("../appM360/routers/mAdmin.router"));
const auth_router_1 = __importDefault(require("../auth/auth.router"));
const common_router_1 = __importDefault(require("../common/router/common.router"));
const hotelAdmin_router_1 = __importDefault(require("../appAdmin/routers/hotelAdmin.router"));
const reservation_client_router_1 = __importDefault(require("../appReservationClient/routers/reservation-client.router"));
const restaurant_app_router_1 = __importDefault(require("../appRestaurant/routers/restaurant.app.router"));
const common_things_router_1 = __importDefault(require("../common/router/common_things.router"));
class RootRouter {
    constructor() {
        this.v1Router = (0, express_1.Router)();
        this.callV1Router();
    }
    callV1Router() {
        // auth router
        this.v1Router.use("/common", new common_router_1.default().router);
        // common router for all
        this.v1Router.use("/auth", new auth_router_1.default().AuthRouter);
        // ================== reservation ===================== //
        this.v1Router.use("/reservation", new hotelAdmin_router_1.default().hAdminRouter);
        // ================== restaurant ===================== //
        this.v1Router.use("/restaurant", new restaurant_app_router_1.default().restaurantRouter);
        // ==================  reservation client ===================== //
        this.v1Router.use("/reservation-client", new reservation_client_router_1.default().hUserRouter);
        // ================== m360 admin panel ===================//
        this.v1Router.use("/m360", new mAdmin_router_1.default().mAdminRouter);
        //==================== common things ===================== //
        this.v1Router.use("/common-things", new common_things_router_1.default().router);
    }
}
exports.default = RootRouter;
//# sourceMappingURL=router.js.map