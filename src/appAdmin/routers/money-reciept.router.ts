import AbstractRouter from "../../abstarcts/abstract.router";
import MoneyRecieptController from "../controllers/money-reciept.controller";

class MoneyRecieptRouter extends AbstractRouter {
  public moneyRecieptController;

  constructor() {
    super();
    this.moneyRecieptController = new MoneyRecieptController();
    this.callRouter();
  }

  private callRouter() {
    // create and get all money reciept
    this.router
      .route("/")
      .post(this.moneyRecieptController.createMoneyReciept)
      .get(this.moneyRecieptController.getAllMoneyReciept);

    // advance money return
    this.router
      .route("/advance-return")
      .post(this.moneyRecieptController.advanceReturnMoneyReciept)
      .get(this.moneyRecieptController.getAllAdvanceReturnMoneyReciept);

    // single advance return
    this.router
      .route("/advance-return/:id")
      .get(this.moneyRecieptController.getSingleAdvanceReturnMoneyReciept);

    // single money reciept
    this.router
      .route("/:id")
      .get(this.moneyRecieptController.getSingleMoneyReciept);
  }
}

export default MoneyRecieptRouter;
