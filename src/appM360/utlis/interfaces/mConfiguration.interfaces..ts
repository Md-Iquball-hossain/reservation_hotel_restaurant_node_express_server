export interface IPermissions {
  permission_id: number;
  permission_name: string;
  hotel_permission_id: number;
  permission_group_id: number;
  permission_group_name: string;
}
export interface IhotelPermissions {
  hotel_id: number;
  name: string;
  permissions: IPermissions[];
}
