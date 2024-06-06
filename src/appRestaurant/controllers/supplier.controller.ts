import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import SupplierService from "../services/supplier.service";
import SupplierValidator from "../utils/validator/supplier.validator";


class SupplierController extends AbstractController {
        private Service = new SupplierService();
        private Validator = new SupplierValidator();
        constructor() {
        super();
    }

    //=================== Supplier Controller ======================//

    // create Supplier
    public createSupplier= this.asyncWrapper.wrap(
        { bodySchema: this.Validator.createSupplierValidatorValidator },
        async (req: Request, res: Response) => {
            const { code, ...data } = await this.Service.createSupplier(req);

            res.status(code).json(data);
        }
    );

    // get All Supplier
    public getAllSupplier = this.asyncWrapper.wrap(
        { querySchema: this.Validator.getAllSupplierQueryValidator },
        async (req: Request, res: Response) => {
            const { code, ...data } = await this.Service.getAllSupplier(req);

            res.status(code).json(data);
        }
    );

    // update Supplier
    public updateSupplier = this.asyncWrapper.wrap(
        { bodySchema: this.Validator.UpdateSupplierValidator },
        async (req: Request, res: Response) => {
            const { code, ...data } = await this.Service.updateSupplier(req);

            res.status(code).json(data);
            }
        );

    // Delete Supplier
    public deleteSupplier = this.asyncWrapper.wrap(
        { paramSchema: this.commonValidator.singleParamValidator() },
        async (req: Request, res: Response) => {
            const { code, ...data } = await this.Service.deleteSupplier(req);

            res.status(code).json(data);
            }
        );

}
export default SupplierController;