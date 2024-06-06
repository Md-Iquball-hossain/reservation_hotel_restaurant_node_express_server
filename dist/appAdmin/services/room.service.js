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
                const hotel_room_amenities_parse = room_amenities
                    ? JSON.parse(room_amenities)
                    : [];
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
            const { key, availability, limit, skip, refundable, occupancy } = req.query;
            const { hotel_id } = req.hotel_admin;
            // model
            const model = this.Model.RoomModel();
            const { data, total } = yield model.getAllRoom({
                key: key,
                availability: availability,
                refundable: refundable,
                occupancy: occupancy,
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
    // get available and unavailable Room
    getAllAvailableAndUnavailableRoom(req) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return __awaiter(this, void 0, void 0, function* () {
            const { key, availability, limit, skip, refundable, occupancy, from_date, to_date, } = req.query;
            const { hotel_id } = req.hotel_admin;
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
            const newFromDate = new Date(from_date);
            newFromDate.setDate(newFromDate.getDate());
            const newToDate = new Date(to_date);
            // getting all room booking
            const getAllBookingRoom = yield model.getAllBookingRoom({
                from_date: newFromDate.toISOString(),
                to_date: newToDate.toISOString(),
                hotel_id,
            });
            // get all booking room sd query
            const getAllBookingRoomSdQuery = yield model.getAllBookingRoomForSdQueryAvailblityWithCheckout({
                from_date: newFromDate.toISOString(),
                to_date: new Date(to_date),
                hotel_id,
            });
            const availableRoomForBooking = [];
            const allBookingRooms = [];
            // get all booking room
            if (getAllBookingRoom === null || getAllBookingRoom === void 0 ? void 0 : getAllBookingRoom.length) {
                for (let i = 0; i < (getAllBookingRoom === null || getAllBookingRoom === void 0 ? void 0 : getAllBookingRoom.length); i++) {
                    const booking_rooms = (_a = getAllBookingRoom[i]) === null || _a === void 0 ? void 0 : _a.booking_rooms;
                    for (let j = 0; j < (booking_rooms === null || booking_rooms === void 0 ? void 0 : booking_rooms.length); j++) {
                        allBookingRooms.push({
                            id: booking_rooms[j].id,
                            room_id: booking_rooms[j].room_id,
                            check_in_time: getAllBookingRoom[i].check_in_time,
                            check_out_time: getAllBookingRoom[i].check_out_time,
                            name: getAllBookingRoom[i].name,
                            email: getAllBookingRoom[i].email,
                            grand_total: getAllBookingRoom[i].grand_total,
                            due: getAllBookingRoom[i].due,
                            user_last_balance: getAllBookingRoom[i].user_last_balance,
                        });
                    }
                }
            }
            // get all booking room second query result
            if (getAllBookingRoomSdQuery.length) {
                for (let i = 0; i < (getAllBookingRoomSdQuery === null || getAllBookingRoomSdQuery === void 0 ? void 0 : getAllBookingRoomSdQuery.length); i++) {
                    const booking_rooms = (_b = getAllBookingRoomSdQuery[i]) === null || _b === void 0 ? void 0 : _b.booking_rooms;
                    for (let j = 0; j < (booking_rooms === null || booking_rooms === void 0 ? void 0 : booking_rooms.length); j++) {
                        allBookingRooms.push({
                            id: booking_rooms[j].id,
                            room_id: booking_rooms[j].room_id,
                            check_in_time: getAllBookingRoomSdQuery[i].check_in_time,
                            check_out_time: getAllBookingRoomSdQuery[i].check_out_time,
                            name: getAllBookingRoomSdQuery[i].name,
                            email: getAllBookingRoomSdQuery[i].email,
                            grand_total: getAllBookingRoomSdQuery[i].grand_total,
                            due: getAllBookingRoomSdQuery[i].due,
                            user_last_balance: getAllBookingRoomSdQuery[i].user_last_balance,
                        });
                    }
                }
            }
            if (allRoom === null || allRoom === void 0 ? void 0 : allRoom.length) {
                for (let i = 0; i < allRoom.length; i++) {
                    let found = false;
                    for (let j = 0; j < (allBookingRooms === null || allBookingRooms === void 0 ? void 0 : allBookingRooms.length); j++) {
                        if (allRoom[i].id == ((_c = allBookingRooms[j]) === null || _c === void 0 ? void 0 : _c.room_id)) {
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
                                guest_name: ((_d = allBookingRooms[j]) === null || _d === void 0 ? void 0 : _d.name) || "",
                                guest_email: ((_e = allBookingRooms[j]) === null || _e === void 0 ? void 0 : _e.email) || "",
                                check_in_time: ((_f = allBookingRooms[j]) === null || _f === void 0 ? void 0 : _f.check_in_time) || "",
                                check_out_time: ((_g = allBookingRooms[j]) === null || _g === void 0 ? void 0 : _g.check_out_time) || "",
                                grand_total: ((_h = allBookingRooms[j]) === null || _h === void 0 ? void 0 : _h.grand_total) || "",
                                due_amount: ((_j = allBookingRooms[j]) === null || _j === void 0 ? void 0 : _j.due) || "",
                                user_last_balance: ((_k = allBookingRooms[j]) === null || _k === void 0 ? void 0 : _k.user_last_balance) || "",
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
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { key, availability, limit, skip, from_date, to_date, refundable, occupancy, } = req.query;
            const { hotel_id } = req.hotel_admin;
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
            const newFromDate = new Date(from_date);
            newFromDate.setDate(newFromDate.getDate());
            // get all booking room sd query
            const getAllBookingRoomSdQuery = yield model.getAllBookingRoomForSdQueryAvailblityWithCheckout({
                from_date: newFromDate.toISOString(),
                to_date: new Date(to_date),
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
            // get all booking room second query result
            if (getAllBookingRoomSdQuery.length) {
                for (let i = 0; i < (getAllBookingRoomSdQuery === null || getAllBookingRoomSdQuery === void 0 ? void 0 : getAllBookingRoomSdQuery.length); i++) {
                    const booking_rooms = (_b = getAllBookingRoomSdQuery[i]) === null || _b === void 0 ? void 0 : _b.booking_rooms;
                    for (let j = 0; j < (booking_rooms === null || booking_rooms === void 0 ? void 0 : booking_rooms.length); j++) {
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
            console.log(req.hotel_admin.hotel_id, "hotel admin");
            const model = this.Model.RoomModel();
            const data = yield model.getSingleRoom(req.hotel_admin.hotel_id, parseInt(room_id));
            if (!data.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            // get all active room booking
            const roomBookingModel = this.Model.roomBookingModel();
            const bookingData = yield roomBookingModel.getAllRoomBookingByRoomId(req.hotel_admin.hotel_id, parseInt(room_id));
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: Object.assign(Object.assign({}, data[0]), { bookingData: bookingData[0] }),
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
                const hotel_room_amenities_parse = room_amenities
                    ? JSON.parse(room_amenities)
                    : [];
                // Check if amenities already exist
                const roomModel = this.Model.RoomModel();
                const existingAmenities = yield roomModel.getAllAmenities(Number(room_id), hotel_room_amenities_parse);
                let distinctAminities = [];
                if (existingAmenities.length) {
                    for (let i = 0; i < hotel_room_amenities_parse.length; i++) {
                        let found = false;
                        for (let j = 0; j < existingAmenities.length; j++) {
                            if (hotel_room_amenities_parse[i] == existingAmenities[j].rah_id) {
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            distinctAminities.push(hotel_room_amenities_parse[i]);
                        }
                    }
                }
                if (distinctAminities.length) {
                    const hotelRoomAmenitiesPayload = distinctAminities.map((id) => ({
                        room_id: parseInt(room_id),
                        rah_id: id,
                    }));
                    yield model.insertHotelRoomAmenities(hotelRoomAmenitiesPayload);
                }
                // Remove room amenities
                const rmv_amenities = remove_amenities
                    ? JSON.parse(remove_amenities)
                    : [];
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
//# sourceMappingURL=room.service.js.map