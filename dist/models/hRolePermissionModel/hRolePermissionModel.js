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
class HRolePermissionModel extends schema_1.default {
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
    // create hotel permission
    addedHotelPermission(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("hotel_permission")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(payload);
        });
    }
    // get all hotel permission
    getAllHotelPermission(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotel_id, ids } = payload;
            console.log({ ids, hotel_id });
            return yield this.db("hotel_permission")
                .withSchema(this.RESERVATION_SCHEMA)
                .select("id", "hotel_id", "permission_id")
                .where(function () {
                if (ids === null || ids === void 0 ? void 0 : ids.length) {
                    this.whereIn("id", ids);
                }
                if (hotel_id) {
                    this.where({ hotel_id });
                }
            });
        });
    }
    // v2 get all hotel permission code
    getAllHotelPermissions(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotel_id } = payload;
            return yield this.db("hotel_permission_view")
                .withSchema(this.RESERVATION_SCHEMA)
                .select("hotel_id", "permissions")
                .where(function () {
                if (hotel_id) {
                    this.where({ hotel_id });
                }
            });
        });
    }
    // create role permission
    createRolePermission(insertObj) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("role_permission")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(insertObj);
        });
    }
    // delete role perimission
    deleteRolePermission(h_permission_id, permission_type, role_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.db("role_permission")
                .withSchema(this.RESERVATION_SCHEMA)
                .andWhere("h_permission_id", h_permission_id)
                .andWhere("permission_type", permission_type)
                .andWhere("role_id", role_id)
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
    getAllRole(hotel_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("role")
                .withSchema(this.RESERVATION_SCHEMA)
                .select("*")
                .where({ hotel_id });
        });
    }
    // get single role
    getSingleRole(id, hotel_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.db("role_permission_view")
                .withSchema(this.RESERVATION_SCHEMA)
                .select("*")
                .where("role_id", id)
                .andWhere({ hotel_id });
            return res;
        });
    }
    // update role
    updateSingleRole(id, body, hotel_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.db("role AS r")
                .withSchema(this.RESERVATION_SCHEMA)
                .update(body)
                .where({ id })
                .andWhere({ hotel_id });
            return res;
        });
    }
    // get role by name
    getRoleByName(name, hotel_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.db("role")
                .withSchema(this.RESERVATION_SCHEMA)
                .select("*")
                .where({ hotel_id })
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
exports.default = HRolePermissionModel;
//# sourceMappingURL=hRolePermissionModel.js.map