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
const parking_service_1 = __importDefault(require("../services/parking.service"));
const parking_validator_1 = __importDefault(require("../utils/validator/parking.validator"));
class ParkingController extends abstract_controller_1.default {
    constructor() {
        super();
        this.Service = new parking_service_1.default();
        this.Validator = new parking_validator_1.default();
        // create Parking
        this.createParking = this.asyncWrapper.wrap({ bodySchema: this.Validator.createParkingValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.Service.createParking(req), { code } = _a, data = __rest(_a, ["code"]);
            res.status(code).json(data);
        }));
        // get All Parking
        this.getAllParking = this.asyncWrapper.wrap({ querySchema: this.Validator.getAllParkingValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.Service.getAllParking(req), { code } = _b, data = __rest(_b, ["code"]);
            res.status(code).json(data);
        }));
        // get single Parking
        this.getSingleParking = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamValidator() }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.Service.getSingleParking(req), { code } = _c, data = __rest(_c, ["code"]);
            res.status(code).json(data);
        }));
        // update Parking
        this.updateParking = this.asyncWrapper.wrap({ bodySchema: this.Validator.updateParkingValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.Service.updateParking(req), { code } = _d, data = __rest(_d, ["code"]);
            res.status(code).json(data);
        }));
        // create Vehicle Parking
        this.createVehicleParking = this.asyncWrapper.wrap({ bodySchema: this.Validator.createVehicleParkingValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _e = yield this.Service.createVehicleParking(req), { code } = _e, data = __rest(_e, ["code"]);
            res.status(code).json(data);
        }));
        // get all Vehicle Parking
        this.getAllVehicleParking = this.asyncWrapper.wrap({ querySchema: this.Validator.getAllVehicleParkingValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _f = yield this.Service.getAllVehicleParking(req), { code } = _f, data = __rest(_f, ["code"]);
            res.status(code).json(data);
        }));
        // update Vehicle Parking
        this.updateVehicleParking = this.asyncWrapper.wrap({ bodySchema: this.Validator.updateVehicleParkingValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _g = yield this.Service.updateVehicleParking(req), { code } = _g, data = __rest(_g, ["code"]);
            res.status(code).json(data);
        }));
    }
}
exports.default = ParkingController;
//# sourceMappingURL=parking.controller.js.map