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
exports.RoomReportService = void 0;
const abstract_service_1 = __importDefault(require("../../abstarcts/abstract.service"));
class RoomReportService extends abstract_service_1.default {
    constructor() {
        super();
    }
    getRoomReport(req) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, from_date, to_date, room_number, } = req.query;
            const { hotel_id } = req.hotel_admin;
            // model
            const model = this.Model.reportModel();
            const { data: allRoom, total } = yield model.getAllRoom({
                limit: limit,
                skip: skip,
                room_number: room_number,
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
            // Count of total available rooms
            let totalAvailableRoomCount = 0;
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
                        totalAvailableRoomCount++;
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
                total_available_room: totalAvailableRoomCount,
                data: availableRoomForBooking,
            };
        });
    }
}
exports.RoomReportService = RoomReportService;
exports.default = RoomReportService;
//# sourceMappingURL=report.room.service.js.map