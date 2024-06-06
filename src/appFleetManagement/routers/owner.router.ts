import AbstractRouter from "../../abstarcts/abstract.router";
import OwnerController from "../controllers/owner.controller";

class OwnerRouter extends AbstractRouter {
    private Controller = new OwnerController();

    constructor() {
        super();
        this.callRouter();
    }

    private callRouter() {

        // create and get all owner
        this.router
        .route("/")
        .post(
        this.uploader
            .cloudUploadRaw(this.fileFolders.FLEET_FILES),
        this.Controller.createOwner
        )
        .get(this.Controller.getAllOwner)

        // single and update owner
        this.router
        .route("/:id")
        .get(this.Controller.getSingleOwner)
        .patch(
        this.uploader
            .cloudUploadRaw(this.fileFolders.FLEET_FILES),
        this.Controller.updateOwner
        );

    }
}
export default OwnerRouter;