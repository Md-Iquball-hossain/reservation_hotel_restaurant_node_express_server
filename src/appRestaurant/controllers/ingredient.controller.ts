import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import IngredientService from "../services/ingredient.service";
import IngredientValidator from "../utils/validator/ingredient.validator";

class IngredientController extends AbstractController {
        private Service = new IngredientService();
        private Validator = new IngredientValidator();
        constructor() {
        super();
    }

    //=================== Ingredient Controller ======================//

    // create Ingredient
    public createIngredient= this.asyncWrapper.wrap(
        { bodySchema: this.Validator.createIngredientValidator },
        async (req: Request, res: Response) => {
            const { code, ...data } = await this.Service.createIngredient(req);

            res.status(code).json(data);
        }
    );

    // get All Ingredient
    public getAllIngredient = this.asyncWrapper.wrap(
        { querySchema: this.Validator.getAllIngredientQueryValidator },
        async (req: Request, res: Response) => {
            const { code, ...data } = await this.Service.getAllIngredient(req);

            res.status(code).json(data);
        }
    );

    // update Ingredient
    public updateIngredient = this.asyncWrapper.wrap(
        { bodySchema: this.Validator.UpdateIngredientValidator },
        async (req: Request, res: Response) => {
            const { code, ...data } = await this.Service.updateIngredient(req);

            res.status(code).json(data);
            }
        );

    // delete Ingredient
    public deleteIngredient = this.asyncWrapper.wrap(
        { paramSchema: this.commonValidator.singleParamValidator() },
        async (req: Request, res: Response) => {
            const { code, ...data } = await this.Service.deleteIngredient(req);

            res.status(code).json(data);
            }
        );

}
export default IngredientController;