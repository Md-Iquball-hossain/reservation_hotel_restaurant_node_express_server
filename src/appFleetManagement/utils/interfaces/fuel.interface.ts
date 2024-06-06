export interface IcreateFuelRefillPayload {
    hotel_id: number;
    vehicle_id: number;
    filling_station_name: string;
    fuel_quantity: string;
    per_quantity_amount: number;
    refilled_by: string;
    refilled_date: Date;
    total_amount: number;
    documents: string;
    created_by: number;
    }