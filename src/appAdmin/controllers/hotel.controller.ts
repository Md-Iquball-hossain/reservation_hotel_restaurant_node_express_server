import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import HotelService from "../services/hotel.service";
import HotelValidator from "../utlis/validator/hotel.validator";

class HotelController extends AbstractController {
  private hotelService;
  private hotelValidator = new HotelValidator();
  constructor() {
    super();

    this.hotelService = new HotelService();
  }

  // get my hotel
  public getMyHotel = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.hotelService.getMyHotel(req);

      res.status(code).json(data);
    }
  );

  // update my hotel
  public updateMyHotel = this.asyncWrapper.wrap(
    { bodySchema: this.hotelValidator.updateHotelValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.hotelService.updateMyHotel(req);

      res.status(code).json(data);
    }
  );
}

export default HotelController;
