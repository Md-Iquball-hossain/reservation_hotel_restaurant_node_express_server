import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";
import { ILogin } from "../../common/types/commontypes";
import config from "../../config/config";
import Lib from "../../utils/lib/lib";
import { OTP_TYPE_FORGET_HOTEL_ADMIN } from "../../utils/miscellaneous/constants";

class HotelAdminAuthService extends AbstractServices {
  constructor() {
    super();
  }

  // login
  public async login({ email, password }: ILogin) {
    const model = this.Model.hotelAdminModel();
    const checkUser = await model.getSingleAdmin({ email });

    if (!checkUser.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_BAD_REQUEST,
        message: this.ResMsg.WRONG_CREDENTIALS,
      };
    }

    const { password: hashPass, id, ...rest } = checkUser[0];

    const checkPass = await Lib.compare(password, hashPass);

    if (!checkPass) {
      return {
        success: false,
        code: this.StatusCode.HTTP_BAD_REQUEST,
        message: this.ResMsg.WRONG_CREDENTIALS,
      };
    }

    const token = Lib.createToken(
      { ...rest, id, type: "admin" },
      config.JWT_SECRET_HOTEL_ADMIN,
      "24h"
    );

    const rolePermissionModel = this.Model.HotelrolePermissionModel();

    const res = await rolePermissionModel.getAdminRolePermission({ id });

    const { id: admin_id, name, role_id, role_name, permissions } = res[0];

    const output_data: any = [];

    for (let i = 0; i < permissions?.length; i++) {
      let found = false;

      for (let j = 0; j < output_data.length; j++) {
        if (
          permissions[i].permission_group_id ==
          output_data[j].permission_group_id
        ) {
          let found_sub = false;
          for (let k = 0; k < output_data[j].subModules.length; k++) {
            if (
              output_data[j].subModules[k].permission_id ==
              permissions[i].permission_id
            ) {
              output_data[j].subModules[k].permission_type.push(
                permissions[i].permission_type
              );
              found_sub = true;
            }
          }
          if (!found_sub) {
            output_data[j].subModules.push({
              permission_id: permissions[i].permission_id,
              permission_name: permissions[i].permission_name,
              permission_type: [permissions[i].permission_type],
            });
          }

          found = true;
        }
      }

      if (!found) {
        output_data.push({
          permission_group_id: permissions[i].permission_group_id,
          permission_group_name: permissions[i].permission_group_name,
          subModules: [
            {
              permission_id: permissions[i].permission_id,
              permission_name: permissions[i].permission_name,
              permission_type: [permissions[i].permission_type],
            },
          ],
        });
      }
    }

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.LOGIN_SUCCESSFUL,

      data: {
        ...rest,
        id,
        authorization: output_data,
      },
      token,
    };
  }

  // get profile
  public async getProfile(req: Request) {
    const { id, hotel_id } = req.hotel_admin;

    const data = await this.Model.hotelAdminModel().getSingleAdmin({
      id,
    });

    const rolePermissionModel = this.Model.HotelrolePermissionModel();

    const res = await rolePermissionModel.getAdminRolePermission({ id });

    const { id: admin_id, name, role_id, role_name, permissions } = res[0];

    const output_data: any = [];

    for (let i = 0; i < permissions?.length; i++) {
      let found = false;

      for (let j = 0; j < output_data.length; j++) {
        if (
          permissions[i].permission_group_id ==
          output_data[j].permission_group_id
        ) {
          let found_sub = false;
          for (let k = 0; k < output_data[j].subModules.length; k++) {
            if (
              output_data[j].subModules[k].permission_id ==
              permissions[i].permission_id
            ) {
              output_data[j].subModules[k].permission_type.push(
                permissions[i].permission_type
              );
              found_sub = true;
            }
          }
          if (!found_sub) {
            output_data[j].subModules.push({
              permission_id: permissions[i].permission_id,
              permission_name: permissions[i].permission_name,
              permission_type: [permissions[i].permission_type],
            });
          }

          found = true;
        }
      }

      if (!found) {
        output_data.push({
          permission_group_id: permissions[i].permission_group_id,
          permission_group_name: permissions[i].permission_group_name,
          subModules: [
            {
              permission_id: permissions[i].permission_id,
              permission_name: permissions[i].permission_name,
              permission_type: [permissions[i].permission_type],
            },
          ],
        });
      }
    }

    const { password, ...rest } = data[0];

    if (data.length) {
      return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        data: {
          ...rest,
          authorization: output_data,
        },
      };
    } else {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }
  }

  // update profile
  public async updateProfile(req: Request) {
    const { id } = req.hotel_admin;

    const model = this.Model.hotelAdminModel();

    const checkAdmin = await model.getSingleAdmin({
      id,
    });

    if (!checkAdmin.length) {
      return {
        success: true,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }

    const files = (req.files as Express.Multer.File[]) || [];

    if (files.length) {
      req.body[files[0].fieldname] = files[0].filename;
    }

    const { email } = checkAdmin[0];

    await model.updateAdmin(req.body, { email });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: "Profile updated successfully",
    };
  }

  // forget
  public async forgetService({
    token,
    email,
    password,
  }: {
    token: string;
    email: string;
    password: string;
  }) {
    const tokenVerify: any = Lib.verifyToken(
      token,
      config.JWT_SECRET_HOTEL_ADMIN
    );

    if (!tokenVerify) {
      return {
        success: false,
        code: this.StatusCode.HTTP_UNAUTHORIZED,
        message: this.ResMsg.HTTP_UNAUTHORIZED,
      };
    }

    const { email: verifyEmail, type } = tokenVerify;

    if (email === verifyEmail && type === OTP_TYPE_FORGET_HOTEL_ADMIN) {
      const hashPass = await Lib.hashPass(password);
      const adminModel = this.Model.hotelAdminModel();
      await adminModel.updateAdmin({ password: hashPass }, { email });

      return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: this.ResMsg.HTTP_FULFILLED,
      };
    } else {
      return {
        success: false,
        code: this.StatusCode.HTTP_BAD_REQUEST,
        message: this.ResMsg.HTTP_BAD_REQUEST,
      };
    }
  }
}

export default HotelAdminAuthService;
