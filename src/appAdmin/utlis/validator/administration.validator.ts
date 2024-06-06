import Joi from "joi";

class AdministrationValidator {
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
    status: Joi.string().valid("active", "blocked").optional(),
  });

  // create permission validator
  public createPermissionValidator = Joi.object({
    permission_group_id: Joi.number().required(),
    name: Joi.array().items(Joi.string()).required(),
  });

  // Define Joi schema for permissions
  permissionSchema = Joi.object({
    h_permission_id: Joi.number().required(),
    permission_type: Joi.string()
      .valid("read", "write", "update", "delete")
      .required(),
  });

  // Define Joi schema for the entire object
  createRolePermissionValidator = Joi.object({
    role_name: Joi.string().required(),
    permissions: Joi.array().items(this.permissionSchema).min(1).required(),
  });
}

export default AdministrationValidator;
