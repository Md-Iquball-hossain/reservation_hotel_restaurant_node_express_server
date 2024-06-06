import AbstractRouter from "../../abstarcts/abstract.router";
import ResOrderController from "../controllers/order.controller";

class ResOrderRouter extends AbstractRouter {
  public Controller;

  constructor() {
    super();
    this.Controller = new ResOrderController();
    this.callRouter();
  }

  private callRouter() {
    // create order
    this.router
      .route("/")
      .post(this.Controller.createOrder)
      .get(this.Controller.getAllOrder);

    // create Table
    this.router
      .route("/table")
      .post(this.Controller.createTable)
      .get(this.Controller.getAllTable);

    // Get all employee
    this.router.route("/employee").get(this.Controller.getAllEmployee);

    // Get all Kitchen order
    this.router.route("/kitchen").get(this.Controller.getAllKitchenOrder);

    // Get all guest order
    this.router.route("/guest").get(this.Controller.getAllGuest);

    // ordern payment
    this.router.route("/payment/:id").post(this.Controller.orderPayment);

    // update Kitchen order
    this.router
      .route("/kitchen/:id")
      .patch(this.Controller.updateKitchenstatus);

    // update table
    this.router.route("/table/:id").patch(this.Controller.updateTableName);

    // single order
    this.router
      .route("/:id")
      .get(this.Controller.getSingleOrder)
      .patch(this.Controller.updateOrder);
  }
}

export default ResOrderRouter;
