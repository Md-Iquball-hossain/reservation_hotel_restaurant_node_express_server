import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import InvoiceService from "../services/invoice.service";
import InvoiceValidator from "../../appAdmin/utlis/validator/invoice.validator";



    class InvoiceController extends AbstractController {
        private Service = new InvoiceService();
        private validator = new InvoiceValidator();
        constructor() {
        super();
    }

    //=================== Invoice Controller ======================//

    // get all invoice
    public getAllInvoice = this.asyncWrapper.wrap(
        { querySchema: this.validator.getAllInvoiceValidator},
        async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.getAllInvoice(req);
        res.status(code).json(data);
        }
    );

    // get single Invoice
    public getSingleInvoice = this.asyncWrapper.wrap(
        { paramSchema: this.commonValidator.singleParamValidator() },
        async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.getSingleInvoice(req);

        res.status(code).json(data);
        }
    );

}
export default InvoiceController;