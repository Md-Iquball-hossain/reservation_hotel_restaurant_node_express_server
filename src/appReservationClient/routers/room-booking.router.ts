import AbstractRouter from "../../abstarcts/abstract.router";
import AuthChecker from "../../common/middleware/authChecker/authChecker";
import CRoomBookingController from "../controllers/booking.controller";

class ClientRoomBookingRouter extends AbstractRouter {

    private clientRoomBookingController = new CRoomBookingController();
    private authChecker = new AuthChecker();

  constructor() {
      super();
      this.callRouter();
  }

  private callRouter() {
    // room booking router
    this.router
      .route("/")

      .post(
        this.authChecker.hotelUserAuthChecker,
        this.clientRoomBookingController.createRoomBooking)
      .get(
        this.authChecker.hotelUserAuthChecker,
        this.clientRoomBookingController.getAllRoomBooking);

    // single room
    this.router
      .route("/single/:id")
      .get(
        this.authChecker.hotelUserAuthChecker,
        this.clientRoomBookingController.getSingleRoomBooking);
  }
}

export default ClientRoomBookingRouter;
