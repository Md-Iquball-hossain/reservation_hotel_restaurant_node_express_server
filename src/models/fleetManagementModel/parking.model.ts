
import { 
    IcreateParkingPayload, 
    IcreateVehicleParkingPayload, 
    IupdateParkingPayload, 
    IupdateVehicleParkingPayload
} from "../../appFleetManagement/utils/interfaces/parking.interface";
import { TDB } from "../../common/types/commontypes";
import Schema from "../../utils/miscellaneous/schema";

class ParkingModel extends Schema {
    private db: TDB;

    constructor(db: TDB) {
    super();
    this.db = db;
    }

    // Create Parking
    public async createParking(payload: IcreateParkingPayload) {
    return await this.db("parking")
        .withSchema(this.FLEET_SCHEMA)
        .insert(payload);
    }

    // Get all Parking
    public async getAllParking(payload: {
        key?: string;
        id?: number;
        parking_id?: number;
        parking_size?: string;
        status?: number;
        hotel_id?: number;
        limit?: string;
        skip?: string;
    }) {

    const { id, key, hotel_id, limit, skip , status, parking_size} =
    payload;

    const dtbs = this.db("parking as p");

    if (limit && skip) {
    dtbs.limit(parseInt(limit as string));
    dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs
    .withSchema(this.FLEET_SCHEMA)
    .select(
        "p.id",
        "p.parking_area",
        "p.parking_size",
        "p.par_slot_number",
        "p.status",
    )
    .where("p.hotel_id", hotel_id)
    .andWhere(function () {
        if (key) {
        this.andWhere("p.par_slot_number", 
            "like", 
            `%${key}%`)
        .orWhere(
            "p.parking_area",
            "like",
            `%${key}%`
        );
        }
        if (parking_size) {
        this.andWhere("p.parking_size", 
            "like", 
            `%${parking_size}%`);
        }
        if (status) {
        this.andWhere("p.status", 
            "like", 
            `%${status}%`);
        }
        if (id) {
        this.andWhere("p.id", 
            "like", 
            `%${id}%`);
        }
    })
    .orderBy("p.id", "desc");

    const total = await this.db("parking as p")
    .withSchema(this.FLEET_SCHEMA)
    .count("p.id as total")
    .where("p.hotel_id", hotel_id)
    .andWhere(function () {
        if (key) {
        this.andWhere("p.par_slot_number", 
            "like", 
            `%${key}%`)
        .orWhere(
            "p.parking_area",
            "like",
            `%${key}%`
        );
        }
        if (status) {
        this.andWhere("p.status", 
            "like", 
            `%${status}%`);
        }
        if (id) {
            this.andWhere("p.id", 
            "like", 
            `%${id}%`);
        }
    })
    return { data, total: total[0].total };
    }

    // get single parking
    public async getSingleParking(id: number, hotel_id: number) {
        return await this.db("parking_view")
            .withSchema(this.FLEET_SCHEMA)
            .select("*")
            .where({id})
            .andWhere({hotel_id})
    }

    // Update Parking
    public async updateParking(id: number,
        payload: IupdateParkingPayload) {
        return await this.db("parking")
        .withSchema(this.FLEET_SCHEMA)
        .where({ id })
        .update(payload);
    }

    // Get all Vehicle Parking
    public async getAllVehicleParking(payload: {
        status?: string;
        from_date?: string;
        to_date?: string;
        vehicle_id?:string;
        limit?: string;
        skip?: string;
    }) {

    const { limit, skip , status, vehicle_id, from_date, to_date } =
    payload;

    const dtbs = this.db("veh_parking as vp");

    if (limit && skip) {
    dtbs.limit(parseInt(limit as string));
    dtbs.offset(parseInt(skip as string));
    }

    const endDate = new Date(to_date as string);
    endDate.setDate(endDate.getDate());

    const data = await dtbs
    .withSchema(this.FLEET_SCHEMA)
    .select(
        "vp.id",
        "v.license_plate as vehicle",
        "p.par_slot_number as parking_number",
        "vp.assigned_time as parking_date",
        "vp.left_time",
        "vp.status",
    )
    .leftJoin("parking as p", "vp.parking_id", "p.id")
    .leftJoin("vehicles as v", "vp.vehicle_id", "v.id")
    .andWhere(function () {
        if (status) {
            this.andWhere("vp.status", 
            "like", 
            `%${status}%`);
        }
        if (vehicle_id) {
            this.andWhere("vp.vehicle_id", 
            "like", 
            `%${vehicle_id}%`);
        }
        if (from_date && to_date) {
            this.andWhereBetween(
        "vp.created_at", [from_date, endDate]);
        }
    })
    .orderBy("vp.id", "desc");

    const total = await this.db("veh_parking as vp")
    .withSchema(this.FLEET_SCHEMA)
    .count("vp.id as total")
    .leftJoin("parking as p", "vp.parking_id", "p.id")
    .leftJoin("vehicles as v", "vp.vehicle_id", "v.id")
    .andWhere(function () {
        if (status) {
            this.andWhere("vp.status", 
            "like", 
            `%${status}%`);
        }
        if (vehicle_id) {
            this.andWhere("vp.vehicle_id",
            "like", 
            `%${vehicle_id}%`);
        }
        if (from_date && to_date) {
            this.andWhereBetween(
        "vp.created_at", [from_date, endDate]);
        }
    })
    return { data, total: total[0].total };
    }

    // Assign vehicle in Parking
    public async createVehicleParking
    (payload: IcreateVehicleParkingPayload) {
        return await this.db("veh_parking")
            .withSchema(this.FLEET_SCHEMA)
            .insert(payload);
        }

    // Update vehicle in Parking
    public async updateVehiceInParking(id: number,
        payload: IupdateVehicleParkingPayload) {
        return await this.db("veh_parking")
        .withSchema(this.FLEET_SCHEMA)
        .where({ id})
        .update(payload);
    }

    // get single vehicle from parking
    public async getSingleVehicleParking(id: number) {
        return await this.db("veh_parking")
            .withSchema(this.FLEET_SCHEMA)
            .select("*")
            .where("id", id)
    }

}
export default ParkingModel;
