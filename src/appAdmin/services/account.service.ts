import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";
import { IupdateAccount } from "../utlis/interfaces/account.interface";
import { check } from "express-validator";

export class AccountService extends AbstractServices {
  constructor() {
    super();
  }

  // create Account
  public async createAccount(req: Request) {
    return await this.db.transaction(async (trx) => {
      const { hotel_id, id } = req.hotel_admin;

      const { opening_balance, ...rest } = req.body;

      // model
      const model = this.Model.accountModel(trx);

      // insert account
      const res = await model.createAccount({
        ...rest,
        last_balance: opening_balance,
        hotel_id,
        created_by: id,
      });

      // insert in account transaction
      const transactionRes = await model.insertAccountTransaction({
        ac_tr_ac_id: res[0],
        ac_tr_cash_in: opening_balance,
      });

      // insert in account ledger
      await model.insertAccountLedger({
        ac_tr_id: transactionRes[0],
        ledger_credit_amount: opening_balance,
        ledger_balance: opening_balance,
        ledger_details: `Opening balance has been credited for ${rest.name} account`,
      });

      return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: "Account created successfully.",
      };
    });
  }

  // get all accounts
  public async getAllAccount(req: Request) {
    const { hotel_id } = req.hotel_admin;

    const { ac_type, key, status, limit, skip, admin_id } = req.query;

    // model
    const model = this.Model.accountModel();

    // fetch all accounts for the given hotel_id
    const { data, total } = await model.getAllAccounts({
      hotel_id,
      status: status as string,
      ac_type: ac_type as string,
      key: key as string,
      limit: limit as string,
      skip: skip as string,
      admin_id: parseInt(admin_id as string),
    });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total,
      data,
    };
  }

  // update account
  public async updateAccount(req: Request) {
    const { hotel_id } = req.hotel_admin;
    const id = parseInt(req.params.id);

    const { last_balance, ...rest } = req.body;

    const model = this.Model.accountModel();

    const account = await model.upadateSingleAccount(
      {
        ...rest,
        hotel_id,
        last_balance,
      },
      { hotel_id, id }
    );
    return {
      success: true,
      code: this.StatusCode.HTTP_SUCCESSFUL,
      message: "Account updated successfully.",
    };
  }

  // balance transfer
  public async balanceTransfer(req: Request) {
    const { id, hotel_id } = req.hotel_admin;

    const { from_account, to_account, transfer_type, pay_amount } = req.body;

    // check account

    // model
    const model = this.Model.accountModel();

    // check from account
    const checkFromAcc = await model.getSingleAccount({
      hotel_id,
      id: from_account,
    });

    if (!checkFromAcc.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: "From account not found",
      };
    }

    // check to account
    const checkToAcc = await model.getSingleAccount({
      hotel_id,
      id: to_account,
    });

    if (!checkToAcc.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: "To account not found",
      };
    }

    const { last_balance: from_acc_last_balance } = checkFromAcc[0];
    const { last_balance: to_acc_last_balance } = checkToAcc[0];

    if (pay_amount > from_acc_last_balance) {
      return {
        success: false,
        code: this.StatusCode.HTTP_BAD_REQUEST,
        message: "Pay amount is more than accounts balance",
      };
    }

    //=========== from account step ==========//

    // now insert account transaction
    const transactionRes = await model.insertAccountTransaction({
      ac_tr_ac_id: from_account,
      ac_tr_cash_out: pay_amount,
    });

    const accLedgerLastBalance = await model.getAllLedgerLastBalanceByAccount({
      hotel_id,
      ledger_account_id: from_account,
    });

    const nowLedgerBalance = parseFloat(accLedgerLastBalance) - pay_amount;

    // now inset in account ledger
    await model.insertAccountLedger({
      ac_tr_id: transactionRes[0],
      ledger_debit_amount: pay_amount,
      ledger_balance: nowLedgerBalance,
      ledger_details: `Balance transfer to ${to_account}, total pay amount is = ${pay_amount}`,
    });

    // account update
    const nowFrmAccBlnc = parseFloat(from_acc_last_balance) - pay_amount;
    await model.upadateSingleAccount(
      {
        last_balance: nowFrmAccBlnc,
      },
      { id: from_account, hotel_id }
    );

    //=========== to account step ==========//

    // now insert account transaction
    const toAcctransactionRes = await model.insertAccountTransaction({
      ac_tr_ac_id: to_account,
      ac_tr_cash_in: pay_amount,
    });

    const toAccLedgerLastBalance = await model.getAllLedgerLastBalanceByAccount(
      {
        hotel_id,
        ledger_account_id: to_account,
      }
    );

    console.log({ toAccLedgerLastBalance });
    const nowToAccLedgerBalance =
      parseFloat(toAccLedgerLastBalance) + pay_amount;

    console.log({ nowToAccLedgerBalance });

    // now insert in account ledger
    await model.insertAccountLedger({
      ac_tr_id: toAcctransactionRes[0],
      ledger_credit_amount: pay_amount,
      ledger_balance: nowToAccLedgerBalance,
      ledger_details: `Balance transfered from ${from_account}, total paid amount is = ${pay_amount}`,
    });

    console.log({ to_acc_last_balance });
    // account update
    const nowToAccBlnc = parseFloat(to_acc_last_balance) + pay_amount;
    console.log({ nowToAccBlnc });
    await model.upadateSingleAccount(
      {
        last_balance: nowToAccBlnc,
      },
      { id: to_account, hotel_id }
    );

    return {
      success: true,
      code: this.StatusCode.HTTP_SUCCESSFUL,
      message: "Balance transfered",
    };
  }
}
export default AccountService;
