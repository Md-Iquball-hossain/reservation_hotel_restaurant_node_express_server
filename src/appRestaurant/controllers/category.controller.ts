import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import CategoryService from "../services/category.service";
import CategoryValidator from "../utils/validator/category.validator";


class CategoryController extends AbstractController {
        private Service = new CategoryService();
        private Validator = new CategoryValidator();
        constructor() {
        super();
    }

    //=================== Category Controller ======================//

    // create Category
    public createCategory= this.asyncWrapper.wrap(
    { bodySchema: this.Validator.createCategoryValidatorValidator },
    async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.createCategory(req);

        res.status(code).json(data);
    }
    );

    // get All Category
    public getAllCategory = this.asyncWrapper.wrap(
    { querySchema: this.Validator.getAllCategoryQueryValidator },
    async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.getAllCategory(req);

        res.status(code).json(data);
    }
    );

    // update Category
    public updateCategory = this.asyncWrapper.wrap(
    { bodySchema: this.Validator.UpdateCategoryValidator },
    async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.updateCategory(req);

        res.status(code).json(data);
        }
    );

    // delete Category
    public deleteCategory = this.asyncWrapper.wrap(
    { paramSchema: this.commonValidator.singleParamValidator() },
    async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.deleteCategory(req);

        res.status(code).json(data);
        }
    );

}
export default CategoryController;