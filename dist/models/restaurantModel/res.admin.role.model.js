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
class ResAdminRoleModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    //=================== Admin  ======================//
    // get Res admin by email
    getResAdminByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("res_admin AS ra")
                .withSchema(this.RESTAURANT_SCHEMA)
                .select("ra.id", "ra.email", "ra.password", "ra.name", "ra.avatar", "ra.phone", "ra.status", "r.id As roleId", "r.name As roleName", "ra.created_at")
                .leftJoin("role AS r", "ra.role", "r.id")
                .where({ email });
        });
    }
    // insert user admin
    insertUserAdmin(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("res_admin")
                .withSchema(this.RESTAURANT_SCHEMA)
                .insert(payload);
        });
    }
    getSingleAdmin(where) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, id } = where;
            return yield this.db("res_admin AS ra")
                .select("ra.hotel_id", "ra.id", "ra.email", "ra.password", "ra.name", "ra.avatar", "ra.phone", "ra.status", "r.id As role_id", "r.name As role_name", "ra.created_at")
                .withSchema(this.RESTAURANT_SCHEMA)
                .leftJoin("role AS r", "ra.res_id", "r.res_id")
                .where(function () {
                if (id) {
                    this.where("ra.id", id);
                }
                if (email) {
                    this.where("ra.email", email);
                }
            });
        });
    }
    // get all admin
    getAllAdmin(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, status, res_id } = payload;
            const dtbs = this.db("res_admin AS ra");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.RESTAURANT_SCHEMA)
                .select("ra.id", "ra.email", "ra.name", "ra.avatar", "ra.phone", "ra.status", "r.id As role_id", "r.name As role_name", "ra.created_at")
                .leftJoin("role AS r", "ra.role", "r.id")
                .where(function () {
                if (status) {
                    this.where("ra.status", status);
                }
                this.andWhere("ra.res_id", res_id);
            });
            const total = yield this.db("res_admin AS ra")
                .withSchema(this.RESTAURANT_SCHEMA)
                .count("ra.id As total")
                .leftJoin("role AS r", "ra.role", "r.id")
                .where(function () {
                if (status) {
                    this.where("ra.status", status);
                }
                this.andWhere("ra.res_id", res_id);
            });
            return { data, total: total[0].total };
        });
    }
    // update admin model
    updateAdmin(payload, where) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("res_admin")
                .withSchema(this.RESTAURANT_SCHEMA)
                .update(payload)
                .where({ email: where.email });
        });
    }
    //=================== Admin Role Permission ======================//
    // create Res permission
    addedResPermission(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("res_permission")
                .withSchema(this.RESTAURANT_SCHEMA)
                .insert(payload);
        });
    }
    // create module
    rolePermissionGroup(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("permission_group")
                .withSchema(this.RESTAURANT_SCHEMA)
                .insert(body);
        });
    }
    // get permission group
    getPermissionGroup(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ids, name } = payload || {};
            return yield this.db("permission_group")
                .withSchema(this.RESTAURANT_SCHEMA)
                .select("id", "name")
                .where(function () {
                if (name) {
                    this.where("name", "like", `%${name}%`);
                }
                if (ids) {
                    this.whereIn("id", ids);
                }
            })
                .orderBy("id", "desc");
        });
    }
    // create permission
    createPermission({ permission_group_id, name, created_by, res_id, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertObj = name.map((item) => {
                return {
                    permission_group_id,
                    name: item,
                    created_by,
                    res_id,
                };
            });
            return yield this.db("permission")
                .withSchema(this.RESTAURANT_SCHEMA)
                .insert(insertObj);
        });
    }
    // create hotel permission
    addedPermission(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("res_permission")
                .withSchema(this.RESTAURANT_SCHEMA)
                .insert(payload);
        });
    }
    // get all hotel permission
    getAllResPermission(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { res_id, ids } = payload;
            console.log({ ids, res_id });
            return yield this.db("res_permission")
                .withSchema(this.RESTAURANT_SCHEMA)
                .select("id", "res_id", "permission_grp_id")
                .where(function () {
                if (ids === null || ids === void 0 ? void 0 : ids.length) {
                    this.whereIn("id", ids);
                }
                if (res_id) {
                    this.where({ res_id });
                }
            });
        });
    }
    // v2 get all Res permission code
    getAllResPermissions(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { res_id } = payload;
            return yield this.db("res_permission_view")
                .withSchema(this.RESTAURANT_SCHEMA)
                .select("res_id", "permissions")
                .where(function () {
                if (res_id) {
                    this.where({ res_id });
                }
            });
        });
    }
    // create role permission
    createRolePermission(insertObj) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("role_permission")
                .withSchema(this.RESTAURANT_SCHEMA)
                .insert(insertObj);
        });
    }
    // delete role perimission
    deleteRolePermission(r_permission_id, permission_type, res_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.db("role_permission")
                .withSchema(this.RESTAURANT_SCHEMA)
                .andWhere("r_permission_id", r_permission_id)
                .andWhere("permission_type", permission_type)
                .andWhere("res_id", res_id)
                .delete();
            return res;
        });
    }
    // create role
    createRole(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.db("role")
                .withSchema(this.RESTAURANT_SCHEMA)
                .insert(payload);
            return res;
        });
    }
    // get role
    getAllRole(res_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("role")
                .withSchema(this.RESTAURANT_SCHEMA)
                .select("*")
                .where({ res_id });
        });
    }
    // get single role
    getSingleRole(id, res_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.db("role_permission_view")
                .withSchema(this.RESTAURANT_SCHEMA)
                .select("*")
                .where("role_id", id)
                .andWhere({ res_id });
            return res;
        });
    }
    // update role
    updateSingleRole(id, body, res_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.db("role AS r")
                .withSchema(this.RESTAURANT_SCHEMA)
                .update(body)
                .where({ id })
                .andWhere({ res_id });
            return res;
        });
    }
    // get role by name
    getRoleByName(name, res_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.db("role")
                .withSchema(this.RESTAURANT_SCHEMA)
                .select("*")
                .where({ res_id })
                .andWhere(function () {
                if (name) {
                    this.where("name", "like", `${name}%`);
                }
            });
            return res;
        });
    }
    // get admins role permission
    getAdminRolePermission(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, email } = payload;
            return yield this.db("admin_permissions")
                .withSchema(this.RESTAURANT_SCHEMA)
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
    // get admins role permission
    getAdminsRolePermission(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.db("res_admin_permissions")
                .withSchema(this.RESTAURANT_SCHEMA)
                .where({ id });
            return res;
        });
    }
}
exports.default = ResAdminRoleModel;
//# sourceMappingURL=res.admin.role.model.js.map