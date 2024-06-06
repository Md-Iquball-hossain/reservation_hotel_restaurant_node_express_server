import AbstractRouter from "../../abstarcts/abstract.router";
import IngredientController from "../controllers/ingredient.controller";


class IngredientRouter extends AbstractRouter {
    private Controller = new IngredientController();

    constructor() {
        super();
        this.callRouter();
    }

    private callRouter() {

    //=================== Ingredient Router ======================//

        // Ingredient
        this.router
        .route("/")
        .post(this.Controller.createIngredient)
        .get(this.Controller.getAllIngredient)

        // edit and remove Ingredient
        this.router
        .route("/:id")
        .patch(this.Controller.updateIngredient)
        .delete(this.Controller.deleteIngredient);

    }

}
export default IngredientRouter;