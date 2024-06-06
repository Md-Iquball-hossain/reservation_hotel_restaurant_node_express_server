import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import SettingValidator from "../utlis/validator/setting.validator";
import HallSettingService from "../services/setting.hall.service";

class HallSettingController extends AbstractController {
        private hallSettingService = new HallSettingService();
        private settingValidator = new SettingValidator();
        constructor() {
        super();
    }

    //=================== Room Amenities Controller ======================//

    // Create Hall Amenities
    public createHallAmenities= this.asyncWrapper.wrap(
        { bodySchema: this.settingValidator.createHallAmenitiesValidator },
        async (req: Request, res: Response) => {
            const { code, ...data } = await this.hallSettingService.createHallAmenities(req);

            res.status(code).json(data);
        }
    );

    // Get All Hall Amenities
    public getAllHallAmenities = this.asyncWrapper.wrap(
        { querySchema: this.settingValidator.getAllHallAmenitiesQueryValidator },
        async (req: Request, res: Response) => {
            const { code, ...data } = await this.hallSettingService.getAllHallAmenities(req);

            res.status(code).json(data);
        }
    );

    // Update Hall Amenities
    public updateHallAmenities = this.asyncWrapper.wrap(
        { bodySchema: this.settingValidator.UpdateHallAmenitiesValidator },
        async (req: Request, res: Response) => {
            const { code, ...data } = await this.hallSettingService.updateHallAmenities(req);

            res.status(code).json(data);
            }
        );

    // Delete Hall Amenities
    public deleteHallAmenities = this.asyncWrapper.wrap(
        { paramSchema: this.commonValidator.singleParamValidator() },
        async (req: Request, res: Response) => {
            const { code, ...data } = await this.hallSettingService.deleteHallAmenities(req);

            res.status(code).json(data);
            }
        );

}
export default HallSettingController;