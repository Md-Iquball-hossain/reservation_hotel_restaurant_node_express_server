import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";
import SettingModel from "../../models/settingModel/Setting.Model";
import { IUpdateBankName } from "../utlis/interfaces/setting.interface";

class BankNameService extends AbstractServices {
    constructor() {
        super();
    }

    //=================== Bank Name Service  ======================//

    // create Bank Name
    public async createBankName(req: Request) {
        return await this.db.transaction(async (trx) => {
        const { hotel_id } = req.hotel_admin;
        const { name } = req.body;

        // Bank name check
        const settingModel = this.Model.settingModel();

        const {data} = await settingModel.getAllBankName({name ,hotel_id});

        if (data.length) {
        return {
            success: false,
            code: this.StatusCode.HTTP_CONFLICT,
            message: "Bank name already exists, give another unique name",
        };
    }

        // model
        const model = new SettingModel(trx);

        const res = await model.createBankName({
            hotel_id,
            name,
        });

        return {
            success: true,
            code: this.StatusCode.HTTP_SUCCESSFUL,
            message: "Bank Name created successfully.",
        };
        });
    }

    // Get All Bank Name
    public async getAllBankName(req: Request) {
        const { hotel_id } = req.hotel_admin;
        const { limit, skip, name} = req.query;

        const model = this.Model.settingModel();

        const { data, total } = await model.getAllBankName({

        limit: limit as string,
        skip: skip as string,
        name: name as string,
        hotel_id,

        });
        return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        total,
        data
        };
    }

    // Update Bank Name
    public async updateBankName(req: Request) {
        return await this.db.transaction(async (trx) => {
        const { hotel_id } = req.hotel_admin;
        const { id } = req.params;

        const updatePayload =
            req.body as IUpdateBankName;

        const model = this.Model.settingModel(trx);
        const res = await model.updateBankName(parseInt(id), {
            hotel_id,
            name: updatePayload.name,
        });

        if (res === 1) {
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: "Bank Name updated successfully",
            };
        } else {
            return {
                success: false,
                code: this.StatusCode.HTTP_NOT_FOUND,
                message: "Bank Name didn't find  from this ID",
            };
        }
        });
    }

    // Delete Bank Name
    public async deleteBankName(req: Request) {
        return await this.db.transaction(async (trx) => {
        const { id } = req.params;

        const model = this.Model.settingModel(trx);
        const res = await model.deleteBankName(parseInt(id));

        if (res === 1) {
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: "Bank Name deleted successfully",
            };
        } else {
            return {
                success: false,
                code: this.StatusCode.HTTP_NOT_FOUND,
                message: "Bank Name didn't find from this ID",
            };
        }
        });
    }

}
export default BankNameService;