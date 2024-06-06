import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import FuelService from "../services/fuel.service";
import FuelValidator from "../utils/validator/fuel.validator";

class FuelController extends AbstractController {
        private Service = new FuelService();
        private Validator = new FuelValidator();
        constructor() {
        super();
    }

    // create Fuel Refill
    public createFuelRefill= this.asyncWrapper.wrap(
    { bodySchema: this.Validator.createFuelValidator },
    async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.createFuelRefill(req);

        res.status(code).json(data);
    }
    );

    // get all Fuel Refill
    public getAllFuelRefill = this.asyncWrapper.wrap(
    { querySchema: this.Validator.getAllFuelValidator },
    async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.getAllFuelRefill(req);

        res.status(code).json(data);
    }
    );

}
export default FuelController;