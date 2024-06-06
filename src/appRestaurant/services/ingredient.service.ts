import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";
import { IUpdateIngredientPayload } from "../utils/interfaces/ingredient.interface";

class IngredientService extends AbstractServices {
    constructor() {
        super();
    }

    //=================== Ingredient service ======================//

    // create Ingredient
    public async createIngredient(req: Request) {
        return await this.db.transaction(async (trx) => {
        const { id, res_id } = req.rest_user;
        const { name, measurement } = req.body;

        // Ingredient name check
        const Model = this.Model.restaurantModel();

        const {data} = await Model.getAllIngredient({name, measurement, res_id});

        if (data.length) {
        return {
            success: false,
            code: this.StatusCode.HTTP_CONFLICT,
            message: "Ingredientname already exists, give another unique Ingredient",
        };
    }

        await Model.createIngredient({
            res_id,
            name,
            measurement,
            created_by: id
        });

        return {
            success: true,
            code: this.StatusCode.HTTP_SUCCESSFUL,
            message: "Ingredient created successfully.",
        };
        });
    }

    // Get all Ingredient
    public async getAllIngredient(req: Request) {
        const { res_id } = req.rest_user;
        const { limit, skip, name, measurement} = req.query;

        const model = this.Model.restaurantModel();

        const { data, total } = await model.getAllIngredient({

        limit: limit as string,
        skip: skip as string,
        name : name as string,
        measurement: measurement as string,
        res_id,

        });
        return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        total,
        data
        };
    }
    
    // Update Ingredient
    public async updateIngredient(req: Request) {
        return await this.db.transaction(async (trx) => {
        const { res_id } = req.rest_user;
        const { id } = req.params;

        const updatePayload =
            req.body as IUpdateIngredientPayload;

        const model = this.Model.restaurantModel(trx);
        const res = await model.updateIngredient(parseInt(id), {
            res_id,
            name: updatePayload.name,
            measurement: updatePayload.measurement
        });

        if (res === 1) {
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: "Ingredient updated successfully",
            };
        } else {
            return {
                success: false,
                code: this.StatusCode.HTTP_NOT_FOUND,
                message: "Ingredient didn't find  from this ID",
            };
        }
        });
    }

    // Delete Ingredient
    public async deleteIngredient(req: Request) {
        return await this.db.transaction(async (trx) => {
        const { id } = req.params;

        const model = this.Model.restaurantModel(trx);
        const res = await model.deleteIngredient(parseInt(id));

        if (res === 1) {
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: "Ingredient deleted successfully",
            };
        } else {
            return {
                success: false,
                code: this.StatusCode.HTTP_NOT_FOUND,
                message: "Ingredient didn't find from this ID",
            };
        }
        });
    }

}
export default IngredientService;
