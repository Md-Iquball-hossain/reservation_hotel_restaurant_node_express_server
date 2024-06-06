import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import RestaurantAuthService from "../services/auth.rest-user.service";
import CommonService from "../../common/services/commonServices";

class RestaurantAuthController extends AbstractController {
  private Service = new RestaurantAuthService();
  private commonService = new CommonService();
  constructor() {
    super();
  }

  // login Restaurant
  public loginRestaurant = this.asyncWrapper.wrap(
    { bodySchema: this.commonValidator.loginValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.Service.loginRestaurant(req);

      res.status(code).json(data);
    }
  );

  // forget password
  public forgetPassword = this.asyncWrapper.wrap(
    { bodySchema: this.commonValidator.forgetPasswordValidator },
    async (req: Request, res: Response) => {
      const { token, email, password } = req.body;
      const { code, ...data } = await this.Service.forgetService({
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
      const { id } = req.rest_user;
      const table = "res_admin";
      const passField = "password";
      const userIdField = "id";
      const schema = "restaurant";
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
export default RestaurantAuthController;
