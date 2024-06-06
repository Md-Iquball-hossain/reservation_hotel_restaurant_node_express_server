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
class HotelService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // get my hotel
    getMyHotel(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotel_id } = req.hotel_admin;
            const checkHotel = yield this.Model.HotelModel().getSingleHotel({
                id: hotel_id,
            });
            if (!checkHotel.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: checkHotel[0],
            };
        });
    }
    // update my hotel
    updateMyHotel(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotel_id } = req.hotel_admin;
            const model = this.Model.HotelModel();
            const checkHotel = yield model.getSingleHotel({
                id: hotel_id,
            });
            if (!checkHotel.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            const files = req.files || [];
            const hotelImages = [];
            const _a = req.body, { remove_photo, hotel_amnities, remove_amnities } = _a, rest = __rest(_a, ["remove_photo", "hotel_amnities", "remove_amnities"]);
            if (files.length) {
                files.forEach((element) => {
                    if (element.fieldname === "logo") {
                        rest["logo"] = element.filename;
                    }
                    else {
                        hotelImages.push({
                            hotel_id: hotel_id,
                            photo: element.filename,
                        });
                    }
                });
            }
            const { email } = checkHotel[0];
            // update hotel user
            if (Object.keys(rest).length) {
                yield model.updateHotel(rest, { email });
            }
            // insert photo
            if (hotelImages.length) {
                yield model.insertHotelImage(hotelImages);
            }
            const rmv_photo = remove_photo ? JSON.parse(remove_photo) : [];
            // delete hotel image
            if (rmv_photo.length) {
                yield model.deleteHotelImage(rmv_photo, hotel_id);
            }
            const hotel_amnities_parse = hotel_amnities
                ? JSON.parse(hotel_amnities)
                : [];
            // insert hotel amnities
            if (hotel_amnities_parse.length) {
                const hotelAmnitiesPayload = hotel_amnities_parse.map((item) => {
                    return {
                        hotel_id,
                        name: item,
                    };
                });
                yield model.insertHotelAmnities(hotelAmnitiesPayload);
            }
            const remove_amnities_parse = remove_amnities
                ? JSON.parse(remove_amnities)
                : [];
            // delete hotel amnities
            if (remove_amnities_parse.length) {
                yield model.deleteHotelAmnities(remove_amnities_parse, hotel_id);
            }
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: "Update successfully",
            };
        });
    }
}
exports.default = HotelService;
//# sourceMappingURL=hotel.service.js.map