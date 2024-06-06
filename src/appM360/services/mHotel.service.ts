import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";
import { newHotelUserAccount } from "../../templates/mHotelUserCredentials.template";
import Lib from "../../utils/lib/lib";
import { OTP_FOR_CREDENTIALS } from "../../utils/miscellaneous/constants";
import { IhotelPermissions } from "../utlis/interfaces/mConfiguration.interfaces.";

class MHotelService extends AbstractServices {
  constructor() {
    super();
  }

  // create hotel
  public async createHotel(req: Request) {
    return await this.db.transaction(async (trx) => {
      const {
        hotel_email,
        user_name,
        user_email,
        password,
        permission,
        hotel_name,
        ...rest
      } = req.body;

      if (rest.expiry_date < new Date()) {
        return {
          success: false,
          code: this.StatusCode.HTTP_UNPROCESSABLE_ENTITY,
          message: "Date expiry cannot shorter than present Date",
        };
      }

      const files = (req.files as Express.Multer.File[]) || [];

      const model = this.Model.HotelModel(trx);
      const hotelAdminModel = this.Model.hotelAdminModel(trx);

      //   check hotel
      const checkHotelEmail = await model.getSingleHotel({
        email: hotel_email,
      });

      if (checkHotelEmail.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_CONFLICT,
          message: this.ResMsg.HTTP_CONFLICT,
        };
      }

      // check admin
      const checkHotelAdmin = await hotelAdminModel.getSingleAdmin({
        email: user_email,
      });

      if (checkHotelAdmin.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_CONFLICT,
          message: "Admin email already exist",
        };
      }

      if (files.length) {
        rest["logo"] = files[0].filename;
      }

      const hashPass = await Lib.hashPass(password);

      // create hotel
      const hotelRes = await model.createHotel({
        name: hotel_name,
        email: hotel_email,
        ...rest,
      });

      // create web token
      // const web_token = new SyncCryptoService().encrypt("57");

      // update hotel
      // await model.updateHotel({ web_token }, { id: hotelRes[0] });

      // ============ create hotel admin step ==============//

      const hotelAdminRoleModel = this.Model.HotelrolePermissionModel(trx);
      const mRolePermissionModel = this.Model.mRolePermissionModel(trx);

      const extractPermission = JSON.parse(permission);

      // check all permission
      const checkAllPermission = await mRolePermissionModel.getAllPermission({
        ids: extractPermission,
      });

      if (checkAllPermission.length != extractPermission.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_NOT_FOUND,
          message: "Invalid Permissions",
        };
      }

      const hotel_permission_payload = extractPermission.map((item: number) => {
        return {
          permission_id: item,
          hotel_id: hotelRes[0],
        };
      });

      // insert hotel permission
      const permissionRes = await hotelAdminRoleModel.addedHotelPermission(
        hotel_permission_payload
      );

      // insert Role
      const roleRes = await hotelAdminRoleModel.createRole({
        name: "super-admin",
        hotel_id: hotelRes[0],
      });

      const rolePermissionPayload: {
        hotel_id: number;
        role_id: number;
        h_permission_id: number;
        permission_type: "read" | "write" | "update" | "delete";
      }[] = [];

      for (let i = 0; i < extractPermission.length; i++) {
        for (let j = 0; j < 4; j++) {
          rolePermissionPayload.push({
            hotel_id: hotelRes[0],
            h_permission_id: permissionRes[0] + i,
            permission_type:
              j == 0 ? "read" : j == 1 ? "write" : j == 2 ? "update" : "delete",
            role_id: roleRes[0],
          });
        }
      }

      // insert role permission
      await hotelAdminRoleModel.createRolePermission(rolePermissionPayload);

      // insert user admin
      const res = await hotelAdminModel.insertUserAdmin({
        email: user_email,
        name: user_name,
        password: hashPass,
        role: roleRes[0],
        hotel_id: hotelRes[0],
      });

      // send email with password
      await Lib.sendEmail(
        hotel_email,
        OTP_FOR_CREDENTIALS,
        newHotelUserAccount(user_email, password, hotel_name)
      );

      return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: this.ResMsg.HTTP_SUCCESSFUL,
        data: {
          id: res[0],
        },
        // web_token,
      };
    });
  }

  // get all hotel
  public async getAllHotel(req: Request) {
    const { status, from_date, to_date, name, limit, skip, group, city } =
      req.query;
    const model = this.Model.HotelModel();

    const endDate = new Date(to_date as string);
    endDate.setDate(endDate.getDate() + 1);

    const { data, total } = await model.getAllHotel({
      name: name as string,
      status: status as string,
      from_date: from_date as string,
      to_date: endDate as unknown as string,
      limit: limit as string,
      skip: skip as string,
      group: group as string,
      city: city as string,
    });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total,
      data,
    };
  }

  // get single hotel
  public async getSingleHotel(req: Request) {
    const { id } = req.params;

    const model = this.Model.HotelModel();
    const user = await model.getSingleHotel({ id: parseInt(id) });

    if (!user.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }

    const { password, ...rest } = user[0];

    const data: IhotelPermissions[] =
      await this.Model.mConfigurationModel().getAllPermissionByHotel(
        parseInt(id)
      );

    const { permissions } = data[0];

    const groupedPermissions: any = {};

    permissions?.forEach((entry) => {
      const permission_group_id = entry.permission_group_id;
      const permission = {
        permission_id: entry.permission_id,
        permission_name: entry.permission_name,
      };

      if (!groupedPermissions[permission_group_id]) {
        groupedPermissions[permission_group_id] = {
          permission_group_id: permission_group_id,
          permissionGroupName: entry.permission_group_name,
          permissions: [permission],
        };
      } else {
        groupedPermissions[permission_group_id].permissions.push(permission);
      }
    });
    const result = Object.values(groupedPermissions);

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data: { ...rest, permissions: result },
    };
  }

  // update hotel
  public async updateHotel(req: Request) {
    return await this.db.transaction(async (trx) => {
      const body = req.body;

      const { id } = req.params;

      if (body.expiry_date < new Date()) {
        return {
          success: false,
          code: this.StatusCode.HTTP_UNPROCESSABLE_ENTITY,
          message: "Date expiry cannot shorter than present Date",
        };
      }

      const files = (req.files as Express.Multer.File[]) || [];

      const model = this.Model.HotelModel(trx);

      // check user
      const checkUser = await model.getSingleHotel({ email: body.email });

      if (!checkUser.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_NOT_FOUND,
          message: this.ResMsg.HTTP_NOT_FOUND,
        };
      }

      if (files.length) {
        body["logo"] = files[0].filename;
      }

      await model.updateHotel(body, { id: parseInt(id) });

      return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: "User updated successfully",
      };
    });
  }
}

export default MHotelService;
