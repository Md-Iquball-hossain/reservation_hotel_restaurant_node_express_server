"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customEror_1 = __importDefault(require("../../../utils/lib/customEror"));
const statusCode_1 = __importDefault(require("../../../utils/miscellaneous/statusCode"));
class Wrapper {
    // CONTROLLER ASYNCWRAPPER
    wrap(schema, cb) {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { params, query, body } = req;
                if (schema) {
                    if (schema.bodySchema) {
                        const validateBody = yield schema.bodySchema.validateAsync(body);
                        req.body = validateBody;
                    }
                    if (schema.paramSchema) {
                        const validateParams = yield schema.paramSchema.validateAsync(params);
                        req.params = validateParams;
                    }
                    if (schema.querySchema) {
                        const validateQuery = yield schema.querySchema.validateAsync(query);
                        req.query = validateQuery;
                    }
                }
                yield cb(req, res, next);
            }
            catch (err) {
                console.log({ err });
                if (err.isJoi) {
                    // next(
                    //   new CustomError(err.message, StatusCode.HTTP_UNPROCESSABLE_ENTITY)
                    // );
                    res.status(statusCode_1.default.HTTP_BAD_REQUEST).json({
                        success: false,
                        message: err.message,
                    });
                }
                else {
                    next(new customEror_1.default(err.message, err.status));
                }
            }
        });
    }
}
exports.default = Wrapper;
//# sourceMappingURL=middleware.js.map