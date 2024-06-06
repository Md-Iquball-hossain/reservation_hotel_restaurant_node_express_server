import AbstractRouter from "../../abstarcts/abstract.router";
import RoomController from "../controllers/room.controller";

class RoomRouter extends AbstractRouter {
  private roomController;
  constructor() {
    super();
    this.roomController = new RoomController();
    this.callRouter();
  }
  private callRouter() {
    // create room
    this.router
      .route("/create")
      .post(
        this.uploader.cloudUploadRaw(this.fileFolders.ROOM_FILES),
        this.roomController.createroom
    );

    // get all room
    this.router.route("/").get(this.roomController.getAllHotelRoom);

    // get all available and unavailable room
    this.router
      .route("/available-unavailable")
      .get(this.roomController.getAllAvailableAndUnavailableRoom);

    // get all available room
    this.router
      .route("/available")
      .get(this.roomController.getAllAvailableRoom);

    // get Single room
    this.router
      .route("/:room_id")
      .get(this.roomController.getSingleHotelRoom)
      .patch(
        this.uploader.cloudUploadRaw(this.fileFolders.ROOM_FILES),
        this.roomController.updateHotelRoom
      );
  }
}
export default RoomRouter;
