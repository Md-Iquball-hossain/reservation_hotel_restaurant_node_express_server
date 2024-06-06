import Joi from "joi";

class ResOrderValidator {
  //create order validator
  public createOrderValidator = Joi.object({
    tab_id: Joi.number().optional(),
    staff_id: Joi.number().allow().optional(),
    email: Joi.string().allow("").optional(),
    name: Joi.string().allow("").optional(),
    sub_tab_name: Joi.string().allow("").optional(),
    ac_tr_ac_id: Joi.number().optional(),
    // discount: Joi.number().allow("").optional(),
    // vat: Joi.number().allow("").optional(),
    include_with_hotel: Joi.number().optional(),
    change_amount: Joi.number().allow("").optional(),
    order_type: Joi.string().valid("in-dine", "takeout", "delivery").optional(),
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
    order_items: Joi.array()
      .items(
        Joi.object({
          food_id: Joi.number().required(),
          //   name: Joi.string().required(),
          quantity: Joi.number().required(),
          //   rate: Joi.number().required(),
          //   total: Joi.number().allow("").optional(),
        })
      )
      .required(),
  });

  //order payment validator
  public orderPaymentValidator = Joi.object({
    include_with_hotel: Joi.number().required(),
    ac_tr_ac_id: Joi.number().optional(),
    paid_amount: Joi.number().optional(),
    discount: Joi.number().allow("").optional(),
    vat: Joi.number().allow("").optional(),
  });

  //update order
  public updateOrderValidator = Joi.object({
    order_items_modify: Joi.array()
      .items(
        Joi.object({
          food_id: Joi.number().required(),
          quantity: Joi.number().required(),
        })
      )
      .optional(),
  });

  // get all order query validator
  public getAllOrderQueryValidator = Joi.object({
    limit: Joi.string().optional(),
    skip: Joi.string().optional(),
    tab_id: Joi.number().allow("").optional(),
    status: Joi.string().allow("").optional(),
    key: Joi.string().allow("").optional(),
    from_date: Joi.string().allow("").optional(),
    to_date: Joi.string().allow("").optional(),
    kitchen_status: Joi.string().allow("").optional(),
    order_category: Joi.string().allow("").optional(),
    staff_name: Joi.string().allow("").optional(),
    is_paid: Joi.string().allow("").optional(),
    category: Joi.string().allow("").optional(),
  });

  // create Table head validator
  createTableValidator = Joi.object({
    name: Joi.string().required(),
    category: Joi.string().required(),
  });

  //create sub Table validator
  createSubTableValidator = Joi.object({
    name: Joi.string().required(),
  });

  //create order validator
  public createPrePaidOrderValidator = Joi.object({
    tab_id: Joi.number().required(),
    emp_id: Joi.number().allow().optional(),
    email: Joi.string().allow("").optional(),
    name: Joi.string().allow("").optional(),
    ac_tr_ac_id: Joi.number().required(),
    sub_total: Joi.number().optional(),
    discount: Joi.number().allow("").optional(),
    vat: Joi.number().allow("").optional(),
    grand_total: Joi.number().required(),
    payable_amount: Joi.number().allow("").optional(),
    change_amount: Joi.number().allow("").optional(),
    order_type: Joi.string().valid("in-dine", "takeout", "delivery").optional(),
    note: Joi.string().allow("").optional(),
    sub_tables: Joi.string()
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
        } catch (err) {
          return helpers.message({
            custom: "invalid Sub Tables, should be a valid JSON Object",
          });
        }
      })
      .optional(),
    order_items: Joi.array()
      .items(
        Joi.object({
          food_id: Joi.number().required(),
          name: Joi.string().required(),
          quantity: Joi.number().required(),
          rate: Joi.number().required(),
          total: Joi.number().allow("").optional(),
        })
      )
      .required(),
  });

  // get all kitchen query validator
  public getAllKitchenQueryValidator = Joi.object({
    limit: Joi.string().allow("").optional(),
    skip: Joi.string().allow("").optional(),
    table_name: Joi.string().allow("").optional(),
    order_no: Joi.string().allow("").optional(),
    kitchen_status: Joi.string().allow("").optional(),
  });

  // get all table validator
  public getAllTableValidator = Joi.object({
    limit: Joi.string().allow("").optional(),
    skip: Joi.string().allow("").optional(),
    name: Joi.string().allow("").optional(),
    category: Joi.string().allow("").optional(),
  });

  // get all Sub table validator
  public getAllSubTableValidator = Joi.object({
    limit: Joi.string().allow("").optional(),
    skip: Joi.string().allow("").optional(),
    name: Joi.string().allow("").optional(),
    status: Joi.string().allow("").optional(),
  });

  // update Kitchen Status
  public UpdateKitchenStatusValidator = Joi.object({
    kitchen_status: Joi.string().required(),
  });

  // update Order Status
  public UpdateOrderStatusValidator = Joi.object({
    status: Joi.string().allow("").optional(),
    check_out: Joi.string().required(),
  });

  // update Table Name Status
  public UpdateTableNameValidator = Joi.object({
    name: Joi.string().allow("").optional(),
    status: Joi.string().allow("").optional(),
  });

  // get all guest list validator
  public getAllGuestValidator = Joi.object({
    key: Joi.string().allow("").optional(),
    email: Joi.string().allow("").optional(),
    user_type: Joi.string().allow("").optional(),
    limit: Joi.string().allow("").optional(),
    skip: Joi.string().allow("").optional(),
  });

  // get all Employee query validator
  getAllEmployeeQueryValidator = Joi.object({
    status: Joi.string().valid("0", "1"),
    key: Joi.string().allow("").optional(),
    limit: Joi.string().allow("").optional(),
    skip: Joi.string().allow("").optional(),
  });
}
export default ResOrderValidator;
