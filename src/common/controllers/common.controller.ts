import CommonAbstractController from "../commonAbstract/common.abstract.controller";

import { Request, Response } from "express";
import CommonService from "../services/commonServices";

class CommonController extends CommonAbstractController {
  private commonService = new CommonService();
  constructor() {
    super();
  }

  // send email otp
  public sendEmailOtpController = this.asyncWrapper.wrap(
    { bodySchema: this.commonValidator.sendEmailOtpValidator },
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.commonService.sendOtpToEmailService(
        req
      );
      res.status(code).json(rest);
    }
  );

  // match email otp
  public matchEmailOtpController = this.asyncWrapper.wrap(
    { bodySchema: this.commonValidator.matchEmailOtpValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.commonService.matchEmailOtpService(
        req
      );

      res.status(code).json(data);
    }
  );
}

export default CommonController;
