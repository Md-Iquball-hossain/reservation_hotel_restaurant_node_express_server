import AbstractRouter from "../../abstarcts/abstract.router";
import SupplierController from "../controllers/supplier.controller";


class SupplierRouter extends AbstractRouter {
    private Controller = new SupplierController();

    constructor() {
        super();
        this.callRouter();
    }

    private callRouter() {

    //=================== Supplier Router ======================//

        // Supplier
        this.router
        .route("/")
        .post(this.Controller.createSupplier)
        .get(this.Controller.getAllSupplier)

        // edit and remove Supplier
        this.router
        .route("/:id")
        .patch(this.Controller.updateSupplier)
        .delete(this.Controller.deleteSupplier);

    }

}
export default SupplierRouter;