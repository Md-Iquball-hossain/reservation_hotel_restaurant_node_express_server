
import { IcreateDriverPayload, IupdateDriverPayload } from "../../appFleetManagement/utils/interfaces/driver.interface";
import { 
    IcreateOwnerPayload, 
    IupdateOwnerPayload 
} from "../../appFleetManagement/utils/interfaces/owner.interface";
import { TDB } from "../../common/types/commontypes";
import Schema from "../../utils/miscellaneous/schema";

class FleetCommonModel extends Schema {
    private db: TDB;

    constructor(db: TDB) {
    super();
    this.db = db;
    }

    //=================== Owner ======================//

    // Create owners
    public async createOwner(payload: IcreateOwnerPayload) {
    return await this.db("owners")
        .withSchema(this.FLEET_SCHEMA)
        .insert(payload);
    }

    // Get all Owner
    public async getAllOwner(payload: {
        id?: number;
        key?: string;
        hotel_id: number;
        limit?: string;
        skip?: string;
    }) {

    const { id, key, hotel_id, limit, skip } =
    payload;

    const dtbs = this.db("owners as o");

    if (limit && skip) {
    dtbs.limit(parseInt(limit as string));
    dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs
    .withSchema(this.FLEET_SCHEMA)
    .select(
        "o.id",
        "o.name",
        "o.email",
        "o.phone",
        "o.address",
        "o.occupation",
        "o.photo",
        "o.status"
    )
    .where("o.hotel_id", hotel_id)
    .andWhere(function () {
        if (key) {
        this.andWhere("o.name", "like", `%${key}%`).orWhere(
            "o.phone",
            "like",
            `%${key}%`
        );
        }
        if (id) {
            this.andWhere("o.id", "like", `%${id}%`);
        }
    })
    .orderBy("o.id", "desc");

    const total = await this.db("owners as o")
    .withSchema(this.FLEET_SCHEMA)
    .count("o.id as total")
    .where("o.hotel_id", hotel_id)
    .andWhere(function () {
        if (key) {
        this.andWhere("o.name", "like", `%${key}%`).orWhere(
            "o.phone",
            "like",
            `%${key}%`
        );
        }
        if (id) {
            this.andWhere("o.id", "like", `%${id}%`);
        }
    })

    return { data, total: total[0].total };
    }

    // get single owner
    public async getSingleOwner(id: number, hotel_id: number) {
        return await this.db("owner_view as ov")
            .withSchema(this.FLEET_SCHEMA)
            .select("*")
            .where("ov.id", id)
            .andWhere("ov.hotel_id", hotel_id);
    }

    // Update owner
    public async updateOwner(id: number,
        payload: IupdateOwnerPayload) 
    {
        return await this.db("owners")
        .withSchema(this.FLEET_SCHEMA)
        .where({ id })
        .update(payload);
    }

    //=================== Driver ======================//

    // Create Driver
    public async createDriver(payload: IcreateDriverPayload) {
    return await this.db("drivers")
        .withSchema(this.FLEET_SCHEMA)
        .insert(payload);
    }

    // Get all Driver
    public async getAllDriver(payload: {
        key?: string;
        id?: number;
        hotel_id: number;
        limit?: string;
        phone?: string;
        status?: number;
        skip?: string;
    }) {

    const { key, id, hotel_id, limit, skip, status } =
    payload;

    const dtbs = this.db("drivers as d");

    if (limit && skip) {
    dtbs.limit(parseInt(limit as string));
    dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs
    .withSchema(this.FLEET_SCHEMA)
    .select(
        "d.id",
        "d.name",
        "d.phone",
        "d.photo",
        "d.license_class",
        "d.licence_number",
        "d.year_of_experience",
        "d.expiry_date",
        "d.status"
    )
    .where("d.hotel_id", hotel_id)
    .andWhere(function () {
        if (key) {
        this.andWhere("d.name", "like", `%${key}%`).orWhere(
            "d.phone",
            "like",
            `%${key}%`
        );
        }
        if (status) {
            this.andWhere("d.status", "like", `%${status}%`);
        }
        if (id) {
            this.andWhere("d.id", "like", `%${id}%`);
        }
    })
    .orderBy("d.id", "desc");

    const total = await this.db("drivers as d")
    .withSchema(this.FLEET_SCHEMA)
    .count("d.id as total")
    .where("d.hotel_id", hotel_id)
    .andWhere(function () {
        if (key) {
        this.andWhere("d.name", "like", `%${key}%`).orWhere(
            "d.phone",
            "like",
            `%${key}%`
        );
        }
        if (status) {
            this.andWhere("d.status", "like", `%${status}%`);
        }
        if (id) {
            this.andWhere("d.id", "like", `%${id}%`);
        }
    })

    return { data, total: total[0].total };
    }

    // get single Driver
    public async getSingleDriver(id: number, hotel_id: number) {
        return await this.db("driver_view as d")
        .withSchema(this.FLEET_SCHEMA)
        .select("*")
        .where("d.id", id)
        .andWhere("d.hotel_id", hotel_id);
    }

    // Update Driver
    public async updateDriver(id: number,
        payload: IupdateDriverPayload) 
    {
        return await this.db("drivers")
        .withSchema(this.FLEET_SCHEMA)
        .where({ id })
        .update(payload);
    }

    //=================== Overview Report ======================//

}
export default FleetCommonModel;
