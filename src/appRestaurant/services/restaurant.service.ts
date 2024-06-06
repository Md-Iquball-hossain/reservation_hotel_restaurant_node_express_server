import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";

class RestaurantService extends AbstractServices {
  constructor() {
    super();
  }

  //=================== Restaurant service ======================//

  // get Single Restaurant
  public async getSingleRestaurant(req: Request) {
    const { res_id, hotel_id, id } = req.rest_user;

    const data = await this.Model.restaurantModel().getResAdmin({
      res_id,
      hotel_id,
    });

    const rolePermissionModel = this.Model.restaurantModel();

    const res = await rolePermissionModel.getAdminRolePermission({
      id,
    });

    const { id: admin_id, name, role_id, role_name, permissions } = res[0];

    const output_data: any = [];

    for (let i = 0; i < permissions?.length; i++) {
      let found = false;

      for (let j = 0; j < output_data.length; j++) {
        if (
          permissions[i].permission_group_id ==
          output_data[j].permission_group_id
        ) {
          output_data[j].permission_type.push(permissions[i].permission_type);
          found = true;
          break;
        }
      }

      if (!found) {
        output_data.push({
          permission_group_id: permissions[i].permission_group_id,
          permission_group_name: permissions[i].permission_group_name,
          permission_type: [permissions[i].permission_type],
        });
      }
    }

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data: { ...data[0], role_name, authorization: output_data },
    };
  }

  // udate hotel restaurant
  public async updateRestaurant(req: Request) {
    return await this.db.transaction(async (trx) => {
      const { res_id: id, id: res_admin } = req.rest_user;

      const updatePayload = req.body as IupdateRestaurantPayload;

      const files = (req.files as Express.Multer.File[]) || [];
      let photo = updatePayload.photo;

      if (files.length) {
        photo = files[0].filename;
      }

      const model = this.Model.restaurantModel(trx);

      const res = await model.updateRestaurant(id, {
        name: updatePayload.name,
        phone: updatePayload.phone,
        photo: photo,
        address: updatePayload.address,
        city: updatePayload.city,
        country: updatePayload.country,
        bin_no: updatePayload.bin_no,
        updated_by: res_admin,
      });

      return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: "Restaurant Profile updated successfully",
      };
    });
  }

  // udate restaurant admin
  public async updateResAdmin(req: Request) {
    return await this.db.transaction(async (trx) => {
      const { id: res_admin } = req.rest_user;
      const { id } = req.params;

      const updatePayload = req.body as IupdateRestAdminPayload;

      const files = (req.files as Express.Multer.File[]) || [];
      let avatar = updatePayload.avatar;

      if (files.length) {
        avatar = files[0].filename;
      }

      const model = this.Model.restaurantModel(trx);
      await model.updateResAdmin(parseInt(id), {
        name: updatePayload.name,
        phone: updatePayload.phone,
        avatar: avatar,
        status: updatePayload.status,
        updated_by: res_admin,
      });

      return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: "Restaurant Admin updated successfully",
      };
    });
  }
}
export default RestaurantService;
