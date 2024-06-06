import Joi from "joi";

class SettingValidator {
  //=================== Room Type validation ======================//

  // create room Type validation
  public createRoomTypeValidator = Joi.object({
    room_type: Joi.string().lowercase().allow("").required(),
  });

  // get all room Type query validator
  public getAllRoomTypeQueryValidator = Joi.object({
    limit: Joi.string().allow("").optional(),
    skip: Joi.string().allow("").optional(),
    room_type: Joi.string().allow("").optional(),
  });

  // update room type validation
  public UpdateRoomTypeValidator = Joi.object({
    room_type: Joi.string().required(),
  });

  //=================== Bed Type validation ======================//

  // create bed Type validation
  public createBedTypeValidator = Joi.object({
    bed_type: Joi.string().allow("").required(),
  });

  // get all Bed Type query validator
  public getAllBedTypeQueryValidator = Joi.object({
    limit: Joi.string().allow("").optional(),
    skip: Joi.string().allow("").optional(),
    bed_type: Joi.string().allow("").optional(),
  });

  // update bed type validation
  public UpdateBedTypeValidator = Joi.object({
    bed_type: Joi.string().required(),
  });

  //=================== Room Amenities validation ======================//

  // create Room Amenities validation
  public createRoomAmenitiesValidator = Joi.object({
    room_amenities: Joi.string().allow("").required(),
  });

  // get all Room Amenities query validator
  public getAllRoomAmenitiesQueryValidator = Joi.object({
    limit: Joi.string().allow("").optional(),
    skip: Joi.string().allow("").optional(),
    room_amenities: Joi.string().allow("").optional(),
  });

  // update Room Amenities validation
  public UpdateRoomAmenitiesValidator = Joi.object({
    room_amenities: Joi.string().required(),
  });

  //=================== Bank Name validation ======================//

  // create Bank Name
  public createBankNameValidator = Joi.object({
    name: Joi.string().allow("").required(),
  });

  // get all Bank Name
  public getAllBankNameQueryValidator = Joi.object({
    limit: Joi.string().allow("").optional(),
    skip: Joi.string().allow("").optional(),
    name: Joi.string().allow("").optional(),
  });

  // update Bank Name
  public UpdateBankNameValidator = Joi.object({
    name: Joi.string().required(),
  });

  //=================== designation validation ======================//

  // create designation validation
  public createdesignationValidator = Joi.object({
    name: Joi.string().allow("").required(),
  });

  // get all designation query validation
  public getAlldesignationQueryValidator = Joi.object({
    limit: Joi.string().allow("").optional(),
    skip: Joi.string().allow("").optional(),
    name: Joi.string().allow("").optional(),
  });

  // update designation validation
  public UpdatedesignationValidator = Joi.object({
    name: Joi.string().required(),
  });

  //=================== department validation ======================//

  // create department validation
  public createdepartmentValidator = Joi.object({
    name: Joi.string().allow("").required(),
  });

  // get all department query validation
  public getAlldepartmentQueryValidator = Joi.object({
    limit: Joi.string().allow("").optional(),
    skip: Joi.string().allow("").optional(),
    name: Joi.string().allow("").optional(),
  });

  // update department validation
  public UpdatedepatmentValidator = Joi.object({
    name: Joi.string().required(),
  });

    //=================== Hall Amenities validation ======================//

  // create Hall Amenities validation
  public createHallAmenitiesValidator = Joi.object({
    name: Joi.string().allow("").required(),
    description: Joi.string().allow("").optional(),
  });

  // get all Hall Amenities query validator
  public getAllHallAmenitiesQueryValidator = Joi.object({
    limit: Joi.string().allow("").optional(),
    skip: Joi.string().allow("").optional(),
    name: Joi.string().allow("").optional(),
  });

  // update Hall Amenities validation
  public UpdateHallAmenitiesValidator = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow("").optional(),
  });

  //=================== PayRoll Months validation ======================//

  // create PayRoll Months validation
  public createPayRollMonthsValidator = Joi.object({
    name: Joi.string().allow("").required(),
    days: Joi.number().optional(),
    hours: Joi.number().allow("").required(),
  });

  // get all PayRoll Months query validation
  public getAllPayrollMonthsQueryValidator = Joi.object({
    limit: Joi.string().allow("").optional(),
    skip: Joi.string().allow("").optional(),
    name: Joi.string().allow("").optional(),
  });

  // update PayRoll Months validation
  public UpdatePayrollMonthsValidator = Joi.object({
    name: Joi.string().allow("").optional(),
    days: Joi.number().optional(),
    hours: Joi.number().allow("").optional(),
  });

}
export default SettingValidator;
