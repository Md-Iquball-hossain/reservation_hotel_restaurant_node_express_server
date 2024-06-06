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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_controller_1 = __importDefault(require("../../abstract/abstract.controller"));
const admin_administration_service_1 = __importDefault(require("../services/admin.administration.service"));
class AdministrationController extends abstract_controller_1.default {
    constructor() {
        super();
        this.administrationService = new admin_administration_service_1.default();
        this.createAdmin = this.asyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.administrationService.createAdmin(req), { code } = _a, data = __rest(_a, ["code"]);
            if (data.success) {
                res.status(code).json(data);
            }
            else {
                this.error(data.message, code);
            }
        }));
        // get all admin
        this.getAllAdmin = this.asyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.administrationService.getAllAdmin(req), { code } = _b, data = __rest(_b, ["code"]);
            res.status(code).json(data);
        }));
        // create permission group
        this.createPermissionGroup = this.asyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.administrationService.createPermissionGroup(req), { code } = _c, data = __rest(_c, ["code"]);
            res.status(code).json(data);
        }));
        // get permission group
        this.getPermissionGroup = this.asyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.administrationService.getPermissionGroup(req), { code } = _d, data = __rest(_d, ["code"]);
            res.status(code).json(data);
        }));
        // create permission
        this.createPermission = this.asyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const _e = yield this.administrationService.createPermission(req), { code } = _e, data = __rest(_e, ["code"]);
            res.status(code).json(data);
        }));
        // get all permission
        this.getAllPermission = this.asyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const _f = yield this.administrationService.getAllPermission(req), { code } = _f, data = __rest(_f, ["code"]);
            res.status(code).json(data);
        }));
        // create role
        this.createRole = this.asyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const _g = yield this.administrationService.createRole(req), { code } = _g, data = __rest(_g, ["code"]);
            res.status(code).json(data);
        }));
        // get role
        this.getRole = this.asyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const _h = yield this.administrationService.getRole(req), { code } = _h, data = __rest(_h, ["code"]);
            res.status(code).json(data);
        }));
        // get single role
        this.getSingleRole = this.asyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const _j = yield this.administrationService.getSingleRole(req), { code } = _j, data = __rest(_j, ["code"]);
            res.status(code).json(data);
        }));
        // update single role
        this.updateSingleRole = this.asyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const _k = yield this.administrationService.updateSingleRole(req), { code } = _k, data = __rest(_k, ["code"]);
            res.status(code).json(data);
        }));
        // get admins role
        this.getAdminRole = this.asyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const _l = yield this.administrationService.getAdminRole(req), { code } = _l, data = __rest(_l, ["code"]);
            res.status(code).json(data);
        }));
    }
}
exports.default = AdministrationController;
//# sourceMappingURL=admin.administration.controller.js.map