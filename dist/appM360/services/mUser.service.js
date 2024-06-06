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
const constants_1 = require("../../utils/miscellaneous/constants");
const mHotelUserCredentials_template_1 = require("../../templates/mHotelUserCredentials.template");
class MUserService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // create user
    createUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const _a = req.body, { password, email } = _a, rest = __rest(_a, ["password", "email"]);
                if (rest.expiry_date < new Date()) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_UNPROCESSABLE_ENTITY,
                        message: "Date expiry cannot shorter than present Date",
                    };
                }
                const files = req.files || [];
                const model = this.Model.mHotelUserModel(trx);
                //   check user
                const checkUser = yield model.getSingleHotelUser({ email });
                if (checkUser.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: this.ResMsg.HTTP_CONFLICT,
                    };
                }
                if (files.length) {
                    rest["logo"] = files[0].filename;
                }
                const generatePass = lib_1.default.otpGenNumber(8);
                const hashPass = yield lib_1.default.hashPass(generatePass);
                const res = yield model.createHotelUser(Object.assign({ email, password: hashPass }, rest));
                // send email with password
                yield lib_1.default.sendEmail(email, constants_1.OTP_FOR_CREDENTIALS, (0, mHotelUserCredentials_template_1.newHotelUserAccount)(email, generatePass, req.body.name));
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    data: {
                        id: res[0],
                    },
                };
            }));
        });
    }
    // get all user
    getAllUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { status, from_date, to_date, name, limit, skip, group, city } = req.query;
            const model = this.Model.mHotelUserModel();
            const endDate = new Date(to_date);
            endDate.setDate(endDate.getDate() + 1);
            const { data, total } = yield model.getAllHotelUser({
                name: name,
                status: status,
                from_date: from_date,
                to_date: endDate,
                limit: limit,
                skip: skip,
                group: group,
                city: city,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total,
                data,
            };
        });
    }
    // get single user
    getSingleUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const model = this.Model.mHotelUserModel();
            const user = yield model.getSingleHotelUser({ id: parseInt(id) });
            if (!user.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            const _a = user[0], { password } = _a, rest = __rest(_a, ["password"]);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: rest,
            };
        });
    }
    // update a single user
    updateUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const body = req.body;
                const { id } = req.params;
                if (body.expiry_date < new Date()) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_UNPROCESSABLE_ENTITY,
                        message: "Date expiry cannot shorter than present Date",
                    };
                }
                const files = req.files || [];
                const model = this.Model.mHotelUserModel(trx);
                // check user
                const checkUser = yield model.getSingleHotelUser({ email: body.email });
                if (!checkUser.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: this.ResMsg.HTTP_NOT_FOUND,
                    };
                }
                if (files.length) {
                    body["logo"] = files[0].filename;
                }
                yield model.updateHotelUser(body, { id: parseInt(id) });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: "User updated successfully",
                };
            }));
        });
    }
}
exports.default = MUserService;
//# sourceMappingURL=mUser.service.js.map