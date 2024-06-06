
import { TDB } from "../../common/types/commontypes";
import Schema from "../../utils/miscellaneous/schema";
import {
ICreateFoodBody,
ICreateFoodItemsBody,
IupdateFoodBody,
} from "../../appRestaurant/utils/interfaces/food.interface";
import { 
    ICreateCategoryPayload, 
    IUpdateCategoryPayload 
} from "../../appRestaurant/utils/interfaces/category.interface";
import { 
    ICreateIngredientPayload, 
    IUpdateIngredientPayload 
} from "../../appRestaurant/utils/interfaces/ingredient.interface";
import { 
    ICreatePurchaseItemPayload 
} from "../../appRestaurant/utils/interfaces/purchase.interface";

    class ResFoodModel extends Schema {
    private db: TDB;

    constructor(db: TDB) {
        super();
        this.db = db;
    }

    //=================== Category  ======================//

    // create Category
    public async createCategory(payload: ICreateCategoryPayload) {
        return await this.db("category")
        .withSchema(this.RESTAURANT_SCHEMA)
        .insert(payload);
    }

    // Get All Category
    public async getAllCategory(payload: {
        limit?: string;
        skip?: string;
        name: string;
        status?: string;
        res_id: number;
    }) {
    const { limit, skip, res_id, name, status } = payload;

    const dtbs = this.db("category as c");

    if (limit && skip) {
    dtbs.limit(parseInt(limit as string));
    dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs
    .withSchema(this.RESTAURANT_SCHEMA)
    .select("c.id", "c.name", "c.status")
    .where("c.res_id", res_id)
    .andWhere(function () {
        if (name) {
        this.andWhere("c.name", "like", `%${name}%`);
        }
        if (status) {
        this.andWhere("c.status", "like", `%${status}%`);
        }
    })
    .orderBy("c.id", "desc");

    const total = await this.db("category as c")
    .withSchema(this.RESTAURANT_SCHEMA)
    .count("c.id as total")
    .where("c.res_id", res_id)
    .andWhere(function () {
        if (name) {
        this.andWhere("c.name", "like", `%${name}%`);
        }
        if (status) {
        this.andWhere("c.status", "like", `%${status}%`);
        }
    });

    return { total: total[0].total, data };
    }

    // Update Category
    public async updateCategory(id: number, payload: IUpdateCategoryPayload) {
        return await this.db("category")
        .withSchema(this.RESTAURANT_SCHEMA)
        .where({ id })
        .update(payload);
    }

    // Delete Category
    public async deleteCategory(id: number) {
        return await this.db("category")
        .withSchema(this.RESTAURANT_SCHEMA)
        .where({ id })
        .del();
    }


    // Purchase
    public async getPurchaseReport(payload: {
        limit?: string;
        skip?: string;
        from_date?: string;
        to_date?: string;
        res_id: number;
    }) {
    const { limit, skip, res_id, from_date, to_date } = payload;

    const dtbs = this.db("purchase_view as pv");

    if (limit && skip) {
    dtbs.limit(parseInt(limit));
    dtbs.offset(parseInt(skip));
    }

    const endDate = new Date(to_date as string);
    endDate.setDate(endDate.getDate());

    const data = await dtbs
    .withSchema(this.RESTAURANT_SCHEMA)
    .select(
        "pv.id",
        "pv.purchase_date",
        "pv.supplier_name",
        "pv.grand_total",
        "pv.account_name",
        "pv.ac_type",
        "pv.purchase_items"
    )
    .where("pv.res_id", res_id)
    .andWhere(function () {
        if (from_date && to_date) {
        this.andWhereBetween("pv.purchase_date", [from_date, endDate]);
        }
    })
    .orderBy("pv.id", "desc");

    const total = await this.db("purchase_view as pv")
    .withSchema(this.RESTAURANT_SCHEMA)
    .count("pv.id as total")
    .where("pv.res_id", res_id)
    .andWhere(function () {
        if (from_date && to_date) {
        this.andWhereBetween("pv.purchase_date", [from_date, endDate]);
        }
    });

    const totalAmount = await this.db("purchase_view as pv")
    .withSchema(this.RESTAURANT_SCHEMA)
    .sum("pv.grand_total as totalAmount")
    .where("pv.res_id", res_id)
    .andWhere(function () {
        if (from_date && to_date) {
        this.andWhereBetween("pv.purchase_date", [from_date, endDate]);
        }
    });

    return {
    data,
    totalAmount: totalAmount[0]?.totalAmount || 0,
    total: total[0]?.total || 0,
    };
    }

    //=================== Ingredient  ======================//

    // create Ingredient
    public async createIngredient(payload: ICreateIngredientPayload) {
        return await this.db("ingredient")
        .withSchema(this.RESTAURANT_SCHEMA)
        .insert(payload);
    }

    // create purchase item
    public async createPurchaseItem(payload: ICreatePurchaseItemPayload[]) {
        return await this.db("purchase_item")
        .withSchema(this.RESTAURANT_SCHEMA)
        .insert(payload);
    }

    // Get All Ingredient
    public async getAllIngredient(payload: {
        limit?: string;
        skip?: string;
        name: string;
        measurement: string;
        res_id: number;
    }) {
    const { limit, skip, res_id, name } = payload;

    const dtbs = this.db("ingredient as i");

    if (limit && skip) {
    dtbs.limit(parseInt(limit as string));
    dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs
    .withSchema(this.RESTAURANT_SCHEMA)
    .select("i.id", "i.name", "i.measurement")
    .where("i.res_id", res_id)
    .andWhere(function () {
        if (name) {
        this.andWhere("i.name", "like", `%${name}%`);
        }
    })
    .orderBy("i.id", "desc");

    const total = await this.db("ingredient as i")
    .withSchema(this.RESTAURANT_SCHEMA)
    .count("i.id as total")
    .where("i.res_id", res_id)
    .andWhere(function () {
        if (name) {
        this.andWhere("i.name", "like", `%${name}%`);
        }
    });

    return { total: total[0].total, data };
    }

    // Single Ingredint
    public async getSingleIngredient(ing_id: number, res_id: number) {
        const dtbs = this.db("ingredient as i");
        const data = await dtbs
        .withSchema(this.RESTAURANT_SCHEMA)
        .select("*")
        .where("i.id", ing_id)
        .andWhere("i.res_id", res_id);

        return data.length > 0 ? data[0] : [];
    }

    // Update Ingredient
    public async updateIngredient(id: number, payload: IUpdateIngredientPayload) {
        return await this.db("ingredient")
        .withSchema(this.RESTAURANT_SCHEMA)
        .where({ id })
        .update(payload);
    }

    // Delete Ingredient
    public async deleteIngredient(id: number) {
        return await this.db("ingredient")
        .withSchema(this.RESTAURANT_SCHEMA)
        .where({ id })
        .del();
    }

    //=================== Inventory  ======================//

    // insert in inventory
    public async insertInInventory(
        payload: {
        res_id: number;
        ing_id: number;
        available_quantity: number;
        }[]
    ) {
        return await this.db("inventory")
        .withSchema(this.RESTAURANT_SCHEMA)
        .insert(payload);
    }

    // update in inventory
    public async updateInInventory(
        payload: {
        available_quantity: number;
        },
        where: { id: number }
    ) {
        return await this.db("inventory")
        .withSchema(this.RESTAURANT_SCHEMA)
        .update(payload)
        .where("id", where.id);
    }

    // get all inventory
    public async getAllInventory(where: { res_id: number; ing_ids: number[] }) {
        const { ing_ids, res_id } = where;
        return await this.db("inventory")
        .withSchema(this.RESTAURANT_SCHEMA)
        .select("*")
        .where("res_id", res_id)
        .andWhere(function () {
            if (ing_ids) {
            this.whereIn("ing_id", ing_ids);
            }
        });
    }

    // get all purchase ingredient item
    public async getInventoryList(payload: {
        key: string;
        res_id: number;
        limit: string;
        skip: string;
    }) {
    const { limit, skip, res_id, key } = payload;

    const dtbs = this.db("inventory as inv");

    if (limit && skip) {
    dtbs.limit(parseInt(limit as string));
    dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs
    .withSchema(this.RESTAURANT_SCHEMA)
    .select(
        "inv.id",
        "inv.ing_id",
        "ing.name",
        "ing.measurement",
        "inv.available_quantity",
        "inv.quantity_sold"
    )
    .leftJoin("ingredient as ing", "inv.ing_id", "ing.id")
    .where({ "inv.res_id": res_id })
    .andWhere(function () {
        if (key) {
        this.andWhere((builder) => {
            builder.where("ing.name", "like", `%${key}%`);
        });
        }
    });
    return { data };
    }

    //=================== Food  ======================//

    // create food
    public async createFood(payload: ICreateFoodBody) {
        return await this.db("food")
        .withSchema(this.RESTAURANT_SCHEMA)
        .insert(payload);
    }

    // create food items
    public async createFoodItems(payload: ICreateFoodItemsBody[]) {
        return await this.db("food_items")
        .withSchema(this.RESTAURANT_SCHEMA)
        .insert(payload);
    }

    // get all purchase ingredient item
    public async getAllPurchaseIngItem(payload: { res_id: number }) {
        const { res_id } = payload;

        const dtbs = this.db("purchase_item_view as i");

        const data = await dtbs
        .withSchema(this.RESTAURANT_SCHEMA)
        .where({ "i.res_id": res_id })
        .orderBy("id", "desc");

        return { data };
    }

    // get All Food
    public async getAllFood(payload: {
        limit?: string;
        skip?: string;
        key?: string;
        category?: string;
        res_id: number;
        ids?: number[];
    }) {
    const { key, limit, skip, res_id, ids, category } = payload;

    console.log({ category });

    const dtbs = this.db("food_view as fv");

    if (limit && skip) {
    dtbs.limit(parseInt(limit as string));
    dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs
    .withSchema(this.RESTAURANT_SCHEMA)
    .select(
        "fv.id",
        "fv.name as food_name",
        "fv.category_id",
        "fv.category_name",
        "fv.production_price",
        "fv.retail_price",
        "fv.status",
        "fv.food_items"
    )
    .where("fv.res_id", res_id)
    .andWhere((qb) => {
        if (key) {
        qb.andWhere("fv.name", "like", `%${key}%`).orWhere(
            "fv.category_name",
            "like",
            `%${key}%`
        );
        }

        if (category) {
        qb.andWhere(
            this.db.raw("LOWER(fv.category_name)"),
            "like",
            `%${category.toLowerCase()}%`
        );
        }

        if (ids) {
        qb.whereIn("id", ids);
        }
    })
    .orderBy("fv.id", "desc");

    const total = await this.db("food_view as fv")
    .withSchema(this.RESTAURANT_SCHEMA)
    .count("fv.id as total")
    .where("fv.res_id", res_id)
    .andWhere((qb) => {
        if (key) {
        qb.andWhere("fv.name", "like", `%${key}%`).orWhere(
            "fv.category_name",
            "like",
            `%${key}%`
        );
        }

        if (category) {
        qb.andWhere(
            this.db.raw("LOWER(fv.category_name)"),
            "like",
            `%${category.toLowerCase()}%`
        );
        }

        if (ids) {
        qb.whereIn("id", ids);
        }
    });

    return { total: total[0].total, data };
    }

    // get Single Food
    public async getSingleFood(payload: { id: number; res_id: number }) {
        const { id, res_id } = payload;

        return await this.db("food_view")
        .select("*")
        .withSchema(this.RESTAURANT_SCHEMA)
        .where({ id, res_id });
    }

    // get Single Food
    public async getSingleOrderFood(payload: {
        foodID: number[];
        res_id: number;
    }) {
        const { foodID, res_id } = payload;

        const data = await this.db("food_view")
        .select("*")
        .withSchema(this.RESTAURANT_SCHEMA)
        .where({ id: foodID, res_id });

        return data.length > 0 ? data[0] : 0;
    }

    // update Food
    public async updateFood(id: number, payload: IupdateFoodBody) {
        return await this.db("food")
        .withSchema(this.RESTAURANT_SCHEMA)
        .where({ id })
        .update(payload);
    }

}
export default ResFoodModel;
