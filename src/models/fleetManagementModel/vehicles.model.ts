

import { 
    IcreateVehiclePayload, 
    IupdateVehiclePayload 
    } from "../../appFleetManagement/utils/interfaces/vehicles.interface";
import { 
    IcreateFuelRefillPayload 
    } from "../../appFleetManagement/utils/interfaces/fuel.interface";
import { 
    IcreateMaintenancePayload, 
    IupdateMaintenancePayload 
    } from "../../appFleetManagement/utils/interfaces/maintenance.interface";
import { 
    IcreateTripPayload 
    } from "../../appFleetManagement/utils/interfaces/trip.interface";
import { TDB } from "../../common/types/commontypes";
import Schema from "../../utils/miscellaneous/schema";

class VehiclesModel extends Schema {
    private db: TDB;

    constructor(db: TDB) {
    super();
    this.db = db;
    }

    //=================== vehicle ======================//

    // Create vehicle
    public async createVehicle(payload: IcreateVehiclePayload) {
    return await this.db("vehicles")
        .withSchema(this.FLEET_SCHEMA)
        .insert(payload);
    }

    // Get all vehicle
    public async getAllVehicles(payload: {
        key?: string;
        status?: string;
        hotel_id: number;
        limit?: string;
        skip?: string;
    }) {

    const { key, hotel_id, status, limit, skip} =
    payload;

    const dtbs = this.db("vehicles as v");

    if (limit && skip) {
    dtbs.limit(parseInt(limit as string));
    dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs
    .withSchema(this.FLEET_SCHEMA)
    .select(
        "v.id",
        "v.reg_number",
        "v.vehicle_type",
        "v.manufacturer",
        "v.model",
        "v.mileage",
        "v.license_plate",
        "v.fuel_type",
        "v.fuel_quantity",
        "v.vehicle_photo",
        "o.name as owner_name",
        "v.status"
    )
    .where("v.hotel_id", hotel_id)
    .leftJoin("owners as o", "v.owner_id", "o.id")
    .andWhere(function () {
    if (key) {
        this.andWhere("v.reg_number", "like", `%${key}%`)
        .orWhere(
            "v.model",
            "like",
            `%${key}%`)
        .orWhere(
            "v.vehicle_type",
            "like",
            `%${key}%`)
        .orWhere(
            "v.license_plate",
            "like",
            `%${key}%`
        );
        }
    if (status) {
        this.andWhere("v.status", "like", `%${status}%`);
    }
    })
    .orderBy("v.id", "desc");

    const total = await this.db("vehicles as v")
    .withSchema(this.FLEET_SCHEMA)
    .count("v.id as total")
    .where("v.hotel_id", hotel_id)
    .leftJoin("owners as o", "v.owner_id", "o.id")
    .andWhere(function () {
        if (key) {
        this.andWhere("v.reg_number", "like", `%${key}%`)
        .orWhere(
            "v.model",
            "like",
            `%${key}%`)
        .orWhere(
            "v.vehicle_type",
            "like",
            `%${key}%`)
        .orWhere(
            "v.license_plate",
            "like",
            `%${key}%`
            );
        }
    if (status) {
        this.andWhere("v.status", "like", `%${status}%`);
    }
    })

    return { data, total: total[0].total };
    }

    // check unique vehicles
    public async checkVehicles(reg_number: string,
        license_plate: string, hotel_id: number) {
        return this.db("vehicles")
        .withSchema(this.FLEET_SCHEMA)
        .where({
            reg_number: reg_number,
            license_plate: license_plate,
            hotel_id: hotel_id,
        })
        .first();
    }

    // get single vehicle
    public async getSingleVehicle(id: number, hotel_id: number) {
        return await this.db("vehicle_view as vv")
        .withSchema(this.FLEET_SCHEMA)
        .select("*")
        .where("vv.id", id)
        .andWhere("vv.hotel_id", hotel_id);
    }

    // Update vehicle
    public async updateVehicle(id: number,
        payload: IupdateVehiclePayload) 
    {
        return await this.db("vehicles")
        .withSchema(this.FLEET_SCHEMA)
        .where({ id })
        .update(payload);
    }

    //=================== Fuel ======================//

    // Create Fuel Refill
    public async createFuelRefill(
        payload: IcreateFuelRefillPayload) {
        return await this.db("fuel_refill")
            .withSchema(this.FLEET_SCHEMA)
            .insert(payload);
        }

    // Get all fuel refill
    public async getAllFuelRefill(payload: {
        key?: string;
        from_date: string;
        to_date: string;
        hotel_id: number;
        limit?: string;
        skip?: string;
    }) {

    const { key, hotel_id, limit, from_date, to_date, skip } =
    payload;

    const dtbs = this.db("fuel_refill as fr");

    if (limit && skip) {
    dtbs.limit(parseInt(limit as string));
    dtbs.offset(parseInt(skip as string));
    }

    const endDate = new Date(to_date as string);
    endDate.setDate(endDate.getDate());

    const data = await dtbs
    .withSchema(this.FLEET_SCHEMA)
    .select(
        "fr.id",
        "v.license_plate as vehicle_number",
        "fr.filling_station_name",
        "fr.fuel_quantity",
        "fr.per_quantity_amount as price",
        "fr.total_amount",
        "fr.refilled_by",
        "fr.refilled_date",
        "fr.documents"
    )

    .where("fr.hotel_id", hotel_id)
    .leftJoin("vehicles as v", "fr.vehicle_id", "v.id")
    .andWhere(function () {
        if (key) {
            this.andWhere("fr.filling_station_name",
            "like", 
            `%${key}%`).orWhere(
                "fr.refilled_by",
                "like",
                `%${key}%`
            )}
        if (from_date && to_date) {
            this.andWhereBetween(
        "fr.refilled_date", [from_date, endDate]);
        }
    })
    .orderBy("fr.id", "desc");

    const total = await this.db("fuel_refill as fr")
    .withSchema(this.FLEET_SCHEMA)
    .count("fr.id as total")
    .where("fr.hotel_id", hotel_id)
    .leftJoin("vehicles as v", "fr.vehicle_id", "v.id")
    .andWhere(function () {
        if (key) {
        this.andWhere("fr.filling_station_name",
        "like", 
        `%${key}%`).orWhere(
            "fr.refilled_by",
            "like",
            `%${key}%`
        )}
        if (from_date && to_date) {
            this.andWhereBetween(
        "fr.refilled_date", [from_date, endDate]);
        }
    })

    return { data, total: total[0].total };
    }

    //=================== Maintenance ======================//

    // Create Maintenance
    public async createMaintenance(
        payload: IcreateMaintenancePayload) {
        return await this.db("maintenance")
            .withSchema(this.FLEET_SCHEMA)
            .insert(payload);
    }

    // Get all Maintenance
    public async getAllMaintenance(payload: {
        key?: string;
        from_date: string;
        to_date: string;
        hotel_id: number;
        limit?: string;
        skip?: string;
    }) {

    const { key, hotel_id, limit, from_date, to_date, skip } =
    payload;

    const dtbs = this.db("maintenance as m");

    if (limit && skip) {
    dtbs.limit(parseInt(limit as string));
    dtbs.offset(parseInt(skip as string));
    }

    const endDate = new Date(to_date as string);
    endDate.setDate(endDate.getDate());

    const data = await dtbs
    .withSchema(this.FLEET_SCHEMA)
    .select(
        "m.id",
        "m.maintenance_date",
        "m.maintenance_type",
        "m.maintenance_cost",
        "m.documents"
    )
    .where("m.hotel_id", hotel_id)
    .andWhere(function () {
        if (key) {
            this.andWhere("m.maintenance_type",
            "like", 
            `%${key}%`)
            }
        if (from_date && to_date) {
            this.andWhereBetween(
        "m.created_at", [from_date, endDate]);
        }
    })
    .orderBy("m.id", "desc");

    const total = await this.db("maintenance as m")
    .withSchema(this.FLEET_SCHEMA)
    .count("m.id as total")
    .where("m.hotel_id", hotel_id)
    .andWhere(function () {
        if (key) {
        this.andWhere("m.maintenance_type",
        "like", 
        `%${key}%`)
        }
        if (from_date && to_date) {
            this.andWhereBetween(
        "m.created_at", [from_date, endDate]);
        }
    })

    return { data, total: total[0].total };
    }

    // Update Maintenance
    public async updateMaintenance(id: number,
        payload: IupdateMaintenancePayload) 
    {
        return await this.db("maintenance")
        .withSchema(this.FLEET_SCHEMA)
        .where({ id })
        .update(payload);
    }

    //=================== Trip ======================//

    // Create Trip
    public async createTrip(
        payload: IcreateTripPayload) {
        return await this.db("trips")
            .withSchema(this.FLEET_SCHEMA)
            .insert(payload);
        }
    
    // Get Trip
    public async getAllTrip(payload: {
        key?: string;
        from_date: string;
        to_date: string;
        hotel_id: number;
        limit?: string;
        skip?: string;
    }) {

    const { key, hotel_id, limit, from_date, to_date, skip } =
    payload;

    const dtbs = this.db("trips as t");

    if (limit && skip) {
    dtbs.limit(parseInt(limit as string));
    dtbs.offset(parseInt(skip as string));
    }

    const endDate = new Date(to_date as string);
    endDate.setDate(endDate.getDate());

    const data = await dtbs
    .withSchema(this.FLEET_SCHEMA)
    .select(
        "t.id",
        "v.license_plate as vehicle_number",
        "d.name as driver_name",
        "t.trip_start",
        "t.trip_end",
        "t.start_location",
        "t.end_location",
        "t.fuel_usage",
        "t.trip_cost",
        "t.distance"
    )

    .where("t.hotel_id", hotel_id)
    .leftJoin("vehicles as v", "t.vehicle_id", "v.id")
    .leftJoin("drivers as d", "t.driver_id", "d.id")
    .andWhere(function () {
        if (key) {
            this.andWhere("v.license_plate",
            "like", 
            `%${key}%`).orWhere(
                "d.name",
                "like",
                `%${key}%`
            )}
        if (from_date && to_date) {
            this.andWhereBetween(
        "t.trip_start", [from_date, endDate]);
        }
    })
    .orderBy("t.id", "desc");

    const total = await this.db("trips as t")
    .withSchema(this.FLEET_SCHEMA)
    .count("t.id as total")
    .where("t.hotel_id", hotel_id)
    .leftJoin("vehicles as v", "t.vehicle_id", "v.id")
    .leftJoin("drivers as d", "t.driver_id", "d.id")
    .andWhere(function () {
        if (key) {
        this.andWhere("v.license_plate",
        "like", 
        `%${key}%`).orWhere(
            "d.name",
            "like",
            `%${key}%`
        )}
        if (from_date && to_date) {
            this.andWhereBetween(
        "t.trip_start", [from_date, endDate]);
        }
    })

    return { data, total: total[0].total };
    }

}
export default VehiclesModel;
