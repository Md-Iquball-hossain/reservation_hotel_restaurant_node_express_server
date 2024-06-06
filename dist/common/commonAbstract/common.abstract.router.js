"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uploader_1 = __importDefault(require("../middleware/uploader/uploader"));
const commonValidator_1 = __importDefault(require("../validators/commonValidator"));
class CommonAbstractRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.commonValidator = new commonValidator_1.default();
        this.uploader = new uploader_1.default();
    }
}
exports.default = CommonAbstractRouter;
//# sourceMappingURL=common.abstract.router.js.map