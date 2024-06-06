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
const hallBooking_validator_1 = __importDefault(require("../utlis/validator/hallBooking.validator"));
const hall_booking_service_1 = __importDefault(require("../services/hall-booking.service"));
class HallBookingController extends abstract_controller_1.default {
    constructor() {
        super();
        this.hallBookingValidator = new hallBooking_validator_1.default();
        // create hall booking
        this.createHallBooking = this.asyncWrapper.wrap({ bodySchema: this.hallBookingValidator.createHallBookingValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.hallBookingService.createHallBooking(req), { code } = _a, data = __rest(_a, ["code"]);
            res.status(code).json(data);
        }));
        // get all hall booking
        this.getAllHallBooking = this.asyncWrapper.wrap({ querySchema: this.hallBookingValidator.getAllHallBookingQueryValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.hallBookingService.getAllHallBooking(req), { code } = _b, data = __rest(_b, ["code"]);
            res.status(code).json(data);
        }));
        // get single hall booking
        this.getSingleHallBooking = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamValidator() }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.hallBookingService.getSingleHallBooking(req), { code } = _c, data = __rest(_c, ["code"]);
            res.status(code).json(data);
        }));
        // insert check in hall booking
        this.insertHallBookingCheckIn = this.asyncWrapper.wrap({ bodySchema: this.hallBookingValidator.insertHallBookingCheckIn }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.hallBookingService.insertHallBookingCheckIn(req), { code } = _d, data = __rest(_d, ["code"]);
            res.status(code).json(data);
        }));
        // get all check in hall booking
        this.getAllHallBookingCheckIn = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _e = yield this.hallBookingService.getAllHallBookingCheckIn(req), { code } = _e, data = __rest(_e, ["code"]);
            res.status(code).json(data);
        }));
        // add check out hall booking
        this.updateBookingCheckOut = this.asyncWrapper.wrap({
            paramSchema: this.commonValidator.singleParamValidator(),
            bodySchema: this.hallBookingValidator.addHallBookingCheckOut,
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _f = yield this.hallBookingService.updateBookingCheckOut(req), { code } = _f, data = __rest(_f, ["code"]);
            res.status(code).json(data);
        }));
        this.hallBookingService = new hall_booking_service_1.default();
    }
}
exports.default = HallBookingController;
//# sourceMappingURL=hall-Booking.controller.js.map