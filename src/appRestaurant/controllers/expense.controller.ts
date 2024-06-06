    import { Request, Response } from "express";
    import AbstractController from "../../abstarcts/abstract.controller";
    import ExpenseResService from "../services/expense.service";
    import ExpenseResValidator from "../utils/validator/expense.validator";

    class ExpenseResController extends AbstractController {
    private Service = new ExpenseResService();
    private validator = new ExpenseResValidator();

    constructor() {
        super();
    }

    // Create expense
    public createExpenseHead = this.asyncWrapper.wrap(
        { bodySchema: this.validator.createExpenseHeadValidator },
        async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.createExpenseHead(
            req
        );

        res.status(code).json(data);
        }
    );

    // Get All expense Head
    public getAllExpenseHead = this.asyncWrapper.wrap(
        null,
        async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.getAllExpenseHead(
            req
        );

        res.status(code).json(data);
        }
    );

    // Update expense Head
    public updateExpenseHead = this.asyncWrapper.wrap(
        { bodySchema: this.validator.UpdateExpenseHeadValidator },
        async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.updateExpenseHead(
            req
        );

        res.status(code).json(data);
        }
    );

    // Delete expense Head
    public deleteExpenseHead = this.asyncWrapper.wrap(
        null,
        async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.deleteExpenseHead(
            req
        );

        res.status(code).json(data);
        }
    );

    // Create expense
    public createExpense = this.asyncWrapper.wrap(
        { bodySchema: this.validator.createExpenseValidator },
        async (req: Request, res: Response) => {
        const result = await this.Service.createExpense(req);

        const { code, ...data } = result;
        res.status(code).json(data);
        }
    );

    // get all expense Controller
    public getAllExpense = this.asyncWrapper.wrap(
        { querySchema: this.validator.getAllExpenseQueryValidator },
        async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.getAllExpense(req);
        res.status(code).json(data);
        }
    );

    // get single expense Controller
    public getSingleExpense = this.asyncWrapper.wrap(
        { paramSchema: this.commonValidator.singleParamValidator() },
        async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.getSingleExpense(req);

        res.status(code).json(data);
        }
    );

    }
    export default ExpenseResController;