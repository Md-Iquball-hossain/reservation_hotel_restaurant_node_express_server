import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";
import { 
    IcreateOwnerPayload, 
    IupdateOwnerPayload 
} from "../utils/interfaces/owner.interface";

    class ownerService extends AbstractServices {
        constructor() {
            super();
        }

    // Create Owner

    public async createOwner(req: Request) {
        const { hotel_id, id: admin_id } = req.hotel_admin;
        const body = req.body as IcreateOwnerPayload;

        const model = this.Model.fleetCommonModel();

    // Check
    const {data} = await model.getAllOwner({
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
        body["documents"] = files[1].filename;
    }

    // Owners create
    await model.createOwner({
        ...body,
        hotel_id,
        created_by: admin_id
    });

    return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: "Owner created successfully.",
    };
    }

    // Get all Owner
    public async getAllOwner(req: Request) {
    const { hotel_id } = req.hotel_admin;
    const { limit, skip, key} = req.query;

    const model = this.Model.fleetCommonModel();

    const { data, total } = await model.getAllOwner({
        key : key as string,
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

    // Get Single Owner
    public async getSingleOwner(req: Request) {
        const { id } = req.params;
        const { hotel_id } = req.hotel_admin;

        const model = this.Model.fleetCommonModel();

        const data = await model.getSingleOwner(
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

    // udate owner
    public async updateOwner(req: Request) {
        return await this.db.transaction(async (trx) => {
        const { id: admin_id } = req.hotel_admin;
        const { id } = req.params;

        const updatePayload = req.body as IupdateOwnerPayload;

    const files = (req.files as Express.Multer.File[]) || [];
        let photo = updatePayload.photo;
        let documents = updatePayload.documents;

    if (files.length) {
        photo = files[0].filename;
    }

    if (files.length) {
        documents= files[1].filename;
    }

    const model = this.Model.fleetCommonModel(trx);
    await model.updateOwner(parseInt(id), {
        name:updatePayload.name,
        email: updatePayload.email,
        phone:updatePayload.phone,
        address:updatePayload.address,
        occupation:updatePayload.occupation,
        photo: photo,
        documents: documents,
        status: updatePayload.status,
        updated_by: admin_id
    });

    return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: "Owner updated successfully",
    };
    });
    }

}
export default ownerService;