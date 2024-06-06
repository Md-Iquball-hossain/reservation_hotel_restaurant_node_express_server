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
const schema_1 = __importDefault(require("../../utils/miscellaneous/schema"));
class SettingModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    //=================== Room Type  ======================//
    // create room type
    createRoomType(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("hotel_room_type")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(payload);
        });
    }
    // Get All room type
    getAllRoomType(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, hotel_id, room_type } = payload;
            const dtbs = this.db("hotel_room_type as hrt");
            if (limit && skip) {
                dtbs.limit(parseInt(limit, 10));
                dtbs.offset(parseInt(skip, 10));
            }
            const dataQuery = dtbs
                .withSchema(this.RESERVATION_SCHEMA)
                .select("hrt.id", "hrt.room_type")
                .where("hrt.hotel_id", hotel_id);
            if (room_type) {
                dataQuery.andWhere("hrt.room_type", "like", `%${room_type}%`);
            }
            const data = yield dataQuery.orderBy("hrt.id", "desc");
            const totalQuery = this.db("hotel_room_type as hrt")
                .withSchema(this.RESERVATION_SCHEMA)
                .count("hrt.id as total")
                .where("hrt.hotel_id", hotel_id);
            if (room_type) {
                totalQuery.andWhere("hrt.room_type", "like", `%${room_type}%`);
            }
            const total = yield totalQuery;
            return { total: total[0].total, data };
        });
    }
    // Update room type
    updateRoomType(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { room_type: newRoomType } = payload;
            yield this.db("hotel_room")
                .withSchema(this.RESERVATION_SCHEMA)
                .where({ room_type: newRoomType })
                .update({ room_type: newRoomType });
            return yield this.db("hotel_room_type")
                .withSchema(this.RESERVATION_SCHEMA)
                .where({ id })
                .update(payload);
        });
    }
    // Delete Room Type
    deleteRoomType(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("hotel_room_type")
                .withSchema(this.RESERVATION_SCHEMA)
                .where({ id })
                .del();
        });
    }
    //=================== Bed Type  ======================//
    // create bed type
    createBedType(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("hotel_room_bed_type")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(payload);
        });
    }
    // Get All bed type
    getAllBedType(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, hotel_id, bed_type } = payload;
            const dtbs = this.db("hotel_room_bed_type as hrbt");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.RESERVATION_SCHEMA)
                .select("hrbt.id", "hrbt.bed_type")
                .where("hotel_id", hotel_id)
                .andWhere(function () {
                if (bed_type) {
                    this.andWhere("hrbt.bed_type", "like", `%${bed_type}%`);
                }
            })
                .orderBy("hrbt.id", "desc");
            const total = yield this.db("hotel_room_bed_type as hrbt")
                .withSchema(this.RESERVATION_SCHEMA)
                .count("hrbt.id as total")
                .where("hrbt.hotel_id", hotel_id)
                .andWhere(function () {
                if (bed_type) {
                    this.andWhere("hrbt.bed_type", "like", `%${bed_type}%`);
                }
            });
            return { total: total[0].total, data };
        });
    }
    // Update Bed Type
    updateBedType(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { bed_type: newRoomType } = payload;
            yield this.db("hotel_room")
                .withSchema(this.RESERVATION_SCHEMA)
                .where({ id })
                .update({ bed_type: newRoomType });
            return this.db("hotel_room_bed_type")
                .withSchema(this.RESERVATION_SCHEMA)
                .where({ id })
                .update(payload);
        });
    }
    // Delete Bed Type
    deleteBedType(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("hotel_room_bed_type")
                .withSchema(this.RESERVATION_SCHEMA)
                .where({ id })
                .del();
        });
    }
    //=================== Room Amenities  ======================//
    // create Room Amenities
    createRoomAmenities(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("hotel_room_amenities_head")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(payload);
        });
    }
    // Get All Room Amenities
    getAllRoomAmenities(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, hotel_id, room_amenities } = payload;
            const dtbs = this.db("hotel_room_amenities_head as hrah");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.RESERVATION_SCHEMA)
                .select("hrah.id", "hrah.room_amenities")
                .where("hotel_id", hotel_id)
                .andWhere(function () {
                if (room_amenities) {
                    this.andWhere("hrah.room_amenities", "like", `%${room_amenities}%`);
                }
            })
                .orderBy("hrah.id", "desc");
            const total = yield this.db("hotel_room_amenities_head as hrah")
                .withSchema(this.RESERVATION_SCHEMA)
                .count("hrah.id as total")
                .where("hrah.hotel_id", hotel_id)
                .andWhere(function () {
                if (room_amenities) {
                    this.andWhere("hrah.room_amenities", "like", `%${room_amenities}%`);
                }
            });
            return { total: total[0].total, data };
        });
    }
    // Update Room Amenities
    updateRoomAmenities(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("hotel_room_amenities_head")
                .withSchema(this.RESERVATION_SCHEMA)
                .where({ id })
                .update(payload);
        });
    }
    // Delete Room Amenities
    deleteRoomAmenities(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("hotel_room_amenities_head")
                .withSchema(this.RESERVATION_SCHEMA)
                .where({ id })
                .del();
        });
    }
    //=================== Bank Name  ======================//
    // create Bank Name
    createBankName(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("bank_name")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(payload);
        });
    }
    // Get All Bank Name
    getAllBankName(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, hotel_id, name } = payload;
            const dtbs = this.db("bank_name as bn");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.RESERVATION_SCHEMA)
                .select("bn.id", "bn.name as bank_name")
                .where("hotel_id", hotel_id)
                .andWhere(function () {
                if (name) {
                    this.andWhere("bn.name", "like", `%${name}%`);
                }
            })
                .orderBy("bn.id", "desc");
            const total = yield this.db("bank_name as bn")
                .withSchema(this.RESERVATION_SCHEMA)
                .count("bn.id as total")
                .where("bn.hotel_id", hotel_id)
                .andWhere(function () {
                if (name) {
                    this.andWhere("bn.name", "like", `%${name}%`);
                }
            });
            return { total: total[0].total, data };
        });
    }
    // Update Bank Name
    updateBankName(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("bank_name")
                .withSchema(this.RESERVATION_SCHEMA)
                .where({ id })
                .update(payload);
        });
    }
    // Delete Bank Name
    deleteBankName(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("bank_name")
                .withSchema(this.RESERVATION_SCHEMA)
                .where({ id })
                .del();
        });
    }
    //=================== Designation Model  ======================//
    // create  Designation Model 
    createDesignation(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("designation")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(payload);
        });
    }
    // Get All designation
    getAllDesignation(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, hotel_id, name } = payload;
            const dtbs = this.db("designation as d");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.RESERVATION_SCHEMA)
                .select("d.id", "d.name as designation_name")
                .where("hotel_id", hotel_id)
                .andWhere(function () {
                if (name) {
                    this.andWhere("d.name", "like", `%${name}%`);
                }
            })
                .orderBy("d.id", "desc");
            const total = yield this.db("designation as d")
                .withSchema(this.RESERVATION_SCHEMA)
                .count("d.id as total")
                .where("d.hotel_id", hotel_id)
                .andWhere(function () {
                if (name) {
                    this.andWhere("d.name", "like", `%${name}%`);
                }
            });
            return { total: total[0].total, data };
        });
    }
    // Update Designation
    updateDesignation(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("designation")
                .withSchema(this.RESERVATION_SCHEMA)
                .where({ id })
                .update(payload);
        });
    }
    // Delete designation
    deleteDesignation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("designation")
                .withSchema(this.RESERVATION_SCHEMA)
                .where({ id })
                .del();
        });
    }
    //=================== Department Model  ======================//
    // create Department 
    createDepartment(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("department")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(payload);
        });
    }
    // Get All Department
    getAllDepartment(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, hotel_id, name } = payload;
            const dtbs = this.db("department as d");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.RESERVATION_SCHEMA)
                .select("d.id", "d.name as department_name")
                .where("hotel_id", hotel_id)
                .andWhere(function () {
                if (name) {
                    this.andWhere("d.name", "like", `%${name}%`);
                }
            })
                .orderBy("d.id", "desc");
            const total = yield this.db("department as d")
                .withSchema(this.RESERVATION_SCHEMA)
                .count("d.id as total")
                .where("d.hotel_id", hotel_id)
                .andWhere(function () {
                if (name) {
                    this.andWhere("d.name", "like", `%${name}%`);
                }
            });
            return { total: total[0].total, data };
        });
    }
    // Update Department
    updateDepartment(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("department")
                .withSchema(this.RESERVATION_SCHEMA)
                .where({ id })
                .update(payload);
        });
    }
    // Delete Department
    deleteDepartment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("department")
                .withSchema(this.RESERVATION_SCHEMA)
                .where({ id })
                .del();
        });
    }
    //=================== Hall Amenities  ======================//
    // create Hall Amenities
    createHallAmenities(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("hall_amenities")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(payload);
        });
    }
    // Get All Hall Amenities
    getAllHallAmenities(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, hotel_id, name } = payload;
            const dtbs = this.db("hall_amenities as ha");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.RESERVATION_SCHEMA)
                .select("ha.id", "ha.name", "ha.description")
                .where("ha.hotel_id", hotel_id)
                .andWhere(function () {
                if (name) {
                    this.andWhere("ha.name", "like", `%${name}%`);
                }
            })
                .orderBy("ha.id", "desc");
            const total = yield this.db("hall_amenities as ha")
                .withSchema(this.RESERVATION_SCHEMA)
                .count("ha.id as total")
                .where("ha.hotel_id", hotel_id)
                .andWhere(function () {
                if (name) {
                    this.andWhere("ha.name", "like", `%${name}%`);
                }
            });
            return { total: total[0].total, data };
        });
    }
    // Update Hall Amenities
    updateHallAmenities(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("hall_amenities")
                .withSchema(this.RESERVATION_SCHEMA)
                .where({ id })
                .update(payload);
        });
    }
    // Delete Hall Amenities
    deleteHallAmenities(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("hall_amenities")
                .withSchema(this.RESERVATION_SCHEMA)
                .where({ id })
                .del();
        });
    }
    //=================== Payroll Months ======================//
    // create  Payroll Months 
    createPayrollMonths(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("payroll_months")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(payload);
        });
    }
    // Get All PayrollMonths
    getPayrollMonths(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, hotel_id, name } = payload;
            const dtbs = this.db("payroll_months as pm");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.RESERVATION_SCHEMA)
                .select("pm.id", "pm.name as month_name", "pm.days as working_days", "pm.hours")
                .where("pm.hotel_id", hotel_id)
                .andWhere(function () {
                if (name) {
                    this.andWhere("pm.name", "like", `%${name}%`);
                }
            })
                .orderBy("pm.id", "asc");
            const total = yield this.db("payroll_months as pm")
                .withSchema(this.RESERVATION_SCHEMA)
                .count("pm.id as total")
                .where("pm.hotel_id", hotel_id)
                .andWhere(function () {
                if (name) {
                    this.andWhere("pm.name", "like", `%${name}%`);
                }
            });
            return { total: total[0].total, data };
        });
    }
    // Update Payroll Months
    updatePayrollMonths(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("payroll_months")
                .withSchema(this.RESERVATION_SCHEMA)
                .where({ id })
                .update(payload);
        });
    }
    // Delete Payroll Months
    deletePayrollMonths(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("payroll_months")
                .withSchema(this.RESERVATION_SCHEMA)
                .where({ id })
                .del();
        });
    }
}
exports.default = SettingModel;
//# sourceMappingURL=Setting.Model.js.map