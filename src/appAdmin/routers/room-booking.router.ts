import AbstractRouter from "../../abstarcts/abstract.router";
import RoomBookingController from "../controllers/room-booking.controller";

class RoomBookingRouter extends AbstractRouter {
  private roomBookingController;
  constructor() {
    super();
    this.roomBookingController = new RoomBookingController();
    this.callRouter();
  }
  private callRouter() {
    // room booking router
    this.router
      .route("/")
      .post(this.roomBookingController.createRoomBooking)
      .get(this.roomBookingController.getAllRoomBooking);

    // check in router
    this.router
      .route("/check-in")
      .post(this.roomBookingController.insertBookingCheckIn)
      .get(this.roomBookingController.getAllRoomBookingCheckIn);

    // checkout router
    this.router
      .route("/check-out/:id")
      .post(this.roomBookingController.addBookingCheckOut);

    // extend room booking
    this.router
      .route("/extend/:id")
      .patch(this.roomBookingController.extendRoomBooking);

    // refund room booking
    this.router
      .route("/refund/:id")
      .patch(this.roomBookingController.refundRoomBooking);

    // single room booking
    this.router
      .route("/:id")
      .get(this.roomBookingController.getSingleRoomBooking);
  }
}
export default RoomBookingRouter;
