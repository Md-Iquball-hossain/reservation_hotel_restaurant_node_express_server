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
const abstract_service_1 = __importDefault(require("../../abstarcts/abstract.service"));
const lib_1 = __importDefault(require("../../utils/lib/lib"));
const config_1 = __importDefault(require("../../config/config"));
class hotelRestaurantService extends abstract_service_1.default {
    constructor() {
        super();
    }
    //=================== Restaurant service ======================//
    // Create Restaurant
    createRestaurant(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotel_id, id: admin_id } = req.hotel_admin;
            const { name, phone, email, password } = req.body;
            const Model = this.Model.restaurantModel();
            const { data } = yield Model.getAllRestaurantEmail({ email, hotel_id });
            if (data.length > 0) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_CONFLICT,
                    message: "Restaurant Email already exists, give another unique email address",
                };
            }
            if (data.length) {
                const { status } = data[0];
                if (status == "blocked") {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Restaurant can't create because it is blocked",
                    };
                }
            }
            const hashPass = yield lib_1.default.hashPass(password);
            // Restaurant create
            yield Model.createRestaurant({
                hotel_id,
                name,
                phone,
                email,
                password: hashPass,
                created_by: admin_id
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: "Restaurant created successfully.",
            };
        });
    }
    // login Restaurant
    loginRestaurant(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const model = this.Model.restaurantModel();
            const checkUser = yield model.getSingleRestaurant({ email });
            if (!checkUser.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_BAD_REQUEST,
                    message: "Email is not correct",
                };
            }
            const _a = checkUser[0], { password: hashPass } = _a, rest = __rest(_a, ["password"]);
            const checkPass = yield lib_1.default.compare(password, hashPass);
            if (!checkPass) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_BAD_REQUEST,
                    message: "Password is not correct",
                };
            }
            console.log({ hashPass, checkPass });
            const token = lib_1.default.createToken(Object.assign({}, rest), config_1.default.JWT_SECRET_H_RESTURANT, "48h");
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: "Login successful",
                data: rest,
                token: token,
            };
        });
    }
    // Get all Restaurant
    getAllRestaurant(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotel_id } = req.hotel_admin;
            const { limit, skip, key } = req.query;
            const model = this.Model.restaurantModel();
            const { data, total } = yield model.getAllRestaurant({
                key: key,
                limit: limit,
                skip: skip,
                hotel_id,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total,
                data
            };
        });
    }
}
exports.default = hotelRestaurantService;
//# sourceMappingURL=restaurant.service.js.map