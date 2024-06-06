import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";

    class InvoiceService extends AbstractServices {
        constructor() {
            super();
        }

    //=================== Invoice ======================//

    // get All invoice service
    public async getAllInvoice(req: Request) {
        const { from_date, to_date, key, limit, skip, due_inovice } = req.query;
        const { res_id } = req.rest_user;

        // model
        const model = this.Model.restaurantModel();

        const { data, total } = await model.getAllInvoice({
        res_id,
        from_date: from_date as string,
        to_date: to_date as string,
        key: key as string,
        limit: limit as string,
        skip: skip as string,
        due_inovice: due_inovice as string,
        });

        return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        total,
        data,
        };
    }

    // Get Single Invoice
    public async getSingleInvoice(req: Request) {
        const { id } = req.params;
    
        const model = this.Model.restaurantModel();
        const singleInvoiceData = await model.getSingleInvoice({
            res_id: req.rest_user.res_id,
            id: parseInt(id),
            });
            if (!singleInvoiceData.length) {
            return {
                success: false,
                code: this.StatusCode.HTTP_NOT_FOUND,
                message: this.ResMsg.HTTP_NOT_FOUND,
            };
            }
            return {
            success: true,
            code: this.StatusCode.HTTP_OK,
            data: singleInvoiceData[0],
            };
        }

}
export default InvoiceService;