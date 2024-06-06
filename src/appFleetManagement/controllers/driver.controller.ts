import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import DriverService from "../services/driver.service";
import DriverValidator from "../utils/validator/driver.validator";

class DriverController extends AbstractController {
        private Service = new DriverService();
        private Validator = new DriverValidator();
        constructor() {
        super();
    }

    // create Driver
    public createDriver= this.asyncWrapper.wrap(
    { bodySchema: this.Validator.createDriverValidator },
    async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.createDriver(req);

        res.status(code).json(data);
    }
    );

    // get all Driver
    public getAllDriver = this.asyncWrapper.wrap(
    { querySchema: this.Validator.getAllDriverValidator },
    async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.getAllDriver(req);

        res.status(code).json(data);
    }
    );

    // update Driver
    public updateDriver = this.asyncWrapper.wrap(
    { bodySchema: this.Validator.updateDriverValidator },
    async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.updateDriver(req);

        res.status(code).json(data);
        }
    );

    // get single Driver
    public getSingleDriver = this.asyncWrapper.wrap(
        { paramSchema: this.commonValidator.singleParamValidator() },
        async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.getSingleDriver(req);

        res.status(code).json(data);
        }
    );

}
export default DriverController;