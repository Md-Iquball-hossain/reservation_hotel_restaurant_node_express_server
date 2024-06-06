import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import { ILogin } from "../../common/types/commontypes";
import CommonService from "../../common/services/commonServices";
import HotelAdminAuthService from "../services/auth.hotel-admin.service";
import HotelAdminAuthValidator from "../utils/validator/auth.validator";

class HotelAdminAuthController extends AbstractController {
  private adminAuthService = new HotelAdminAuthService();
  private commonService = new CommonService();
  private AuthValidator = new HotelAdminAuthValidator();
  constructor() {
    super();
  }

  // login
  public login = this.asyncWrapper.wrap(
    { bodySchema: this.commonValidator.loginValidator },
    async (req: Request, res: Response) => {
      const { email, password } = req.body as ILogin;
      const { code, ...data } = await this.adminAuthService.login({
        email,
        password,
      });
      res.status(code).json(data);
    }
  );

  // get profile
  public getProfile = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.adminAuthService.getProfile(req);
      res.status(code).json(data);
    }
  );

  // update profile
  public updateProfile = this.asyncWrapper.wrap(
    { bodySchema: this.AuthValidator.updateProfileValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.adminAuthService.updateProfile(req);
      if (data.success) {
        res.status(code).json(data);
      } else {
        this.error(data.message, code);
      }
    }
  );

  // forget password
  public forgetPassword = this.asyncWrapper.wrap(
    { bodySchema: this.commonValidator.forgetPasswordValidator },
    async (req: Request, res: Response) => {
      const { token, email, password } = req.body;
      const { code, ...data } = await this.adminAuthService.forgetService({
        token,
        email,
        password,
      });
      res.status(code).json(data);
    }
  );

  // change password
  public changeAdminPassword = this.asyncWrapper.wrap(
    { bodySchema: this.commonValidator.changePasswordValidator },
    async (req: Request, res: Response) => {
      const { old_password, new_password } = req.body;
      const { id } = req.hotel_admin;
      const table = "user_admin";
      const passField = "password";
      const userIdField = "id";
      const schema = "hotel_reservation";
      const { code, ...data } = await this.commonService.userPasswordVerify({
        table,
        oldPassword: old_password,
        passField,
        userId: id,
        userIdField,
        schema,
      });
      if (data.success) {
        const { code, ...data } = await this.commonService.changePassword({
          password: new_password,
          table,
          passField,
          userId: id,
          userIdField,
          schema,
        });
        res.status(code).json(data);
      } else {
        res.status(code).json(data);
      }
    }
  );
}

export default HotelAdminAuthController;
