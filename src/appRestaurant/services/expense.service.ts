import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";
import {
  ICreateResExpensebody,
  IUpdateResExpenseHeadPayload,
} from "../utils/interfaces/expense.interface";

export class ExpenseResService extends AbstractServices {
  constructor() {
    super();
  }

  // create Expense Head Service
  public async createExpenseHead(req: Request) {
    return await this.db.transaction(async (trx) => {
      const { res_id } = req.rest_user;
      const { name } = req.body;

      // expense head check
      const Model = this.Model.restaurantModel();
      const { data: checkHead } = await Model.getAllExpenseHead({
        name,
        res_id,
      });

      if (checkHead.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_CONFLICT,
          message:
            "Same Expense Head already exists, give another unique Expense Head",
        };
      }

      await Model.createExpenseHead({
        res_id,
        name,
      });

      return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: "Expense Head created successfully.",
      };
    });
  }

  // Get all Expense Head list
  public async getAllExpenseHead(req: Request) {
    const { res_id } = req.rest_user;
    const { limit, skip, name } = req.query;

    const model = this.Model.restaurantModel();

    const { data, total } = await model.getAllExpenseHead({
      limit: limit as string,
      skip: skip as string,
      name: name as string,
      res_id,
    });
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total,
      data,
    };
  }

  // Update Expense Head Service
  public async updateExpenseHead(req: Request) {
    return await this.db.transaction(async (trx) => {
      const { res_id } = req.rest_user;
      const { id } = req.params;

      const updatePayload = req.body as IUpdateResExpenseHeadPayload;

      const model = this.Model.restaurantModel(trx);
      const res = await model.updateExpenseHead(parseInt(id), {
        res_id,
        name: updatePayload.name,
      });

      if (res === 1) {
        return {
          success: true,
          code: this.StatusCode.HTTP_OK,
          message: "Expense Head updated successfully",
        };
      } else {
        return {
          success: false,
          code: this.StatusCode.HTTP_NOT_FOUND,
          message: "Expense Head didn't find",
        };
      }
    });
  }

  // Delete Expense Head Service
  public async deleteExpenseHead(req: Request) {
    return await this.db.transaction(async (trx) => {
      const { id } = req.params;

      const model = this.Model.restaurantModel(trx);
      const res = await model.deleteExpenseHead(parseInt(id));

      if (res === 1) {
        return {
          success: true,
          code: this.StatusCode.HTTP_OK,
          message: "Expense Head deleted successfully",
        };
      } else {
        return {
          success: false,
          code: this.StatusCode.HTTP_NOT_FOUND,
          message: "Expense Head didn't find",
        };
      }
    });
  }

  // Create Expense Service
  public async createExpense(req: Request) {
    return await this.db.transaction(async (trx) => {
      const { res_id, id: created_by } = req.rest_user;

      const {
        expense_item,
        ac_tr_ac_id,
        expense_category,
        expense_date,
        remarks,
        name,
      } = req.body as ICreateResExpensebody;

      const Model = this.Model.restaurantModel(trx);

      // account check
      const checkAccount = await Model.getSingleAccount({
        res_id,
        id: ac_tr_ac_id,
      });

      if (!checkAccount.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_NOT_FOUND,
          message: "Account not found",
        };
      }

      const year = new Date().getFullYear();

      // get last voucher ID
      const voucherData = await Model.getAllExpenseForLastId();

      const voucherNo = voucherData.length ? voucherData[0].id + 1 : 1;

      let expenseTotal = 0;
      expense_item.forEach((item: any) => {
        expenseTotal += item.amount;
      });

      const last_balance = checkAccount[0].last_balance;

      if (last_balance < expenseTotal) {
        return {
          success: false,
          code: this.StatusCode.HTTP_BAD_REQUEST,
          message: "Insufficient balance in this account for expense",
        };
      }

      // Insert expense record
      const expenseRes = await Model.createExpense({
        name,
        remarks,
        expense_date,
        voucher_no: `EXP-${year}${voucherNo}`,
        ac_tr_ac_id,
        res_id,
        created_by,
        total: expenseTotal,
      });

      const expenseItemPayload = expense_item.map((item: any) => {
        return {
          name: item.name,
          amount: item.amount,
          expense_id: expenseRes[0],
        };
      });

      //   expense item
      await Model.createExpenseItem(expenseItemPayload);

      //   ====================== account transaction  step =================== //

      // Insert account transaction
      const transactionRes = await Model.insertAccountTransaction({
        res_id,
        ac_tr_ac_id,
        ac_tr_cash_out: expenseTotal,
      });

      // Get the last ledger balance
      const ledgerLastBalance = await Model.getAllLedgerLastBalanceByAccount({
        res_id,
        ledger_account_id: ac_tr_ac_id,
      });

      const available_balance = parseFloat(ledgerLastBalance) - expenseTotal;

      // Insert account ledger
      await Model.insertAccountLedger({
        ac_tr_id: transactionRes[0],
        ledger_debit_amount: expenseTotal,
        ledger_details: `Balance has been debited by expense, Expense id = ${expenseRes[0]}`,
        ledger_balance: available_balance,
      });

      // update account last balance
      await Model.upadateSingleAccount(
        { last_balance: available_balance },
        { res_id, id: ac_tr_ac_id }
      );

      return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: "Expense created successfully.",
      };
    });
  }

  // get all Expense service
  public async getAllExpense(req: Request) {
    const { res_id } = req.rest_user;
    const { from_date, to_date, limit, skip, key, expense_category } =
      req.query;

    const model = this.Model.restaurantModel();

    const { data, total } = await model.getAllExpense({
      expense_category: expense_category as string,
      from_date: from_date as string,
      to_date: to_date as string,
      limit: limit as string,
      skip: skip as string,
      key: key as string,
      res_id,
    });
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total,
      data,
    };
  }

  // get single expense service
  public async getSingleExpense(req: Request) {
    const { id } = req.params;
    const { res_id } = req.rest_user;

    const data = await this.Model.restaurantModel().getSingleExpense(
      parseInt(id),
      res_id
    );
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data,
    };
  }
}
export default ExpenseResService;