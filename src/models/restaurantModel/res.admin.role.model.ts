
import { TDB } from "../../common/types/commontypes";
import Schema from "../../utils/miscellaneous/schema";

import {
    ICreateResAdminPayload,
    IUpdateResAdminPayload,
    IcreateResRolePermission,
} from "../../appRestaurant/utils/interfaces/admin-role.interface";


    class ResAdminRoleModel extends Schema {
    private db: TDB;

    constructor(db: TDB) {
        super();
        this.db = db;
    }

    //=================== Admin  ======================//

    // get Res admin by email
    public async getResAdminByEmail(email: string) {
        return await this.db("res_admin AS ra")
        .withSchema(this.RESTAURANT_SCHEMA)
        .select(
            "ra.id",
            "ra.email",
            "ra.password",
            "ra.name",
            "ra.avatar",
            "ra.phone",
            "ra.status",
            "r.id As roleId",
            "r.name As roleName",
            "ra.created_at"
        )
        .leftJoin("role AS r", "ra.role", "r.id")
        .where({ email });
    }

    // insert user admin
    public async insertUserAdmin(payload: ICreateResAdminPayload) {
        return await this.db("res_admin")
        .withSchema(this.RESTAURANT_SCHEMA)
        .insert(payload);
    }

    public async getSingleAdmin(where: { email?: string; id?: number }) {
        const { email, id } = where;
        return await this.db("res_admin AS ra")
        .select(
            "ra.hotel_id",
            "ra.id",
            "ra.email",
            "ra.password",
            "ra.name",
            "ra.avatar",
            "ra.phone",
            "ra.status",
            "r.id As role_id",
            "r.name As role_name",
            "ra.created_at"
        )
        .withSchema(this.RESTAURANT_SCHEMA)
        .leftJoin("role AS r", "ra.res_id", "r.res_id")
        .where(function () {
            if (id) {
            this.where("ra.id", id);
            }
            if (email) {
            this.where("ra.email", email);
            }
        });
    }

    // get all admin
    public async getAllAdmin(payload: {
        res_id: number;
        limit: string;
        skip: string;
        status?: string;
    }) {
        const { limit, skip, status, res_id } = payload;
        const dtbs = this.db("res_admin AS ra");
        if (limit && skip) {
        dtbs.limit(parseInt(limit as string));
        dtbs.offset(parseInt(skip as string));
        }

        const data = await dtbs
        .withSchema(this.RESTAURANT_SCHEMA)
        .select(
            "ra.id",
            "ra.email",
            "ra.name",
            "ra.avatar",
            "ra.phone",
            "ra.status",
            "r.id As role_id",
            "r.name As role_name",
            "ra.created_at"
        )
        .leftJoin("role AS r", "ra.role", "r.id")
        .where(function () {
            if (status) {
            this.where("ra.status", status);
            }
            this.andWhere("ra.res_id", res_id);
        });

        const total = await this.db("res_admin AS ra")
        .withSchema(this.RESTAURANT_SCHEMA)
        .count("ra.id As total")
        .leftJoin("role AS r", "ra.role", "r.id")
        .where(function () {
            if (status) {
            this.where("ra.status", status);
            }
            this.andWhere("ra.res_id", res_id);
        });

        return { data, total: total[0].total };
    }

    // update admin model
    public async updateAdmin(
        payload: IUpdateResAdminPayload,
        where: { email: string }
    ) {
        return await this.db("res_admin")
        .withSchema(this.RESTAURANT_SCHEMA)
        .update(payload)
        .where({ email: where.email });
    }

    //=================== Admin Role Permission ======================//

    // create Res permission
    public async addedResPermission(
        payload: {
        res_id: number;
        permission_id: number;
        }[]
    ) {
        return await this.db("res_permission")
        .withSchema(this.RESTAURANT_SCHEMA)
        .insert(payload);
    }

    // create module
    public async rolePermissionGroup(body: any) {
        return await this.db("permission_group")
        .withSchema(this.RESTAURANT_SCHEMA)
        .insert(body);
    }

    // get permission group
    public async getPermissionGroup(payload?: { name?: string; ids?: number[] }) {
        const { ids, name } = payload || {};
        return await this.db("permission_group")
        .withSchema(this.RESTAURANT_SCHEMA)
        .select("id", "name")
        .where(function () {
            if (name) {
            this.where("name", "like", `%${name}%`);
            }
            if (ids) {
            this.whereIn("id", ids);
            }
        })
        .orderBy("id", "desc");
    }

    // create permission
    public async createPermission({
        permission_group_id,
        name,
        created_by,
        res_id,
    }: {
        permission_group_id: number;
        name: string[];
        created_by: number;
        res_id: number;
    }) {
        const insertObj = name.map((item: string) => {
        return {
            permission_group_id,
            name: item,
            created_by,
            res_id,
        };
        });

        return await this.db("permission")
        .withSchema(this.RESTAURANT_SCHEMA)
        .insert(insertObj);
    }

    // create hotel permission
    public async addedPermission(
        payload: {
        res_id: number;
        permission_id: number;
        }[]
    ) {
        return await this.db("res_permission")
        .withSchema(this.RESTAURANT_SCHEMA)
        .insert(payload);
    }

    // get all hotel permission
    public async getAllResPermission(payload: {
        ids?: number[];
        res_id?: number;
    }) {
        const { res_id, ids } = payload;
        console.log({ ids, res_id });

        return await this.db("res_permission")
        .withSchema(this.RESTAURANT_SCHEMA)
        .select("id", "res_id", "permission_grp_id")
        .where(function () {
            if (ids?.length) {
            this.whereIn("id", ids);
            }
            if (res_id) {
            this.where({ res_id });
            }
        });
    }

    // v2 get all Res permission code
    public async getAllResPermissions(payload: { res_id?: number }) {
        const { res_id } = payload;
        return await this.db("res_permission_view")
        .withSchema(this.RESTAURANT_SCHEMA)
        .select("res_id", "permissions")
        .where(function () {
            if (res_id) {
            this.where({ res_id });
            }
        });
    }

    // create role permission
    public async createRolePermission(insertObj: IcreateResRolePermission[]) {
        return await this.db("role_permission")
        .withSchema(this.RESTAURANT_SCHEMA)
        .insert(insertObj);
    }

    // delete role perimission
    public async deleteRolePermission(
        r_permission_id: number,
        permission_type: string,
        res_id: number
    ) {
        const res = await this.db("role_permission")
        .withSchema(this.RESTAURANT_SCHEMA)
        .andWhere("r_permission_id", r_permission_id)
        .andWhere("permission_type", permission_type)
        .andWhere("res_id", res_id)
        .delete();

        return res;
    }

    // create role
    public async createRole(payload: { res_id: number; name: string }) {
        const res = await this.db("role")
        .withSchema(this.RESTAURANT_SCHEMA)
        .insert(payload);
        return res;
    }

    // get role
    public async getAllRole(res_id: number) {
        return await this.db("role")
        .withSchema(this.RESTAURANT_SCHEMA)
        .select("*")
        .where({ res_id });
    }

    // get single role
    public async getSingleRole(id: number, res_id: number) {
        const res = await this.db("role_permission_view")
        .withSchema(this.RESTAURANT_SCHEMA)
        .select("*")
        .where("role_id", id)
        .andWhere({ res_id });

        return res;
    }

    // update role
    public async updateSingleRole(id: number, body: any, res_id: number) {
        const res = await this.db("role AS r")
        .withSchema(this.RESTAURANT_SCHEMA)
        .update(body)
        .where({ id })
        .andWhere({ res_id });

        return res;
    }

    // get role by name
    public async getRoleByName(name: string, res_id: number) {
        const res = await this.db("role")
        .withSchema(this.RESTAURANT_SCHEMA)
        .select("*")
        .where({ res_id })
        .andWhere(function () {
            if (name) {
            this.where("name", "like", `${name}%`);
            }
        });

        return res;
    }

    // get admins role permission
    public async getAdminRolePermission(payload: {
        email?: string;
        id?: Number;
    }) {
        const { id, email } = payload;
        return await this.db("admin_permissions")
        .withSchema(this.RESTAURANT_SCHEMA)
        .where(function () {
            if (id) {
            this.where({ id });
            } else {
            this.where({ email });
            }
        });
    }

    // get admins role permission
    public async getAdminsRolePermission(id: Number) {
        const res = await this.db("res_admin_permissions")
        .withSchema(this.RESTAURANT_SCHEMA)
        .where({ id });
        return res;
    }

}
export default ResAdminRoleModel;
