import { NextFunction, Request, Response } from "express";
import AbstractServices from "../../../abstarcts/abstract.service";
import config from "../../../config/config";
import { SyncCryptoService } from "../../../utils/lib/crypto";
import Lib from "../../../utils/lib/lib";
import ResMsg from "../../../utils/miscellaneous/responseMessage";
import StatusCode from "../../../utils/miscellaneous/statusCode";
import { IAdmin, IhotelUser, IrestUser } from "../../types/commontypes";

class AuthChecker extends AbstractServices {
  constructor() {
    super();
  }
  // admin auth checker
  public mAdminAuthChecker = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { authorization } = req.headers;

    if (!authorization) {
      return res
        .status(StatusCode.HTTP_UNAUTHORIZED)
        .json({ success: false, message: ResMsg.HTTP_UNAUTHORIZED });
    }

    const authSplit = authorization.split(" ");

    if (authSplit.length !== 2) {
      return res.status(StatusCode.HTTP_UNAUTHORIZED).json({
        success: false,
        message: ResMsg.HTTP_UNAUTHORIZED,
      });
    }

    const verify = Lib.verifyToken(
      authSplit[1],
      config.JWT_SECRET_M_ADMIN
    ) as IAdmin;

    if (!verify) {
      return res
        .status(StatusCode.HTTP_UNAUTHORIZED)
        .json({ success: false, message: ResMsg.HTTP_UNAUTHORIZED });
    } else {
      if (verify.type !== "admin" || verify.status === 0) {
        return res.status(StatusCode.HTTP_UNAUTHORIZED).json({
          success: false,
          message: ResMsg.HTTP_UNAUTHORIZED,
        });
      } else {
        req.admin = verify as IAdmin;
        next();
      }
    }
  };

  // hotel admin auth checker
  public hotelAdminAuthChecker = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { authorization } = req.headers;

    if (!authorization) {
      return res
        .status(StatusCode.HTTP_UNAUTHORIZED)
        .json({ success: false, message: ResMsg.HTTP_UNAUTHORIZED });
    }

    const authSplit = authorization.split(" ");

    if (authSplit.length !== 2) {
      return res.status(StatusCode.HTTP_UNAUTHORIZED).json({
        success: false,
        message: ResMsg.HTTP_UNAUTHORIZED,
      });
    }

    const verify = Lib.verifyToken(
      authSplit[1],
      config.JWT_SECRET_HOTEL_ADMIN
    ) as IAdmin;

    if (!verify) {
      return res
        .status(StatusCode.HTTP_UNAUTHORIZED)
        .json({ success: false, message: ResMsg.HTTP_UNAUTHORIZED });
    } else {
      if (verify.type !== "admin" || verify.status === 0) {
        return res.status(StatusCode.HTTP_UNAUTHORIZED).json({
          success: false,
          message: ResMsg.HTTP_UNAUTHORIZED,
        });
      } else {
        req.hotel_admin = verify as IAdmin;
        next();
      }
    }
  };

  // hotel user auth checker
  public hotelUserAuthChecker = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { authorization } = req.headers;

    if (!authorization) {
      return res
        .status(StatusCode.HTTP_UNAUTHORIZED)
        .json({ success: false, message: ResMsg.HTTP_UNAUTHORIZED });
    }

    const authSplit = authorization.split(" ");

    if (authSplit.length !== 2) {
      return res.status(StatusCode.HTTP_UNAUTHORIZED).json({
        success: false,
        message: ResMsg.HTTP_UNAUTHORIZED,
      });
    }

    const verify = Lib.verifyToken(
      authSplit[1],
      config.JWT_SECRET_H_USER
    ) as IhotelUser;

    if (!verify) {
      return res
        .status(StatusCode.HTTP_UNAUTHORIZED)
        .json({ success: false, message: ResMsg.HTTP_UNAUTHORIZED });
    } else {
      if (
        verify.type !== "hotel_user" ||
        verify.status === "blocked" ||
        verify.status === "expired"
      ) {
        return res.status(StatusCode.HTTP_UNAUTHORIZED).json({
          success: false,
          message: ResMsg.HTTP_UNAUTHORIZED,
        });
      } else {
        req.hotel_user = verify as IhotelUser;
        next();
      }
    }
  };

  // hotel user auth checker
  public hotelRestAuthChecker = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { authorization } = req.headers;

    if (!authorization) {
      return res
        .status(StatusCode.HTTP_UNAUTHORIZED)
        .json({ success: false, message: ResMsg.HTTP_UNAUTHORIZED });
    }

    const authSplit = authorization.split(" ");

    if (authSplit.length !== 2) {
      return res.status(StatusCode.HTTP_UNAUTHORIZED).json({
        success: false,
        message: ResMsg.HTTP_UNAUTHORIZED,
      });
    }

    const verify = Lib.verifyToken(
      authSplit[1],
      config.JWT_SECRET_H_RESTURANT
    ) as IrestUser;

    if (!verify) {
      return res
        .status(StatusCode.HTTP_UNAUTHORIZED)
        .json({ success: false, message: ResMsg.HTTP_UNAUTHORIZED });
    } else {
      if (verify.status === "blocked" || verify.status === "inactive") {
        return res.status(StatusCode.HTTP_UNAUTHORIZED).json({
          success: false,
          message: ResMsg.HTTP_UNAUTHORIZED,
        });
      } else {
        req.rest_user = verify as IrestUser;
        next();
      }
    }
  };

  // web token verify checker
  public webTokenVerfiyChecker = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const web_token: string = req.headers.web_token as string;

      if (!web_token) {
        return res
          .status(StatusCode.HTTP_UNAUTHORIZED)
          .json({ success: false, message: ResMsg.HTTP_UNAUTHORIZED });
      }

      const verify = new SyncCryptoService().decrypt(web_token);

      if (!verify.success) {
        return res
          .status(StatusCode.HTTP_UNAUTHORIZED)
          .json({ success: false, message: ResMsg.HTTP_UNAUTHORIZED });
      } else {
        req.web_token = { id: parseInt(verify.data as string) };
        next();
      }
    } catch (err: any) {
      res
        .status(StatusCode.HTTP_BAD_REQUEST)

        .json({
          success: false,
          message: err.reason ? err.reason : ResMsg.HTTP_UNAUTHORIZED,
        });
    }
  };
}

export default AuthChecker;
