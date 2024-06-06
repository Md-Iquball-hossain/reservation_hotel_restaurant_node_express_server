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
const abstract_controller_1 = __importDefault(require("../../abstarcts/abstract.controller"));
const guest_service_1 = __importDefault(require("../services/guest.service"));
const guest_validator_1 = __importDefault(require("../utlis/validator/guest.validator"));
class GuestController extends abstract_controller_1.default {
    constructor() {
        super();
        this.guestService = new guest_service_1.default();
        this.guestValidator = new guest_validator_1.default();
        // Create guest controller
        this.createGuest = this.asyncWrapper.wrap({ bodySchema: this.guestValidator.createGuestValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.guestService.createGuest(req), { code } = _a, data = __rest(_a, ["code"]);
            res.status(code).json(data);
        }));
        // get all Guest controller with filter
        this.getAllGuest = this.asyncWrapper.wrap({ querySchema: this.guestValidator.getAllGuestValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.guestService.getAllGuest(req), { code } = _b, data = __rest(_b, ["code"]);
            res.status(code).json(data);
        }));
        // get Single Guest Controller
        this.getSingleGuest = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamValidator("user_id") }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.guestService.getSingleGuest(req), { code } = _c, data = __rest(_c, ["code"]);
            res.status(code).json(data);
        }));
        // get Hall Booking Guest controller with filter
        this.getHallGuest = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.guestService.getHallGuest(req), { code } = _d, data = __rest(_d, ["code"]);
            res.status(code).json(data);
        }));
        // get Room Booking controller with filter
        this.getRoomGuest = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _e = yield this.guestService.getRoomGuest(req), { code } = _e, data = __rest(_e, ["code"]);
            res.status(code).json(data);
        }));
    }
}
exports.default = GuestController;
//# sourceMappingURL=guest.controller.js.map