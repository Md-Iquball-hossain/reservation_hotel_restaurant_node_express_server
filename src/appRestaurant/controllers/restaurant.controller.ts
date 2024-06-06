import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import RestaurantService from "../services/restaurant.service";
import RestaurantValidator from "../utils/validator/restaurant.validator";



    class RestaurantController extends AbstractController {
        private Service = new RestaurantService();
        private Validator = new RestaurantValidator();
        constructor() {
        super();
    }

    //=================== Restaurant Controller ======================//

    // get Single Restaurant
    public getSingleRestaurant = this.asyncWrapper.wrap(
        null,
        async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.getSingleRestaurant(
        req
        );
        res.status(code).json(data);
        }
    );

    // Update Restaurant
    public updateRestaurant = this.asyncWrapper.wrap(
        { bodySchema: this.Validator.updateRestaurantValidator },
        async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.updateRestaurant(req);

        res.status(code).json(data);
        }
    );

    // Update Restaurant Admin
    public updateResAdmin = this.asyncWrapper.wrap(
        { bodySchema: this.Validator.updateRestaurantAdminValidator},
        async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.updateResAdmin(req);

        res.status(code).json(data);
        }
    );

}
export default RestaurantController;