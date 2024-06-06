    import { Request, Response } from "express";
    import AbstractController from "../../abstarcts/abstract.controller";
    import PayRollValidator from "../utlis/validator/payRoll.validator";
    import PayRollService from "../services/payroll.service";

    class PayRollController extends AbstractController {
    private service = new PayRollService();
    private payRollValidator = new PayRollValidator();
    constructor() {
        super();
    }

    // Create Pay Roll
    public createPayRoll = this.asyncWrapper.wrap(
        { bodySchema: this.payRollValidator.CreatePayrollValidator },
        async (req: Request, res: Response) => {
        const { code, ...data } = await this.service.createPayRoll(req);
        if (data.success) {
            res.status(code).json(data);
        } else {
            this.error(data.message, code);
        }
        }
    );

    // get all Pay Roll
    public getAllPayRoll = this.asyncWrapper.wrap(
        { querySchema: this.payRollValidator.getAllPayRollValidator },
        async (req: Request, res: Response) => {
        const { code, ...data } = await this.service.getAllPayRoll(req);

        res.status(code).json(data);
        }
    );

    // get Single Pay Roll
    public getSinglePayRoll = this.asyncWrapper.wrap(
        { paramSchema: this.commonValidator.singleParamValidator() },
        async (req: Request, res: Response) => {
        const { code, ...data } = await this.service.getSinglePayRoll(req);

        res.status(code).json(data);
        }
    );

    }
    export default PayRollController;
