export interface ICreateFoodBody {
  res_id: number;
  name: string;
  category_id: number;
  production_price?: number;
  retail_price: number;
  created_by: number;
}

export interface ICreateFoodItemsBody {
  food_id: number;
  ingredient_id: number;
  ing_quantity: number;
}

export interface IupdateFoodBody {
  name?: string;
  category_id?: number;
  retail_price?: number;
  status?: number;
  updated_by?: number;
}

export interface IupdateSubTableStatusBody {
  status: string;
  updated_by?: number;
}

export interface IinsertSubTables {
  order_id: number;
  sub_tab_id: number;
  status: string;
}

export interface IupdateFoodPayload {
  res_id: number;
  name: string;
  inc_quantity: string;
  dec_quantity: string;
  ava_quantity: string;
  category_id: number;
  retail_price: number;
  status: number;
  updated_by: number;
}
