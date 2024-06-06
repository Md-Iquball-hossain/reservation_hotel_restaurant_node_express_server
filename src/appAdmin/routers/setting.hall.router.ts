import AbstractRouter from "../../abstarcts/abstract.router";
import HallSettingController from "../controllers/setting.hall.controller";

class HallSettingRouter extends AbstractRouter {
    private hallSettingController = new HallSettingController();

    constructor() {
        super();
        this.callRouter();
    }

    private callRouter() {

    //=================== Hall Amenities Router ======================//

    // Hall amenities
    this.router
    .route("/amenities")
    .post(this.hallSettingController.createHallAmenities)
    .get(this.hallSettingController.getAllHallAmenities)

    // edit and remove Hall 
    this.router
    .route("/amenities/:id")
    .patch(this.hallSettingController.updateHallAmenities)
    .delete(this.hallSettingController.deleteHallAmenities);
    }

}
export default HallSettingRouter;