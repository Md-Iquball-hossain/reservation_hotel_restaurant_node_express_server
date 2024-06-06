import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";

class AdminService extends AbstractServices {
  constructor() {
    super();
  }

  // get all admin
  public async getAllAdmin(req: Request) {
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
    };
  }
}
export default AdminService;
