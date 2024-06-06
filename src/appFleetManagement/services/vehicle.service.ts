import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";
import { 
    IcreateVehiclePayload, 
    IupdateVehiclePayload 
} from "../utils/interfaces/vehicles.interface";

    class VehicleService extends AbstractServices {
        constructor() {
            super();
        }

    // Create Vehicle

    public async createVehicle(req: Request) {
        const { hotel_id, id: admin_id } = req.hotel_admin;
        const body = req.body as IcreateVehiclePayload;

        const model = this.Model.vehicleModel();

    // Check
    const {data} = await model.getAllVehicles({
        key: body.reg_number,
        hotel_id,
        
    });

    if (data.length) {
    return {
        success: false,
        code: this.StatusCode.HTTP_CONFLICT,
        message: "Registration already exists, give another unique one",
    };
    }

    const files = (req.files as Express.Multer.File[]) || [];

    if (files.length) {
        body["vehicle_photo"] = files[0].filename;
    }

    // Vehicle create
    await model.createVehicle({
        ...body,
        hotel_id,
        created_by: admin_id
    });

    return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: "Vehicle created successfully.",
    };
    }

    // Get all Vehicle
    public async getAllVehicle(req: Request) {
        const { hotel_id } = req.hotel_admin;
        const { limit, skip, key, status} = req.query;

        const model = this.Model.vehicleModel();

    const { data, total } = await model.getAllVehicles({
        key : key as string,
        status : status as string,
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

    // Get Single Vehicle
    public async getSingleVehicle(req: Request) {
        const { id } = req.params;
        const { hotel_id } = req.hotel_admin;

        const model = this.Model.vehicleModel();

        const data = await model.getSingleVehicle(
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

    // update Vehicle
    public async updateVehicle(req: Request) {
        return await this.db.transaction(async (trx) => {
        const { id: admin_id , hotel_id} = req.hotel_admin;
        const { id } = req.params;

        const updatePayload = req.body as IupdateVehiclePayload;

        const files = (req.files as Express.Multer.File[]) || [];
        let vehicle_photo = updatePayload.vehicle_photo;

    if (files.length) {
        vehicle_photo = files[0].filename;
    }

    // Check if owner exists
    const Model = this.Model.fleetCommonModel(trx);

    if (updatePayload.owner_id){
    const CheckOwnerID = await Model.getSingleOwner(updatePayload.owner_id, hotel_id);

    if (!CheckOwnerID.length) {
        return {
            success: false,
            code: this.StatusCode.HTTP_NOT_FOUND,
            message: "Invalid owner information",
        };
    }
    }

    const model = this.Model.vehicleModel(trx);

    await model.updateVehicle(parseInt(id), {
        owner_id: updatePayload.owner_id,
        reg_number: updatePayload.reg_number,
        model: updatePayload.model,
        mileage: updatePayload.mileage,
        manufacturer: updatePayload.manufacturer,
        vehicle_photo: vehicle_photo,
        manufacture_year: updatePayload.manufacture_year,
        license_plate:updatePayload.license_plate,
        tax_token: updatePayload.tax_token,
        token_expired: updatePayload.token_expired,
        insurance_number: updatePayload.insurance_number,
        insurance_expired: updatePayload.insurance_expired,
        vehicle_type: updatePayload.vehicle_type,
        fuel_type: updatePayload.fuel_type,
        status: updatePayload.status,
        vehicle_color: updatePayload.vehicle_color,
        updated_by: admin_id 
    });

    return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: "Vehicle updated successfully",
    };
    });
    }

}
export default VehicleService;