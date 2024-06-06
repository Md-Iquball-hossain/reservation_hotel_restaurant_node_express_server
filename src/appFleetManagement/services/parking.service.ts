import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";
import { IcreateParkingPayload, IcreateVehicleParkingPayload, IupdateParkingPayload, IupdateVehicleParkingPayload } from "../utils/interfaces/parking.interface";

    class ParkingService extends AbstractServices {
        constructor() {
            super();
        }

    // Create Parking

    public async createParking(req: Request) {
        const { hotel_id, id: admin_id } = req.hotel_admin;
        const body = req.body as IcreateParkingPayload;

        const model = this.Model.parkingModel();

    // Check
    const {data} = await model.getAllParking({
        key: body.par_slot_number,
        hotel_id,
    });

    if (data.length) {
    return {
        success: false,
        code: this.StatusCode.HTTP_CONFLICT,
        message: "Parking slot already exists, give another unique one",
    };
    }

    // Parking create
    await model.createParking({
        ...body,
        hotel_id,
        created_by: admin_id
    });

    return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: "Parking created successfully.",
    };
    }

    // Get all Parking
    public async getAllParking(req: Request) {
    const { hotel_id } = req.hotel_admin;
    const { limit, skip, key, status} = req.query;

    const model = this.Model.parkingModel();

    const { data, total } = await model.getAllParking({
        key : key as string,
        status: parseInt(status as string),
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
    public async getSingleParking(req: Request) {
        const { id } = req.params;
        const { hotel_id } = req.hotel_admin;

        const model = this.Model.parkingModel();

        const data = await model.getSingleParking(
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

    // update Parking
    public async updateParking(req: Request) {
    return await this.db.transaction(async (trx) => {
    const { id: admin_id } = req.hotel_admin;
    const { id } = req.params;

    const updatePayload = req.body as IupdateParkingPayload;

    const model = this.Model.parkingModel(trx);

    await model.updateParking(parseInt(id), {
        parking_area: updatePayload.parking_area,
        parking_size: updatePayload.parking_size,
        par_slot_number: updatePayload.par_slot_number,
        status: updatePayload.status,
        updated_by: admin_id 
    });

    return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: "Parking updated successfully",
    };
    });
    }

    // Assign Vehicle into parking

    public async createVehicleParking(req: Request) {
    return await this.db.transaction(async (trx) => {
        const { hotel_id, id: admin_id } = req.hotel_admin;
        const body = req.body as IcreateVehicleParkingPayload;

    const model = this.Model.parkingModel(trx);

    const Model = this.Model.vehicleModel(trx);

    const vehicle_id = body.vehicle_id;

    const vehicleID = await Model.getSingleVehicle(
        vehicle_id, 
        hotel_id
    );

    if (!vehicleID.length) {
        return {
            success: false,
            code: this.StatusCode.HTTP_CONFLICT,
            message: "Invalid vehicle information",
        };
        }

    const id = body.parking_id;

    const data = await model.getSingleParking(
        id,
        hotel_id
    );

    if (!data.length) {
        return {
            success: false,
            code: this.StatusCode.HTTP_CONFLICT,
            message: "Invalid parking information",
        };
        }

    const status = data[0].status

    if (status === 1) {
    return {
        success: false,
        code: this.StatusCode.HTTP_CONFLICT,
        message: "Parking slot Already Booked.Choose anoter one",
    };
    }

    if(body.assigned_time && vehicleID.length){
    // Assign vehicle in parking
    await model.createVehicleParking({
        ...body,
        created_by: admin_id,
        status: 1
    });

    const parking_id = Number(body.parking_id)

    // Update parking status
    await model.updateParking(
        parking_id, 
        {
        status: 1 ,
        updated_by: admin_id
        });

    const id = Number(body.vehicle_id)

    // Update vehicle's parking status
    if (id) {
        await Model.updateVehicle(id, 
            { parking_status: 1 });
    }
    }

    return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: "Parking Slot Assigned successfully.",
    };
    });
    }

    // Get all Vehicle Parking
    public async getAllVehicleParking(req: Request) {
        const {} = req.hotel_admin;
        const { limit, skip, status, from_date, vehicle_id, to_date} = req.query;
    
        const model = this.Model.parkingModel();
    
        const { data, total } = await model.getAllVehicleParking({
            from_date : from_date as string,
            to_date : to_date as string,
            vehicle_id : vehicle_id as string,
            status: status as string,
            limit: limit as string,
            skip: skip as string,
        });
        return {
            success: true,
            code: this.StatusCode.HTTP_OK,
            total,
            data
        };
        }

    // update Vehicle into parking

    public async updateVehicleParking(req: Request) {
    return await this.db.transaction(async (trx: any) => {
    const { id: admin_id } = req.hotel_admin;
    const { id } = req.params;
    const body = req.body as IupdateVehicleParkingPayload;

    const parkingModel = this.Model.parkingModel(trx);
    const vehicleModel = this.Model.vehicleModel(trx);

    const singleParkingVehicle = await parkingModel
    .getSingleVehicleParking(parseInt(id));

    const status = singleParkingVehicle[0].status;

    if (body.left_time && status === 1) {

    const vehicleId = singleParkingVehicle[0].vehicle_id;

    await vehicleModel.updateVehicle(
        vehicleId, 
        { 
            parking_status: 0 
        }
    );

    const parking_id = singleParkingVehicle[0].parking_id;

    await parkingModel.updateParking(
        parking_id, 
        {
            status: 0,
            updated_by: admin_id
        }
    );

    // Update parking
    await parkingModel.updateVehiceInParking(
        parseInt(id), 
        {
            left_time: body.left_time,
            updated_by: admin_id,
            status: 0
        }
    );
    }
    return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: "Parking status updated successfully.",
    }
    });
    }

}
export default ParkingService;