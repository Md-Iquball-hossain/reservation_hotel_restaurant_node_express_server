"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../../app/database");
const manageFile_1 = __importDefault(require("../../utils/lib/manageFile"));
class CommonAbstractServices {
    constructor() {
        this.db = database_1.db;
        this.manageFile = new manageFile_1.default();
    }
}
exports.default = CommonAbstractServices;
//# sourceMappingURL=common.abstract.service.js.map