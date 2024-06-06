"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_abstract_router_1 = __importDefault(require("../commonAbstract/common.abstract.router"));
const common_things_controller_1 = __importDefault(require("../controllers/common_things.controller"));
class CommonThingsRouter extends common_abstract_router_1.default {
    constructor() {
        super();
        this.CommonController = new common_things_controller_1.default();
        this.callRouter();
    }
    // call router
    callRouter() {
        // create module
        this.router
            .route("/restaurant/permission-group")
            .get(this.CommonController.getRestaurantPermissionGroup);
    }
}
exports.default = CommonThingsRouter;
//# sourceMappingURL=common_things.router.js.map