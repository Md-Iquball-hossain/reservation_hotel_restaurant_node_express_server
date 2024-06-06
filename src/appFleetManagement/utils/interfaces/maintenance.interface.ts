export interface IcreateMaintenancePayload {
    hotel_id: number;
    vehicle_id: number;
    maintenance_by: string;
    workshop_name: string;
    maintenance_date: Date;
    maintenance_type: string;
    maintenance_cost: number;
    documents: string;
    created_by: number;
    }

export interface IupdateMaintenancePayload {
    vehicle_id?: number;
    maintenance_by: string;
    workshop_name: string;
    maintenance_date?: Date;
    maintenance_type?: string;
    maintenance_cost?: number;
    documents?: string;
    updated_by: number;
    }