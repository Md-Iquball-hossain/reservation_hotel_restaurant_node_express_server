import AbstractRouter from "../../abstarcts/abstract.router";
import ClientRoomController from "../controllers/room.controller";

class RoomImagesRouter extends AbstractRouter {
    private Controller;
    constructor() {
    super();
    this.Controller = new ClientRoomController();
    this.callRouter();
    }
    private callRouter() {

        // hotel room images
        this.router
        .route("/")
        .get(this.Controller.getAllHotelRoomImages);

    }

}
export default RoomImagesRouter;