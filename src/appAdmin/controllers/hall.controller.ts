import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import HallService from "../services/hall.service";
import HallValidator from "../utlis/validator/hall.validation";

class HallController extends AbstractController {
    private hallService=new HallService();
    private hallvalidator = new HallValidator();
    constructor() {
        super();
}
    // Create Hall
    public createHall = this.asyncWrapper.wrap(
    { bodySchema: this.hallvalidator.createHallValidator},
    async (req: Request, res: Response) => {
        const { code, ...data } = await this.hallService.createHall(req);

        res.status(code).json(data);
        }
    );

    // get all hall with filter
    public getAllHall = this.asyncWrapper.wrap(
        { querySchema: this.hallvalidator.getAllHotelHallQueryValidator },
        async (req: Request, res: Response) => {
        const { code, ...data } = await this.hallService.getAllHall(req);
        res.status(code).json(data);
        }
    );

    // get all hotel available and unavailable hall
    public getAllAvailableAndUnavailableHall = this.asyncWrapper.wrap(
        null,
        // { querySchema: this.hallvalidator.getAvailableHallQueryValidator },
        async (req: Request, res: Response) => {
            const { code, ...data } =
            await this.hallService.getAllAvailableAndUnavailableHall(req);
            res.status(code).json(data);
        }
        );

    // get all available hall
    public getAllAvailableHall = this.asyncWrapper.wrap(
        null,
        // { querySchema: this.hallvalidator.getAvailableHallQueryValidator },
        async (req: Request, res: Response) => {
        const { code, ...data } = await this.hallService.getAllAvailableHall(req);
        res.status(code).json(data);
        }
    );

    // get single hall
    public getSingleHall = this.asyncWrapper.wrap(
        { paramSchema: this.commonValidator.singleParamValidator("hall_id") },
        async (req: Request, res: Response) => {
        const { code, ...data } =
            await this.hallService.getSingleHall(req);
        res.status(code).json(data);
        }
    );

    // update hall
    public updateHall = this.asyncWrapper.wrap(
        { bodySchema: this.hallvalidator.updateHotelHallValidator },
        async (req: Request, res: Response) => {
        const { code, ...data } = await this.hallService.updateHall(req);
        res.status(code).json(data);
        }
    );

}
export default HallController;