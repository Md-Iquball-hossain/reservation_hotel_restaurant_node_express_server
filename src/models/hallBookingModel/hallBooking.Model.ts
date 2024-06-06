import { IBookingHalls, IHallBooking, InsertHallBookingCheckOut, InsertHallBookingCheckin } from "../../appAdmin/utlis/interfaces/hallBooking.interface";
import { TDB } from "../../common/types/commontypes";
import Schema from "../../utils/miscellaneous/schema";

    class HallBookingModel extends Schema {
        private db: TDB;
        constructor(db: TDB) {
        super();
        this.db = db;
        }

    // insert hall booking
    public async insertHallBooking(payload: IHallBooking) {
    return await this.db("hall_booking")
        .withSchema(this.RESERVATION_SCHEMA)
        .insert(payload);
    }

    // insert booking hall
    public async insertBookingHall(payload: IBookingHalls[]) {
    return await this.db("booking_halls")
        .withSchema(this.RESERVATION_SCHEMA)
        .insert(payload);
    }

    public async getAllHallBookingByHallId(
        hotel_id: number,
        name: number
        ) {
            return await this.db.raw(`
            SELECT id as booking_id,booking_no,user_id,name,photo,status,grand_total FROM hotel_reservation.hall_booking_view 
            WHERE JSON_CONTAINS(booking_halls, '{"hall_id": ${name}}')
            AND hotel_id = ${hotel_id} AND status NOT IN ('left', 'rejected')
        `);
        }

    // get last hall booking id
    public async getLastHallBookingId(hotel_id: number) {
    return await this.db("hall_booking")
        .withSchema(this.RESERVATION_SCHEMA)
        .select("id")
        .where({ hotel_id })
        .orderBy("id", "desc")
        .limit(1);
    }

    // get all hall booking
    public async getAllHallBooking(payload: {
        limit?: string;
        skip?: string;
        key?: string;
        from_date?: string;
        to_date?: string;
        event_date?: string;
        hotel_id: number;
        booking_status?: string;
        user_id?: string;
    }) {
    const { limit, skip, hotel_id, key, booking_status,event_date,from_date, to_date, user_id } = payload;

    const dtbs = this.db("hall_booking_view as hbv");

    if (limit && skip) {
    dtbs.limit(parseInt(limit as string));
    dtbs.offset(parseInt(skip as string));
    }

    const endDate = new Date(to_date as string);
    endDate.setDate(endDate.getDate());

    const data = await dtbs
    .withSchema(this.RESERVATION_SCHEMA)
    .select(
        "hbv.id",
        "hbv.booking_no",
        "hbv.user_id",
        "hbv.name as client_name",
        "hbv.email as client_mail",
        "hbcio.id as hall_check_in",
        "hbv.event_date",
        "hbv.start_time",
        "hbv.end_time",
        "hbv.number_of_hours",
        "hbv.total_occupancy",
        "hbv.extra_charge",
        "hbv.grand_total",
        "hbv.pay_status",
        "hbv.due",
        "hbv.reserved_hall",
        "hbv.booking_status",
        "hbv.booking_date",
        "hbv.hall_booking_inv_id",
        "hbv.created_by_id",
        "hbv.created_by_name",
        "hbv.check_in_out_status",
    )
    .where("hotel_id", hotel_id)
    .leftJoin("hall_booking_check_in_out as hbcio", "hbv.id", "hbcio.booking_id")
    .andWhere(function () {
    if (key) {
    this.andWhere("hbv.name", "like", `%${key}%`)
        .orWhere("hbv.email", "like", `%${key}%`)
        .orWhereRaw("JSON_EXTRACT(booking_halls, '$[*].name') LIKE ?",[`%${key}%`]
        );
    }
    if (user_id) {
    this.andWhere({ user_id });
    }
    if (booking_status) {
    this.andWhere({ booking_status });
    }
    if (event_date) {
        this.andWhere({ event_date });
    }
    if (from_date && to_date) {
        this.andWhereBetween("rbv.check_in_time", [from_date, endDate]);
    }
    })
    .orderBy("hbv.id", "desc");

    const total = await this.db("hall_booking_view as hbv")
    .withSchema(this.RESERVATION_SCHEMA)
    .leftJoin("hall_booking_check_in_out as hbcio", "hbv.id", "hbcio.booking_id")
    .count("hbv.id as total")
    .where("hbv.hotel_id", hotel_id)
    .andWhere(function () {
    if (key) {
    this.andWhere("hbv.name", "like", `%${key}%`)
        .orWhere("hbv.email", "like", `%${key}%`)
        .orWhereRaw(
        "JSON_EXTRACT(booking_halls, '$[*].name') LIKE ?",
        [`%${key}%`]
        );
    }
    if (user_id) {
        this.andWhere({ user_id });
        }
    if (booking_status) {
    this.andWhere({ booking_status });
    }
    if (event_date) {
        this.andWhere({ event_date });
    }
    if (from_date && to_date) {
        this.andWhereBetween("rbv.check_in_time", [from_date, endDate]);
    }
    });

    return { data, total: total[0].total };
    }

    // get single hall booking
    public async getSingleHallBooking(id: number, hotel_id: number) {
        return await this.db("hall_booking_view")
        .withSchema(this.RESERVATION_SCHEMA)
        .select("*")
        .where({ id })
        .andWhere({ hotel_id });
    }

    // insert hall booking check in
    public async insertHallBookingCheckIn( payload: InsertHallBookingCheckin) {
        return await this.db("hall_booking_check_in_out")
        .withSchema(this.RESERVATION_SCHEMA)
        .insert(payload);
    }

    // get all hall booking
    public async getAllHallBookingCheckIn(payload: {
    hotel_id: number;
    booking_id?: number;
    from_date?: string;
    to_date?: string;
    limit?: string;
    skip?: string;
    key?: string;
    }) {
    const { limit, skip, hotel_id, key, booking_id, from_date, to_date } = payload;

    const endDate = new Date(to_date as string);
    endDate.setDate(endDate.getDate() + 1);

    const dtbs = this.db("hall_booking_check_in_out as hbco");

    if (limit && skip) {
        dtbs.limit(parseInt(limit as string));
        dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs
        .select(
        "hbco.id",
        "u.name as name",
        "u.email as email",
        "b.id as booking_id",
        "b.booking_no",
        "hbco.check_in",
        "hbco.check_out",
        "hbco.event_date",
        "hbco.status",
        "hbco.created_at"
    )
    .withSchema(this.RESERVATION_SCHEMA)
    .leftJoin("hall_booking as b", "hbco.booking_id", "b.id")
    .leftJoin("user as u", "b.user_id", "u.id")
    .where("b.hotel_id", hotel_id)
    .andWhere(function () {
    if (key) {
        this.andWhere("b.booking_no", "like", `%${key}%`).orWhere(
        "u.name",
        "like",
        `%${key}%`
        );
    }
    })
    .andWhere(function () {
    if (booking_id) {
        this.andWhere("b.id", booking_id);
    }

    if (from_date && to_date) {
        this.andWhereBetween("hbco.created_at", [from_date, endDate]);
    }
    })
    .orderBy("hbco.id", "desc");

    const total = await this.db("hall_booking_check_in_out as hbco")
    .count("hbco.id as total")
    .withSchema(this.RESERVATION_SCHEMA)
    .leftJoin("hall_booking as b", "hbco.booking_id", "b.id")
    .where("b.hotel_id", hotel_id)
    .andWhere(function () {
    if (key) {
        this.andWhere("b.booking_no", "like", `%${key}%`).orWhere(
        "u.name",
        "like",
        `%${key}%`
        );
    }
    })
    .andWhere(function () {
    if (booking_id) {
        this.andWhere("b.id", booking_id);
    }

    if (from_date && to_date) {
        this.andWhereBetween("hbco.created_at", [from_date, endDate]);
    }
    });

    return {
        data,
        total: total[0].total,
    };
    }

    public async updateHallBooking(
        payload: { pay_status?: number; booking_status?: string; reserved_hall?: number },
        where: { id: number }
    ) {
        return await this.db("hall_booking")
        .withSchema(this.RESERVATION_SCHEMA)
        .update(payload)
        .where({ id: where.id });
    }

    // get single hall check in checkout
    public async getSingleHallBookingCheckIn(id: number, hotel_id: number) {
    return await this.db("hall_check_in_out_view")
        .withSchema(this.RESERVATION_SCHEMA)
        .select("*")
        .where({ hotel_id })
        .andWhere({ id });
    }

    // add hall booking check out
    public async updateBookingCheckOut(
        payload: { check_out: string; status: string },
        id: number
    ) {
        return await this.db("hall_booking_check_in_out")
        .withSchema(this.RESERVATION_SCHEMA)
        .update(payload)
        .where({ id });
    }

    // Get All Guest Model
    public async getAllGuest(payload: {
        limit?: string;
        skip?: string;
        key?: string;
        email: string;
        hotel_id: number;
    }) {
    const { key, hotel_id, limit, skip } = payload;

    const dtbs = this.db("user");

    if (limit && skip) {
    dtbs.limit(parseInt(limit as string));
    dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs
    .select(
        "id",
        "name",
        "email",
        "country",
        "city",
        "status",
        "last_balance",
        "created_at"
    )
    .withSchema(this.RESERVATION_SCHEMA)
    .where({ hotel_id })
    .andWhere(function () {
        if (key) {
        this.andWhere("name", "like", `%${key}%`)
            .orWhere("email", "like", `%${key}%`)
            .orWhere("country", "like", `%${key}%`)
            .orWhere("city", "like", `%${key}%`);
        }
    })
    .orderBy("id", "desc");

    const total = await this.db("user")
    .withSchema(this.RESERVATION_SCHEMA)
    .count("id as total")
    .where({ hotel_id })
    .andWhere(function () {
        if (key) {
        this.andWhere("name", "like", `%${key}%`)
            .orWhere("email", "like", `%${key}%`)
            .orWhere("country", "like", `%${key}%`)
            .orWhere("city", "like", `%${key}%`);
        }
    });

    return { data, total: total[0].total };
    }

}
export default HallBookingModel;

// import { IBookingHalls, IHallBooking, InsertHallBookingCheckOut, InsertHallBookingCheckin } from "../../appAdmin/utlis/interfaces/hallBooking.interface";
// import { TDB } from "../../common/types/commontypes";
// import Schema from "../../utils/miscellaneous/schema";

//     class HallBookingModel extends Schema {
//         private db: TDB;
//         constructor(db: TDB) {
//         super();
//         this.db = db;
//         }

//     // insert hall booking
//     public async insertHallBooking(payload: IHallBooking) {
//     return await this.db("hall_booking")
//         .withSchema(this.RESERVATION_SCHEMA)
//         .insert(payload);
//     }

//     // insert booking hall
//     public async insertBookingHall(payload: IBookingHalls[]) {
//     return await this.db("booking_halls")
//         .withSchema(this.RESERVATION_SCHEMA)
//         .insert(payload);
//     }

//     public async getAllHallBookingByHallId(
//         hotel_id: number,
//         name: number
//         ) {
//             return await this.db.raw(`
//             SELECT id as booking_id,booking_no,user_id,name,photo,status,grand_total FROM hotel_reservation.hall_booking_view 
//             WHERE JSON_CONTAINS(booking_halls, '{"hall_id": ${name}}')
//             AND hotel_id = ${hotel_id} AND status NOT IN ('left', 'rejected')
//         `);
//         }

//     // get last hall booking id
//     public async getLastHallBookingId(hotel_id: number) {
//     return await this.db("hall_booking")
//         .withSchema(this.RESERVATION_SCHEMA)
//         .select("id")
//         .where({ hotel_id })
//         .orderBy("id", "desc")
//         .limit(1);
//     }

//     // get all hall booking
//     public async getAllHallBooking(payload: {
//         limit?: string;
//         skip?: string;
//         key?: string;
//         from_date?: string;
//         to_date?: string;
//         event_date?: string;
//         hotel_id: number;
//         booking_status?: string;
//         user_id?: string;
//     }) {
//     const { limit, skip, hotel_id, key, booking_status,event_date,from_date, to_date, user_id } = payload;

//     const dtbs = this.db("hall_booking_view as hbv");

//     if (limit && skip) {
//     dtbs.limit(parseInt(limit as string));
//     dtbs.offset(parseInt(skip as string));
//     }

//     const endDate = new Date(to_date as string);
//     endDate.setDate(endDate.getDate());

//     const data = await dtbs
//     .withSchema(this.RESERVATION_SCHEMA)
//     .select(
//         "hbv.id",
//         "hbv.booking_no",
//         "hbv.user_id",
//         "hbv.name as client_name",
//         "hbv.email as client_mail",
//         "hbcio.id as hall_check_in",
//         "hbv.event_date",
//         "hbv.start_time",
//         "hbv.end_time",
//         "hbv.number_of_hours",
//         "hbv.total_occupancy",
//         "hbv.extra_charge",
//         "hbv.grand_total",
//         "hbv.pay_status",
//         "hbv.due",
//         "hbv.reserved_hall",
//         "hbv.booking_status",
//         "hbv.booking_date",
//         "hbv.hall_booking_inv_id",
//         "hbv.created_by_id",
//         "hbv.created_by_name",
//         "hbv.check_in_out_status",
//     )
//     .where("hotel_id", hotel_id)
//     .leftJoin("hall_booking_check_in_out as hbcio", "hbv.id", "hbcio.booking_id")
//     .andWhere(function () {
//     if (key) {
//     this.andWhere("hbv.name", "like", `%${key}%`)
//         .orWhere("hbv.email", "like", `%${key}%`)
//         .orWhereRaw("JSON_EXTRACT(booking_halls, '$[*].name') LIKE ?",[`%${key}%`]
//         );
//     }
//     if (user_id) {
//     this.andWhere({ user_id });
//     }
//     if (booking_status) {
//     this.andWhere({ booking_status });
//     }
//     if (event_date) {
//         this.andWhere({ event_date });
//     }
//     if (from_date && to_date) {
//         this.andWhereBetween("rbv.check_in_time", [from_date, endDate]);
//     }
//     })
//     .orderBy("hbv.id", "desc");

//     const total = await this.db("hall_booking_view as hbv")
//     .withSchema(this.RESERVATION_SCHEMA)
//     .leftJoin("hall_booking_check_in_out as hbcio", "hbv.id", "hbcio.booking_id")
//     .count("hbv.id as total")
//     .where("hbv.hotel_id", hotel_id)
//     .andWhere(function () {
//     if (key) {
//     this.andWhere("hbv.name", "like", `%${key}%`)
//         .orWhere("hbv.email", "like", `%${key}%`)
//         .orWhereRaw(
//         "JSON_EXTRACT(booking_halls, '$[*].name') LIKE ?",
//         [`%${key}%`]
//         );
//     }
//     if (user_id) {
//         this.andWhere({ user_id });
//         }
//     if (booking_status) {
//     this.andWhere({ booking_status });
//     }
//     if (event_date) {
//         this.andWhere({ event_date });
//     }
//     if (from_date && to_date) {
//         this.andWhereBetween("rbv.check_in_time", [from_date, endDate]);
//     }
//     });

//     return { data, total: total[0].total };
//     }

//     // get single hall booking
//     public async getSingleHallBooking(id: number, hotel_id: number) {
//         return await this.db("hall_booking_view")
//         .withSchema(this.RESERVATION_SCHEMA)
//         .select("*")
//         .where({ id })
//         .andWhere({ hotel_id });
//     }

//     // insert hall booking check in
//     public async insertHallBookingCheckIn( payload: InsertHallBookingCheckin) {
//         return await this.db("hall_booking_check_in_out")
//         .withSchema(this.RESERVATION_SCHEMA)
//         .insert(payload);
//     }

//     // get all hall booking
//     public async getAllHallBookingCheckIn(payload: {
//     hotel_id: number;
//     booking_id?: number;
//     from_date?: string;
//     to_date?: string;
//     limit?: string;
//     skip?: string;
//     key?: string;
//     }) {
//     const { limit, skip, hotel_id, key, booking_id, from_date, to_date } = payload;

//     const endDate = new Date(to_date as string);
//     endDate.setDate(endDate.getDate() + 1);

//     const dtbs = this.db("hall_booking_check_in_out as hbco");

//     if (limit && skip) {
//         dtbs.limit(parseInt(limit as string));
//         dtbs.offset(parseInt(skip as string));
//     }

//     const data = await dtbs
//         .select(
//         "hbco.id",
//         "u.name as name",
//         "u.email as email",
//         "b.id as booking_id",
//         "b.booking_no",
//         "hbco.check_in",
//         "hbco.check_out",
//         "hbco.event_date",
//         "hbco.status",
//         "hbco.created_at"
//     )
//     .withSchema(this.RESERVATION_SCHEMA)
//     .leftJoin("hall_booking as b", "hbco.booking_id", "b.id")
//     .leftJoin("user as u", "b.user_id", "u.id")
//     .where("b.hotel_id", hotel_id)
//     .andWhere(function () {
//     if (key) {
//         this.andWhere("b.booking_no", "like", `%${key}%`).orWhere(
//         "u.name",
//         "like",
//         `%${key}%`
//         );
//     }
//     })
//     .andWhere(function () {
//     if (booking_id) {
//         this.andWhere("b.id", booking_id);
//     }

//     if (from_date && to_date) {
//         this.andWhereBetween("hbco.created_at", [from_date, endDate]);
//     }
//     })
//     .orderBy("hbco.id", "desc");

//     const total = await this.db("hall_booking_check_in_out as hbco")
//     .count("hbco.id as total")
//     .withSchema(this.RESERVATION_SCHEMA)
//     .leftJoin("hall_booking as b", "hbco.booking_id", "b.id")
//     .where("b.hotel_id", hotel_id)
//     .andWhere(function () {
//     if (key) {
//         this.andWhere("b.booking_no", "like", `%${key}%`).orWhere(
//         "u.name",
//         "like",
//         `%${key}%`
//         );
//     }
//     })
//     .andWhere(function () {
//     if (booking_id) {
//         this.andWhere("b.id", booking_id);
//     }

//     if (from_date && to_date) {
//         this.andWhereBetween("hbco.created_at", [from_date, endDate]);
//     }
//     });

//     return {
//         data,
//         total: total[0].total,
//     };
//     }

//     public async updateHallBooking(
//         payload: { pay_status?: number; booking_status?: string; reserved_hall?: number },
//         where: { id: number }
//     ) {
//         return await this.db("hall_booking")
//         .withSchema(this.RESERVATION_SCHEMA)
//         .update(payload)
//         .where({ id: where.id });
//     }

//     // get single hall check in checkout
//     public async getSingleHallBookingCheckIn(id: number, hotel_id: number) {
//     return await this.db("hall_check_in_out_view")
//         .withSchema(this.RESERVATION_SCHEMA)
//         .select("*")
//         .where({ hotel_id })
//         .andWhere({ id });
//     }

//     // add hall booking check out
//     public async updateBookingCheckOut(
//         payload: { check_out: string; status: string },
//         id: number
//     ) {
//         return await this.db("hall_booking_check_in_out")
//         .withSchema(this.RESERVATION_SCHEMA)
//         .update(payload)
//         .where({ id });
//     }

//     // Get All Guest Model
//     public async getAllGuest(payload: {
//         limit?: string;
//         skip?: string;
//         key?: string;
//         email: string;
//         hotel_id: number;
//     }) {
//     const { key, hotel_id, limit, skip } = payload;

//     const dtbs = this.db("user");

//     if (limit && skip) {
//     dtbs.limit(parseInt(limit as string));
//     dtbs.offset(parseInt(skip as string));
//     }

//     const data = await dtbs
//     .select(
//         "id",
//         "name",
//         "email",
//         "country",
//         "city",
//         "status",
//         "last_balance",
//         "created_at"
//     )
//     .withSchema(this.RESERVATION_SCHEMA)
//     .where({ hotel_id })
//     .andWhere(function () {
//         if (key) {
//         this.andWhere("name", "like", `%${key}%`)
//             .orWhere("email", "like", `%${key}%`)
//             .orWhere("country", "like", `%${key}%`)
//             .orWhere("city", "like", `%${key}%`);
//         }
//     })
//     .orderBy("id", "desc");

//     const total = await this.db("user")
//     .withSchema(this.RESERVATION_SCHEMA)
//     .count("id as total")
//     .where({ hotel_id })
//     .andWhere(function () {
//         if (key) {
//         this.andWhere("name", "like", `%${key}%`)
//             .orWhere("email", "like", `%${key}%`)
//             .orWhere("country", "like", `%${key}%`)
//             .orWhere("city", "like", `%${key}%`);
//         }
//     });

//     return { data, total: total[0].total };
//     }

// }
// export default HallBookingModel;



// // import { IBookingHalls, IHallBooking, InsertHallBookingCheckOut, InsertHallBookingCheckin } from "../../appAdmin/utlis/interfaces/hallBooking.interface";
// // import { TDB } from "../../common/types/commontypes";
// // import Schema from "../../utils/miscellaneous/schema";

// //     class HallBookingModel extends Schema {
// //         private db: TDB;
// //         constructor(db: TDB) {
// //         super();
// //         this.db = db;
// //         }

// //     // insert hall booking
// //     public async insertHallBooking(payload: IHallBooking) {
// //     return await this.db("hall_booking")
// //         .withSchema(this.RESERVATION_SCHEMA)
// //         .insert(payload);
// //     }

// //     // insert booking hall
// //     public async insertBookingHall(payload: IBookingHalls[]) {
// //     return await this.db("booking_halls")
// //         .withSchema(this.RESERVATION_SCHEMA)
// //         .insert(payload);
// //     }

// //     public async getAllHallBookingByHallId(
// //         hotel_id: number,
// //         name: number
// //         ) {
// //             return await this.db.raw(`
// //             SELECT id as booking_id,booking_no,user_id,name,photo,status,grand_total FROM hotel_reservation.hall_booking_view 
// //             WHERE JSON_CONTAINS(booking_halls, '{"hall_id": ${name}}')
// //             AND hotel_id = ${hotel_id} AND status NOT IN ('left', 'rejected')
// //         `);
// //         }

// //     // get last hall booking id
// //     public async getLastHallBookingId(hotel_id: number) {
// //     return await this.db("hall_booking")
// //         .withSchema(this.RESERVATION_SCHEMA)
// //         .select("id")
// //         .where({ hotel_id })
// //         .orderBy("id", "desc")
// //         .limit(1);
// //     }

// //     // get all hall booking
// //     public async getAllHallBooking(payload: {
// //         limit?: string;
// //         skip?: string;
// //         key?: string;
// //         from_date?: string;
// //         to_date?: string;
// //         event_date?: string;
// //         hotel_id: number;
// //         booking_status?: string;
// //         user_id?: string;
// //     }) {
// //     const { limit, skip, hotel_id, key, booking_status,event_date,from_date, to_date, user_id } = payload;

// //     const dtbs = this.db("hall_booking_view as hbv");

// //     if (limit && skip) {
// //     dtbs.limit(parseInt(limit as string));
// //     dtbs.offset(parseInt(skip as string));
// //     }

// //     const endDate = new Date(to_date as string);
// //     endDate.setDate(endDate.getDate());

// //     const data = await dtbs
// //     .withSchema(this.RESERVATION_SCHEMA)
// //     .select(
// //         "hbv.id",
// //         "hbv.booking_no",
// //         "hbv.user_id",
// //         "hbv.name as client_name",
// //         "hbv.email as client_mail",
// //         "hbcio.id as hall_check_in",
// //         "hbv.event_date",
// //         "hbv.start_time",
// //         "hbv.end_time",
// //         "hbv.number_of_hours",
// //         "hbv.total_occupancy",
// //         "hbv.extra_charge",
// //         "hbv.grand_total",
// //         "hbv.pay_status",
// //         "hbv.due",
// //         "hbv.reserved_hall",
// //         "hbv.booking_status",
// //         "hbv.booking_date",
// //         "hbv.hall_booking_inv_id",
// //         "hbv.created_by_id",
// //         "hbv.created_by_name",
// //         "hbv.check_in_out_status",
// //     )
// //     .where("hotel_id", hotel_id)
// //     .leftJoin("hall_booking_check_in_out as hbcio", "hbv.id", "hbcio.booking_id")
// //     .andWhere(function () {
// //     if (key) {
// //     this.andWhere("hbv.name", "like", `%${key}%`)
// //         .orWhere("hbv.email", "like", `%${key}%`)
// //         .orWhereRaw("JSON_EXTRACT(booking_halls, '$[*].name') LIKE ?",[`%${key}%`]
// //         );
// //     }
// //     if (user_id) {
// //     this.andWhere({ user_id });
// //     }
// //     if (booking_status) {
// //     this.andWhere({ booking_status });
// //     }
// //     if (event_date) {
// //         this.andWhere({ event_date });
// //     }
// //     if (from_date && to_date) {
// //         this.andWhereBetween("rbv.check_in_time", [from_date, endDate]);
// //     }
// //     })
// //     .orderBy("hbv.id", "desc");

// //     const total = await this.db("hall_booking_view as hbv")
// //     .withSchema(this.RESERVATION_SCHEMA)
// //     .leftJoin("hall_booking_check_in_out as hbcio", "hbv.id", "hbcio.booking_id")
// //     .count("hbv.id as total")
// //     .where("hbv.hotel_id", hotel_id)
// //     .andWhere(function () {
// //     if (key) {
// //     this.andWhere("hbv.name", "like", `%${key}%`)
// //         .orWhere("hbv.email", "like", `%${key}%`)
// //         .orWhereRaw(
// //         "JSON_EXTRACT(booking_halls, '$[*].name') LIKE ?",
// //         [`%${key}%`]
// //         );
// //     }
// //     if (user_id) {
// //         this.andWhere({ user_id });
// //         }
// //     if (booking_status) {
// //     this.andWhere({ booking_status });
// //     }
// //     if (event_date) {
// //         this.andWhere({ event_date });
// //     }
// //     if (from_date && to_date) {
// //         this.andWhereBetween("rbv.check_in_time", [from_date, endDate]);
// //     }
// //     });

// //     return { data, total: total[0].total };
// //     }

// //     // get single hall booking
// //     public async getSingleHallBooking(id: number, hotel_id: number) {
// //         return await this.db("hall_booking_view")
// //         .withSchema(this.RESERVATION_SCHEMA)
// //         .select("*")
// //         .where({ id })
// //         .andWhere({ hotel_id });
// //     }

// //     // insert hall booking check in
// //     public async insertHallBookingCheckIn( payload: InsertHallBookingCheckin) {
// //         return await this.db("hall_booking_check_in_out")
// //         .withSchema(this.RESERVATION_SCHEMA)
// //         .insert(payload);
// //     }

// //     // get all hall booking
// //     public async getAllHallBookingCheckIn(payload: {
// //     hotel_id: number;
// //     booking_id?: number;
// //     from_date?: string;
// //     to_date?: string;
// //     limit?: string;
// //     skip?: string;
// //     key?: string;
// //     }) {
// //     const { limit, skip, hotel_id, key, booking_id, from_date, to_date } = payload;

// //     const endDate = new Date(to_date as string);
// //     endDate.setDate(endDate.getDate() + 1);

// //     const dtbs = this.db("hall_booking_check_in_out as hbco");

// //     if (limit && skip) {
// //         dtbs.limit(parseInt(limit as string));
// //         dtbs.offset(parseInt(skip as string));
// //     }

// //     const data = await dtbs
// //         .select(
// //         "hbco.id",
// //         "u.name as name",
// //         "u.email as email",
// //         "b.id as booking_id",
// //         "b.booking_no",
// //         "hbco.check_in",
// //         "hbco.check_out",
// //         "hbco.event_date",
// //         "hbco.status",
// //         "hbco.created_at"
// //     )
// //     .withSchema(this.RESERVATION_SCHEMA)
// //     .leftJoin("hall_booking as b", "hbco.booking_id", "b.id")
// //     .leftJoin("user as u", "b.user_id", "u.id")
// //     .where("b.hotel_id", hotel_id)
// //     .andWhere(function () {
// //     if (key) {
// //         this.andWhere("b.booking_no", "like", `%${key}%`).orWhere(
// //         "u.name",
// //         "like",
// //         `%${key}%`
// //         );
// //     }
// //     })
// //     .andWhere(function () {
// //     if (booking_id) {
// //         this.andWhere("b.id", booking_id);
// //     }

// //     if (from_date && to_date) {
// //         this.andWhereBetween("hbco.created_at", [from_date, endDate]);
// //     }
// //     })
// //     .orderBy("hbco.id", "desc");

// //     const total = await this.db("hall_booking_check_in_out as hbco")
// //     .count("hbco.id as total")
// //     .withSchema(this.RESERVATION_SCHEMA)
// //     .leftJoin("hall_booking as b", "hbco.booking_id", "b.id")
// //     .where("b.hotel_id", hotel_id)
// //     .andWhere(function () {
// //     if (key) {
// //         this.andWhere("b.booking_no", "like", `%${key}%`).orWhere(
// //         "u.name",
// //         "like",
// //         `%${key}%`
// //         );
// //     }
// //     })
// //     .andWhere(function () {
// //     if (booking_id) {
// //         this.andWhere("b.id", booking_id);
// //     }

// //     if (from_date && to_date) {
// //         this.andWhereBetween("hbco.created_at", [from_date, endDate]);
// //     }
// //     });

// //     return {
// //         data,
// //         total: total[0].total,
// //     };
// //     }

// //     public async updateHallBooking(
// //         payload: { pay_status?: number; booking_status?: string; reserved_hall?: number },
// //         where: { id: number }
// //     ) {
// //         return await this.db("hall_booking")
// //         .withSchema(this.RESERVATION_SCHEMA)
// //         .update(payload)
// //         .where({ id: where.id });
// //     }

// //     // get single hall check in checkout
// //     public async getSingleHallBookingCheckIn(id: number, hotel_id: number) {
// //     return await this.db("hall_check_in_out_view")
// //         .withSchema(this.RESERVATION_SCHEMA)
// //         .select("*")
// //         .where({ hotel_id })
// //         .andWhere({ id });
// //     }

// //     // add hall booking check out
// //     public async updateBookingCheckOut(
// //         payload: { check_out: string; status: string },
// //         id: number
// //     ) {
// //         return await this.db("hall_booking_check_in_out")
// //         .withSchema(this.RESERVATION_SCHEMA)
// //         .update(payload)
// //         .where({ id });
// //     }

// //     // Get All Guest Model
// //     public async getAllGuest(payload: {
// //         limit?: string;
// //         skip?: string;
// //         key?: string;
// //         email: string;
// //         hotel_id: number;
// //     }) {
// //     const { key, hotel_id, limit, skip } = payload;

// //     const dtbs = this.db("user");

// //     if (limit && skip) {
// //     dtbs.limit(parseInt(limit as string));
// //     dtbs.offset(parseInt(skip as string));
// //     }

// //     const data = await dtbs
// //     .select(
// //         "id",
// //         "name",
// //         "email",
// //         "country",
// //         "city",
// //         "status",
// //         "last_balance",
// //         "created_at"
// //     )
// //     .withSchema(this.RESERVATION_SCHEMA)
// //     .where({ hotel_id })
// //     .andWhere(function () {
// //         if (key) {
// //         this.andWhere("name", "like", `%${key}%`)
// //             .orWhere("email", "like", `%${key}%`)
// //             .orWhere("country", "like", `%${key}%`)
// //             .orWhere("city", "like", `%${key}%`);
// //         }
// //     })
// //     .orderBy("id", "desc");

// //     const total = await this.db("user")
// //     .withSchema(this.RESERVATION_SCHEMA)
// //     .count("id as total")
// //     .where({ hotel_id })
// //     .andWhere(function () {
// //         if (key) {
// //         this.andWhere("name", "like", `%${key}%`)
// //             .orWhere("email", "like", `%${key}%`)
// //             .orWhere("country", "like", `%${key}%`)
// //             .orWhere("city", "like", `%${key}%`);
// //         }
// //     });

// //     return { data, total: total[0].total };
// //     }

// // }
// // export default HallBookingModel;