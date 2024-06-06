import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";
import SettingModel from "../../models/settingModel/Setting.Model";
import { IUpdatedepartment } from "../utlis/interfaces/setting.interface";

class DepartmentSettingService extends AbstractServices {
    constructor() {
        super();
    }

    //=================== Department service ======================//

    // create Department
    public async createDepartment(req: Request) {
        return await this.db.transaction(async (trx) => {
        const { hotel_id } = req.hotel_admin;
        const { name } = req.body;

        // Department check
        const settingModel = this.Model.settingModel();

        const {data} = await settingModel.getAllDepartment({name, hotel_id});

        if (data.length) {
        return {
            success: false,
            code: this.StatusCode.HTTP_CONFLICT,
            message: "Department name already exists, give another unique department name",
        };
    }
        // model
        const model = new SettingModel(trx);

        const res = await model.createDepartment({
            hotel_id,
            name,
        });

        return {
            success: true,
            code: this.StatusCode.HTTP_SUCCESSFUL,
            message: "Department created successfully.",
        };
        });
    }

    // Get all Department
    public async getAllDepartment(req: Request) {
        const { hotel_id } = req.hotel_admin;
        const { limit, skip, name} = req.query;

        const model = this.Model.settingModel();

        const { data, total } = await model.getAllDepartment({

        limit: limit as string,
        skip: skip as string,
        name : name as string,
        hotel_id,

        });
        return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        total,
        data
        };
    }
    
    // Update Department
    public async updateDepartment(req: Request) {
        return await this.db.transaction(async (trx) => {
        const { hotel_id } = req.hotel_admin;
        const { id } = req.params;

        const updatePayload =
            req.body as IUpdatedepartment;

        const model = this.Model.settingModel(trx);
        const res = await model.updateDepartment(parseInt(id), {
            hotel_id,
            name: updatePayload.name,
        });

        if (res === 1) {
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: "Department updated successfully",
            };
        } else {
            return {
                success: false,
                code: this.StatusCode.HTTP_NOT_FOUND,
                message: "Department didn't find  from this ID",
            };
        }
        });
    }

    // Delete Department
    public async deleteDepartment(req: Request) {
        return await this.db.transaction(async (trx) => {
        const { id } = req.params;

        const model = this.Model.settingModel(trx);
        const res = await model.deleteDepartment(parseInt(id));

        if (res === 1) {
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: "Department deleted successfully",
            };
        } else {
            return {
                success: false,
                code: this.StatusCode.HTTP_NOT_FOUND,
                message: "Department didn't find from this ID",
            };
        }
        });
    }

}
export default DepartmentSettingService;