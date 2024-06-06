import { Request } from "express";
import Lib from "../../utils/lib/lib";
import AbstractServices from "../../abstarcts/abstract.service";

class MAdministrationService extends AbstractServices {
  constructor() {
    super();
  }

  // create admin
  public async createAdmin(req: Request) {
    const { password, ...rest } = req.body;
    const mUserAdminModel = this.Model.mUserAdminModel();
    const check = await mUserAdminModel.getAdminByEmail(req.body.email);

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

    const res = await mUserAdminModel.insertUserAdmin(rest);

    if (res.length) {
      return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: this.ResMsg.HTTP_SUCCESSFUL,
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
    const { limit, skip, status } = req.query;

    const mUserAdminModel = this.Model.mUserAdminModel();

    const { data, total } = await mUserAdminModel.getAllAdmin(
      limit as string,
      skip as string,
      status as string
    );

    return {
      success: true,
      code: this.StatusCode.HTTP_SUCCESSFUL,
      total,
      data,
    };
  }

  // create permission group
  public async createPermissionGroup(req: Request) {
    const { id } = req.admin;
    const model = this.Model.mRolePermissionModel();
    const res = await model.rolePermissionGroup({
      ...req.body,
      created_by: id,
    });

    if (res.length) {
      return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: this.ResMsg.HTTP_SUCCESSFUL,
      };
    }

    return {
      success: false,
      code: this.StatusCode.HTTP_BAD_REQUEST,
      message: this.ResMsg.HTTP_BAD_REQUEST,
    };
  }
  // get permission group
  public async getPermissionGroup(req: Request) {
    const { id } = req.admin;
    const model = this.Model.mRolePermissionModel();
    const data = await model.getRolePermissionGroup();

    return {
      success: true,
      code: this.StatusCode.HTTP_SUCCESSFUL,
      data,
    };
  }

  // create permission
  public async createPermission(req: Request) {
    const { id } = req.admin;

    const { permission_group_id, name } = req.body;
    const model = this.Model.mRolePermissionModel();
    const res = await model.createPermission({
      permission_group_id,
      name,
      created_by: id,
    });

    console.log({ res });

    if (res.length) {
      return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: this.ResMsg.HTTP_SUCCESSFUL,
      };
    }

