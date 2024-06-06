import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import ParkingService from "../services/parking.service";
import ParkingValidator from "../utils/validator/parking.validator";

class ParkingController extends AbstractController {
        private Service = new ParkingService();
        private Validator = new ParkingValidator();
        constructor() {
        super();
    }

    // create Parking
    public createParking= this.asyncWrapper.wrap(
    { bodySchema: this.Validator.createParkingValidator },
    async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.createParking(req);

        res.status(code).json(data);
    }
    );

    // get All Parking
    public getAllParking = this.asyncWrapper.wrap(
    { querySchema: this.Validator.getAllParkingValidator },
    async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.getAllParking(req);

        res.status(code).json(data);
    }
    );

    // get single Parking
    public getSingleParking = this.asyncWrapper.wrap(
        { paramSchema: this.commonValidator.singleParamValidator() },
        async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.getSingleParking(req);

        res.status(code).json(data);
        }
    );

    // update Parking
    public updateParking = this.asyncWrapper.wrap(
    { bodySchema: this.Validator.updateParkingValidator },
    async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.updateParking(req);

        res.status(code).json(data);
        }
    );

    // create Vehicle Parking
    public createVehicleParking = this.asyncWrapper.wrap(
    { bodySchema: this.Validator.createVehicleParkingValidator },
    async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.createVehicleParking(req);

        res.status(code).json(data);
    }
    );
    
    // get all Vehicle Parking
    public getAllVehicleParking = this.asyncWrapper.wrap(
    { querySchema: this.Validator.getAllVehicleParkingValidator },
    async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.getAllVehicleParking(req);

        res.status(code).json(data);
    }
    );

    // update Vehicle Parking
    public updateVehicleParking = this.asyncWrapper.wrap(
    { bodySchema: this.Validator.updateVehicleParkingValidator },
    async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.updateVehicleParking(req);

        res.status(code).json(data);
        }
    );

}
export default ParkingController;