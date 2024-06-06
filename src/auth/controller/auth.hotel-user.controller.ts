import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import CommonService from "../../common/services/commonServices";
import AuthHotelUserService from "../services/auth.hotel-user.service";
import HoteUserAuthValidator from "../utils/validator/hotelUserAuth.validator";

class AuthHotelUserController extends AbstractController {
  private authHotelUserService = new AuthHotelUserService();
  private commonService = new CommonService();
  private hotelUserAuthValidator = new HoteUserAuthValidator();
  constructor() {
    super();
  }

  // registration
  public registration = this.asyncWrapper.wrap(
    { bodySchema: this.hotelUserAuthValidator.registrationValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.authHotelUserService.registration(
        req
      );
      if (data.success) {
        res.status(code).json(data);
      } else {
        this.error(data.message, code);
      }
    }
  );

  // login
  public login = this.asyncWrapper.wrap(
    { bodySchema: this.commonValidator.loginValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.authHotelUserService.login(req);

      res.status(code).json(data);
    }
  );

  // get profile
  public getProfile = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.authHotelUserService.getProfile(
      req
      );
      res.status(code).json(data);
    }
  );

  // update profile
  public updateProfile = this.asyncWrapper.wrap(
    { bodySchema: this.hotelUserAuthValidator.updateProfileValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.authHotelUserService.updateProfile(
        req
      );
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
      const { code, ...data } = await this.authHotelUserService.forgetService({
        token,
        email,
        password,
      });
      res.status(code).json(data);
    }
  );

  // change password
  public changePassword = this.asyncWrapper.wrap(
    { bodySchema: this.commonValidator.changePasswordValidator },
    async (req: Request, res: Response) => {
      const { old_password, new_password } = req.body;
      const { id } = req.hotel_user;

      const table = "user";
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

export default AuthHotelUserController;
