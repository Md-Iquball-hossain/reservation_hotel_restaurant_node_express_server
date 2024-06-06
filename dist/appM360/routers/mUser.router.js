"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const mUserController_1 = __importDefault(require("../controllers/mUserController"));
class MUserRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.userController = new mUserController_1.default();
        this.callRouter();
    }
    callRouter() {
        // create user and get all user
        this.router
            .route("/")
            .post(this.uploader.cloudUploadRaw(this.fileFolders.M_USER_FILES), this.userController.createUser)
            .get(this.userController.getAllUser);
        // get single user
        this.router
            .route("/:id")
            .get(this.userController.getSingleUser)
            .patch(this.uploader.cloudUploadRaw(this.fileFolders.M_USER_FILES), this.userController.updateUser);
    }
}
exports.default = MUserRouter;
//# sourceMappingURL=mUser.router.js.map