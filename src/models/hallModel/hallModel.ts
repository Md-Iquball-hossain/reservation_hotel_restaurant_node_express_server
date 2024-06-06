    // Hall Model
    import { IHallAmenities, IHallImage, IcreateHallBody, IupdateHallPayload } from "../../appAdmin/utlis/interfaces/hall.interface";
    import { TDB } from "../../common/types/commontypes";
    import Schema from "../../utils/miscellaneous/schema";
    
    class HallModel extends Schema {
    private db: TDB;
    constructor(db: TDB) {
        super();
        this.db = db;
    }

    // create Hall
    public async createHall(payload: IcreateHallBody) {
    return await this.db("hall")
        .withSchema(this.RESERVATION_SCHEMA)
        .insert(payload);
    }

    // Hall Name fetch
    public async getAllHallName(name: string,hotel_id: number){
    return this.db("hall")
        .withSchema(this.RESERVATION_SCHEMA)
        .where({
        name: name,
        hotel_id: hotel_id,
        })
        .first();
    }

    // insert Hall room amenities
    public async insertHallRoomAmenities(payload: IHallAmenities[]
    ) {
    return await this.db("hall_room_amenities")
        .withSchema(this.RESERVATION_SCHEMA)
        .insert(payload);
    }

    // Create Hall image
    public async createHallImage(payload: IHallImage[]) {
    return await this.db("hall_images")
        .withSchema(this.RESERVATION_SCHEMA)
        .insert(payload);
    }

    // Get All hall
    public async getAllHall(payload: {
        key?: string;
        hall_status?: string;
        limit?: string;
        skip?: string;
        hotel_id: number;
        halls?: number[];
    }) {
        const {
            key,
            hall_status,
            limit,
            skip,
            halls,
            hotel_id
        } = payload;
    
        const dtbs = this.db("hall_view as hv");
    
        if (limit) {
            dtbs.limit(parseInt(limit as string));
        }
        if (skip) {
            dtbs.offset(parseInt(skip as string));
        }
    
        const data = await dtbs
            .withSchema(this.RESERVATION_SCHEMA)
            .select(
                "hv.hall_id as id",
                "hv.name",
                "hv.hall_size",
                "hv.rate_per_hour",
                "hv.capacity",
                "hv.location",
                "hv.hall_amenities",
                "hv.hall_images",
                "hv.hall_status",
                "hv.created_at",
            )
            .where({ hotel_id })
            .andWhere(function () {
                if (key) {
                    this.andWhere("hv.name", "like", `%${key}%`);
                }
                if (hall_status) {
                    this.andWhere("hv.hall_status", "like", `%${hall_status}%`);
                }
                if (halls) {
                    this.whereIn("hv.hall_id", halls);
                }
            })
            .orderBy("hv.hall_id", "desc");
    
        const total = await this.db("hall_view as hv")
            .withSchema(this.RESERVATION_SCHEMA)
            .count("hv.hall_id as total")
            .where({ hotel_id })
            .andWhere(function () {
                if (key) {
                    this.andWhere("hv.name", "like", `%${key}%`);
                }
                if (hall_status) {
                    this.andWhere("hv.hall_status", "like", `%${hall_status}%`);
                }
                if (halls) {
                    this.whereIn("hv.hall_id", halls);
                }
            });
    
        return { data, total: total[0].total };
    }
    

    // Get all booking hall
    public async getAllBookingHall(payload: {
        hotel_id: number;
        start_time?: string;
        end_time?: string;
        event_date?: string;
        limit?: string;
        skip?: string;
        halls?: number[];
    }) {
        const {
            limit,
            skip,
            hotel_id,
            end_time,
            event_date,
            start_time
        } = payload;
    
        const dtbs = this.db("hall_booking_view");
    
        if (limit) {
            dtbs.limit(parseInt(limit as string));
        }
        if (skip) {
            dtbs.offset(parseInt(skip as string));
        }
    
        return await dtbs
            .select(
                "id",
                "hotel_id",
                "start_time",
                "end_time",
                "event_date",
                "name",
                "email",
                "grand_total",
                "due",
                "user_last_balance",
                "booking_halls"
            )
            .withSchema(this.RESERVATION_SCHEMA)
            .where((qb) => {
                qb.andWhere({ hotel_id });
                qb.andWhere({ reserved_hall: 1 });
                qb.andWhere({ event_date });
                qb.andWhereNot({ booking_status: "left" });
                if (start_time && end_time) {
                    qb.andWhereBetween("start_time", [start_time, end_time]);
                }
            });
    }

    // get all booking hall second query avaibility with checkout
    public async getAllBookingHallForSdQueryAvailblityWithCheckout(payload: {
        hotel_id: number;
        key?: string;
        start_time: string;
        end_time: string;
        event_date?: string;
        limit?: string;
        skip?: string;
        halls?: number[];
    }) {
        const {
            limit,
            skip,
            hotel_id,
            start_time,
            end_time,
            event_date
        } = payload;
    
        const dtbs = this.db("hall_booking_view");
    
        if (limit) {
            dtbs.limit(parseInt(limit as string));
        }
        if (skip) {
            dtbs.offset(parseInt(skip as string));
        }
    
        return await dtbs
            .select(
                "id",
                "hotel_id",
                "start_time",
                "end_time",
                "event_date",
                "name",
                "email",
                "grand_total",
                "due",
                "user_last_balance",
                "booking_halls"
            )
            .withSchema(this.RESERVATION_SCHEMA)
            .where((qb) => {
                qb.andWhere({ hotel_id });
                qb.andWhere({ reserved_hall: 1 });
                qb.andWhere({ event_date });
                qb.andWhereNot({ booking_status: "left" });
                if (start_time && end_time) {
                qb.andWhereNotBetween("start_time", [start_time, end_time]);
                qb.andWhere("end_time", ">", start_time)
                .andWhere(
                    "start_time",
                    "<",
                    end_time
                );
                
            }
            });
    }

    // Get single hall
    public async getSingleHall (hotel_id: number, hall_id: number) {
        return await this.db("hall_view")
        .withSchema(this.RESERVATION_SCHEMA)
        .where({ hall_id })
        .andWhere({ hotel_id });
    }

    // update hotel Hall
    public async updateHall(
        hall_id: number,
        hotel_id: number,
        payload: IupdateHallPayload
    ) {
        return await this.db("hall")
        .withSchema(this.RESERVATION_SCHEMA)
        .update(payload)
        .where({ id: hall_id })
        .andWhere({ hotel_id });
    }

    // insert hall's new photo
    public async insertHallImage(payload: IHallImage[]) {
    return await this.db("hall_images")
        .withSchema(this.RESERVATION_SCHEMA)
        .insert(payload);
    }

    // remove room photo
    public async deleteHallImage(payload: number[], hall_id: number) {
    return await this.db("hall_images")
        .withSchema(this.RESERVATION_SCHEMA)
        .delete()
        .whereIn("id", payload)
        .andWhere("hall_id", hall_id);
    }

    // update many hall
    public async updateManyHall(
        hall_id: number[],
        hotel_id: number,
        payload: IupdateHallPayload
    ) {
        return await this.db("hall")
        .withSchema(this.RESERVATION_SCHEMA)
        .update(payload)
        .whereIn("id", hall_id)
        .andWhere({ hotel_id });
    }

    // get all Hall Amenities
    public async getAllHallAmenities(
        hall_id: number,
        hotel_id: number,
        amenity_id: number[]){
        return await this.db("hall_room_amenities")
            .withSchema(this.RESERVATION_SCHEMA)
            .where({ hall_id, hotel_id })
            .whereIn("amenity_id", amenity_id)
            .select('hall_id', 'amenity_id');
    }

    // delete hall amnities
    public async deleteHallAmenities(payload: [], hall_id: number) {
        return await this.db("hall_room_amenities")
        .withSchema(this.RESERVATION_SCHEMA)
        .delete()
        .whereIn("id", payload)
        .andWhere("hall_id", hall_id)
    }

    }
    export default HallModel;

