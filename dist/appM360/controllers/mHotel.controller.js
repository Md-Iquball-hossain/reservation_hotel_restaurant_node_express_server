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
const mHotel_service_1 = __importDefault(require("../services/mHotel.service"));
const mHotel_validator_1 = __importDefault(require("../utlis/validator/mHotel.validator"));
class MHotelController extends abstract_controller_1.default {
    constructor() {
        super();
        this.mUserService = new mHotel_service_1.default();
        this.mHotelValidator = new mHotel_validator_1.default();
        // create hotel
        this.createHotel = this.asyncWrapper.wrap({ bodySchema: this.mHotelValidator.createHotelValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.mUserService.createHotel(req), { code } = _a, data = __rest(_a, ["code"]);
            if (data.success) {
                res.status(code).json(data);
            }
            else {
                this.error(data.message, code);
            }
        }));
        // get all hotel
        this.getAllHotel = this.asyncWrapper.wrap({ querySchema: this.mHotelValidator.getAllHotelValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.mUserService.getAllHotel(req), { code } = _b, data = __rest(_b, ["code"]);
            res.status(code).json(data);
        }));
        // get single hotel
        this.getSingleHotel = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamValidator() }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.mUserService.getSingleHotel(req), { code } = _c, data = __rest(_c, ["code"]);
            res.status(code).json(data);
        }));
        // update hotel
        this.updateHotel = this.asyncWrapper.wrap({ bodySchema: this.mHotelValidator.updateHotelValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.mUserService.updateHotel(req), { code } = _d, data = __rest(_d, ["code"]);
            if (data.success) {
                res.status(code).json(data);
            }
            else {
                this.error(data.message, code);
            }
        }));
    }
}
exports.default = MHotelController;
//# sourceMappingURL=mHotel.controller.js.map