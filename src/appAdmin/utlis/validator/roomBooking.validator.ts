import Joi from "joi";

class RoomBookingValidator {
  // create room booking validator
  public createRoomBookingValidator = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    check_in_time: Joi.string().required(),
    check_out_time: Joi.string().required(),
    nid_no: Joi.number().allow("").optional(),
    passport_no: Joi.string().allow("").optional(),
    discount_amount: Joi.number().required(),
    tax_amount: Joi.number().required(),
    total_occupancy: Joi.number().required(),
    extra_charge: Joi.number().optional(),
    booking_rooms: Joi.array()
      .items(
        Joi.object({
          room_id: Joi.number().required(),
        })
      )
      .required(),
    paid_amount: Joi.number().required(),
    ac_tr_ac_id: Joi.number().optional(),
    check_in: Joi.number().allow("").optional(),
    payment_type: Joi.string()
      .valid("bank", "cash", "cheque", "mobile-banking")
      .optional(),
  });

  // refund room booking
  public refundRoomBookingValidator = Joi.object({
    charge: Joi.number().required(),
    refund_from_acc: Joi.number().required(),
    refund_type: Joi.string().required(),
  });

  // get all room booking query validator
  public getAllRoomBookingQueryValidator = Joi.object({
    limit: Joi.string().optional(),
    skip: Joi.string().optional(),
    name: Joi.string().allow("").optional(),
    status: Joi.string().allow("").optional(),
    user_id: Joi.string().allow("").optional(),
  });

  // insert booking check in
  public insertBookingCheckIn = Joi.object({
    booking_id: Joi.number().required(),
    check_in: Joi.string().required(),
  });

  // add booking check out
  public addBookingCheckOut = Joi.object({
    check_out: Joi.string().required(),
  });

  // extend Room Booking Validator
  public extendRoomBookingValidator = Joi.object({
    check_out_time: Joi.string().required(),
    sub_total: Joi.number().optional(),
    due: Joi.number().optional(),
    grand_total: Joi.number().optional(),
    extend_status: Joi.number().optional(),
    extend_nights: Joi.number().optional(),
    booking_rooms: Joi.array()
      .items(
        Joi.object({
          room_id: Joi.number().required(),
        })
      )
      .required(),
  });
}
export default RoomBookingValidator;
