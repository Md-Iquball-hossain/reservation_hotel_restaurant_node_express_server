import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";

class ResReportService extends AbstractServices {
  constructor() {
    super();
  }

  // Supplier ledger
  public async getSupplierLedger(req: Request) {
    const { from_date, to_date, limit, skip, supplier_id } = req.query;

    const { res_id } = req.rest_user;
    // model
    const model = this.Model.restaurantModel();

    const { totalCreditAmount, data, total } = await model.getSupplierReport({
      supplier_id: supplier_id as string,
      from_date: from_date as string,
      to_date: to_date as string,
      limit: limit as string,
      skip: skip as string,
      res_id,
    });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total,
      totalCreditAmount,
      data,
    };
  }

  // Purchase
  public async getPurchaseReport(req: Request) {
    const { from_date, to_date, limit, skip, name } = req.query;
    const { res_id } = req.rest_user;
    // model
    const model = this.Model.restaurantModel();

    const { totalAmount, data, total } = await model.getPurchaseReport({
      from_date: from_date as string,
      to_date: to_date as string,
      limit: limit as string,
      skip: skip as string,
      res_id,
    });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total,
      totalAmount,
      data,
    };
  }

  // Food Category
  public async getFoodCategoryReport(req: Request) {
    const { from_date, to_date, limit, skip, category_name , food_name} = req.query;
    const { res_id } = req.rest_user;
    // model
    const model = this.Model.restaurantModel();

    const { totalSoldQuantity, data, total } =
      await model.getFoodCategoryReport({
        category_name: category_name as string,
        food_name: food_name as string,
        from_date: from_date as string,
        to_date: to_date as string,
        limit: limit as string,
        skip: skip as string,
        res_id,
      });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total,
      totalSoldQuantity,
      data,
    };
  }

  // Sales
  public async getSalesReport(req: Request) {
    const { from_date, to_date, limit, skip, name } = req.query;
    const { res_id } = req.rest_user;
    // model
    const model = this.Model.restaurantModel();

    const { totalAmount, totalSold, data, total } = await model.getSalesReport({
      name: name as string,
      from_date: from_date as string,
      to_date: to_date as string,
      limit: limit as string,
      skip: skip as string,
      res_id,
    });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total,
      totalAmount,
      totalSold,
      data,
    };
  }

  // Expense
  public async getExpenseReport(req: Request) {
    const { from_date, to_date, limit, skip, name } = req.query;
    const { res_id } = req.rest_user;
    // model
    const model = this.Model.restaurantModel();

    const { totalAmount, data, total } = await model.getExpenseReport({
      name: name as string,
      from_date: from_date as string,
      to_date: to_date as string,
      limit: limit as string,
      skip: skip as string,
      res_id,
    });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total,
      totalAmount,
      data,
    };
  }
}
export default ResReportService;
