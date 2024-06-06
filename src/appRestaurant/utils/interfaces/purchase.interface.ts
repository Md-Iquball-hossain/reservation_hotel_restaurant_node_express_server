export interface ICreatePurchaseItemPayload {
  ingredient_id: number;
  quantity: number;
  price: number;
  purchase_id: number;
  name: string;
}
export interface ICreatePurchaseItemBody {
  ingredient_id: number;
  quantity: number;
  price: number;
  name: string;
}

export interface ICreatePurchaseBody {
  purchase_date: string;
  supplier_id: number;
  ac_tr_ac_id: number;
  discount_amount: number;
  purchase_items: ICreatePurchaseItemBody[];
}

export interface ICreatePurchasePayload {
  res_id: number;
  ac_tr_id: number;
  purchase_date: string;
  supplier_id: number;
  ac_tr_ac_id: number;
  sub_total: number;
  discount_amount: number;
  grand_total: number;
}
