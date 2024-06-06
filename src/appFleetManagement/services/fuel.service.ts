import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";
import { IcreateFuelRefillPayload } from "../utils/interfaces/fuel.interface";


    class FuelService extends AbstractServices {
        constructor() {
            super();
        }

    // Create Fuel Refill

    public async createFuelRefill(req: Request) {
    return await this.db.transaction(async (trx) => {
    const { hotel_id, id: admin_id } = req.hotel_admin;
    const body = req.body as IcreateFuelRefillPayload;

    const Model = this.Model.vehicleModel(trx);

    const files = (req.files as Express.Multer.File[]) || [];

    if (files.length) {
        body["documents"] = files[0].filename;
    }

    const vehicle_id = body.vehicle_id;

    const getSingleVehicle = await Model.getSingleVehicle(
        vehicle_id, 
        hotel_id
    );

    if (!getSingleVehicle.length) {
    return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: "Invalid vehicle information",
    };
    }

    const {id, fuel_quantity} = getSingleVehicle[0]

    const totalAmount = 
        parseFloat(body.fuel_quantity) * 
        (body.per_quantity_amount)

    // Owners create
    await Model.createFuelRefill({
        ...body,
        total_amount: totalAmount,
        hotel_id,
        created_by: admin_id
    });

    const update_fuel_quantity = (
        parseFloat(fuel_quantity) + 
        parseFloat(body.fuel_quantity)
        ).toFixed(2)

    // update vehicle fuel
    await Model.updateVehicle(id, {
        fuel_quantity : update_fuel_quantity      
    });

    return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: "Fuel created successfully.",
    };
    });
    }

    // Get all Fuel
    public async getAllFuelRefill(req: Request) {
    const { hotel_id } = req.hotel_admin;
    const { limit, skip, key, from_date, to_date} = req.query;

    const model = this.Model.vehicleModel();

    const { data, total } = await model.getAllFuelRefill({
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

}
export default FuelService;