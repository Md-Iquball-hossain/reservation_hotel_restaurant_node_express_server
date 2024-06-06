import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";
import { ILogin } from "../../common/types/commontypes";
import config from "../../config/config";
import Lib from "../../utils/lib/lib";
import { OTP_TYPE_FORGET_H_USER } from "../../utils/miscellaneous/constants";

class AuthHotelUserService extends AbstractServices {
  constructor() {
    super();
  }

  public async registration(req: Request) {
    return await this.db.transaction(async (trx) => {
      const { email, password, ...rest } = req.body;
      const { id: hotel_id } = req.web_token;

      const guestModel = this.Model.guestModel(trx);
      const checkUser = await guestModel.getSingleGuest({
        email,
        hotel_id,
      });

      const { data } = await guestModel.getAllGuestEmail({ email, hotel_id });

      if (data.length > 0) {
        return {
          success: false,
          code: this.StatusCode.HTTP_CONFLICT,
          message: "Email already exists, give another unique email address",
        };
      }

      const files = (req.files as Express.Multer.File[]) || [];

      if (files.length) {
        rest["photo"] = files[0].filename;
      }

      const hashPass = await Lib.hashPass(password);

      if (checkUser.length) {
        const { id, user_type } = checkUser[0];

        if (user_type == "user") {
          return {
            success: false,
            code: this.StatusCode.HTTP_CONFLICT,
            message: "Already registered",
          };
        }

        await guestModel.updateSingleGuest(
          { ...rest, pasword: hashPass, user_type: "user" },
          { id }
        );

      } else {
        await guestModel.createGuest({
          ...rest,
          email,
          password: hashPass,
          hotel_id,
        });
      }

      return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: "Registration successful",
      };
    });
  }

  // login
  public async login(req: Request) {
    const { email, password }: ILogin = req.body;
    const { id: hotel_id } = req.web_token;

    const model = this.Model.clientModel();

    const checkUser = await model.getSingleUser({ email, hotel_id });

    if (!checkUser.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_BAD_REQUEST,
        message: "Email is not correct",
      };
    }

    const { password: hashPass, ...rest } = checkUser[0];
    const checkPass = await Lib.compare(password, hashPass);

    if (!checkPass) {
      return {
        success: false,
        code: this.StatusCode.HTTP_BAD_REQUEST,
        message: "Password is not correct",
      };
    }
    console.log({ hashPass, checkPass });
    const token = Lib.createToken(
      { ...rest, type: "hotel_user" },
      config.JWT_SECRET_H_USER,
      "214h"
    );

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: "Login successful",
      data: rest,
      token: token,
    };
  }

  // get profile
  public async getProfile(req: Request) {
    const { id: user_id, hotel_id } = req.hotel_user;

    const data = await this.Model.clientModel().getSingleUser({
      id: user_id,
      hotel_id,
    });
    const { password, ...rest } = data[0];

    if (data.length) {
      return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        data: rest,
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
    const { id: user_id, hotel_id } = req.hotel_user;

    const model = this.Model.clientModel();

    const checkAdmin = await model.getSingleUser({
      id : user_id,
      hotel_id
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

    await model.updateUser(req.body, { email });

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
      config.JWT_SECRET_H_USER
    );

    if (!tokenVerify) {
      return {
        success: false,
        code: this.StatusCode.HTTP_UNAUTHORIZED,
        message: this.ResMsg.HTTP_UNAUTHORIZED,
      };
    }

    const { email: verifyEmail, type } = tokenVerify;

    if (email === verifyEmail && type === OTP_TYPE_FORGET_H_USER) {
      const hashPass = await Lib.hashPass(password);
      const userModel = this.Model.clientModel();
      await userModel.updateUser({ password: hashPass }, { email });

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
export default AuthHotelUserService;
