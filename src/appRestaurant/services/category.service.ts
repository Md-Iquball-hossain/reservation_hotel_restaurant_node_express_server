import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";
import { IUpdateCategoryPayload } from "../utils/interfaces/category.interface";


class CategoryService extends AbstractServices {
    constructor() {
        super();
    }

    //=================== Category service ======================//

    // create Category
    public async createCategory(req: Request) {
    return await this.db.transaction(async (trx) => {
    const { res_id } = req.rest_user;
    const { name} = req.body;

    // Category name check
    const Model = this.Model.restaurantModel();

    const {data} = await Model.getAllCategory({name, res_id});

    if (data.length) {
    return {
        success: false,
        code: this.StatusCode.HTTP_CONFLICT,
        message: "Category name already exists, give another unique category",
    };
    }

    await Model.createCategory({
        res_id,
        name,
    });

    return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: "Category created successfully.",
    };
    });
    }

    // Get all Category
    public async getAllCategory(req: Request) {
    const {res_id } = req.rest_user;
    const { limit, skip, name, status} = req.query;

    const model = this.Model.restaurantModel();

    const { data, total } = await model.getAllCategory({
    name : name as string,
    status: status as string,
    limit: limit as string,
    skip: skip as string,
    res_id,

    });
    return {
    success: true,
    code: this.StatusCode.HTTP_OK,
    total,
    data
    };
    }
    
    // Update Category
    public async updateCategory(req: Request) {
    return await this.db.transaction(async (trx) => {
    const { res_id } = req.rest_user
    const { id } = req.params;

    const updatePayload =
        req.body as IUpdateCategoryPayload;

    const model = this.Model.restaurantModel(trx);
    const res = await model.updateCategory(parseInt(id), {
        res_id,
        name: updatePayload.name,
        status: updatePayload.status,
        
    });

    if (res === 1) {
        return {
            success: true,
            code: this.StatusCode.HTTP_OK,
            message: "Category updated successfully",
        };
    } else {
        return {
            success: false,
            code: this.StatusCode.HTTP_NOT_FOUND,
            message: "Category didn't find  from this ID",
        };
    }
    });
    }

    // Delete Category
    public async deleteCategory(req: Request) {
    return await this.db.transaction(async (trx) => {
    const { id } = req.params;

    const model = this.Model.restaurantModel(trx);
    const res = await model.deleteCategory(parseInt(id));

    if (res === 1) {
        return {
            success: true,
            code: this.StatusCode.HTTP_OK,
            message: "Category deleted successfully",
        };
    } else {
        return {
            success: false,
            code: this.StatusCode.HTTP_NOT_FOUND,
            message: "Category didn't find from this ID",
        };
    }
    });
    }

}
export default CategoryService;