"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const hotel_router_1 = __importDefault(require("./hotel.router"));
class SettingRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.callRouter();
    }
    callRouter() {
        // hotel router
        this.router.use("/hotel", new hotel_router_1.default().router);
    }
}
exports.default = SettingRouter;
//# sourceMappingURL=setting.router%20copy.js.map