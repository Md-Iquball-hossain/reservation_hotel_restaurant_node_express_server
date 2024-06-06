import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";
import SettingModel from "../../models/settingModel/Setting.Model";
import { IUpdatedesignation } from "../utlis/interfaces/setting.interface";

class DesignationSettingService extends AbstractServices {
constructor() {
super();
}

//=================== designation service ======================//

// create designation
public async createDesignation(req: Request) {
return await this.db.transaction(async (trx) => {
    const { hotel_id } = req.hotel_admin;
    const { name } = req.body;

    // designation check
    const settingModel = this.Model.settingModel();

    const { data } = await settingModel.getAllDesignation({ name, hotel_id });

    if (data.length) {
    return {
        success: false,
        code: this.StatusCode.HTTP_CONFLICT,
        message:
        "Designation name already exists, give another unique designation name",
    };
    }
    // model
    const model = new SettingModel(trx);

    const res = await model.createDesignation({
    hotel_id,
    name,
    });

    return {
    success: true,
    code: this.StatusCode.HTTP_SUCCESSFUL,
    message: "Designation created successfully.",
    };
});
}

// Get all designation
public async getAllDesignation(req: Request) {
const { hotel_id } = req.hotel_admin;
const { limit, skip, name } = req.query;

const model = this.Model.settingModel();

const { data, total } = await model.getAllDesignation({
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

// Update Designation
public async updateDesignation(req: Request) {
return await this.db.transaction(async (trx) => {
    const { hotel_id } = req.hotel_admin;
    const { id } = req.params;

    const updatePayload = req.body as IUpdatedesignation;

    const model = this.Model.settingModel(trx);
    const res = await model.updateDesignation(parseInt(id), {
    hotel_id,
    name: updatePayload.name,
    });

    if (res === 1) {
    return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: "Designation name updated successfully",
    };
    } else {
    return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: "Designation didn't find  from this ID",
    };
    }
});
}

// Delete Designation
public async deleteDesignation(req: Request) {
return await this.db.transaction(async (trx) => {
    const { id } = req.params;

    const model = this.Model.settingModel(trx);
    const res = await model.deleteDesignation(parseInt(id));

    if (res === 1) {
    return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: "Designation deleted successfully",
    };
    } else {
    return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: "Designation didn't find from this ID",
    };
    }
});
}
}
export default DesignationSettingService;
