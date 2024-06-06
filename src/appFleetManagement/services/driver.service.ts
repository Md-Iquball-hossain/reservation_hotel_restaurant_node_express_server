import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";
import { 
    IcreateDriverPayload, 
    IupdateDriverPayload 
} from "../utils/interfaces/driver.interface";

    class DriverService extends AbstractServices {
        constructor() {
            super();
        }

    // Create Driver

    public async createDriver(req: Request) {
        const { hotel_id, id: admin_id } = req.hotel_admin;
        const body = req.body as IcreateDriverPayload;

        const model = this.Model.fleetCommonModel();

    const {data} = await model.getAllDriver({
        key: body.phone,
        hotel_id,
        
    });

    if (data.length) {
    return {
        success: false,
        code: this.StatusCode.HTTP_CONFLICT,
        message: "Phone number already exists, give another unique Phone number",
    };
    }

    const files = (req.files as Express.Multer.File[]) || [];

    if (files.length) {
        body["photo"] = files[0].filename;
    }

    if (files.length) {
        body["licence_photo"] = files[1].filename;
    }

    // Owners create
    await model.createDriver({
        ...body,
        hotel_id,
        created_by: admin_id
    });

    return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: "Driver Profile created successfully.",
    };
    }

    // Get all Driver
    public async getAllDriver(req: Request) {
    const { hotel_id } = req.hotel_admin;
    const { limit, skip, key, status} = req.query;

    const model = this.Model.fleetCommonModel();

    const { data, total } = await model.getAllDriver({
        key : key as string,
        status : parseInt(status as string),
        limit: limit as string,
        skip: skip as string,
        hotel_id,
    });
    return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        total,
        data
    };
    }

    // Get Single Driver
    public async getSingleDriver(req: Request) {
        const { id } = req.params;
        const { hotel_id } = req.hotel_admin;

        const model = this.Model.fleetCommonModel();

        const data = await model.getSingleDriver(
        parseInt(id),
        hotel_id
        );

        if (!data.length) {
            return {
            success: false,
            code: this.StatusCode.HTTP_NOT_FOUND,
            message: this.ResMsg.HTTP_NOT_FOUND,
            };
        }

        return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        data: data[0],
        };
    }

    // udate Driver
    public async updateDriver(req: Request) {
        return await this.db.transaction(async (trx) => {
        const { id: admin_id } = req.hotel_admin;
        const { id } = req.params;

    const updatePayload = req.body as IupdateDriverPayload;

    const files = (req.files as Express.Multer.File[]) || [];
        let photo = updatePayload.photo;
        let licence_photo = updatePayload.licence_photo;

    if (files.length) {
        photo = files[0].filename;
    }

    if (files.length) {
        licence_photo= files[1].filename;
    }

    const model = this.Model.fleetCommonModel(trx);
    await model.updateDriver(parseInt(id), {
        name: updatePayload.name,
        email: updatePayload.email,
        phone: updatePayload.phone,
        address: updatePayload.address,
        blood_group: updatePayload.blood_group,
        photo: photo,
        date_of_birth: updatePayload.date_of_birth,
        licence_number:updatePayload.licence_number,
        licence_photo: licence_photo,
        license_class: updatePayload.license_class,
        expiry_date: updatePayload.expiry_date,
        year_of_experience: updatePayload.year_of_experience,
        emr_contact_name: updatePayload.emr_contact_name,
        emr_contact_number: updatePayload.emr_contact_number,
        updated_by: admin_id,
        status: updatePayload.status
    });

    return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: "Diver Profile updated successfully",
    };
    });
    }

}
export default DriverService;