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
class MConfigurationModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // create permission group
    createPermissionGroup(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("permission_group")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(body);
        });
    }
    // get all permission group
    getAllRolePermissionGroup(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, name } = payload;
            return yield this.db("permission_group")
                .withSchema(this.RESERVATION_SCHEMA)
                .select("id", "name")
                .where(function () {
                if (name) {
                    this.where("name", "like", `%${name}%`);
                }
                if (id) {
                    this.andWhere({ id });
                }
            });
        });
    }
    // create permission
    createPermission({ permission_group_id, name, created_by, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertObj = name.map((item) => {
                return {
                    permission_group_id,
                    name: item,
                    created_by,
                };
            });
            return yield this.db("permission")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(insertObj);
        });
    }
    // get all permission
    getAllPermissionByHotel(hotel_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.db("hotel_permission_view")
                .withSchema(this.RESERVATION_SCHEMA)
                .select("*")
                .where({ hotel_id });
            return res;
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
    // added hotel permission
    addedHotelPermission(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("hotel_permission")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(payload);
        });
    }
    // create hotel permission
    deleteHotelPermission(hotel_id, permission_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("hotel_permission")
                .withSchema(this.RESERVATION_SCHEMA)
                .whereIn("permission_id", permission_id)
                .andWhere({ hotel_id })
                .delete();
        });
    }
    // delete hotel hotel role permission
    deleteHotelRolePermission(hotel_id, h_permission_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("role_permission")
                .withSchema(this.RESERVATION_SCHEMA)
                .whereIn("h_permission_id", h_permission_id)
                .andWhere({ hotel_id })
                .delete();
        });
    }
}
exports.default = MConfigurationModel;
//# sourceMappingURL=mConfigurationModel.js.map