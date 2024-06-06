"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class ResOrderValidator {
    constructor() {
        //create order validator
        this.createOrderValidator = joi_1.default.object({
            tab_id: joi_1.default.number().optional(),
            staff_id: joi_1.default.number().allow().optional(),
            email: joi_1.default.string().allow("").optional(),
            name: joi_1.default.string().allow("").optional(),
            sub_tab_name: joi_1.default.string().allow("").optional(),
            ac_tr_ac_id: joi_1.default.number().optional(),
            // discount: Joi.number().allow("").optional(),
            // vat: Joi.number().allow("").optional(),
            include_with_hotel: joi_1.default.number().optional(),
            change_amount: joi_1.default.number().allow("").optional(),
            order_type: joi_1.default.string().valid("in-dine", "takeout", "delivery").optional(),
            // sub_tables: Joi.string()
            //   .allow()
            //   .custom((value, helpers) => {
            //     try {
            //       const parsedObject = JSON.parse(value);
            //       const SubTablesType = typeof parsedObject;
            //       if (SubTablesType !== "object") {
            //         return helpers.message({
            //           custom: "invalid Sub Tables, should be a JSON object",
            //         });
            //       }
            //       return value;
            //     } catch (err) {
            //       return helpers.message({
            //         custom: "invalid Sub Tables, should be a valid JSON Object",
            //       });
            //     }
            //   })
            //   .optional(),
            order_items: joi_1.default.array()
                .items(joi_1.default.object({
                food_id: joi_1.default.number().required(),
                //   name: Joi.string().required(),
                quantity: joi_1.default.number().required(),
                //   rate: Joi.number().required(),
                //   total: Joi.number().allow("").optional(),
            }))
                .required(),
        });
        //order payment validator
        this.orderPaymentValidator = joi_1.default.object({
            include_with_hotel: joi_1.default.number().required(),
            ac_tr_ac_id: joi_1.default.number().optional(),
            paid_amount: joi_1.default.number().optional(),
            discount: joi_1.default.number().allow("").optional(),
            vat: joi_1.default.number().allow("").optional(),
        });
        //update order
        this.updateOrderValidator = joi_1.default.object({
            order_items_modify: joi_1.default.array()
                .items(joi_1.default.object({
                food_id: joi_1.default.number().required(),
                quantity: joi_1.default.number().required(),
            }))
                .optional(),
        });
        // get all order query validator
        this.getAllOrderQueryValidator = joi_1.default.object({
            limit: joi_1.default.string().optional(),
            skip: joi_1.default.string().optional(),
            tab_id: joi_1.default.number().allow("").optional(),
            status: joi_1.default.string().allow("").optional(),
            key: joi_1.default.string().allow("").optional(),
            from_date: joi_1.default.string().allow("").optional(),
            to_date: joi_1.default.string().allow("").optional(),
            kitchen_status: joi_1.default.string().allow("").optional(),
            order_category: joi_1.default.string().allow("").optional(),
            staff_name: joi_1.default.string().allow("").optional(),
            is_paid: joi_1.default.string().allow("").optional(),
            category: joi_1.default.string().allow("").optional(),
        });
        // create Table head validator
        this.createTableValidator = joi_1.default.object({
            name: joi_1.default.string().required(),
            category: joi_1.default.string().required(),
        });
        //create sub Table validator
        this.createSubTableValidator = joi_1.default.object({
            name: joi_1.default.string().required(),
        });
        //create order validator
        this.createPrePaidOrderValidator = joi_1.default.object({
            tab_id: joi_1.default.number().required(),
            emp_id: joi_1.default.number().allow().optional(),
            email: joi_1.default.string().allow("").optional(),
            name: joi_1.default.string().allow("").optional(),
            ac_tr_ac_id: joi_1.default.number().required(),
            sub_total: joi_1.default.number().optional(),
            discount: joi_1.default.number().allow("").optional(),
            vat: joi_1.default.number().allow("").optional(),
            grand_total: joi_1.default.number().required(),
            payable_amount: joi_1.default.number().allow("").optional(),
            change_amount: joi_1.default.number().allow("").optional(),
            order_type: joi_1.default.string().valid("in-dine", "takeout", "delivery").optional(),
            note: joi_1.default.string().allow("").optional(),
            sub_tables: joi_1.default.string()
                .allow()
                .custom((value, helpers) => {
                try {
                    const parsedObject = JSON.parse(value);
                    const SubTablesType = typeof parsedObject;
                    if (SubTablesType !== "object") {
                        return helpers.message({
                            custom: "invalid Sub Tables, should be a JSON object",
                        });
                    }
                    return value;
                }
                catch (err) {
                    return helpers.message({
                        custom: "invalid Sub Tables, should be a valid JSON Object",
                    });
                }
            })
                .optional(),
            order_items: joi_1.default.array()
                .items(joi_1.default.object({
                food_id: joi_1.default.number().required(),
                name: joi_1.default.string().required(),
                quantity: joi_1.default.number().required(),
                rate: joi_1.default.number().required(),
                total: joi_1.default.number().allow("").optional(),
            }))
                .required(),
        });
        // get all kitchen query validator
        this.getAllKitchenQueryValidator = joi_1.default.object({
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
            table_name: joi_1.default.string().allow("").optional(),
            order_no: joi_1.default.string().allow("").optional(),
            kitchen_status: joi_1.default.string().allow("").optional(),
        });
        // get all table validator
        this.getAllTableValidator = joi_1.default.object({
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
            name: joi_1.default.string().allow("").optional(),
            category: joi_1.default.string().allow("").optional(),
        });
        // get all Sub table validator
        this.getAllSubTableValidator = joi_1.default.object({
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
            name: joi_1.default.string().allow("").optional(),
            status: joi_1.default.string().allow("").optional(),
        });
        // update Kitchen Status
        this.UpdateKitchenStatusValidator = joi_1.default.object({
            kitchen_status: joi_1.default.string().required(),
        });
        // update Order Status
        this.UpdateOrderStatusValidator = joi_1.default.object({
            status: joi_1.default.string().allow("").optional(),
            check_out: joi_1.default.string().required(),
        });
        // update Table Name Status
        this.UpdateTableNameValidator = joi_1.default.object({
            name: joi_1.default.string().allow("").optional(),
            status: joi_1.default.string().allow("").optional(),
        });
        // get all guest list validator
        this.getAllGuestValidator = joi_1.default.object({
            key: joi_1.default.string().allow("").optional(),
            email: joi_1.default.string().allow("").optional(),
            user_type: joi_1.default.string().allow("").optional(),
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
        });
        // get all Employee query validator
        this.getAllEmployeeQueryValidator = joi_1.default.object({
            status: joi_1.default.string().valid("0", "1"),
            key: joi_1.default.string().allow("").optional(),
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
        });
    }
}
exports.default = ResOrderValidator;
//# sourceMappingURL=order.validator.js.map