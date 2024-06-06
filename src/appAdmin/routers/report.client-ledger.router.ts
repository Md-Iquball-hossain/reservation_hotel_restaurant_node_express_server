import AbstractRouter from "../../abstarcts/abstract.router";
import ClientLedgerReportController from "../controllers/report.client-ledger.controller";

class ClientLegderReportRouter extends AbstractRouter {
    private clientLedgerReportController;
    constructor() {
        super();
        this.clientLedgerReportController = new ClientLedgerReportController();
        this.callRouter();
}
    private callRouter() {

    // get hall Booking report router
    this.router.route("/")
    .get(this.clientLedgerReportController.getClientLedgerReport);

    }
}
export default ClientLegderReportRouter;