import { Router } from "express";
import AuthChecker from "../../common/middleware/authChecker/authChecker";
import IngredientRouter from "./ingredient.router";
import SupplierRouter from "./supplier.router";
import CategoryRouter from "./category.router";
import PurchaseRouter from "./purchase.router";
import RestaurantProfileRouter from "./restaurant.profile.router";
import RestaurantAccountRouter from "./account.router";
import FoodRouter from "./food.router";
import InventoryRouter from "./inventory.router";
import ExpenseResRouter from "./expense.router";
import ResOrderRouter from "./order.router";
import InvoiceRouter from "./invoice.router";
import ResReportRouter from "./report.router";
import AdministrationResRouter from "./admin-role.router";

class RestaurantRouter {
  public restaurantRouter = Router();
  public authChecker = new AuthChecker();

  constructor() {
    this.callRouter();
  }

  private callRouter() {
    // Restaurant Profile router
    this.restaurantRouter.use(
      "/profile",
      this.authChecker.hotelRestAuthChecker,
      new RestaurantProfileRouter().router
    );

    // ingredient router
    this.restaurantRouter.use(
      "/ingredient",
      this.authChecker.hotelRestAuthChecker,
      new IngredientRouter().router
    );

    // Supplier router
    this.restaurantRouter.use(
      "/supplier",
      this.authChecker.hotelRestAuthChecker,
      new SupplierRouter().router
    );

    // Category router
    this.restaurantRouter.use(
      "/category",
      this.authChecker.hotelRestAuthChecker,
      new CategoryRouter().router
    );

    // Purchase router
    this.restaurantRouter.use(
      "/purchase",
      this.authChecker.hotelRestAuthChecker,
      new PurchaseRouter().router
    );

    // Account router
    this.restaurantRouter.use(
      "/account",
      this.authChecker.hotelRestAuthChecker,
      new RestaurantAccountRouter().router
    );

    // Food router
    this.restaurantRouter.use(
      "/food",
      this.authChecker.hotelRestAuthChecker,
      new FoodRouter().router
    );

    // inventory router
    this.restaurantRouter.use(
      "/inventory",
      this.authChecker.hotelRestAuthChecker,
      new InventoryRouter().router
    );

    // expense router
    this.restaurantRouter.use(
      "/expense",
      this.authChecker.hotelRestAuthChecker,
      new ExpenseResRouter().router
    );

    // order router
    this.restaurantRouter.use(
      "/order",
      this.authChecker.hotelRestAuthChecker,
      new ResOrderRouter().router
    );

    // invoice router
    this.restaurantRouter.use(
      "/invoice",
      this.authChecker.hotelRestAuthChecker,
      new InvoiceRouter().router
    );

    // invoice router
    this.restaurantRouter.use(
      "/report",
      this.authChecker.hotelRestAuthChecker,
      new ResReportRouter().router
    );

    // administration router
    this.restaurantRouter.use(
      "/administration",
      this.authChecker.hotelRestAuthChecker,
      new AdministrationResRouter().router
    );
  }
}
export default RestaurantRouter;
