import { Request } from "express";
import Lib from "../../utils/lib/lib";
import AbstractServices from "../../abstarcts/abstract.service";

class AdministrationResService extends AbstractServices {
  constructor() {
    super();
  }

  // create admin
  public async createAdmin(req: Request) {
    const { password, ...rest } = req.body;
    const { res_id, hotel_id, id: res_admin } = req.rest_user;
    const Model = this.Model.restaurantModel();
    const check = await Model.getSingleAdmin({
      email: req.body.email,
    });

    if (check.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_CONFLICT,
        message: "Email already exist",
      };
    }
    const files = (req.files as Express.Multer.File[]) || [];

    rest["password"] = await Lib.hashPass(password);
    rest["avatar"] = files?.length && files[0].filename;
    rest["created_by"] = res_admin;

    const res = await Model.insertUserAdmin({ ...rest, res_id, hotel_id });

    if (res.length) {
      return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: "Admin Created Successfully",
      };
    }

    return {
      success: false,
      code: this.StatusCode.HTTP_BAD_REQUEST,
      message: this.ResMsg.HTTP_BAD_REQUEST,
    };
  }

  // get all admin
  public async getAllAdmin(req: Request) {
    const { res_id } = req.rest_user;
    const { limit, skip, status } = req.query;

    const model = this.Model.restaurantModel();

    const { data, total } = await model.getAllAdmin({
      res_id,
      limit: limit as string,
      skip: skip as string,
      status: status as string,
    });

    return {
      success: true,
      code: this.StatusCode.HTTP_SUCCESSFUL,
      total,
      data,
    };
  }

  // udate restaurant admin
  public async updateResAdmin(req: Request) {
  return await this.db.transaction(async (trx) => {
    const { id: res_admin } = req.rest_user;
    const { id } = req.params;

    const updatePayload = req.body as IupdateRestAdminPayload;

    const model = this.Model.restaurantModel(trx);
    await model.updateResAdmin(parseInt(id), {
      status: updatePayload.status,
      updated_by: res_admin,
    });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: "Restaurant Admin updated successfully",
    };
  });
  }

  // get all permission
  public async getAllPermission(req: Request) {
    const { res_id } = req.rest_user;
    const model = this.Model.restaurantModel();
    const data = await model.getAllResPermissions({ res_id });

    const { permissions } = data[0];

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data: permissions,
    };
  }

  // create role
  public async createRole(req: Request) {
    return await this.db.transaction(async (trx) => {
      const { role_name, permissions } = req.body;
      const { res_id, id: res_admin } = req.rest_user;
      const model = this.Model.restaurantModel(trx);

      // check role
      const checkRole = await model.getRoleByName(role_name, res_id);

      if (checkRole.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_BAD_REQUEST,
          message: "Already exist",
        };
      }

      // insert role
      const res = await model.createRole({
        name: role_name,
        res_id,
      });

      const permissionIds = permissions.map(
        (item: any) => item.r_permission_id
      );

      const uniquePermissionIds = [...new Set(permissionIds)];

      // get all permission
      const checkAllPermission = await model.getAllResPermission({
        ids: permissionIds,
        res_id,
      });

      if (checkAllPermission.length != uniquePermissionIds.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_BAD_REQUEST,
          message: "Permission ids are invalid",
        };
      }

      const rolePermissionPayload: {
        res_id: number;
        role_id: number;
        r_permission_id: number;
        permission_type: "read" | "write" | "update" | "delete";
        created_by: number;
      }[] = [];

      for (let i = 0; i < permissions.length; i++) {
        rolePermissionPayload.push({
          res_id,
          r_permission_id: permissions[i].r_permission_id,
          role_id: res[0],
          permission_type: permissions[i].permission_type,
          created_by: res_admin,
        });
      }

      // insert role permission
      await model.createRolePermission(rolePermissionPayload);

      return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: this.ResMsg.HTTP_SUCCESSFUL,
      };
    });
  }

  // get role
  public async getRole(req: Request) {
    const model = this.Model.restaurantModel();

    const data = await model.getAllRole(req.rest_user.res_id);

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data,
    };
  }
  // get single role
  public async getSingleRole(req: Request) {
    const { id } = req.params;
    const model = this.Model.restaurantModel();

    const data = await model.getSingleRole(parseInt(id), req.rest_user.res_id);

    const { permissions, ...rest } = data[0];
    const output_data: any = [];

    for (let i = 0; i < permissions?.length; i++) {
      let found = false;

      for (let j = 0; j < output_data.length; j++) {
        if (
          permissions[i].permission_group_id ==
          output_data[j].permission_group_id
        ) {
          output_data[j].permission_type.push(permissions[i].permission_type);
          found = true;
          break;
        }
      }

      if (!found) {
        output_data.push({
          permission_group_id: permissions[i].permission_group_id,
          r_permission_id: permissions[i].r_permission_id,
          permission_group_name: permissions[i].permission_group_name,
          permission_type: [permissions[i].permission_type],
        });
      }
    }

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data: { ...rest, permission: output_data },
    };
  }

  public async updateSingleRole(req: Request) {
    const { id: role_id } = req.params;
    const { res_id } = req.rest_user;
    const {
      role_name,
      added,
      deleted,
    }: { role_name: string; added: any[]; deleted: number[] } = req.body;
    const newPermission: any[] = [...new Set(added)];
    const deletedPermission: number[] = [...new Set(deleted)];

    return await this.db.transaction(async (trx) => {
      const model = this.Model.restaurantModel(trx);

      if (role_name) {
        // check role
        const checkRole = await model.getSingleRole(parseInt(role_id), res_id);

        if (!checkRole.length) {
          return {
            success: false,
            code: this.StatusCode.HTTP_NOT_FOUND,
            message: "role not found",
          };
        }
        await model.updateSingleRole(
          parseInt(role_id),
          {
            name: role_name,
          },
          res_id
        );
      }

      // ================== new permission added step ================= //

      if (newPermission.length) {
        const addedPermissionIds = newPermission.map(
          (item: any) => item.r_permission_id
        );

        const uniquePermissionIds = [...new Set(addedPermissionIds)];

        // get all permission
        const checkAllPermission = await model.getAllResPermission({
          ids: addedPermissionIds,
          res_id,
        });

        if (checkAllPermission.length != uniquePermissionIds.length) {
          return {
            success: false,
            code: this.StatusCode.HTTP_BAD_REQUEST,
            message: "Permission ids are invalid",
          };
        }

        const rolePermissionPayload: {
          res_id: number;
          role_id: number;
          r_permission_id: number;
          permission_type: "read" | "write" | "update" | "delete";
        }[] = [];

        for (let i = 0; i < newPermission.length; i++) {
          rolePermissionPayload.push({
            res_id,
            r_permission_id: newPermission[i].r_permission_id,
            role_id: parseInt(role_id),
            permission_type: newPermission[i].permission_type,
          });
        }

        // insert role permission
        await model.createRolePermission(rolePermissionPayload);
      }

      // ===================  delete permission step ============= //

      if (deletedPermission.length) {
        await Promise.all(
          deletedPermission.map(async (item: any) => {
            await model.deleteRolePermission(
              item.r_permission_id,
              item.permission_type,
              res_id
            );
          })
        );
      }

      return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: "Role updated successfully",
      };
    });
  }

  // get admin role
  public async getAdminRole(req: Request) {
    const { id: res_admin } = req.rest_user;
    const model = this.Model.restaurantModel();

    const res = await model.getAdminsRolePermission(res_admin);

    const { id, name, role_id, role_name, permissions } = res[0];

    const moduleObject: any = {};

    for (const permission of permissions) {
      const moduleId = permission.permissiongGroupId;

      if (moduleObject[moduleId]) {
        moduleObject[moduleId].subModule.push({
          permissionId: permission.permissionId,
          permissionName: permission.permissionName,
          permissionType: permission.permissionType,
        });
      } else {
        moduleObject[moduleId] = {
          moduleId,
          module: permission.permissionGroupName,
          subModule: [
            {
              permissionId: permission.permissionId,
              permissionName: permission.permissionName,
              permissionType: permission.permissionType,
            },
          ],
        };
      }
    }

    const data = Object.values(moduleObject);

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data: { id, name, role_id, role_name, permissionList: data },
    };
  }

  // Get all Employee
  public async getAllEmployee(req: Request) {
    const { hotel_id, res_id } = req.rest_user;

    const { limit, skip, key } = req.query;

    const model = this.Model.restaurantModel();

    const { data, total } = await model.getAllEmployee({
      key: key as string,
      limit: limit as string,
      skip: skip as string,
      hotel_id,
      res_id,
    });
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total,
      data,
    };
  }
}

export default AdministrationResService;
