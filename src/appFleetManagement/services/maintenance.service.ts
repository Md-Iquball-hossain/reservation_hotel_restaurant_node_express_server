import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";
import { IcreateMaintenancePayload, IupdateMaintenancePayload } from "../utils/interfaces/maintenance.interface";

    class MaintenanceService extends AbstractServices {
        constructor() {
            super();
        }

    // Create Maintenance

    public async createMaintenance(req: Request) {
    return await this.db.transaction(async (trx) => {
    const { hotel_id, id: admin_id } = req.hotel_admin;
    const body = req.body as IcreateMaintenancePayload;

    const Model = this.Model.vehicleModel(trx);

    const files = (req.files as Express.Multer.File[]) || [];

    if (files.length) {
        body["documents"] = files[0].filename;
    }

    const vehicle_id = body.vehicle_id;

    const vehicleID = await Model.getSingleVehicle(
        vehicle_id, 
        hotel_id
    );

    if (!vehicleID.length) {
        return {
            success: false,
            code: this.StatusCode.HTTP_CONFLICT,
            message: "Vehicle information is not valid",
        };
        }

    // Owners create
    await Model.createMaintenance({
        ...body,
        hotel_id,
        created_by: admin_id
    });

    return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: "Maintenance created successfully.",
    };
    });
    }

    // Get all Maintenance
    public async getAllMaintenance(req: Request) {
    const { hotel_id } = req.hotel_admin;
    const { limit, skip, key, from_date, to_date} = req.query;

    const model = this.Model.vehicleModel();

    const { data, total } = await model.getAllMaintenance({
        from_date : from_date as string,
        to_date: to_date as string,
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

    // udate Maintenance
    public async updateMaintenance(req: Request) {
        return await this.db.transaction(async (trx) => {
        const { id: admin_id } = req.hotel_admin;
        const { id } = req.params;

        const updatePayload = req.body as IupdateMaintenancePayload;

    const files = (req.files as Express.Multer.File[]) || [];
        let documents = updatePayload.documents;

    if (files.length) {
        documents= files[0].filename;
    }

    const model = this.Model.vehicleModel(trx);
    await model.updateMaintenance(parseInt(id), {
        vehicle_id:updatePayload.vehicle_id,
        maintenance_by: updatePayload.maintenance_by,
        workshop_name:updatePayload.workshop_name,
        maintenance_date: updatePayload.maintenance_date,
        maintenance_type:updatePayload.maintenance_type,
        maintenance_cost:updatePayload.maintenance_cost,
        documents: documents,
        updated_by: admin_id
    });

    return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: "Maintenance updated successfully",
    };
    });
    }

}
export default MaintenanceService;