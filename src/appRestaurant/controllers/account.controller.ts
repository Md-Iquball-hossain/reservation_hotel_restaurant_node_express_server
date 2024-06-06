import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import RestaurantAccountService from "../services/account.service";
import RestaurantAccountValidator from "../utils/validator/account.validator";

    class RestaurantAccountController extends AbstractController {
        private Service = new RestaurantAccountService();
        private Validator = new RestaurantAccountValidator();
        constructor() {
        super();
    }

    // Create Account
    public createAccount = this.asyncWrapper.wrap(
        { bodySchema: this.Validator.createAccountValidator },
        async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.createAccount(req);

        res.status(code).json(data);
        }
    );

    // Get all Account
    public getAllAccount = this.asyncWrapper.wrap(
        { querySchema: this.Validator.getAllAccountQueryValidator },
        async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.getAllAccount(req);
        res.status(code).json(data);
        }
    );

    // Update Account
    public updateAccount = this.asyncWrapper.wrap(
        { bodySchema: this.Validator.updateAccountValidator },
        async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.updateAccount(req);

        res.status(code).json(data);
        }
    );

    // balance transfer
    public balanceTransfer = this.asyncWrapper.wrap(
        { bodySchema: this.Validator.balanceTransferValidator },
        async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.balanceTransfer(req);

        res.status(code).json(data);
        }
    );
}
export default RestaurantAccountController;