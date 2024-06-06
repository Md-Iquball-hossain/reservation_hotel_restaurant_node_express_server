"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = __importDefault(require("../../utils/miscellaneous/schema"));
class RolePermissionModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // create module
    rolePermissionGroup(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("permission_group")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(body);
        });
    }
    // get permission group
    getRolePermissionGroup() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("permission_group")
                .withSchema(this.RESERVATION_SCHEMA)
                .select("id", "name");
        });
    }
    // create permission
    createPermission({ permission_group_id, name, created_by, hotel_id, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertObj = name.map((item) => {
                return {
                    permission_group_id,
                    name: item,
                    created_by,
                    hotel_id,
                };
            });
            return yield this.db("permission")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(insertObj);
        });
    }
    // get all permission
    getAllPermission() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.db("permission AS p")
                .withSchema(this.RESERVATION_SCHEMA)
                .select("p.id AS permission_id", "p.name As permission_name", "p.permission_group_id", "pg.name AS permission_group_name")
                .join("permission_group AS pg", "p.permission_group_id", "pg.id");
            return res;
        });
    }
    // create role permission
    createRolePermission(insertObj) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.db("role_permission")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(insertObj);
            return res;
        });
    }
    // delete role perimission
    deleteRolePermission(oldPermissionId, permissionType, role_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.db("role_permission")
                .withSchema(this.RESERVATION_SCHEMA)
                .andWhere("permissionId", oldPermissionId)
                .andWhere("permissionType", permissionType)
                .andWhere("roleId", role_id)
                .delete();
            return res;
        });
    }
    // create role
    createRole(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.db("role")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(payload);
            return res;
        });
    }
    // get role
    getRole() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.db("role")
                .withSchema(this.RESERVATION_SCHEMA)
                .select("*");
            return res;
        });
    }
    // get single role
    getSingleRole(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.db("role AS r")
                .withSchema(this.RESERVATION_SCHEMA)
                .select("r.id AS role_id", "r.name AS role_name", "pg.id AS permission_group_id", "pg.name AS permission_group_name", "p.id AS permission_id", "p.name AS permission_name", "rp.permission_type")
                .join("role_permission AS rp", "r.id", "rp.role_id")
                .join("permission AS p", "rp.permission_id", "p.id")
                .join("permission_group AS pg", "p.permission_group_id", "pg.id")
                .where("r.id", id);
            return res;
        });
    }
    // update role
    updateSingleRole(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.db("role AS r")
                .withSchema(this.RESERVATION_SCHEMA)
                .update(body)
                .where({ id });
            return res;
        });
    }
    // get role by name
    getRoleByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.db("role")
                .withSchema(this.RESERVATION_SCHEMA)
                .select("*")
                .whereILike("name", `%${name}%`);
            return res;
        });
    }
    // get admins role permission
    getAdminRolePermission(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, email } = payload;
            return yield this.db("admin_permissions")
                .withSchema(this.RESERVATION_SCHEMA)
                .where(function () {
                if (id) {
                    this.where({ id });
                }
                else {
                    this.where({ email });
                }
            });
        });
    }
}
exports.default = RolePermissionModel;
//# sourceMappingURL=rolePermissionModel.js.map