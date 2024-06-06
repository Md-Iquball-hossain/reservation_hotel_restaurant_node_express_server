import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import HallBookingValidator from "../utlis/validator/hallBooking.validator";
import HallBookingService from "../services/hall-booking.service";
class HallBookingController extends AbstractController {
  private hallBookingService;
  private hallBookingValidator = new HallBookingValidator();
  constructor() {
    super();
    this.hallBookingService = new HallBookingService();
  }

  // create hall booking
  public createHallBooking = this.asyncWrapper.wrap(
    { bodySchema: this.hallBookingValidator.createHallBookingValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.hallBookingService.createHallBooking(
        req
      );
      res.status(code).json(data);
    }
  );

  // get all hall booking
  public getAllHallBooking = this.asyncWrapper.wrap(
    { querySchema: this.hallBookingValidator.getAllHallBookingQueryValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.hallBookingService.getAllHallBooking(
        req
      );
      res.status(code).json(data);
    }
  );

  // get single hall booking
  public getSingleHallBooking = this.asyncWrapper.wrap(
    { paramSchema: this.commonValidator.singleParamValidator() },
    async (req: Request, res: Response) => {
      const { code, ...data } =
        await this.hallBookingService.getSingleHallBooking(req);

      res.status(code).json(data);
    }
  );

  // insert check in hall booking
  public insertHallBookingCheckIn = this.asyncWrapper.wrap(
    { bodySchema: this.hallBookingValidator.insertHallBookingCheckIn },
    async (req: Request, res: Response) => {
      const { code, ...data } =
        await this.hallBookingService.insertHallBookingCheckIn(req);
      res.status(code).json(data);
    }
  );

  // get all check in hall booking
  public getAllHallBookingCheckIn = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const { code, ...data } =
        await this.hallBookingService.getAllHallBookingCheckIn(req);
      res.status(code).json(data);
    }
  );

  // add check out hall booking
  public updateBookingCheckOut = this.asyncWrapper.wrap(
    {
      paramSchema: this.commonValidator.singleParamValidator(),
      bodySchema: this.hallBookingValidator.addHallBookingCheckOut,
    },
    async (req: Request, res: Response) => {
      const { code, ...data } =
        await this.hallBookingService.updateBookingCheckOut(req);
      res.status(code).json(data);
    }
  );
}

export default HallBookingController;