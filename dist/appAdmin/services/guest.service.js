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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuestService = void 0;
const abstract_service_1 = __importDefault(require("../../abstarcts/abstract.service"));
class GuestService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // Create Guest 
    createGuest(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { hotel_id } = req.hotel_admin;
                const { name, email, city, country } = req.body;
                // Model
                const model = this.Model.guestModel(trx);
                // Check if user already exists
                const checkUser = yield model.getSingleGuest({
                    email,
                    hotel_id,
                });
                if (checkUser.length > 0) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Email already exists, give another unique email address",
                    };
                }
                let userRes;
                // Create user
                userRes = yield model.createGuest({
                    name,
                    email,
                    city,
                    country,
                    hotel_id,
                });
                const userID = userRes[0].id;
                // Check user's user_type
                if (!checkUser.length || checkUser[0].user_type !== "guest") {
                    const existingUserType = yield model.getExistsUserType(userID, "guest");
                    if (!existingUserType) {
                        yield model.createUserType({
                            user_id: userID,
                            user_type: "guest"
                        });
                    }
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: "Guest created successfully.",
                };
            }));
        });
    }
    // get user Type
    getUserType(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, user_type } = req.query;
            // Fetch data
            const checkGuest = yield this.Model.guestModel().getGuest({
                email: email,
                user_type: user_type,
            });
            if (!checkGuest) {
                yield this.Model.guestModel().createUserType({
                    user_type: user_type,
                });
            }
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
            };
        });
    }
    // get All guest service
    getAllGuest(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, email, limit, skip, user_type } = req.query;
            const { hotel_id } = req.hotel_admin;
            // model
            const model = this.Model.guestModel();
            const { data, total } = yield model.getAllGuest({
                key: key,
                email: email,
                user_type: user_type,
                limit: limit,
                skip: skip,
                hotel_id,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total,
                data,
            };
        });
    }
    // get Guest Single Profile service
    getSingleGuest(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id } = req.params;
            // model
            const model = this.Model.guestModel();
            const singleInvoiceData = yield model.getSingleGuest({
                hotel_id: req.hotel_admin.hotel_id,
                id: parseInt(user_id),
            });
            if (!singleInvoiceData.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: singleInvoiceData[0],
            };
        });
    }
    // get All hall guest
    getHallGuest(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotel_id } = req.hotel_admin;
            // model
            const model = this.Model.guestModel();
            const { data, total } = yield model.getHallGuest({
                hotel_id,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total,
                data,
            };
        });
    }
    // get All room guest
    getRoomGuest(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotel_id } = req.hotel_admin;
            // model
            const model = this.Model.guestModel();
            const { data, total } = yield model.getRoomGuest({
                hotel_id,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total,
                data,
            };
        });
    }
}
exports.GuestService = GuestService;
exports.default = GuestService;
//# sourceMappingURL=guest.service.js.map