import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";
import { IcreateTripPayload } from "../utils/interfaces/trip.interface";

    class TripService extends AbstractServices {
        constructor() {
            super();
        }

    // Create Trip

    public async createTrip(req: Request) {
    return await this.db.transaction(async (trx) => {
    const { hotel_id, id: admin_id } = req.hotel_admin;
    const body = req.body as IcreateTripPayload;

    const Model = this.Model.vehicleModel(trx);

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

    const { id, fuel_quantity} = getSingleVehicle[0];

    const update_fuel_quantity = (
        parseFloat(fuel_quantity) - 
        parseFloat(body.fuel_usage)
        ).toFixed(2)

    await Model.updateVehicle(id, {
        fuel_quantity : update_fuel_quantity
    })

    const driver_id = body.driver_id;

    const dModel = this.Model.fleetCommonModel(trx);

    const driverID = await dModel.getSingleDriver(
        driver_id, 
        hotel_id
    );

    if (!driverID.length) {
        return {
            success: false,
            code: this.StatusCode.HTTP_CONFLICT,
            message: "Invalid Driver information",
        };
        }

    // Owners create
    await Model.createTrip({
        ...body,
        hotel_id,
        created_by: admin_id
    });

    return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: "Trip created successfully.",
    };
    });
    }

    // Get all Trip
    public async getAllTrip(req: Request) {
    const { hotel_id } = req.hotel_admin;
    const { limit, skip, key, from_date, to_date, } = req.query;

    const model = this.Model.vehicleModel();

    const { data, total } = await model.getAllTrip({
        key : key as string,
        from_date : from_date as string,
        to_date: to_date as string,
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
export default TripService;