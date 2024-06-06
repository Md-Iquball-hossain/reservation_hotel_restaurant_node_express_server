import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";
import SettingModel from "../../models/settingModel/Setting.Model";
import { IUpdateBedTypePayload, IUpdateRoomAmenitiesPayload, IUpdateRoomTypePayload } from "../utlis/interfaces/setting.interface";

class RoomSettingService extends AbstractServices {
    constructor() {
        super();
    }

    //=================== Room Type ======================//

    // create room type
    public async createRoomType(req: Request) {
        return await this.db.transaction(async (trx) => {
        const { hotel_id } = req.hotel_admin;
        const { room_type } = req.body;

        // room type check
        const settingModel = this.Model.settingModel();

        const {data} = await settingModel.getAllRoomType({room_type,hotel_id});

        if (data.length) {
        return {
            success: false,
            code: this.StatusCode.HTTP_CONFLICT,
            message: "Same Room Type already exists, give another unique room type name",
        };
    }
        // model
        const model = new SettingModel(trx);

        const res = await model.createRoomType({
            hotel_id,
            room_type,
        });

        return {
            success: true,
            code: this.StatusCode.HTTP_SUCCESSFUL,
            message: "Room Type created successfully.",
        };
        });
    }

    // Get all room type
    public async getAllRoomType(req: Request) {
        const { hotel_id } = req.hotel_admin;
        const { limit, skip, room_type} = req.query;

        const model = this.Model.settingModel();

        const { data, total } = await model.getAllRoomType({

        limit: limit as string,
        skip: skip as string,
        room_type: room_type as string,
        hotel_id,

        });
        return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        total,
        data
        };
    }
    
    // Update room type
    public async updateRoomType(req: Request) {
        return await this.db.transaction(async (trx) => {
        const { hotel_id } = req.hotel_admin;
        const { id } = req.params;

        const updatePayload =
            req.body as IUpdateRoomTypePayload;

        const model = this.Model.settingModel(trx);
        const res = await model.updateRoomType(parseInt(id), {
            hotel_id,
            room_type: updatePayload.room_type,
        });

        if (res === 1) {
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: "Room Type updated successfully",
            };
        } else {
            return {
                success: false,
                code: this.StatusCode.HTTP_NOT_FOUND,
                message: "Room Type didn't find  from this ID",
            };
        }
        });
    }

    // Delete room type
    public async deleteRoomType(req: Request) {
        return await this.db.transaction(async (trx) => {
        const { id } = req.params;

        const model = this.Model.settingModel(trx);
        const res = await model.deleteRoomType(parseInt(id));

        if (res === 1) {
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: "Room Type deleted successfully",
            };
        } else {
            return {
                success: false,
                code: this.StatusCode.HTTP_NOT_FOUND,
                message: "Room Type didn't find from this ID",
            };
        }
        });
    }

    //=================== Bed Type ======================//

    // create bed type
    public async createBedType(req: Request) {
        return await this.db.transaction(async (trx) => {
        const { hotel_id } = req.hotel_admin;
        const { bed_type } = req.body;
        
        // bed type check
        const settingModel = this.Model.settingModel();

        const {data} = await settingModel.getAllBedType({bed_type,hotel_id});

        if (data.length) {
        return {
            success: false,
            code: this.StatusCode.HTTP_CONFLICT,
            message: "Similar Bed Type already exists, give another unique bed type name",
        };
    }
        // model
        const model = new SettingModel(trx);

        const res = await model.createBedType({
            hotel_id,
            bed_type,
        });

        return {
            success: true,
            code: this.StatusCode.HTTP_SUCCESSFUL,
            message: "Bed Type created successfully.",
        };
        });
    }

    // Get all bed type
    public async getAllBedType(req: Request) {
        const { hotel_id } = req.hotel_admin;
        const { limit, skip, bed_type} = req.query;

        const model = this.Model.settingModel();

        const { data, total } = await model.getAllBedType({

        limit: limit as string,
        skip: skip as string,
        bed_type: bed_type as string,
        hotel_id,

        });
        return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        total,
        data
        };
    }

    // Update bed type
    public async updateBedType(req: Request) {
        return await this.db.transaction(async (trx) => {
        const { hotel_id } = req.hotel_admin;
        const { id } = req.params;

        const updatePayload =
            req.body as IUpdateBedTypePayload;

        const model = this.Model.settingModel(trx);
        const res = await model.updateBedType(parseInt(id), {
            hotel_id,
            bed_type: updatePayload.bed_type,
        });

        if (res === 1) {
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: "Bed Type updated successfully",
            };
        } else {
            return {
                success: false,
                code: this.StatusCode.HTTP_NOT_FOUND,
                message: "Bed Type didn't find  from this ID",
            };
        }
        });
    }

    // Delete bed type
    public async deleteBedType(req: Request) {
        return await this.db.transaction(async (trx) => {
        const { id } = req.params;

        const model = this.Model.settingModel(trx);
        const res = await model.deleteBedType(parseInt(id));

        if (res === 1) {
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: "Bed Type deleted successfully",
            };
        } else {
            return {
                success: false,
                code: this.StatusCode.HTTP_NOT_FOUND,
                message: "Bed Type didn't find from this ID",
            };
        }
        });
    }

    //=================== Room Amenities ======================//

    // create Room Amenities
    public async createRoomAmenities(req: Request) {
        return await this.db.transaction(async (trx) => {
        const { hotel_id } = req.hotel_admin;
        const { room_amenities } = req.body;

        // room amenities check
        const settingModel = this.Model.settingModel();

        const {data} = await settingModel.getAllRoomAmenities({room_amenities,hotel_id});

        if (data.length) {
        return {
            success: false,
            code: this.StatusCode.HTTP_CONFLICT,
            message: " Same Room Amenities already exists, give another unique room amenities name",
        };
    }

        // model
        const model = new SettingModel(trx);

        const res = await model.createRoomAmenities({
            hotel_id,
            room_amenities,
        });

        return {
            success: true,
            code: this.StatusCode.HTTP_SUCCESSFUL,
            message: "Room Amenities created successfully.",
        };
        });
    }

    // Get All Room Amenities
    public async getAllRoomAmenities(req: Request) {
        const { hotel_id } = req.hotel_admin;
        const { limit, skip, room_amenities} = req.query;

        const model = this.Model.settingModel();

        const { data, total } = await model.getAllRoomAmenities({

        limit: limit as string,
        skip: skip as string,
        room_amenities: room_amenities as string,
        hotel_id,

        });
        return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        total,
        data
        };
    }

    // Update Room Amenities
    public async updateRoomAmenities(req: Request) {
        return await this.db.transaction(async (trx) => {
        const { hotel_id } = req.hotel_admin;
        const { id } = req.params;

        const updatePayload =
            req.body as IUpdateRoomAmenitiesPayload;

        const model = this.Model.settingModel(trx);
        const res = await model.updateRoomAmenities(parseInt(id), {
            hotel_id,
            room_amenities: updatePayload.room_amenities,
        });

        if (res === 1) {
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: "Room Amenities updated successfully",
            };
        } else {
            return {
                success: false,
                code: this.StatusCode.HTTP_NOT_FOUND,
                message: "Room Amenities didn't find  from this ID",
            };
        }
        });
    }

    // Delete Room Amenities
    public async deleteRoomAmenities(req: Request) {
        return await this.db.transaction(async (trx) => {
        const { id } = req.params;

        const model = this.Model.settingModel(trx);
        const res = await model.deleteRoomAmenities(parseInt(id));

        if (res === 1) {
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: "Room Amenities deleted successfully",
            };
        } else {
            return {
                success: false,
                code: this.StatusCode.HTTP_NOT_FOUND,
                message: "Room Amenities didn't find from this ID",
            };
        }
        });
    }

}
export default RoomSettingService;