import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import RoomBookingService from "../services/room-booking.service";
import RoomBookingValidator from "../utlis/validator/roomBooking.validator";

class RoomBookingController extends AbstractController {
  private roomBookingService;
  private roomBookingValidator = new RoomBookingValidator();
  constructor() {
    super();
    this.roomBookingService = new RoomBookingService();
  }

  // create room booking
  public createRoomBooking = this.asyncWrapper.wrap(
    { bodySchema: this.roomBookingValidator.createRoomBookingValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.roomBookingService.createRoomBooking(
        req
      );
      res.status(code).json(data);
    }
  );

  // get all room booking
  public getAllRoomBooking = this.asyncWrapper.wrap(
    { querySchema: this.roomBookingValidator.getAllRoomBookingQueryValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.roomBookingService.getAllRoomBooking(
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
        await this.roomBookingService.getSingleRoomBooking(req);

      res.status(code).json(data);
    }
  );

  // insert check in room booking
  public insertBookingCheckIn = this.asyncWrapper.wrap(
    { bodySchema: this.roomBookingValidator.insertBookingCheckIn },
    async (req: Request, res: Response) => {
      const { code, ...data } =
        await this.roomBookingService.insertBookingCheckIn(req);
      res.status(code).json(data);
    }
  );

  // get all check in room booking
  public getAllRoomBookingCheckIn = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const { code, ...data } =
        await this.roomBookingService.getAllRoomBookingCheckIn(req);
      res.status(code).json(data);
    }
  );

  // add check out room booking
  public addBookingCheckOut = this.asyncWrapper.wrap(
    {
      paramSchema: this.commonValidator.singleParamValidator(),
      bodySchema: this.roomBookingValidator.addBookingCheckOut,
    },
    async (req: Request, res: Response) => {
      const { code, ...data } =
        await this.roomBookingService.addBookingCheckOut(req);
      res.status(code).json(data);
    }
  );

  // refund
  public refundRoomBooking = this.asyncWrapper.wrap(
    { bodySchema: this.roomBookingValidator.refundRoomBookingValidator },
    async (req: Request, res: Response) => {
    const { code, ...data } =
        await this.roomBookingService.refundRoomBooking(req);

    res.status(code).json(data);
    }
  );

  // update room booking
  public extendRoomBooking = this.asyncWrapper.wrap(
    { bodySchema: this.roomBookingValidator.extendRoomBookingValidator },
    async (req: Request, res: Response) => {
    const { code, ...data } =
      await this.roomBookingService.extendRoomBooking(req);

    res.status(code).json(data);
    }
  );

}
export default RoomBookingController;
