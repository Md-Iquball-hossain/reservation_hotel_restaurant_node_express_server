import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";
import { IhotelPermissions } from "../utlis/interfaces/mConfiguration.interfaces.";

class MConfigurationService extends AbstractServices {
  constructor() {
    super();
  }

  // create permission group
  public async createPermissionGroup(req: Request) {
    const { id } = req.admin;
    const model = this.Model.mConfigurationModel();

    // get all permission group
    const checkGroup = await model.getAllRolePermissionGroup({
      name: req.body.name,
    });

    if (checkGroup.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_CONFLICT,
        message: this.ResMsg.HTTP_CONFLICT,
      };
    }

    await model.createPermissionGroup({
      ...req.body,
      created_by: id,
    });

    return {
      success: true,
      code: this.StatusCode.HTTP_SUCCESSFUL,
      message: this.ResMsg.HTTP_SUCCESSFUL,
    };
  }
  // get permission group
  public async getPermissionGroup(req: Request) {
    const model = this.Model.mConfigurationModel();
    const data = await model.getAllRolePermissionGroup({});

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
    const model = this.Model.mConfigurationModel();
    await model.createPermission({
      permission_group_id,
      name,
      created_by: id,
    });

    return {
      success: true,
      code: this.StatusCode.HTTP_SUCCESSFUL,
      message: this.ResMsg.HTTP_SUCCESSFUL,
    };
  }

  // get single hotel permission
  public async getSingleHotelPermission(req: Request) {
    const { id } = req.params;

    const data: IhotelPermissions[] =
      await this.Model.mConfigurationModel().getAllPermissionByHotel(
        parseInt(id)
      );

    const { permissions } = data[0];

    const groupedPermissions: any = {};

    permissions?.forEach((entry) => {
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

  // update hotel permission
  public async updateSingleHotelPermission(req: Request) {
    return await this.db.transaction(async (trx) => {
      const { id } = req.params;

      const { added, deleted } = req.body;

      const model = this.Model.mConfigurationModel(trx);

      const checkHotelPermission = await model.getAllPermissionByHotel(
        parseInt(id)
      );

      const { permissions } = checkHotelPermission[0];

      let distinctValueForAdd = [];

      let existRolePermissionIds = [];

      if (permissions?.length) {
        existRolePermissionIds = permissions.map(
          (item: any) => item.h_permission_id
        );
        if (added?.length) {
          let existHotelPermissionIds;

          existHotelPermissionIds = permissions.map(
            (item: any) => item.permission_id
          );

          for (let i = 0; i < added.length; i++) {
            let found = false;
            for (let j = 0; j < existHotelPermissionIds.length; j++) {
              if (added[i] == existHotelPermissionIds[j]) {
                found = true;
                break;
              }
            }
            if (!found) {
              distinctValueForAdd.push(added[i]);
            }
          }
        }
      } else {
        distinctValueForAdd = added;
      }

      if (distinctValueForAdd.length) {
        const hotelPermissionInsertPayload = distinctValueForAdd.map(
          (item: any) => {
            return {
              hotel_id: id,
              permission_id: item,
            };
          }
        );

        // insert hotel permission payload
        await model.addedHotelPermission(hotelPermissionInsertPayload);
      }

      if (deleted?.length) {
        const deleteRolePermission = [];

        for (let i = 0; i < deleted.length; i++) {
          for (let j = 0; j < permissions.length; j++) {
            if (deleted[i] == permissions[j].permission_id) {
              deleteRolePermission.push(permissions[j].h_permission_id);
            }
          }
        }

        // delete role permission
        if (deleteRolePermission.length) {
          await model.deleteHotelRolePermission(
            parseInt(id),
            deleteRolePermission
          );
        }
        // delte hotel role permission
        await model.deleteHotelPermission(parseInt(id), deleted);
      }

      return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: "Successfully Permission Updated",
      };
    });
  }

  // get all permission
  public async getAllPermission(req: Request) {
    const model = this.Model.mConfigurationModel();
    const data = await model.getAllPermission();

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
}

export default MConfigurationService;
