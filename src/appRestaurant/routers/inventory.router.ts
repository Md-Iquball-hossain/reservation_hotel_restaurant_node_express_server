import AbstractRouter from "../../abstarcts/abstract.router";
import InventoryController from "../controllers/inventory.controller";

class InventoryRouter extends AbstractRouter {
  private Controller = new InventoryController();

  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    // Inventory
    this.router.route("/").get(this.Controller.getAllInventory);
  }
}
export default InventoryRouter;
