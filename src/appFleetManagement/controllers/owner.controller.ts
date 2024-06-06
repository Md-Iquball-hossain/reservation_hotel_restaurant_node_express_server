import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import ownerService from "../services/owner.service";
import ownerValidator from "../utils/validator/owner.validator";


class OwnerController extends AbstractController {
        private Service = new ownerService();
        private Validator = new ownerValidator();
        constructor() {
        super();
    }

    // create owner
    public createOwner= this.asyncWrapper.wrap(
    { bodySchema: this.Validator.createOwnerValidator },
    async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.createOwner(req);

        res.status(code).json(data);
    }
    );

    // get all owner
    public getAllOwner = this.asyncWrapper.wrap(
    { querySchema: this.Validator.getAllOwnerValidator },
    async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.getAllOwner(req);

        res.status(code).json(data);
    }
    );

    // update owner
    public updateOwner = this.asyncWrapper.wrap(
    { bodySchema: this.Validator.updateOwnerValidator },
    async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.updateOwner(req);

        res.status(code).json(data);
        }
    );

    // get single Owner
    public getSingleOwner = this.asyncWrapper.wrap(
        { paramSchema: this.commonValidator.singleParamValidator() },
        async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.getSingleOwner(req);

        res.status(code).json(data);
        }
    );

}
export default OwnerController;