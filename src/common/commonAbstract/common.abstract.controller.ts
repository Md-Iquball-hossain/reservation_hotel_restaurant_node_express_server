import CustomError from "../../utils/lib/customEror";
import Wrapper from "../middleware/asyncWrapper/middleware";
import CommonValidator from "../validators/commonValidator";

abstract class CommonAbstractController {
  protected asyncWrapper: Wrapper;
  public commonValidator;
  constructor() {
    this.asyncWrapper = new Wrapper();
    this.commonValidator = new CommonValidator();
  }

  protected error(message?: string, status?: number, type?: string) {
    throw new CustomError(message || "Something went wrong", status || 500);
  }
}
export default CommonAbstractController;
