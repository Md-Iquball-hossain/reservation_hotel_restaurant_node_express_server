import AbstractRouter from "../../abstarcts/abstract.router";
import RoomSettingController from "../controllers/setting.room.controller";

class RoomSettingRouter extends AbstractRouter {
  private roomSettingController = new RoomSettingController();

  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {

  //=================== Room Type Router ======================//

    // room type
    this.router
      .route("/room-type")
      .post(this.roomSettingController.createRoomType)
      .get(this.roomSettingController.getAllRoomType)

    // edit and remove room type
    this.router
      .route("/room-type/:id")
      .patch(this.roomSettingController.updateRoomType)
      .delete(this.roomSettingController.deleteRoomType);

  //=================== Bed Type Router ======================//

    // bed type
    this.router
      .route("/bed-type")
      .post(this.roomSettingController.createBedType)
      .get(this.roomSettingController.getAllBedType)

    // edit and remove bed type
    this.router
      .route("/bed-type/:id")
      .patch(this.roomSettingController.updateBedType)
      .delete(this.roomSettingController.deleteBedType);

  //=================== Amenities Type Router ======================//

    // room amenities
    this.router
      .route("/room-amenities")
      .post(this.roomSettingController.createRoomAmenities)
      .get(this.roomSettingController.getAllRoomAmenities)

    // edit and remove bed type
    this.router
      .route("/room-amenities/:id")
      .patch(this.roomSettingController.updateRoomAmenities)
      .delete(this.roomSettingController.deleteRoomAmenities);

  }

}
export default RoomSettingRouter;