    import Joi from "joi";

    class UserRoomBookingValidator {
    // create room booking validator
    public createRoomBookingValidator = Joi.object({

        name: Joi.string().allow("").required(),
        email: Joi.string().allow("").required(),
        phone:  Joi.number().allow("").optional(),
        nid_no: Joi.number().allow("").optional(),
        passport_no: Joi.string().allow("").optional(),
        country: Joi.string().lowercase().trim().regex(/^\S/).optional(),
        city: Joi.string().lowercase().trim().regex(/^\S/).optional(),
        address:Joi.string().allow("").optional(),
        zip_code:  Joi.number().allow("").optional(),
        postal_code:  Joi.number().allow("").optional(),

        check_in_time: Joi.string().required(),
        check_out_time: Joi.string().required(),
        total_occupancy: Joi.number().optional(),

        discount_amount: Joi.number().optional(),
        tax_amount: Joi.number().optional(),
        extra_charge: Joi.number().optional(),
        paid_amount: Joi.number().optional(),

        ac_tr_ac_id: Joi.number().optional(),
        payment_type: Joi.string()
        .valid("bank", "cash", "cheque", "mobile-banking")
        .optional(),
        booking_rooms: Joi.array()
            .items(
                Joi.object({
                room_id: Joi.number().required(),
                })
            )
            .required(),
        });
        
        // get all room booking query validator
        public getAllRoomBookingQueryValidator = Joi.object({
            limit: Joi.string().allow("").optional(),
            skip: Joi.string().allow("").optional(),
            name: Joi.string().allow("").optional(),
            status: Joi.string().allow("").optional(),
            user_id: Joi.string().allow("").optional(),
        });

    }
    export default UserRoomBookingValidator;