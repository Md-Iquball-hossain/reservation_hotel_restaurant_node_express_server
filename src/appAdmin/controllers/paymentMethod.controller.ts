import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import SettingValidator from "../utlis/validator/setting.validator";
import BankNameService from "../services/setting.bankname.service";

class BankNameController extends AbstractController {
        private Service = new BankNameService();
        private settingValidator = new SettingValidator();
        constructor() {
        super();
    }

    //=================== Bank Name Controller ======================//

    // Create Bank Name
    public createBankName= this.asyncWrapper.wrap(
        { bodySchema: this.settingValidator.createBankNameValidator },
        async (req: Request, res: Response) => {
            const { code, ...data } = await this.Service.createBankName(req);

            res.status(code).json(data);
        }
    );

    // Get All Bank Name
    public getAllBankName = this.asyncWrapper.wrap(
        { querySchema: this.settingValidator.getAllBankNameQueryValidator },
        async (req: Request, res: Response) => {
            const { code, ...data } = await this.Service.getAllBankName(req);

            res.status(code).json(data);
        }
    );

    // Update BanK Name
    public updateBanKName = this.asyncWrapper.wrap(
        { bodySchema: this.settingValidator.UpdateBankNameValidator },
        async (req: Request, res: Response) => {
            const { code, ...data } = await this.Service.updateBankName(req);

            res.status(code).json(data);
            }
        );

    // Delete BanK Name
    public deleteBanKName = this.asyncWrapper.wrap(
        { paramSchema: this.commonValidator.singleParamValidator() },
        async (req: Request, res: Response) => {
            const { code, ...data } = await this.Service.deleteBankName(req);

            res.status(code).json(data);
            }
        );

}
export default BankNameController;