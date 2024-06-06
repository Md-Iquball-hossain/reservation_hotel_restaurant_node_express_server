import { NextFunction, Request, Response } from "express";
import CustomError from "../../../utils/lib/customEror";
import Joi from "joi";
import StatusCode from "../../../utils/miscellaneous/statusCode";

type Func = (req: Request, res: Response, next: NextFunction) => Promise<void>;

type Validators = {
  bodySchema?: Joi.ObjectSchema<any>;
  paramSchema?: Joi.ObjectSchema<any>;
  querySchema?: Joi.ObjectSchema<any>;
};

class Wrapper {
  // CONTROLLER ASYNCWRAPPER
  public wrap(schema: Validators | null, cb: Func) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { params, query, body } = req;

        if (schema) {
          if (schema.bodySchema) {
            const validateBody = await schema.bodySchema.validateAsync(body);

            req.body = validateBody;
          }
          if (schema.paramSchema) {
            const validateParams = await schema.paramSchema.validateAsync(
              params
            );
            req.params = validateParams;
          }
          if (schema.querySchema) {
            const validateQuery = await schema.querySchema.validateAsync(query);
            req.query = validateQuery;
          }
        }

        await cb(req, res, next);
      } catch (err: any) {
        console.log({ err });
        if (err.isJoi) {
          // next(
          //   new CustomError(err.message, StatusCode.HTTP_UNPROCESSABLE_ENTITY)
          // );

          res.status(StatusCode.HTTP_BAD_REQUEST).json({
            success: false,
            message: err.message,
          });
        } else {
          next(new CustomError(err.message, err.status));
        }
      }
    };
  }
}

export default Wrapper;
