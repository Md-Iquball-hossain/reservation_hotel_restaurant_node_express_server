import AbstractRouter from "../../abstarcts/abstract.router";
import HotelController from "../controllers/hotel.controller";

class HotelRouter extends AbstractRouter {
  private hotelController = new HotelController();
  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    // get my hotel
    this.router
      .route("/")
      .get(this.hotelController.getMyHotel)
      .patch(
        this.uploader.cloudUploadRaw(this.fileFolders.HOTEL_FILES),
        this.hotelController.updateMyHotel
      );
  }

}
export default HotelRouter;
