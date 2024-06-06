import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";
import SettingModel from "../../models/settingModel/Setting.Model";
import { IUpdateHallAmenitiesPayload} from "../utlis/interfaces/setting.interface";

class HallSettingService extends AbstractServices {
    constructor() {
        super();
    }

    //=================== Hall Amenities ======================//

    // create Hall Amenities
    public async createHallAmenities(req: Request) {
        return await this.db.transaction(async (trx) => {
        const { hotel_id } = req.hotel_admin;
        const { name,description } = req.body;

        // Hall amenities check
        const settingModel = this.Model.settingModel();

        const {data} = await settingModel.getAllHallAmenities({name, description, hotel_id});

        if (data.length) {
        return {
            success: false,
            code: this.StatusCode.HTTP_CONFLICT,
            message: " Hall Amenities name already exists, give another unique Hall amenities name",
        };
    }

        // model
        const model = new SettingModel(trx);

        const res = await model.createHallAmenities({
            hotel_id,
            name,
            description
        });

        return {
            success: true,
            code: this.StatusCode.HTTP_SUCCESSFUL,
            message: "Hall Amenities created successfully.",
        };
        });
    }

    // Get All Hall Amenities
    public async getAllHallAmenities(req: Request) {
        const { hotel_id } = req.hotel_admin;
        const { limit, skip, name , description} = req.query;

        const model = this.Model.settingModel();

        const { data, total } = await model.getAllHallAmenities({

        limit: limit as string,
        skip: skip as string,
        name: name as string,
        description: description as string,
        hotel_id,

        });
        return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        total,
        data
        };
    }

    // Update Hall Amenities
    public async updateHallAmenities(req: Request) {
        return await this.db.transaction(async (trx) => {
        const { hotel_id } = req.hotel_admin;
        const { id } = req.params;

        const updatePayload =
            req.body as IUpdateHallAmenitiesPayload;

        const model = this.Model.settingModel(trx);
        const res = await model.updateHallAmenities(parseInt(id), {
            hotel_id,
            name: updatePayload.name,
            description: updatePayload.description
            ,
        });

        if (res === 1) {
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: "Hall Amenities updated successfully",
            };
        } else {
            return {
                success: false,
                code: this.StatusCode.HTTP_NOT_FOUND,
                message: "Hall Amenities didn't find  from this ID",
            };
        }
        });
    }

    // Delete Hall Amenities
    public async deleteHallAmenities(req: Request) {
        return await this.db.transaction(async (trx) => {
        const { id } = req.params;

        const model = this.Model.settingModel(trx);
        const res = await model.deleteHallAmenities(parseInt(id));

        if (res === 1) {
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: "Hall Amenities deleted successfully",
            };
        } else {
            return {
                success: false,
                code: this.StatusCode.HTTP_NOT_FOUND,
                message: "Hall Amenities didn't find from this ID",
            };
        }
        });
    }

}
export default HallSettingService;