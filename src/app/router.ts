import { Router } from "express";
import MAdminRouter from "../appM360/routers/mAdmin.router";
import AuthRouter from "../auth/auth.router";
import CommonRouter from "../common/router/common.router";
import HotelAdminRouter from "../appAdmin/routers/hotelAdmin.router";
import ReservationClientRouter from "../appReservationClient/routers/reservation-client.router";
import RestaurantRouter from "../appRestaurant/routers/restaurant.app.router";
import CommonThingsRouter from "../common/router/common_things.router";

class RootRouter {
  public v1Router = Router();

  constructor() {
    this.callV1Router();
  }

  private callV1Router() {
    // auth router
    this.v1Router.use("/common", new CommonRouter().router);

    // common router for all
    this.v1Router.use("/auth", new AuthRouter().AuthRouter);

    // ================== reservation ===================== //
    this.v1Router.use("/reservation", new HotelAdminRouter().hAdminRouter);

    // ================== restaurant ===================== //
    this.v1Router.use("/restaurant", new RestaurantRouter().restaurantRouter);

    // ==================  reservation client ===================== //
    this.v1Router.use(
      "/reservation-client",
      new ReservationClientRouter().hUserRouter
    );

    // ================== m360 admin panel ===================//
    this.v1Router.use("/m360", new MAdminRouter().mAdminRouter);

    //==================== common things ===================== //
    this.v1Router.use("/common-things", new CommonThingsRouter().router);
  }
}
export default RootRouter;
