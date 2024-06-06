import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";
import SettingModel from "../../models/settingModel/Setting.Model";
import { IUpdatePayrollMonths } from "../utlis/interfaces/setting.interface";

class PayrollMonthsSettingService extends AbstractServices {
constructor() {
super();
}

//=================== Payroll Months service ======================//

    // create Payroll Months
    public async createPayrollMonths(req: Request) {
    return await this.db.transaction(async (trx) => {
        const { hotel_id } = req.hotel_admin;
        const { name,days, hours } = req.body;

    // Payroll Months
    const settingModel = this.Model.settingModel();

    const { data } = await settingModel.getPayrollMonths({ name, hotel_id });

    if (data.length) {
    return {
        success: false,
        code: this.StatusCode.HTTP_CONFLICT,
        message:
        "Month name already exists, give another unique Month name",
    };
    }
    // model
    const model = new SettingModel(trx);

    const res = await model.createPayrollMonths({
    hotel_id,
    name,
    days,
    hours,
    });

    return {
    success: true,
    code: this.StatusCode.HTTP_SUCCESSFUL,
    message: "Payroll Months created successfully.",
    };
    });
    }

    // Get all Payroll Months
    public async getAllPayrollMonths(req: Request) {
    const { hotel_id } = req.hotel_admin;
    const { limit, skip, name } = req.query;

    const model = this.Model.settingModel();

    const { data, total } = await model.getPayrollMonths({
        limit: limit as string,
        skip: skip as string,
        name: name as string,
        hotel_id,
    });
    return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        total,
        data,
    };
    }

    // Update Payroll Months
    public async updatePayrollMonths(req: Request) {
    return await this.db.transaction(async (trx) => {
        const { hotel_id } = req.hotel_admin;
        const { id } = req.params;

    const updatePayload = req.body as IUpdatePayrollMonths;

    const model = this.Model.settingModel(trx);
    const res = await model.updatePayrollMonths(parseInt(id), {
    hotel_id,
    name: updatePayload.name,
    days: updatePayload.days,
    hours: updatePayload.hours
    });

    if (res === 1) {
    return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: "Month name updated successfully",
    };
    } else {
    return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: "Month name didn't find  from this ID",
    };
    }
    });
    }

    // Delete Payroll Months
    public async deletePayrollMonths(req: Request) {
    return await this.db.transaction(async (trx) => {
        const { id } = req.params;

    const model = this.Model.settingModel(trx);
    const res = await model.deletePayrollMonths(parseInt(id));

    if (res === 1) {
    return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: "Payroll Month deleted successfully",
    };
    } else {
    return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: "Payroll Month didn't find from this ID",
    };
    }
    });
    }

}
export default PayrollMonthsSettingService;
