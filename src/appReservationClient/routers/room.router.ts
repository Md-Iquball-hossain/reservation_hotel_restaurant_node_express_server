
import AbstractRouter from "../../abstarcts/abstract.router";
import ClientRoomController from "../controllers/room.controller";

class clientRoomRouter extends AbstractRouter {
    private clientRoomController;

    constructor() {
        super();
        this.clientRoomController = new ClientRoomController();
        this.callRouter();
    }
    private callRouter() {

    // get all room
    this.router.route("/")
    .get(this.clientRoomController.getAllHotelRoom);

    // get all available and unavailable room
    this.router
        .route("/available-unavailable")
        .get(this.clientRoomController.getAllAvailableAndUnavailableRoom);

    // get all available room
    this.router
        .route("/available")
        .get(this.clientRoomController.getAllAvailableRoom);

    this.router.route("/:room_id")
    .get(this.clientRoomController.getSingleHotelRoom);
    

    }
}
export default clientRoomRouter;
