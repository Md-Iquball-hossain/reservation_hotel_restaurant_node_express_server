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
exports.RoomService = void 0;
const abstract_service_1 = __importDefault(require("../../abstarcts/abstract.service"));
const Room_Model_1 = __importDefault(require("../../models/RoomModel/Room.Model"));
class RoomService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // create room
    createRoom(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const _a = req.body, { room_amenities } = _a, rest = __rest(_a, ["room_amenities"]);
                const { hotel_id } = req.hotel_admin;
                // room number check
                const roomModel = this.Model.RoomModel();
                const check = yield roomModel.getRoomByNumber(req.body.room_number, hotel_id);
                if (check) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Room Number already exists, give another unique room number",
                    };
                }
                // model
                const model = new Room_Model_1.default(trx);
                // insert room
                const res = yield model.createRoom(Object.assign(Object.assign({}, rest), { hotel_id }));
                const room_id = res[0];
                // step room amenities
                const hotel_room_amenities_parse = room_amenities ? JSON.parse(room_amenities) : [];
                // insert room amenities
                if (hotel_room_amenities_parse.length) {
                    const hotelRoomAmenitiesPayload = hotel_room_amenities_parse.map((id) => {
                        return {
                            room_id,
                            rah_id: id,
                        };
                    });
                    yield model.insertHotelRoomAmenities(hotelRoomAmenitiesPayload);
                }
                const files = req.files || [];
                // insert room image
                if (files.length) {
                    const roomImages = [];
                    files.forEach((element) => {
                        roomImages.push({
                            room_id,
                            photo: element.filename,
                        });
                    });
                    yield model.createRoomImage(roomImages);
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: "Room created successfully.",
                };
            }));
        });
    }
    // get All Hotel Room
    getAllHotelRoom(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, availability, refundable, occupancy } = req.query;
            const { hotel_id } = req.hotel_admin;
            // model
            const model = this.Model.RoomModel();
            const { data, total } = yield model.getAllRoom({
                key: key,
                availability: availability,
                refundable: refundable,
                occupancy: occupancy,
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
    // get Single Hotel Room
    getSingleHotelRoom(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { room_id } = req.params;
            const model = this.Model.RoomModel();
            const data = yield model.getSingleRoom(req.hotel_admin.hotel_id, parseInt(room_id));
            if (!data.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data
            };
        });
    }
    // update hotel room
    updateroom(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { hotel_id } = req.hotel_admin;
                const { room_id } = req.params;
                const _a = req.body, { remove_photos, room_amenities, remove_amenities } = _a, rest = __rest(_a, ["remove_photos", "room_amenities", "remove_amenities"]);
                const model = this.Model.RoomModel(trx);
                // Update room details
                if (Object.keys(rest).length) {
                    yield model.updateRoom(parseInt(room_id), hotel_id, Object.assign({}, rest));
                }
                // Insert room images
                const files = req.files || [];
                if (files.length) {
                    const roomImages = files.map((element) => ({
                        room_id: parseInt(room_id),
                        photo: element.filename,
                    }));
                    yield model.insertRoomImage(roomImages);
                }
                // Remove room images
                const rmv_photo = remove_photos ? JSON.parse(remove_photos) : [];
                if (rmv_photo.length) {
                    yield model.deleteRoomImage(rmv_photo, Number(room_id));
                }
                // Insert room amenities
                const hotel_room_amenities_parse = room_amenities ? JSON.parse(room_amenities) : [];
                if (hotel_room_amenities_parse.length) {
                    const hotelRoomAmenitiesPayload = hotel_room_amenities_parse.map((id) => ({
                        room_id,
                        rah_id: id,
                    }));
                    yield model.insertHotelRoomAmenities(hotelRoomAmenitiesPayload);
                }
                // Remove room amenities
                const rmv_amenities = remove_amenities ? JSON.parse(remove_amenities) : [];
                if (rmv_amenities.length) {
                    yield model.deleteHotelRoomAmenities(rmv_amenities, Number(room_id));
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: "Room updated successfully",
                };
            }));
        });
    }
}
exports.RoomService = RoomService;
exports.default = RoomService;
//# sourceMappingURL=roomService.js.map