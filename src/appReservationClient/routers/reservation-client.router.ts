import { Router } from "express";
import AuthChecker from "../../common/middleware/authChecker/authChecker";
import clientRoomRouter from "./room.router";
import ClientRoomBookingRouter from "./room-booking.router";
import RoomImagesRouter from "./images.router";

class ReservationClientRouter {
    public hUserRouter = Router();
    public authChecker = new AuthChecker();

    constructor() {
        this.callRouter();
    }

    private callRouter() {

    // room router
    this.hUserRouter.use(
        "/room",
        this.authChecker.webTokenVerfiyChecker,
        new clientRoomRouter().router
    );

    // room router
    this.hUserRouter.use(
        "/images",
        this.authChecker.webTokenVerfiyChecker,
        new RoomImagesRouter().router
    );

    // room router
    this.hUserRouter.use(
        "/room-booking",
        this.authChecker.webTokenVerfiyChecker,
        new ClientRoomBookingRouter().router
    );

    }
}
export default ReservationClientRouter;