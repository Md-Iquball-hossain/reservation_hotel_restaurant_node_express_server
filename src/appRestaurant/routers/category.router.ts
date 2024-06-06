import AbstractRouter from "../../abstarcts/abstract.router";
import CategoryController from "../controllers/category.controller";

class CategoryRouter extends AbstractRouter {
    private Controller = new CategoryController();

    constructor() {
        super();
        this.callRouter();
    }

    private callRouter() {

    //=================== Category Router ======================//

        // Category
        this.router
        .route("/")
        .post(this.Controller.createCategory)
        .get(this.Controller.getAllCategory)

        // edit and remove Category
        this.router
        .route("/:id")
        .patch(this.Controller.updateCategory)
        .delete(this.Controller.deleteCategory);

    }

}
export default CategoryRouter;