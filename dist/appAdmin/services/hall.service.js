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
exports.HallService = void 0;
const abstract_service_1 = __importDefault(require("../../abstarcts/abstract.service"));
const hallModel_1 = __importDefault(require("../../models/hallModel/hallModel"));
class HallService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // create room
    createHall(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const _a = req.body, { hall_amenities, hall_status } = _a, rest = __rest(_a, ["hall_amenities", "hall_status"]);
                const { hotel_id } = req.hotel_admin;
                // Similar hall name check
                const hallModel = this.Model.hallModel();
                const check = yield hallModel.getAllHallName(req.body.name, hotel_id);
                if (check) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Hall Name already exists, give another unique name",
                    };
                }
                // model
                const model = new hallModel_1.default(trx);
                // insert hall
                const res = yield model.createHall(Object.assign(Object.assign({}, rest), { hall_status, hotel_id }));
                const hall_id = res[0];
                // step hall amenities
                const hotel_hall_amenities_parse = hall_amenities
                    ? JSON.parse(hall_amenities)
                    : [];
                // insert hall amenities
                if (hotel_hall_amenities_parse.length) {
                    const hotelRoomAmenitiesPayload = hotel_hall_amenities_parse.map((id) => {
                        return {
                            hall_id,
                            hotel_id,
                            amenity_id: id,
                        };
                    });
                    yield model.insertHallRoomAmenities(hotelRoomAmenitiesPayload);
                }
                const files = req.files || [];
                // insert hall image
                if (files.length) {
                    const hallImages = [];
                    files.forEach((element) => {
                        hallImages.push({
                            hall_id,
                            hotel_id,
                            photo: element.filename,
                        });
                    });
                    yield model.createHallImage(hallImages);
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: "Hall created successfully.",
                };
            }));
        });
    }
    // get All Hall
    getAllHall(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, limit, hall_status, skip } = req.query;
            const { hotel_id } = req.hotel_admin;
            // model
            const model = this.Model.hallModel();
            const { data, total } = yield model.getAllHall({
                key: key,
                hall_status: hall_status,
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
    getAllAvailableAndUnavailableHall(req) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, start_time, end_time, event_date } = req.query;
            const { hotel_id } = req.hotel_admin;
            // model
            const model = this.Model.hallModel();
            const { data: allHall, total } = yield model.getAllHall({
                limit: limit,
                skip: skip,
                hotel_id,
            });
            // getting all hall booking
            const getAllBookingHall = yield model.getAllBookingHall({
                start_time: start_time,
                end_time: end_time,
                event_date: event_date,
                hotel_id,
            });
            const getAllBookingHallSdQuery = yield model.getAllBookingHallForSdQueryAvailblityWithCheckout({
                start_time: start_time,
                end_time: end_time,
                event_date: event_date,
                hotel_id,
            });
            const availableHallForBooking = [];
            const allBookingHalls = [];
            if (getAllBookingHall === null || getAllBookingHall === void 0 ? void 0 : getAllBookingHall.length) {
                for (let i = 0; i < (getAllBookingHall === null || getAllBookingHall === void 0 ? void 0 : getAllBookingHall.length); i++) {
                    const booking_halls = (_a = getAllBookingHall[i]) === null || _a === void 0 ? void 0 : _a.booking_halls;
                    for (let j = 0; j < (booking_halls === null || booking_halls === void 0 ? void 0 : booking_halls.length); j++) {
                        allBookingHalls.push({
                            id: booking_halls[j].id,
                            hall_id: booking_halls[j].hall_id,
                            start_time: getAllBookingHall[i].start_time,
                            end_time: getAllBookingHall[i].end_time,
                            event_date: getAllBookingHall[i].event_date,
                            name: getAllBookingHall[i].name,
                            email: getAllBookingHall[i].email,
                            grand_total: getAllBookingHall[i].grand_total,
                            due: getAllBookingHall[i].due,
                            user_last_balance: getAllBookingHall[i].user_last_balance,
                        });
                    }
                }
            }
            if (getAllBookingHallSdQuery.length) {
                for (let i = 0; i < (getAllBookingHallSdQuery === null || getAllBookingHallSdQuery === void 0 ? void 0 : getAllBookingHallSdQuery.length); i++) {
                    const booking_halls = (_b = getAllBookingHallSdQuery[i]) === null || _b === void 0 ? void 0 : _b.booking_halls;
                    for (let j = 0; j < (booking_halls === null || booking_halls === void 0 ? void 0 : booking_halls.length); j++) {
                        allBookingHalls.push({
                            id: booking_halls[j].id,
                            hall_id: booking_halls[j].hall_id,
                            start_time: getAllBookingHallSdQuery[i].start_time,
                            end_time: getAllBookingHallSdQuery[i].end_time,
                            event_date: getAllBookingHallSdQuery[i].event_date,
                            name: getAllBookingHallSdQuery[i].name,
                            email: getAllBookingHallSdQuery[i].email,
                            grand_total: getAllBookingHallSdQuery[i].grand_total,
                            due: getAllBookingHallSdQuery[i].due,
                            user_last_balance: getAllBookingHallSdQuery[i].user_last_balance,
                        });
                    }
                }
            }
            if (allHall === null || allHall === void 0 ? void 0 : allHall.length) {
                for (let i = 0; i < allHall.length; i++) {
                    let found = false;
                    for (let j = 0; j < (allBookingHalls === null || allBookingHalls === void 0 ? void 0 : allBookingHalls.length); j++) {
                        if (allHall[i].id == ((_c = allBookingHalls[j]) === null || _c === void 0 ? void 0 : _c.hall_id)) {
                            found = true;
                            availableHallForBooking.push({
                                hall_id: allHall[i].id,
                                hall_name: allHall[i].name,
                                rate_per_hour: allHall[i].rate_per_hour,
                                hall_status: allHall[i].hall_status,
                                hall_size: allHall[i].hall_size,
                                capacity: allHall[i].capacity,
                                location: allHall[i].location,
                                available_status: 0,
                                guest_name: ((_d = allBookingHalls[j]) === null || _d === void 0 ? void 0 : _d.name) || "",
                                guest_email: ((_e = allBookingHalls[j]) === null || _e === void 0 ? void 0 : _e.email) || "",
                                start_time: ((_f = allBookingHalls[j]) === null || _f === void 0 ? void 0 : _f.start_time) || "",
                                end_time: ((_g = allBookingHalls[j]) === null || _g === void 0 ? void 0 : _g.end_time) || "",
                                event_date: ((_h = allBookingHalls[j]) === null || _h === void 0 ? void 0 : _h.event_date) || "",
                                grand_total: ((_j = allBookingHalls[j]) === null || _j === void 0 ? void 0 : _j.grand_total) || "",
                                due_amount: ((_k = allBookingHalls[j]) === null || _k === void 0 ? void 0 : _k.due) || "",
                                user_last_balance: ((_l = allBookingHalls[j]) === null || _l === void 0 ? void 0 : _l.user_last_balance) || "",
                                hall_amenities: allHall[i].hall_amenities,
                                hall_images: allHall[i].hall_images,
                            });
                            break;
                        }
                    }
                    if (!found) {
                        availableHallForBooking.push({
                            hall_id: allHall[i].id,
                            hall_name: allHall[i].name,
                            rate_per_hour: allHall[i].rate_per_hour,
                            hall_status: allHall[i].hall_status,
                            hall_size: allHall[i].hall_size,
                            capacity: allHall[i].capacity,
                            location: allHall[i].location,
                            available_status: 1,
                            hall_amenities: allHall[i].hall_amenities,
                            hall_images: allHall[i].hall_images,
                        });
                    }
                }
            }
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total,
                data: availableHallForBooking,
            };
        });
    }
    // get All Hall
    getAllAvailableHall(req) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { hall_status, limit, skip, start_time, end_time, event_date } = req.query;
            const { hotel_id } = req.hotel_admin;
            const model = this.Model.hallModel();
            const { data: allHall, total } = yield model.getAllHall({
                limit: limit,
                skip: skip,
                hotel_id,
            });
            const startTimeOnly = start_time;
            const endTimeOnly = end_time;
            // getting all hall booking
            const getAllBookingHall = yield model.getAllBookingHall({
                start_time: startTimeOnly,
                end_time: endTimeOnly,
                hotel_id,
                event_date: event_date,
            });
            const getAllBookingHallSdQuery = yield model.getAllBookingHallForSdQueryAvailblityWithCheckout({
                start_time: startTimeOnly,
                end_time: endTimeOnly,
                hotel_id,
                event_date: event_date,
            });
            const availableHallForBooking = [];
            const allBookingHalls = [];
            if (getAllBookingHall.length) {
                for (let i = 0; i < getAllBookingHall.length; i++) {
                    const booking_halls = (_a = getAllBookingHall[i]) === null || _a === void 0 ? void 0 : _a.booking_halls;
                    for (let j = 0; j < booking_halls.length; j++) {
                        allBookingHalls.push({
                            id: booking_halls[j].id,
                            hall_id: booking_halls[j].hall_id,
                        });
                    }
                }
            }
            if (getAllBookingHallSdQuery.length) {
                for (let i = 0; i < (getAllBookingHallSdQuery === null || getAllBookingHallSdQuery === void 0 ? void 0 : getAllBookingHallSdQuery.length); i++) {
                    const booking_halls = (_b = getAllBookingHallSdQuery[i]) === null || _b === void 0 ? void 0 : _b.booking_halls;
                    for (let j = 0; j < (booking_halls === null || booking_halls === void 0 ? void 0 : booking_halls.length); j++) {
                        allBookingHalls.push({
                            id: booking_halls[j].id,
                            hall_id: booking_halls[j].hall_id,
                        });
                    }
                }
            }
            if (allHall.length) {
                for (let i = 0; i < allHall.length; i++) {
                    let found = false;
                    for (let j = 0; j < allBookingHalls.length; j++) {
                        if (allHall[i].id == allBookingHalls[j].hall_id) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        availableHallForBooking.push({
                            hall_id: allHall[i].id,
                            hall_name: allHall[i].name,
                            rate_per_hour: allHall[i].rate_per_hour,
                            hall_status: allHall[i].hall_status,
                            hall_size: allHall[i].hall_size,
                            capacity: allHall[i].capacity,
                            location: allHall[i].location,
                            hall_amenities: allHall[i].hall_amenities,
                            hall_images: allHall[i].hall_images,
                        });
                    }
                }
            }
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: availableHallForBooking,
            };
        });
    }
    // get Single Hall 
    getSingleHall(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hall_id } = req.params;
            const model = this.Model.hallModel();
            const data = yield model.getSingleHall(req.hotel_admin.hotel_id, parseInt(hall_id));
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
                data,
            };
        });
    }
    // update hotel Hall
    updateHall(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { hotel_id } = req.hotel_admin;
                const { hall_id } = req.params;
                const _a = req.body, { remove_photos, hall_amenities, remove_amenities } = _a, rest = __rest(_a, ["remove_photos", "hall_amenities", "remove_amenities"]);
                const model = this.Model.hallModel(trx);
                // Update Hall details
                if (Object.keys(rest).length) {
                    yield model.updateHall(parseInt(hall_id), hotel_id, Object.assign({}, rest));
                }
                // Insert Hall images
                const files = req.files || [];
                if (files.length) {
                    const hallImages = files.map((element) => ({
                        hall_id: parseInt(hall_id),
                        hotel_id,
                        photo: element.filename,
                    }));
                    yield model.insertHallImage(hallImages);
                }
                // Remove Hall images
                const rmv_photo = remove_photos ? JSON.parse(remove_photos) : [];
                if (rmv_photo.length) {
                    yield model.deleteHallImage(rmv_photo, Number(hall_id));
                }
                // Update hall amenities
                const hall_room_amenities_parse = hall_amenities
                    ? JSON.parse(hall_amenities)
                    : [];
                // Check if amenities already exist
                const hallModel = this.Model.hallModel(trx);
                const existingAmenities = yield hallModel.getAllHallAmenities(parseInt(hall_id), hotel_id, hall_room_amenities_parse);
                let distinctAminities = [];
                if (existingAmenities.length) {
                    for (let i = 0; i < hall_room_amenities_parse.length; i++) {
                        let found = false;
                        for (let j = 0; j < existingAmenities.length; j++) {
                            if (hall_room_amenities_parse[i] == existingAmenities[j].amenity_id) {
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            distinctAminities.push(hall_room_amenities_parse[i]);
                        }
                    }
                }
                else {
                    distinctAminities = hall_room_amenities_parse;
                }
                if (distinctAminities.length) {
                    const hotelRoomAmenitiesPayload = distinctAminities.map((id) => ({
                        hall_id: parseInt(hall_id),
                        hotel_id,
                        amenity_id: id,
                    }));
                    yield model.insertHallRoomAmenities(hotelRoomAmenitiesPayload);
                }
                // remove hall amenities
                const rmv_amenities = remove_amenities ? JSON.parse(remove_amenities) : [];
                if (rmv_amenities.length) {
                    yield model.deleteHallAmenities(rmv_amenities, Number(hall_id));
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: "Hall updated successfully",
                };
            }));
        });
    }
}
exports.HallService = HallService;
exports.default = HallService;
//# sourceMappingURL=hall.service.js.map