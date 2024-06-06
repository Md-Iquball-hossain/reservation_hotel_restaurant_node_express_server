import { IcreateRolePermission } from "../../appAdmin/utlis/interfaces/admin.role-permission.interface";
import { TDB } from "../../common/types/commontypes";
import Schema from "../../utils/miscellaneous/schema";

class MRolePermissionModel extends Schema {
  private db: TDB;

  constructor(db: TDB) {
    super();
    this.db = db;
  }

  // create module
  public async rolePermissionGroup(body: any) {
    return await this.db("permission_group")
      .withSchema(this.M_RESERVATION_SCHEMA)
      .insert(body);
  }

  // get permission group
  public async getRolePermissionGroup() {
    return await this.db("permission_group")
      .withSchema(this.M_RESERVATION_SCHEMA)
      .select("id", "name");
  }

  // create permission
  public async createPermission({
    permission_group_id,
    name,
    created_by,
  }: {
    permission_group_id: number;
    name: string[];
    created_by: number;
  }) {
    const insertObj = name.map((item: string) => {
      return {
        permission_group_id,
        name: item,
        created_by,
      };
    });

    return await this.db("permission")
      .withSchema(this.M_RESERVATION_SCHEMA)
      .insert(insertObj);
  }

  // get all permission
  public async getAllPermission(payload: {
    ids?: number[];
    hotel_id?: number;
  }) {
    const { ids, hotel_id } = payload;
    const res = await this.db("permission AS p")
      .withSchema(this.RESERVATION_SCHEMA)
      .select(
        "p.id AS permission_id",
        "p.name As permission_name",
        "p.permission_group_id",
        "pg.name AS permission_group_name"
      )
      .join("permission_group AS pg", "p.permission_group_id", "pg.id")
      .where(function () {
        if (ids?.length) {
          this.whereIn("p.id", ids);
        }
      });
    return res;
  }

  // create role permission
  public async createRolePermission(insertObj: IcreateRolePermission[]) {
    const res = await this.db("role_permission")
      .withSchema(this.M_RESERVATION_SCHEMA)
      .insert(insertObj);
    return res;
  }

  // delete role perimission
  public async deleteRolePermission(
    oldPermissionId: number,
    permissionType: string,
    role_id: number
  ) {
    const res = await this.db("role_permission")
      .withSchema(this.M_RESERVATION_SCHEMA)
      .andWhere("permissionId", oldPermissionId)
      .andWhere("permissionType", permissionType)
      .andWhere("roleId", role_id)
      .delete();

    return res;
  }

  // create role
  public async createRole({ role_name }: { role_name: string }) {
    const res = await this.db("role")
      .withSchema(this.M_RESERVATION_SCHEMA)
      .insert({ name: role_name });
    return res;
  }

  // create permission of role
  // public async createPermissionOfRole(permissionObj: any) {
  //   const res = await this.db("rolePermission")
  //     .withSchema(this.ADMINISTRATION_SCHEMA)
  //     .insert(permissionObj, "roleId");
  //   return res;
  // }

  // get role
  public async getRole() {
    const res = await this.db("role")
      .withSchema(this.M_RESERVATION_SCHEMA)
      .select("*");

    return res;
  }

  // get single role
  public async getSingleRole(id: number) {
    const res = await this.db("role AS r")
      .withSchema(this.M_RESERVATION_SCHEMA)
      .select(
        "r.id AS role_id",
        "r.name AS role_name",
        "pg.id AS permission_group_id",
        "pg.name AS permission_group_name",
        "p.id AS permission_id",
        "p.name AS permission_name",
        "rp.permission_type"
      )
      .join("role_permission AS rp", "r.id", "rp.role_id")
      .join("permission AS p", "rp.permission_id", "p.id")
      .join("permission_group AS pg", "p.permission_group_id", "pg.id")
      .where("r.id", id);

    return res;
  }

  // update role
  public async updateSingleRole(id: number, body: any) {
    const res = await this.db("role AS r")
      .withSchema(this.M_RESERVATION_SCHEMA)
      .update(body)
      .where({ id });

    return res;
  }

  // get role by name
  public async getRoleByName(name: string) {
    const res = await this.db("role")
      .withSchema(this.M_RESERVATION_SCHEMA)
      .select("*")
      .whereILike("name", `%${name}%`);

    return res;
  }

  // get admins role permission
  public async getAdminRolePermission(id: Number) {
    const res = await this.db("admin_permissions")
      .withSchema(this.M_RESERVATION_SCHEMA)
      .where({ id });
    return res;
  }
}
export default MRolePermissionModel;
