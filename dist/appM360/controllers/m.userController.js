"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_controller_1 = __importDefault(require("../../abstarcts/abstract.controller"));
const mAdmin_administration_service_1 = __importDefault(require("../services/mAdmin.administration.service"));
class MUserController extends abstract_controller_1.default {
    constructor() {
        super();
        this.administrationService = new mAdmin_administration_service_1.default();
    }
}
exports.default = MUserController;
//# sourceMappingURL=m.userController.js.map