import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import URoomBookingValidator from "../utils/validation/room-booking.validator";
import URoomBookingService from "../services/booking.service";


class CRoomBookingController extends AbstractController {
    private ClientroomBookingService;
    private userRoomBookingValidator = new URoomBookingValidator();
    constructor() {
        super();
        this.ClientroomBookingService = new URoomBookingService();
    }

    // create room booking
    public createRoomBooking = this.asyncWrapper.wrap(
        { bodySchema: this.userRoomBookingValidator.createRoomBookingValidator },
        async (req: Request, res: Response) => {
        const { code, ...data } = await this.ClientroomBookingService.createRoomBooking(
            req
        );
        res.status(code).json(data);
        }
    );

    // get all room booking
    public getAllRoomBooking = this.asyncWrapper.wrap(
        { querySchema: this.userRoomBookingValidator.getAllRoomBookingQueryValidator },
        async (req: Request, res: Response) => {
        const { code, ...data } = await this.ClientroomBookingService.getAllRoomBooking(
            req
        );
        res.status(code).json(data);
        }
    );

    // get single room booking
    public getSingleRoomBooking = this.asyncWrapper.wrap(
        { paramSchema: this.commonValidator.singleParamValidator() },
        async (req: Request, res: Response) => {
        const { code, ...data } =
            await this.ClientroomBookingService.getSingleRoomBooking(req);

        res.status(code).json(data);
        }
    );

}
export default CRoomBookingController;
