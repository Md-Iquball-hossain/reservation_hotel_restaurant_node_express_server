import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";
import { IupdateEmployee } from "../utlis/interfaces/employee.interface";


export class EmployeeSettingService extends AbstractServices {
  constructor() {
    super();
  }

  // create employee
  public async createEmployee(req: Request) {
    const { hotel_id, id } = req.hotel_admin;
    const body = req.body;

    const files = (req.files as Express.Multer.File[]) || [];

    if (files.length) {
      body["photo"] = files[0].filename;
    }

    const employeeModel = this.Model.employeeModel();

    const { data } = await employeeModel.getAllEmployee({
      key: body.email,
      hotel_id,
    });

    if (data.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_CONFLICT,
        message: "Employee already exist",
      };
    }

    await employeeModel.insertEmployee({
      ...req.body,
      hotel_id,
      created_by: id,
    });

    return {
      success: true,
      code: this.StatusCode.HTTP_SUCCESSFUL,
      message: this.ResMsg.HTTP_SUCCESSFUL,
    };
  }

  // get all Employee
  public async getAllEmployee(req: Request) {
    const { hotel_id } = req.hotel_admin;
    const { key, category } = req.query;

    const employeeModel = this.Model.employeeModel();

    const { data, total } = await employeeModel.getAllEmployee({
      key: key as string,
      category: category as string,
      hotel_id,
    });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total,
      data,
    };
  }

  // get Single Employee
  public async getSingleEmployee(req: Request) {
    const { id } = req.params;
    const { hotel_id } = req.hotel_admin;

    const data = await this.Model.employeeModel().getSingleEmployee(
        parseInt(id),
        hotel_id 
    );

    return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        data,
    };
}

  // update employee
  public async updateEmployee(req: Request) {
    return await this.db.transaction(async (trx) => {
    const { hotel_id } = req.hotel_admin;
    const { id } = req.params;
    const { email,...rest} = req.body as IupdateEmployee;

    const files = (req.files as Express.Multer.File[]) || [];

    if (files.length) {
      rest["photo"] = files[0].filename;
    }

    const model = this.Model.employeeModel(trx);
    const res = await model.updateEmployee(parseInt(id), {
      ...rest,
        hotel_id,
        email
    });

    if (res === 1) {
        return {
            success: true,
            code: this.StatusCode.HTTP_OK,
            message: "Employee Profile updated successfully",
        };
    } else {
        return {
            success: false,
            code: this.StatusCode.HTTP_NOT_FOUND,
            message: "Employee Profile didn't find from this ID",
        };
    }
    });
}

  // Delete employee
  public async deleteEmployee(req: Request) {
    return await this.db.transaction(async (trx) => {
    const { id } = req.params;

    const model = this.Model.employeeModel(trx);
    const res = await model.deleteEmployee(parseInt(id));

    if (res === 1) {
        return {
            success: true,
            code: this.StatusCode.HTTP_OK,
            message: "Employee Profile deleted successfully",
        };
    } else {
        return {
            success: false,
            code: this.StatusCode.HTTP_NOT_FOUND,
            message: "Employee Profile didn't find from this ID",
        };
    }
    });
}

}
export default EmployeeSettingService;
