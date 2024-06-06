import Joi from "joi";

class AdministrationResValidator {
  // create Admin input validator
  public createAdminValidator = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().optional(),
    role: Joi.number().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });

  // create permission group validator
  public createPermissionGroupValidator = Joi.object({
    name: Joi.string().required(),
  });

  // get all admin query validator
  public getAllAdminQueryValidator = Joi.object({
    limit: Joi.number().optional(),
    skip: Joi.number().optional(),
    status: Joi.string().valid("active", "inactive").optional(),
  });

  // create permission validator
  public createPermissionValidator = Joi.object({
    permission_group_id: Joi.number().required(),
    name: Joi.array().items(Joi.string()).required(),
  });

  // Define Joi schema for permissions
  permissionSchema = Joi.object({
    r_permission_id: Joi.number().required(),
    permission_type: Joi.string()
      .valid("read", "write", "update", "delete")
      .required(),
  });

  // Define Joi schema for the entire object
  createRolePermissionValidator = Joi.object({
    role_name: Joi.string().required(),
    permissions: Joi.array().items(this.permissionSchema).min(1).required(),
  });

  // get all Employee query validator
  getAllEmployeeQueryValidator = Joi.object({
    status: Joi.string().valid("0", "1"),
    key: Joi.string().allow("").optional(),
    limit: Joi.string().allow("").optional(),
    skip: Joi.string().allow("").optional(),
  });

  // create Restaurant Admin validation
  public updateRestaurantAdminValidator = Joi.object({
    name: Joi.string().optional(),
    avatar: Joi.string().optional(),
    phone: Joi.number().optional(),
    status: Joi.valid("active","inactive").optional()
  });

}
export default AdministrationResValidator;
