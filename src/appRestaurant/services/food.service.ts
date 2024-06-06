import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";
import {
  ICreateFoodItemsBody,
  IupdateFoodPayload,
} from "../utils/interfaces/food.interface";

class FoodService extends AbstractServices {
  constructor() {
    super();
  }

  // create food
  public async createFood(req: Request) {
    return await this.db.transaction(async (trx) => {
      const { id, res_id } = req.rest_user;
      const { food_items, name, category_id, retail_price } = req.body;
      const model = this.Model.restaurantModel(trx);

      const { data } = await model.getAllFood({
        res_id,
        key: name,
      });

      if (data.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_CONFLICT,
          message: "Food already exist",
        };
      }

      const createdFood = await model.createFood({
        res_id,
        name,
        category_id,
        retail_price,
        created_by: id,
      });

      const foodItemsPayload: ICreateFoodItemsBody[] = [];

      for (let i = 0; i < food_items.length; i++) {
        let found = false;

        for (let j = 0; j < foodItemsPayload.length; j++) {
          if (
            food_items[i].ingredient_id == foodItemsPayload[j].ingredient_id
          ) {
            found = true;

            foodItemsPayload[j].ing_quantity += food_items[i].ing_quantity;
            break;
          }
        }

        if (!found) {
          foodItemsPayload.push({
            food_id: createdFood[0],
            ing_quantity: food_items[i].ing_quantity,
            ingredient_id: food_items[i].ingredient_id,
          });
        }
      }

      await model.createFoodItems(foodItemsPayload);

      return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: "Food created",
      };
    });
  }

  // Get All Food
  public async getAllFood(req: Request) {
    const { res_id } = req.rest_user;
    const { limit, skip, key, category } = req.query;

    const model = this.Model.restaurantModel();

    const { data, total } = await model.getAllFood({
      limit: limit as string,
      skip: skip as string,
      key: key as string,
      category: category as string,
      res_id,
    });
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total,
      data,
    };
  }

  // Get Single Food
  public async getSingleFood(req: Request) {
    const { res_id } = req.rest_user;
    const { id } = req.params;

    const data = await this.Model.restaurantModel().getSingleFood({
      id: parseInt(id),
      res_id,
    });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data: data[0],
    };
  }

  // Get All Purchase Ing Item
  public async getAllPurchaseIngItem(req: Request) {
    const { res_id } = req.rest_user;
    const model = this.Model.restaurantModel();
    const { data } = await model.getAllPurchaseIngItem({
      res_id,
    });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data,
    };
  }

  // Update Food
  public async updateFood(req: Request) {
    return await this.db.transaction(async (trx) => {
      const { res_id, id: res_admin } = req.rest_user;
      const { id } = req.params;

      const { name, category_id, retail_price, status } =
        req.body as IupdateFoodPayload;

      const model = this.Model.restaurantModel(trx);

      const getSingleFood = await this.Model.restaurantModel().getSingleFood({
        id: parseInt(id),
        res_id,
      });

      console.log({ getSingleFood }, "food");

      if (!getSingleFood.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_NOT_FOUND,
          message: this.ResMsg.HTTP_NOT_FOUND,
        };
      }

      await model.updateFood(parseInt(id), {
        name: name,
        category_id: category_id,
        retail_price: retail_price,
        status: status,
        updated_by: res_admin,
      });

      return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: "Food updated successfully",
      };
    });
  }
}
export default FoodService;
