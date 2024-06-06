import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import MaintenanceService from "../services/maintenance.service";
import MaintenanceValidator from "../utils/validator/maintenance.validator";


class MaintenanceController extends AbstractController {
        private Service = new MaintenanceService();
        private Validator = new MaintenanceValidator();
        constructor() {
        super();
    }

    // create Maintenance
    public createMaintenance= this.asyncWrapper.wrap(
    { bodySchema: this.Validator.createMaintenanceValidator },
    async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.createMaintenance(req);

        res.status(code).json(data);
    }
    );

    // get all Maintenance
    public getAllMaintenance = this.asyncWrapper.wrap(
    { querySchema: this.Validator.getAllMaintenanceValidator },
    async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.getAllMaintenance(req);

        res.status(code).json(data);
    }
    );

    // update Maintenance
    public updateMaintenance = this.asyncWrapper.wrap(
    { bodySchema: this.Validator.updateMaintenanceValidator },
    async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.updateMaintenance(req);

        res.status(code).json(data);
        }
    );

}
export default MaintenanceController;