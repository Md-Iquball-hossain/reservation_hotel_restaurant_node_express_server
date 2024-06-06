import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";
import Lib from "../../utils/lib/lib";
import { sendEmailOtpTemplate } from "../../templates/sendEmailOtp";
import config from "../../config/config";
import { IChangePassProps, IVerifyPassProps } from "../types/commontypes";
import { IGetOTPPayload } from "../interfaces/commonInterface";
import { OTP_EMAIL_SUBJECT, OTP_FOR, OTP_TYPE_FORGET_HOTEL_ADMIN, OTP_TYPE_FORGET_H_USER,
  OTP_TYPE_FORGET_M_ADMIN, OTP_TYPE_FORGET_RES_ADMIN } from "../../utils/miscellaneous/constants";

class CommonService extends AbstractServices {
  constructor() {
    super();
  }

  // send otp to email
  public async sendOtpToEmailService(req: Request) {
    return await this.db.transaction(async (trx) => {
      const { email, type } = req.body as IGetOTPPayload;

      switch (type) {
        case OTP_TYPE_FORGET_M_ADMIN:
          const adminModel = this.Model.mUserAdminModel(trx);
          const checkAdmin = await adminModel.getAdminByEmail(email);

          if (!checkAdmin.length) {
            return {
              success: false,
              code: this.StatusCode.HTTP_NOT_FOUND,
              message: this.ResMsg.NOT_FOUND_USER_WITH_EMAIL,
            };
          }
          break;

        case OTP_TYPE_FORGET_H_USER:
          const hotelUserModel = this.Model.HotelModel(trx);
          const checkHotelUser = await hotelUserModel.getSingleHotel({
            email,
          });

          if (!checkHotelUser.length) {
            return {
              success: false,
              code: this.StatusCode.HTTP_NOT_FOUND,
              message: this.ResMsg.NOT_FOUND_USER_WITH_EMAIL,
            };
          }
          break;

          case OTP_TYPE_FORGET_RES_ADMIN:
            const Model = this.Model.restaurantModel(trx);
            const checkResAdmin = await Model.getResAdminByEmail(email);
  
            if (!checkResAdmin.length) {
              return {
                success: false,
                code: this.StatusCode.HTTP_NOT_FOUND,
                message: this.ResMsg.NOT_FOUND_USER_WITH_EMAIL,
              };
            }
            break;

        default:
          break;
      }

      const commonModel = this.Model.commonModel(trx);

      const checkOtp = await commonModel.getOTP({
        email: email,
        type: type,
      });

      if (checkOtp.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_GONE,
          message: this.ResMsg.THREE_TIMES_EXPIRED,
        };
      }

      const otp = Lib.otpGenNumber(6);
      const hashed_otp = await Lib.hashPass(otp);

      const send = await Lib.sendEmail(
        email,
        OTP_EMAIL_SUBJECT,
        sendEmailOtpTemplate(otp, OTP_FOR)
      );

      if (send) {
        await commonModel.insertOTP({
          hashed_otp: hashed_otp,
          email: email,
          type: type,
        });

        return {
          success: true,
          code: this.StatusCode.HTTP_OK,
          message: this.ResMsg.OTP_SENT,
          data: {
            email,
          },
        };
      } else {
        return {
          success: false,
          code: this.StatusCode.HTTP_INTERNAL_SERVER_ERROR,
          message: this.ResMsg.HTTP_INTERNAL_SERVER_ERROR,
        };
      }
    });
  }

  // match email otp
  public async matchEmailOtpService(req: Request) {
    return this.db.transaction(async (trx) => {
      const { email, otp, type } = req.body;

      const commonModel = this.Model.commonModel(trx);
      const checkOtp = await commonModel.getOTP({
        email,
        type,
      });

      if (!checkOtp.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_FORBIDDEN,
          message: this.ResMsg.OTP_EXPIRED,
        };
      }

      const { id: email_otp_id, hashed_otp, tried } = checkOtp[0];

      if (tried > 3) {
        return {
          success: false,
          code: this.StatusCode.HTTP_GONE,
          message: this.ResMsg.TOO_MUCH_ATTEMPT,
        };
      }

      const otpValidation = await Lib.compare(otp, hashed_otp);

      console.log({ otpValidation });

      if (otpValidation) {
        await commonModel.updateOTP(
          {
            tried: tried + 1,
            matched: 1,
          },
          { id: email_otp_id }
        );
        console.log("check OTP", OTP_TYPE_FORGET_H_USER)
        let secret = config.JWT_SECRET_HOTEL_ADMIN;
        switch (type) {
          case OTP_TYPE_FORGET_M_ADMIN:
            secret = config.JWT_SECRET_M_ADMIN;
            break;
          case OTP_TYPE_FORGET_HOTEL_ADMIN:
            secret = config.JWT_SECRET_HOTEL_ADMIN;
            break;
          case OTP_TYPE_FORGET_H_USER:
            secret = config.JWT_SECRET_H_USER;
            break;

          case OTP_TYPE_FORGET_RES_ADMIN:
            secret = config.JWT_SECRET_H_RESTURANT;
            break;

          default:
            break;
        }

        const token = Lib.createToken(
          {
            email: email,
            type: type,
          },
          secret,
          "5m"
        );

        return {
          success: true,
          code: this.StatusCode.HTTP_ACCEPTED,
          message: this.ResMsg.OTP_MATCHED,
          token,
        };
      } else {
        await commonModel.updateOTP(
          {
            tried: tried + 1,
          },
          { id: email_otp_id }
        );

        return {
          success: false,
          code: this.StatusCode.HTTP_UNAUTHORIZED,
          message: this.ResMsg.OTP_INVALID,
        };
      }
    });
  }

  // common change password
  public async changePassword({
    password,
    table,
    userIdField,
    userId,
    passField,
    schema,
  }: IChangePassProps) {
    const hashedPass = await Lib.hashPass(password);
    const commonModel = this.Model.commonModel();

    const updatePass = await commonModel.updatePassword({
      table,
      userIdField,
      userId,
      passField,
      schema,
      hashedPass,
    });

    if (updatePass) {
      return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: "Password changed successfully!",
      };
    } else {
      return {
        success: true,
        code: this.StatusCode.HTTP_INTERNAL_SERVER_ERROR,
        message: "Cannot change password!",
      };
    }
  }

  // user password verify
  public async userPasswordVerify({
    table,
    passField,
    oldPassword,
    userIdField,
    userId,
    schema,
  }: IVerifyPassProps) {
    const commonModel = this.Model.commonModel();
    const user = await commonModel.getUserPassword({
      table,
      schema,
      passField,
      userIdField,
      userId,
    });

    if (!user.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: "No user found with this id",
      };
    }
    const checkOldPass = await Lib.compare(oldPassword, user[0][passField]);
    if (!checkOldPass) {
      return {
        success: false,
        code: this.StatusCode.HTTP_UNAUTHORIZED,
        message: "Old password is not correct!",
      };
    } else {
      return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: "Password is verified!",
      };
    }
  }

  // create audit trail
  // public async createAuditTrailService(
  //   admin_id: number,
  //   details: string,
  //   code: number
  // ) {
  //   let status = true;
  //   if (code > 299) {
  //     status = false;
  //   }

  //   const commonModel = this.Model.commonModel();

  //   const res = await commonModel.insetAuditTrail({
  //     adminId: admin_id,
  //     details,
  //     status,
  //   });

  //   if (res.length) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
}

export default CommonService;
