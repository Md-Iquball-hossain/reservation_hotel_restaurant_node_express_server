import Joi from "joi";

class MConfigurationValidator {
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

  // update permission validator
  public updatePermissionValidator = Joi.object({
    added: Joi.array().items(Joi.number().required()).optional(),
    deleted: Joi.array().items(Joi.number().required()).optional(),
  });

  // Define Joi schema for permissions
  permissionSchema = Joi.object({
    permission_id: Joi.number().required(),
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

export default MConfigurationValidator;