    return {
      success: false,
      code: this.StatusCode.HTTP_BAD_REQUEST,
      message: this.ResMsg.HTTP_BAD_REQUEST,
    };
  }

  // get all permission
  public async getAllPermission(req: Request) {
    const model = this.Model.mRolePermissionModel();
    const data = await model.getAllPermission({});

    const groupedPermissions: any = {};

    data.forEach((entry) => {
      const permission_group_id = entry.permission_group_id;
      const permission = {
        permission_id: entry.permission_id,
        permission_name: entry.permission_name,
      };

      if (!groupedPermissions[permission_group_id]) {
        groupedPermissions[permission_group_id] = {
          permission_group_id: permission_group_id,
          permissionGroupName: entry.permission_group_name,
          permissions: [permission],
        };
      } else {
        groupedPermissions[permission_group_id].permissions.push(permission);
      }
    });

    const result = Object.values(groupedPermissions);

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data: result,
    };
  }

  // create role
  public async createRole(req: Request) {
    return await this.db.transaction(async (trx) => {
      const { role_name, permissions } = req.body;
      const { id } = req.admin;
      const model = this.Model.mRolePermissionModel(trx);

      // check role
      const checkRole = await model.getRoleByName(role_name);

      if (checkRole.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_BAD_REQUEST,
          message: "Already exist",
        };
      }

      const res = await model.createRole({
        role_name,
      });

      // permissions
      const permissionObj = permissions.map((item: any) => {
        return {
          role_id: res[0],
          created_by: id,
          permission_id: item.permission_id,
          permission_type: item.permissionType,
        };
      });

      const rolePermissionRes = await model.createRolePermission(permissionObj);

      if (rolePermissionRes.length) {
        return {
          success: true,
          code: this.StatusCode.HTTP_SUCCESSFUL,
          message: this.ResMsg.HTTP_SUCCESSFUL,
        };
      }

      return {
        success: false,
        code: this.StatusCode.HTTP_BAD_REQUEST,
        message: this.ResMsg.HTTP_BAD_REQUEST,
      };
    });
  }

  // get role
  public async getRole(Req: Request) {
    const model = this.Model.mRolePermissionModel();

    const data = await model.getRole();

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data,
    };
  }
  // get single role
  public async getSingleRole(req: Request) {
    const { id } = req.params;
    const model = this.Model.mRolePermissionModel();

    const originalData = await model.getSingleRole(parseInt(id));

    const transformedData: any = {};

    originalData.forEach((item) => {
      const {
        role_id,
        role_name,
        permission_group_id,
        permission_group_name,
        permission_id,
        permission_name,
        permissionType,
      } = item;

      if (!transformedData[role_id]) {
        transformedData[role_id] = {
          role_id,
          role_name,
          permissions: [],
        };
      }

      const permissionGroup = transformedData[role_id].permissions.find(
        (group: any) => group.permission_group_id === permission_group_id
      );

      if (!permissionGroup) {
        transformedData[role_id].permissions.push({
          permission_group_id,
          permission_group_name,
          submodules: [],
        });
      }

      const permission = {
        permission_id,
        permission_name,
        operations: [permissionType],
      };

      let existingPermission: any = null;

      transformedData[role_id].permissions.forEach((group: any) => {
        if (group.permission_group_id === permission_group_id) {
          group.submodules.forEach((submodule: any) => {
            if (submodule.permission_id === permission_id) {
              existingPermission = submodule;
            }
          });
          if (!existingPermission) {
            group.submodules.push(permission);
          } else {
            existingPermission.operations.push(permissionType);
          }
        }
      });
    });

    const finalResult = Object.values(transformedData);

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data: finalResult[0],
    };
  }

  public async updateSingleRole(req: Request) {
    const { id: role_id } = req.params;
    const { id: adminId } = req.admin;
    const {
      role_name,
      added,
      deleted,
    }: { role_name: string; added: any[]; deleted: number[] } = req.body;
    const newPermission: any[] = [...new Set(added)];
    const oldPermission: number[] = [...new Set(deleted)];

    return await this.db.transaction(async (trx) => {
      const model = this.Model.mRolePermissionModel(trx);

      if (role_name) {
        await model.updateSingleRole(parseInt(role_id), {
          name: role_name,
        });
      }

      if (oldPermission.length) {
        await Promise.all(
          oldPermission.map(async (item: any) => {
            await model.deleteRolePermission(
              item.permission_id,
              item.permission_type,
              parseInt(role_id)
            );
          })
        );
      }

      if (newPermission.length) {
        const body = newPermission.map((item) => {
          return {
            role_id: parseInt(role_id),
            h_permission_id: item.permission_id,
            created_by: adminId,
            permission_type: item.permission_type,
          };
        });

        await model.createRolePermission(body);
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
    const { id: admin_id } = req.admin;
    const model = this.Model.mRolePermissionModel();

    const res = await model.getAdminRolePermission(admin_id);

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

  //  ========================= restaurant ======================= //

  // create restaurant permission group
  public async createRestaurantPermissionGroup(req: Request) {
    const { id } = req.admin;
    const model = this.Model.restaurantModel();

    const { name } = req.body;

    const data = await model.getPermissionGroup({ name });

    if (data.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_CONFLICT,
        message: this.ResMsg.HTTP_CONFLICT,
      };
    }

    const res = await model.rolePermissionGroup({
      name,
      created_by: id,
    });

    if (res.length) {
      return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: this.ResMsg.HTTP_SUCCESSFUL,
      };
    }

    return {
      success: false,
      code: this.StatusCode.HTTP_BAD_REQUEST,
      message: this.ResMsg.HTTP_BAD_REQUEST,
    };
  }

  // get permission group
  public async getRestaurantPermissionGroup(req: Request) {
    const model = this.Model.restaurantModel();
    const data = await model.getPermissionGroup();

    return {
      success: true,
      code: this.StatusCode.HTTP_SUCCESSFUL,
      data,
    };
  }
}

export default MAdministrationService;
