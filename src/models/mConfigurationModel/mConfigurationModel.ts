import { TDB } from "../../common/types/commontypes";
import Schema from "../../utils/miscellaneous/schema";

class MConfigurationModel extends Schema {
  private db: TDB;

  constructor(db: TDB) {
    super();
    this.db = db;
  }

  // create permission group
  public async createPermissionGroup(body: any) {
    return await this.db("permission_group")
      .withSchema(this.RESERVATION_SCHEMA)
      .insert(body);
  }

  // get all permission group
  public async getAllRolePermissionGroup(payload: {
    name?: string;
    id?: number;
  }) {
    const { id, name } = payload;

    return await this.db("permission_group")
      .withSchema(this.RESERVATION_SCHEMA)
      .select("id", "name")
      .where(function () {
        if (name) {
          this.where("name", "like", `%${name}%`);
        }

        if (id) {
          this.andWhere({ id });
        }
      });
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
      .withSchema(this.RESERVATION_SCHEMA)
      .insert(insertObj);
  }

  // get all permission
  public async getAllPermissionByHotel(hotel_id?: number) {
    const res = await this.db("hotel_permission_view")
      .withSchema(this.RESERVATION_SCHEMA)
      .select("*")
      .where({ hotel_id });

    return res;
  }

  // get all permission
  public async getAllPermission() {
    const res = await this.db("permission AS p")
      .withSchema(this.RESERVATION_SCHEMA)
      .select(
        "p.id AS permission_id",
        "p.name As permission_name",
        "p.permission_group_id",
        "pg.name AS permission_group_name"
      )
      .join("permission_group AS pg", "p.permission_group_id", "pg.id");
    return res;
  }

  // added hotel permission
  public async addedHotelPermission(
    payload: {
      hotel_id: number;
      permission_id: number;
    }[]
  ) {
    return await this.db("hotel_permission")
      .withSchema(this.RESERVATION_SCHEMA)
      .insert(payload);
  }

  // create hotel permission
  public async deleteHotelPermission(
    hotel_id: number,
    permission_id: number[]
  ) {
    return await this.db("hotel_permission")
      .withSchema(this.RESERVATION_SCHEMA)
      .whereIn("permission_id", permission_id)
      .andWhere({ hotel_id })
      .delete();
  }

  // delete hotel hotel role permission
  public async deleteHotelRolePermission(
    hotel_id: number,
    h_permission_id: number[]
  ) {
    return await this.db("role_permission")
      .withSchema(this.RESERVATION_SCHEMA)
      .whereIn("h_permission_id", h_permission_id)
      .andWhere({ hotel_id })
      .delete();
  }
}
export default MConfigurationModel;
