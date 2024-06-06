import AbstractRouter from "../../abstarcts/abstract.router";
import BankNameController from "../controllers/paymentMethod.controller";

class BankNameRouter extends AbstractRouter {
  private Controller = new BankNameController();

  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {

  //=================== Bank Name Router ======================//

    // Bank name create and get
    this.router
      .route("/")
      .post(this.Controller.createBankName)
      .get(this.Controller.getAllBankName)

    // edit and delete Bank name
    this.router
      .route("/:id")
      .patch(this.Controller.updateBanKName)
      .delete(this.Controller.deleteBanKName);

  }

}
export default BankNameRouter;