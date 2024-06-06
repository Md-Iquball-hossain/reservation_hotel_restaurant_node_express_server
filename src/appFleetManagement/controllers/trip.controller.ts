import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import TripService from "../services/trip.service";
import TripValidator from "../utils/validator/trip.validator";

class TripController extends AbstractController {
        private Service = new TripService();
        private Validator = new TripValidator();
        constructor() {
        super();
    }

    // create Trip
    public createTrip = this.asyncWrapper.wrap(
    { bodySchema: this.Validator.createTripValidator },
    async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.createTrip(req);

        res.status(code).json(data);
    }
    );

    // get all Trip
    public getAllTrip = this.asyncWrapper.wrap(
    { querySchema: this.Validator.getAllTripValidator },
    async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.getAllTrip(req);

        res.status(code).json(data);
    }
    );

}
export default TripController;