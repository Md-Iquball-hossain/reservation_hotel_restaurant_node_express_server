    // RoomModel
    import { IupdateroomPayload } from "../../appAdmin/utlis/interfaces/Room.interfaces";
    import { IuserPayload } from "../../appAdmin/utlis/interfaces/guest.interface";
    import { IBookingRooms, IRoomBooking } from "../../appAdmin/utlis/interfaces/roomBooking.interface";
    import { IUpdateUser, IUpdateUserPayload } from "../../appM360/utlis/interfaces/hotel-user.interface";
    import { TDB } from "../../common/types/commontypes";
    import Schema from "../../utils/miscellaneous/schema";
    
    class ClientModel extends Schema {
        private db: TDB;
        constructor(db: TDB) {
        super();
        this.db = db;
        }

    //=============== Guest ================ //

    // Create user
    public async createUser(payload: IuserPayload) {
    return await this.db("user")
        .withSchema(this.RESERVATION_SCHEMA)
        .insert(payload);
    }

    // get Guest email
    public async getAllGuestEmail(payload: { email: string; hotel_id: number }) {
    const { email, hotel_id } = payload;

    const dtbs = this.db("user");

    const data = await dtbs
        .withSchema(this.RESERVATION_SCHEMA)
        .where({ "user.hotel_id": hotel_id })
        .andWhere({ "user.email": email })
        .orderBy("id", "desc");

    return { data };
    }

    // Get User single profile
    public async getSingleUser(where: {
    email?: string;
    id?: number;
    hotel_id?: number;
    }) {
    const { email, id, hotel_id } = where;
    return await this.db("user")
        .select("*")
        .withSchema(this.RESERVATION_SCHEMA)
        .where(function () {
        if (id) {
            this.where("id", id);
        }
        if (email) {
            this.where("email", email);
        }
        if (hotel_id) {
            this.andWhere("hotel_id", hotel_id);
        }
        });
    }

    //   update single guest
    public async updateSingleUser(
    payload: { last_balance?: number},
    where: { hotel_id?: number; id?: number },
    ) {
    const { hotel_id, id } = where;
    return await this.db("user")
        .withSchema(this.RESERVATION_SCHEMA)
        .update(payload)
        .where({ hotel_id })
        .andWhere({ id })
    }

    public async updateUser(
        payload: IUpdateUserPayload,
        where: { email: string }
    ) {
    return await this.db("user")
        .withSchema(this.RESERVATION_SCHEMA)
        .update(payload)
        .where({ email: where.email });
    }

    //=============== Room ================ //

    // Get All room
    public async getAllRoom(payload: {
    id?:number;
    hotel_id: number;
    key?: string;
    availability?: string;
    refundable?: string;
    limit?: string;
    skip?: string;
    adult?: string;
    child?: string;

    rooms?: number[];
    }) {
    const { key, availability, refundable, limit, skip, hotel_id, adult, child, rooms } = payload;

    const dtbs = this.db("room_view as rv");

    if (limit && skip) {
        dtbs.limit(parseInt(limit as string));
        dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs

    .withSchema(this.RESERVATION_SCHEMA)
    .select(
    "rv.room_id as id",
    "rv.room_type",
    "rv.bed_type",
    "rv.refundable",
    "rv.rate_per_night",
    "rv.discount",
    "rv.discount_percent",
    "rv.child",
    "rv.adult",
    "rv.availability",
    "rv.room_description",
    "rv.room_amenities",
    "rv.room_images",
    )
    .where({ hotel_id })
    .andWhere(function () {
    if (key) {
        this.andWhere("rv.room_number", "like", `%${key}%`)
        .orWhere("rv.room_type", "like", `%${key}%`)
        .orWhere("rv.bed_type", "like", `%${key}%`);
    }
    })
    .andWhere(function () {
    if (availability) {
        this.andWhere({ availability });
    }
    if (refundable) {
        this.andWhere({ refundable });
    }
    if (child) {
        this.andWhere({ child });
    }
    if (adult) {
        this.andWhere({ adult });
    }
    if (rooms) {
        this.whereIn("rv.room_id", rooms);
    }

    })
    .orderBy("rv.room_id", "desc");

    const total = await this.db("room_view as rv")
    .withSchema(this.RESERVATION_SCHEMA)
    .count("rv.room_id as total")
    .where({ hotel_id })
    .andWhere(function () {
    if (key) {
        this.andWhere("rv.room_number", "like", `%${key}%`)
        .orWhere("rv.room_type", "like", `%${key}%`)
        .orWhere("rv.bed_type", "like", `%${key}%`);
    }
    })
    .andWhere(function () {
    if (availability) {
        this.andWhere({ availability });
    }
    if (refundable) {
        this.andWhere({ refundable });
    }
    if (child) {
        this.andWhere({ child });
    }
    if (adult) {
        this.andWhere({ adult });
    }
    if (rooms) {
        this.whereIn("rv.room_id", rooms);
    }
    
    });

    return { data, total: total[0].total };
    }

    // Get all booking room
    public async getAllBookingRoom(payload: {
        hotel_id: number;
        key?: string;
        from_date?: string;
        to_date?: string;
        availability?: string;
        refundable?: string;
        limit?: string;
        skip?: string;
        occupancy?: string;
        rooms?: number[];
    }) {
    const { limit, skip, hotel_id, to_date, from_date } = payload;

    const endDate = new Date(to_date as string);
    endDate.setDate(endDate.getDate() + 1);

    const dtbs = this.db("room_booking_view");

    if (limit && skip) {
    dtbs.limit(parseInt(limit as string));
    dtbs.offset(parseInt(skip as string));
    }

    return await dtbs
    .select(
        "id",
        "hotel_id",
        "check_in_time",
        "check_out_time",
        "booking_rooms"
    )
    .withSchema(this.RESERVATION_SCHEMA)
    .where({ hotel_id })
    .andWhere({ reserved_room: 1 })
    .andWhere(function () {
        if (from_date && to_date) {
        this.andWhereBetween("check_in_time", [from_date, endDate]);
        }
    })
    .andWhereNot({ status: "left" });
    }

    // Get single room
    public async getSingleRoom(
    hotel_id: number, 
    room_id?: number) {
    return await this.db("room_view")
        .withSchema(this.RESERVATION_SCHEMA)
        .where({ room_id })
        .andWhere({ hotel_id});
    }

    // Get all room images
    public async getHotelRoomImages(payload: {
        hotel_id:number;
        limit?: string;
        skip?: string;
        }) {
        const {  limit, skip, hotel_id} = payload;

        const dtbs = this.db("hotel_room as hr");

        if (limit && skip) {
            dtbs.limit(parseInt(limit as string));
            dtbs.offset(parseInt(skip as string));
        }

        const data = await dtbs
        .withSchema(this.RESERVATION_SCHEMA)

        .select(
            "hri.id",
            "hri.room_id",
            "hr.room_number",
            "hri.photo"
        )
        .rightJoin("hotel_room_images as hri", "hr.id", "hri.room_id")
        .where({hotel_id})

        const total = await dtbs
        .withSchema(this.RESERVATION_SCHEMA)
        .where({hotel_id})

        return {data};
    }

    //=============== Room Booking ================ //
    
    // insert room booking
    public async insertRoomBooking(payload: IRoomBooking) {
        return await this.db("room_booking")
        .withSchema(this.RESERVATION_SCHEMA)
        .insert(payload);
    }
    
    // insert booking rooms
    public async insertBookingRoom(payload: IBookingRooms[]) {
        return await this.db("booking_rooms")
        .withSchema(this.RESERVATION_SCHEMA)
        .insert(payload);
    }
    
    // get all room booking
    public async getAllRoomBooking(payload: {
        limit?: string;
        skip?: string;
        name: string;
        hotel_id: number;
        status: string;
        user_id?: string;
    }) {
        const { limit, skip, hotel_id, name, status, user_id } = payload;
    
        const dtbs = this.db("room_booking_view");
        
    
        if (limit && skip) {
        dtbs.limit(parseInt(limit as string));
        dtbs.offset(parseInt(skip as string));
        }
    
    const data = await dtbs
    .withSchema(this.RESERVATION_SCHEMA)
    .select(
        "id",
        "booking_no",
        "user_id",
        "name",
        "photo",
        "email",
        "check_in_time",
        "check_out_time",
        "number_of_nights",
        "total_occupancy",
        "extra_charge",
        "grand_total",
        "status",
        "check_in_out_status",
        "booking_rooms"
    )
    .where("hotel_id", hotel_id)
    .andWhere(function () {
        if (name) {
        this.andWhere("name", "like", `%${name}%`)
            .orWhere("email", "like", `%${name}%`)
            .orWhereRaw(
            "JSON_EXTRACT(booking_rooms, '$[*].room_number') LIKE ?",
            [`%${name}%`]
            );
        }
        if (user_id) {
        this.andWhere({ user_id });
        }
        if (status) {
        this.andWhere({ status });
        }
    })
    .orderBy("id", "desc");

    const total = await this.db("room_booking_view")
    .withSchema(this.RESERVATION_SCHEMA)
    .count("id as total")
    .where("hotel_id", hotel_id)
    .andWhere(function () {
        if (name) {
        this.andWhere("name", "like", `%${name}%`)
            .orWhere("email", "like", `%${name}%`)
            .orWhereRaw(
            "JSON_EXTRACT(booking_rooms, '$[*].room_number') LIKE ?",
            [`%${name}%`]
            );
        }

        if (status) {
        this.andWhere({ status });
        }
    });
    
        return { data, total: total[0].total };
    }

    // update many room
    public async updateManyRoom(
        roomIds: number[],
        hotel_id: number,
        payload: IupdateroomPayload
    ) {
        return await this.db("hotel_room")
        .withSchema(this.RESERVATION_SCHEMA)
        .update(payload)
        .whereIn("id", roomIds)
        .andWhere({ hotel_id });
    }
    
    // get last room booking id
    public async getLastRoomBookingId(hotel_id: number) {
        return await this.db("room_booking")
        .withSchema(this.RESERVATION_SCHEMA)
        .select("id")
        .where({ hotel_id })
        .orderBy("id", "desc")
        .limit(1);
    }
    // get single room booking
    public async getSingleRoomBooking(id: number, hotel_id: number) {
        return await this.db("room_booking_view")
        .withSchema(this.RESERVATION_SCHEMA)
        .select("*")
        .where({ id })
        .andWhere({ hotel_id });
    }

    }
    export default ClientModel;