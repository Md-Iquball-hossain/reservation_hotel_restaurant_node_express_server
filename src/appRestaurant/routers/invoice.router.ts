import AbstractRouter from "../../abstarcts/abstract.router";
import InvoiceController from "../controllers/invoice.controller";

class InvoiceRouter extends AbstractRouter {
    private Controller = new InvoiceController();

    constructor() {
        super();
        this.callRouter();
    }

    private callRouter() {

    //=================== Purchase Router ======================//

    // Invoice
    this.router
    .route("/")
    .get(this.Controller.getAllInvoice);
    

    // Single Invoice
    this.router.route("/:id")
    .get(this.Controller.getSingleInvoice);

    }
}
export default InvoiceRouter;