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
const hall_service_1 = __importDefault(require("../services/hall.service"));
const hall_validation_1 = __importDefault(require("../utlis/validator/hall.validation"));
class HallController extends abstract_controller_1.default {
    constructor() {
        super();
        this.hallService = new hall_service_1.default();
        this.hallvalidator = new hall_validation_1.default();
        // Create Hall
        this.createHall = this.asyncWrapper.wrap({ bodySchema: this.hallvalidator.createHallValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.hallService.createHall(req), { code } = _a, data = __rest(_a, ["code"]);
            res.status(code).json(data);
        }));
        // get all hall with filter
        this.getAllHall = this.asyncWrapper.wrap({ querySchema: this.hallvalidator.getAllHotelHallQueryValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.hallService.getAllHall(req), { code } = _b, data = __rest(_b, ["code"]);
            res.status(code).json(data);
        }));
        // get all hotel available and unavailable hall
        this.getAllAvailableAndUnavailableHall = this.asyncWrapper.wrap(null, 
        // { querySchema: this.hallvalidator.getAvailableHallQueryValidator },
        (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.hallService.getAllAvailableAndUnavailableHall(req), { code } = _c, data = __rest(_c, ["code"]);
            res.status(code).json(data);
        }));
        // get all available hall
        this.getAllAvailableHall = this.asyncWrapper.wrap(null, 
        // { querySchema: this.hallvalidator.getAvailableHallQueryValidator },
        (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.hallService.getAllAvailableHall(req), { code } = _d, data = __rest(_d, ["code"]);
            res.status(code).json(data);
        }));
        // get single hall
        this.getSingleHall = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamValidator("hall_id") }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _e = yield this.hallService.getSingleHall(req), { code } = _e, data = __rest(_e, ["code"]);
            res.status(code).json(data);
        }));
        // update hall
        this.updateHall = this.asyncWrapper.wrap({ bodySchema: this.hallvalidator.updateHotelHallValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _f = yield this.hallService.updateHall(req), { code } = _f, data = __rest(_f, ["code"]);
            res.status(code).json(data);
        }));
    }
}
exports.default = HallController;
//# sourceMappingURL=hall.controller.js.map