import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import PayrollMonthsSettingService from "../services/setting.payroll-month.service";
import SettingValidator from "../utlis/validator/setting.validator";

    class PayrollMonthSettingController extends AbstractController {
    private Service = new PayrollMonthsSettingService();
    private settingValidator = new SettingValidator();
    constructor() {
        super();
    }

    //=================== Payroll Months Controller ======================//

    // Create Payroll Months
    public createPayrollMonths = this.asyncWrapper.wrap(
        { bodySchema: this.settingValidator.createPayRollMonthsValidator },
        async (req: Request, res: Response) => {
        const { code, ...data } =
            await this.Service.createPayrollMonths(req);

        res.status(code).json(data);
        }
    );

    // Get All Payroll Months
    public getAllPayrollMonths = this.asyncWrapper.wrap(
        { querySchema: this.settingValidator.getAllPayrollMonthsQueryValidator },
        async (req: Request, res: Response) => {
        const { code, ...data } =
            await this.Service.getAllPayrollMonths(req);

        res.status(code).json(data);
        }
    );

    // Update Payroll Months
    public updatePayrollMonths = this.asyncWrapper.wrap(
        { bodySchema: this.settingValidator.UpdatePayrollMonthsValidator },
        async (req: Request, res: Response) => {
        const { code, ...data } =
            await this.Service.updatePayrollMonths(req);

        res.status(code).json(data);
        }
    );

    // Delete Payroll Months
    public deletePayrollMonths = this.asyncWrapper.wrap(
        { paramSchema: this.commonValidator.singleParamValidator() },
        async (req: Request, res: Response) => {
        const { code, ...data } =
            await this.Service.deletePayrollMonths(req);

        res.status(code).json(data);
        }
    );

}
export default PayrollMonthSettingController;