import AbstractRouter from "../../abstarcts/abstract.router";
import MHotelController from "../controllers/mHotel.controller";

class MHotelRouter extends AbstractRouter {
  public hotelController;

  constructor() {
    super();
    this.hotelController = new MHotelController();
    this.callRouter();
  }
  private callRouter() {
    // create hotel and get all hotel
    this.router
      .route("/")
      .post(
        this.uploader.cloudUploadRaw(this.fileFolders.HOTEL_FILES),
        this.hotelController.createHotel
      )
      .get(this.hotelController.getAllHotel);

    // get single hotel
    this.router
      .route("/:id")
      .get(this.hotelController.getSingleHotel)
      .patch(
        this.uploader.cloudUploadRaw(this.fileFolders.HOTEL_FILES),
        this.hotelController.updateHotel
      );
  }
}

export default MHotelRouter;
