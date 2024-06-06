import { Request, Response, NextFunction } from "express";
import CustomError from "../../../utils/lib/customEror";
import ManageFile from "../../../utils/lib/manageFile";
interface IcustomError {
  success: boolean;
  message: string;
  status?: number;
}

class ErrorHandler {
  private customError: IcustomError;
  private manageFile: ManageFile;

  constructor() {
    this.customError = {
      success: false,
      message: "Something went wrong :( please try again later!!",
    };

    this.manageFile = new ManageFile();
  }

  /**
   * handleErrors
   */
  public handleErrors = async (
    err: Error | CustomError,
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    // file removing starts
    const files = req.upFiles || [];

    if (files.length) {
      await this.manageFile.deleteFromCloud(files);
    }
    console.log({ err });
    if (err instanceof CustomError) {
      this.customError.message =
        err.message || "Something went wrong, please try again later!";
      this.customError.status = err.status;
    } else {
      this.customError.message =
        "Something went wrong, please try again later!";
    }
    res.status(this.customError.status || 500).json(this.customError);
  };
}

export default ErrorHandler;
