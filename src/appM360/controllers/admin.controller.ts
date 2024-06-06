import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import AdminService from "../services/mAdmin.service";

class AdminController extends AbstractController {
  private adminService;
  constructor() {
    super();
    this.adminService = new AdminService();
  }

  public getAllAdmin = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.adminService.getAllAdmin(req);

      res.status(code).json(data);
    }
  );
}

export default AdminController;
