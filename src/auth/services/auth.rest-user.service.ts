import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";
import Lib from "../../utils/lib/lib";
import { ILogin } from "../../common/types/commontypes";
import config from "../../config/config";
import {
  OTP_TYPE_FORGET_HOTEL_ADMIN,
  OTP_TYPE_FORGET_RES_ADMIN,
} from "../../utils/miscellaneous/constants";
import { Braket } from "aws-sdk";

class RestaurantAuthService extends AbstractServices {
  constructor() {
    super();
  }

  // login Restaurant
  public async loginRestaurant(req: Request) {
    const { email, password }: ILogin = req.body;

    const model = this.Model.restaurantModel();

    const checkUser = await model.getSingleResAdmin({ email });

    if (!checkUser.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_BAD_REQUEST,
        message: "Email is not correct",
      };
    }

    const { password: hashPass, status, ...rest } = checkUser[0];

    if (status !== "active") {
      return {
        success: false,
        code: this.StatusCode.HTTP_BAD_REQUEST,
        message: "Admin account is disabled by hotel Admin",
      };
    }

    const checkPass = await Lib.compare(password, hashPass);

    if (!checkPass) {
      return {
        success: false,
        code: this.StatusCode.HTTP_BAD_REQUEST,
        message: "Password is not correct",
      };
    }

    const token = Lib.createToken(
      { ...rest, status },
      config.JWT_SECRET_H_RESTURANT,
      "48h"
    );

    const rolePermissionModel = this.Model.restaurantModel();

    const res = await rolePermissionModel.getAdminRolePermission({
      id: checkUser[0].id,
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
      message: "Login successful",

      data: {
        ...rest,
        status,
        authorization: output_data,
      },
      token: token,
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
      config.JWT_SECRET_H_RESTURANT
    );

    if (!tokenVerify) {
      return {
        success: false,
        code: this.StatusCode.HTTP_UNAUTHORIZED,
        message: this.ResMsg.HTTP_UNAUTHORIZED,
      };
    }

    const { email: verifyEmail, type } = tokenVerify;

    if (email === verifyEmail && type === OTP_TYPE_FORGET_RES_ADMIN) {
      const hashPass = await Lib.hashPass(password);
      const adminModel = this.Model.restaurantModel();
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
export default RestaurantAuthService;
