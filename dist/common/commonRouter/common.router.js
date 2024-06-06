"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_abstract_router_1 = __importDefault(require("../commonAbstract/common.abstract.router"));
const common_controller_1 = __importDefault(require("../commonController/common.controller"));
class CommonRouter extends common_abstract_router_1.default {
    constructor() {
        super();
        this.CommonController = new common_controller_1.default();
        this.callRouter();
    }
    // call router
    callRouter() {
        // send Email otp
        this.router.post("/send-email-otp", this.commonValidator.sendOtpInputValidator(), this.CommonController.sendEmailOtpController);
        // match email otp
        this.router.post("/match-email-otp", this.commonValidator.matchEmailOtpInputValidator(), this.CommonController.matchEmailOtpController);
    }
}
exports.default = CommonRouter;
//# sourceMappingURL=common.router.js.map