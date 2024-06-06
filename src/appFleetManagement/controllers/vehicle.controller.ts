import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import VehicleService from "../services/vehicle.service";
import VehiclesValidator from "../utils/validator/vehicles.validator";

class VehiclesController extends AbstractController {
        private Service = new VehicleService();
        private Validator = new VehiclesValidator();
        constructor() {
        super();
    }

    // create Vehicle
    public createVehicle= this.asyncWrapper.wrap(
    { bodySchema: this.Validator.createVehicleValidator },
    async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.createVehicle(req);

        res.status(code).json(data);
    }
    );

    // get all Vehicle
    public getAllVehicle = this.asyncWrapper.wrap(
    { querySchema: this.Validator.getAllVehicleValidator },
    async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.getAllVehicle(req);

        res.status(code).json(data);
    }
    );

    // update Vehicle
    public updateVehicle = this.asyncWrapper.wrap(
    { bodySchema: this.Validator.updateVehicleValidator },
    async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.updateVehicle(req);

        res.status(code).json(data);
        }
    );

    // get single Vehicle
    public getSingleVehicle = this.asyncWrapper.wrap(
        { paramSchema: this.commonValidator.singleParamValidator() },
        async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.getSingleVehicle(req);

        res.status(code).json(data);
        }
    );

}
export default VehiclesController;