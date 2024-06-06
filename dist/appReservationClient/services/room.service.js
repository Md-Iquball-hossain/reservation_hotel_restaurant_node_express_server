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
exports.ClientRoomService = void 0;
const abstract_service_1 = __importDefault(require("../../abstarcts/abstract.service"));
class ClientRoomService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // get All Hotel Room
    getAllHotelRoom(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, availability, refundable, limit, skip, adult, child } = req.query;
            const { id: hotel_id } = req.web_token;
            // model
            const model = this.Model.clientModel();
            const { data, total } = yield model.getAllRoom({
                key: key,
                availability: availability,
                refundable: refundable,
                adult: adult,
                child: child,
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
    // get all available and unavailable room
    getAllAvailableAndUnavailableRoom(req) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { key, availability, limit, skip, refundable, occupancy, from_date, to_date, } = req.query;
            const { id: hotel_id } = req.web_token;
            // model
            const model = this.Model.RoomModel();
            const { data: allRoom, total } = yield model.getAllRoom({
                key: key,
                availability: availability,
                refundable: refundable,
                occupancy: occupancy,
                limit: limit,
                skip: skip,
                hotel_id,
            });
            // getting all room booking
            const getAllBookingRoom = yield model.getAllBookingRoom({
                from_date: from_date,
                to_date: to_date,
                hotel_id,
            });
            const availableRoomForBooking = [];
            // all rooms combined from different bookings
            const allBookingRooms = [];
            if (getAllBookingRoom.length) {
                for (let i = 0; i < getAllBookingRoom.length; i++) {
                    const booking_rooms = (_a = getAllBookingRoom[i]) === null || _a === void 0 ? void 0 : _a.booking_rooms;
                    for (let j = 0; j < booking_rooms.length; j++) {
                        allBookingRooms.push({
                            id: booking_rooms[j].id,
                            room_id: booking_rooms[j].room_id,
                        });
                    }
                }
            }
            // now find out all available room
            if (allRoom.length) {
                for (let i = 0; i < allRoom.length; i++) {
                    let found = false;
                    for (let j = 0; j < allBookingRooms.length; j++) {
                        if (allRoom[i].id == allBookingRooms[j].room_id) {
                            found = true;
                            availableRoomForBooking.push({
                                id: allRoom[i].id,
                                room_number: allRoom[i].room_number,
                                room_type: allRoom[i].room_type,
                                bed_type: allRoom[i].bed_type,
                                refundable: allRoom[i].refundable,
                                rate_per_night: allRoom[i].rate_per_night,
                                discount: allRoom[i].discount,
                                discount_percent: allRoom[i].discount_percent,
                                child: allRoom[i].child,
                                adult: allRoom[i].adult,
                                available_status: 0,
                                room_description: allRoom[i].room_description,
                                room_amenities: allRoom[i].room_amenities,
                                room_images: allRoom[i].room_images,
                            });
                            break;
                        }
                    }
                    if (!found) {
                        availableRoomForBooking.push({
                            id: allRoom[i].id,
                            room_number: allRoom[i].room_number,
                            room_type: allRoom[i].room_type,
                            bed_type: allRoom[i].bed_type,
                            refundable: allRoom[i].refundable,
                            rate_per_night: allRoom[i].rate_per_night,
                            discount: allRoom[i].discount,
                            discount_percent: allRoom[i].discount_percent,
                            child: allRoom[i].child,
                            adult: allRoom[i].adult,
                            available_status: 1,
                            room_description: allRoom[i].room_description,
                            room_amenities: allRoom[i].room_amenities,
                            room_images: allRoom[i].room_images,
                        });
                    }
                }
            }
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total,
                data: availableRoomForBooking,
            };
        });
    }
    // get All available Room
    getAllAvailableRoom(req) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { key, availability, limit, skip, from_date, to_date, refundable, occupancy, } = req.query;
            const { id: hotel_id } = req.web_token;
            // model
            const model = this.Model.RoomModel();
            // get all booking
            const { data: allRoom } = yield model.getAllRoom({
                key: key,
                availability: availability,
                refundable: refundable,
                occupancy: occupancy,
                limit: limit,
                skip: skip,
                hotel_id,
            });
            // getting all room booking
            const getAllBookingRoom = yield model.getAllBookingRoom({
                from_date: from_date,
                to_date: to_date,
                hotel_id,
            });
            const availableRoomForBooking = [];
            // all rooms combined from different bookings
            const allBookingRooms = [];
            if (getAllBookingRoom.length) {
                for (let i = 0; i < getAllBookingRoom.length; i++) {
                    const booking_rooms = (_a = getAllBookingRoom[i]) === null || _a === void 0 ? void 0 : _a.booking_rooms;
                    for (let j = 0; j < booking_rooms.length; j++) {
                        allBookingRooms.push({
                            id: booking_rooms[j].id,
                            room_id: booking_rooms[j].room_id,
                        });
                    }
                }
            }
            // now find out all available room
            if (allRoom.length) {
                for (let i = 0; i < allRoom.length; i++) {
                    let found = false;
                    for (let j = 0; j < allBookingRooms.length; j++) {
                        if (allRoom[i].id == allBookingRooms[j].room_id) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        availableRoomForBooking.push({
                            id: allRoom[i].id,
                            room_number: allRoom[i].room_number,
                            room_type: allRoom[i].room_type,
                            bed_type: allRoom[i].bed_type,
                            refundable: allRoom[i].refundable,
                            rate_per_night: allRoom[i].rate_per_night,
                            discount: allRoom[i].discount,
                            discount_percent: allRoom[i].discount_percent,
                            child: allRoom[i].child,
                            adult: allRoom[i].adult,
                            availability: allRoom[i].availability,
                            room_description: allRoom[i].room_description,
                            room_amenities: allRoom[i].room_amenities,
                            room_images: allRoom[i].room_images,
                        });
                    }
                }
            }
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: availableRoomForBooking,
            };
        });
    }
    // get Single Hotel Room
    getSingleHotelRoom(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { room_id } = req.params;
            const { id: hotel_id } = req.web_token;
            const model = this.Model.clientModel();
            const data = yield model.getSingleRoom(hotel_id, parseInt(room_id));
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
                data: data[0],
            };
        });
    }
    // get All Hotel room images
    getAllHotelRoomImages(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip } = req.query;
            const { id: hotel_id } = req.web_token;
            // model
            const model = this.Model.clientModel();
            const { data } = yield model.getHotelRoomImages({
                limit: limit,
                skip: skip,
                hotel_id,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data,
            };
        });
    }
}
exports.ClientRoomService = ClientRoomService;
exports.default = ClientRoomService;
//# sourceMappingURL=room.service.js.map