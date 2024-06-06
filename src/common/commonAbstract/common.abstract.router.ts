import { Router } from "express";
import Uploader from "../middleware/uploader/uploader";
import CommonValidator from "../validators/commonValidator";

class CommonAbstractRouter {
  public router = Router();
  public commonValidator = new CommonValidator();
  public uploader = new Uploader();
}

export default CommonAbstractRouter;
