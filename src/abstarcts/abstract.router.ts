import { Router } from "express";
import CommonValidator from "../common/validators/commonValidator";

import FileFolder from "../utils/miscellaneous/fileFolders";
import Uploader from "../common/middleware/uploader/uploader";

class AbstractRouter {
  public router = Router();
  public commonValidator = new CommonValidator();
  public uploader = new Uploader();
  protected fileFolders = FileFolder;
}

export default AbstractRouter;
