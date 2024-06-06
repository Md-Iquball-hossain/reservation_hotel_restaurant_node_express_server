
export interface IcreateTripPayload {
    hotel_id: number;
    vehicle_id: number;
    driver_id: number;
    start_time: Date;
    end_time: Date;
    start_location: string;
    end_location: string;
    fuel_usage: string;
    trip_cost: number;
    documents: string;
    created_by: number;
    }