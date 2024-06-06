    export interface IinsertinvoicePayload {
        invoice_no: string;
        order_id: number;
        res_id: number;
        user_id?: number;
        discount_amount: number;
        tax_amount?: number;
        sub_total: number;
        grand_total: number;
        due: number;
        description: string;
        type: "online_site" | "front_desk";
        created_by: number;
    }
    
    export interface IinsertinvoiceItemPayload {
        invoice_id: number;
        name?: string;
        discount?: number;
        total_price: number;
        quantity: number;
    }
    
    export interface IinvoiceItemPayload {
        name: string;
        total_price: number;
        quantity: number;
    }
    
    export interface IcreateInvoicePayload {
        user_id: number;
        discount_amount: number;
        tax_amount: number;
        invoice_item: IinvoiceItemPayload[];
    }


    export interface updateSingleInvoice {
        discount_amount: number;
        tax_amount : number;
        sub_total : number;
        grand_total : number;
        due : number;
    }