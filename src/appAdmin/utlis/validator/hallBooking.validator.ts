import Joi from "joi";

class HallBookingValidator {
  // create hall booking validator
  public createHallBookingValidator = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    city: Joi.string().lowercase().trim().regex(/^\S/).optional(),
    phone:  Joi.number().allow("").optional(),
    country: Joi.string().lowercase().trim().regex(/^\S/).optional(),
    address:Joi.string().allow("").optional(),
    zip_code:  Joi.number().allow("").optional(),
    postal_code:  Joi.number().allow("").optional(),
    start_time: Joi.string().required(),
    end_time: Joi.string().required(),
    booking_date: Joi.string().required(),
    event_date: Joi.string().required(),
    total_occupancy: Joi.number().required(),
    discount_amount: Joi.number().optional(),
    tax_amount: Joi.number().optional(),
    paid_amount: Joi.number().required(),
    ac_tr_ac_id: Joi.number().optional(),
    extra_charge: Joi.number().optional(),
    check_in: Joi.string().allow("").optional(),
    booking_halls: Joi.array()
    .items(
    Joi.object({
      hall_id: Joi.number().required(),
      quantity: Joi.number().optional(),
    })
    )
    .required(),
    payment_type: Joi.string()
      .valid("bank", "cash", "cheque", "mobile-banking")
      .optional(),
  });

  // get all hall booking query validator
  public getAllHallBookingQueryValidator = Joi.object({
    limit: Joi.string().allow("").optional(),
    skip: Joi.string().allow("").optional(),
    key: Joi.string().allow("").optional(),
    booking_status: Joi.string().allow("").optional(),
    start_time: Joi.string().allow("").optional(),
    end_time: Joi.string().allow("").optional(),
    event_date:Joi.string().allow("").optional(),
    user_id: Joi.string().allow("").optional(),
  });

  // insert hall booking check in
  public insertHallBookingCheckIn = Joi.object({
    booking_id: Joi.number().required(),
    check_in: Joi.string().required(),
    event_date: Joi.string().required(),
  });

  // add hall booking check out
  public addHallBookingCheckOut = Joi.object({
    check_out: Joi.string().required(),
    event_date: Joi.string().allow("").optional(),
  });

}
export default HallBookingValidator;