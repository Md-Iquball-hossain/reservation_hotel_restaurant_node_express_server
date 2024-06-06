import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";
import Lib from "../../utils/lib/lib";
import { OTP_FOR_CREDENTIALS } from "../../utils/miscellaneous/constants";
import { newHotelUserAccount } from "../../templates/mHotelUserCredentials.template";
import { newResutaurantUserAccount } from "../../templates/restaurantCredential.template";

class hotelRestaurantService extends AbstractServices {
  constructor() {
    super();
  }

  //=================== Restaurant service ======================//

  // Create Restaurant

  public async createRestaurant(req: Request) {
    return await this.db.transaction(async (trx) => {
      const { hotel_id, id: admin_id } = req.hotel_admin;
      const {
        name,
        res_email,
        phone,
        admin_name,
        email,
        password,
        permission,
      } = req.body;

      const model = this.Model.restaurantModel(trx);

      // Check restaurant email and name
      const checkRestaurant = await model.getAllRestaurant({ hotel_id });

      let emailExists = false;
      let nameExists = false;

      if (checkRestaurant && checkRestaurant.data) {
        emailExists = checkRestaurant.data.some(
          (restaurant: any) => restaurant.res_email === res_email
        );
        nameExists = checkRestaurant.data.some(
          (restaurant: any) => restaurant.name === name
        );

        if (emailExists) {
          return {
            success: false,
            code: this.StatusCode.HTTP_CONFLICT,
            message: "Restaurant Email already exists with this hotel.",
          };
        }

        if (nameExists) {
          return {
            success: false,
            code: this.StatusCode.HTTP_CONFLICT,
            message: "Restaurant name already exists with this hotel.",
          };
        }
      }

      // Check admin email
      const adminEmailExists = await model.getAllResAdminEmail({
        email,
        hotel_id,
      });

      if (adminEmailExists) {
        return {
          success: false,
          code: this.StatusCode.HTTP_CONFLICT,
          message: "Restaurant Admin's email already exists with this hotel.",
        };
      }

      const hashPass = await Lib.hashPass(password);

      const resCreate = await model.createRestaurant({
        name,
        email: res_email,
        phone,
        hotel_id,
        created_by: admin_id,
      });

      // ============ create hotel admin step ==============//

      // check all permission
      const checkAllPermission = await model.getPermissionGroup({
        ids: permission,
      });

      if (checkAllPermission.length != permission.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_NOT_FOUND,
          message: "Invalid Permissions",
        };
      }

      const res_permission_payload = permission.map((item: number) => {
        return {
          permission_grp_id: item,
          res_id: resCreate[0],
        };
      });

      // insert hotel permission
      const permissionRes = await model.addedResPermission(
        res_permission_payload
      );

      // insert Role
      const roleRes = await model.createRole({
        name: "super-admin",
        res_id: resCreate[0],
      });

      const rolePermissionPayload: {
        res_id: number;
        role_id: number;
        r_permission_id: number;
        permission_type: "read" | "write" | "update" | "delete";
      }[] = [];

      for (let i = 0; i < permission.length; i++) {
        for (let j = 0; j < 4; j++) {
          rolePermissionPayload.push({
            res_id: resCreate[0],
            r_permission_id: permissionRes[0] + i,
            permission_type:
              j == 0 ? "read" : j == 1 ? "write" : j == 2 ? "update" : "delete",
            role_id: roleRes[0],
          });
        }
      }

      // insert role permission
      await model.createRolePermission(rolePermissionPayload);

      // Restaurant Admin creation
      await model.createResAdmin({
        hotel_id,
        email,
        name: admin_name,
        role: roleRes[0],
        res_id: resCreate[0],
        password: hashPass,
        created_by: admin_id,
      });

      // send email with password
      await Lib.sendEmail(
        res_email,
        OTP_FOR_CREDENTIALS,
        newResutaurantUserAccount(email, password, name)
      );

      return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: "Restaurant created successfully.",
      };
    });
  }

  // Get all Restaurant
  public async getAllRestaurant(req: Request) {
    const { hotel_id } = req.hotel_admin;
    const { limit, skip, key } = req.query;

    const model = this.Model.restaurantModel();

    const { data, total } = await model.getAllRestaurant({
      key: key as string,
      limit: limit as string,
      skip: skip as string,
      hotel_id,
    });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total,
      data,
    };
  }

  // udate hotel restaurant
  public async updateHotelRestaurant(req: Request) {
    return await this.db.transaction(async (trx) => {
      const { id: admin_id, hotel_id } = req.hotel_admin;
      const { id } = req.params;

      const updatePayload = req.body as IupdateRestaurantPayload;

      const model = this.Model.restaurantModel(trx);
      await model.updateRestaurant(parseInt(id), {
        name: updatePayload.name,
        status: updatePayload.status,
        updated_by: admin_id,
      });

      return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: "Restaurant status updated successfully",
      };
    });
  }
}
export default hotelRestaurantService;
