import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import hotelRestaurantService from "../services/restaurant.hotel.service";
import HotelRestaurantValidator from "../utlis/validator/restaurant.hotel.validator";

class hotelRestaurantController extends AbstractController {
  private Service = new hotelRestaurantService();
  private Validator = new HotelRestaurantValidator();
  constructor() {
    super();
  }

  //=================== hotel Restaurant Controller ======================//

  // create Restaurant
  public createRestaurant = this.asyncWrapper.wrap(
    { bodySchema: this.Validator.createRestaurantValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.Service.createRestaurant(req);

      res.status(code).json(data);
    }
  );

  // get All Restaurant
  public getAllRestaurant = this.asyncWrapper.wrap(
    { querySchema: this.Validator.getAllRestaurantQueryValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.Service.getAllRestaurant(req);
      res.status(code).json(data);
    }
  );

  // Update Hotel Restaurant
  public updateHotelRestaurant = this.asyncWrapper.wrap(
    { bodySchema: this.Validator.updateHotelRestaurantValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.Service.updateHotelRestaurant(req);

      res.status(code).json(data);
    }
  );
}
export default hotelRestaurantController;
