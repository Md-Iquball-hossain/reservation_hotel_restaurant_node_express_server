import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";

class MoneyRecieptService extends AbstractServices {
  constructor() {
    super();
  }

  // create money reciept
  public async createMoneyReciept(req: Request) {
    return await this.db.transaction(async (trx) => {
      const { hotel_id, id: admin_id } = req.hotel_admin;

      const {
        ac_tr_ac_id,
        user_id,
        paid_amount,
        reciept_type,
        invoice_id,
        remarks,
      } = req.body;

      //   checking user
      const guestModel = this.Model.guestModel(trx);

      const checkUser = await guestModel.getSingleGuest({ id: user_id });
      if (!checkUser.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_NOT_FOUND,
          message: "User not found",
        };
      }
    
      let userLastBalance = 0;
    
      if (checkUser.length) {
        const { last_balance } = checkUser[0];
    
      userLastBalance = last_balance;
      }

      // const check account
      const accountModel = this.Model.accountModel(trx);

      const checkAccount = await accountModel.getSingleAccount({
        hotel_id,
        id: parseInt(ac_tr_ac_id),
      });

      if (!checkAccount.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_NOT_FOUND,
          message: "Account not found",
        };
      }

      const { ac_type } = checkAccount[0];

      const invoiceModel = this.Model.hotelInvoiceModel(trx);

      // check invoice
      if (reciept_type === "invoice") {
        const checkInvoice =
          await invoiceModel.getSpecificInvoiceForMoneyReciept({
            hotel_id,
            invoice_id,
            user_id,
          });

        if (!checkInvoice.length) {
          return {
            success: false,
            code: this.StatusCode.HTTP_NOT_FOUND,
            message: "Invoice not found with this user",
          };
        }

        const { due, grand_total } = checkInvoice[0];

        if (due == 0) {
          return {
            success: false,
            code: this.StatusCode.HTTP_BAD_REQUEST,
            message: "Already paid this invoice",
          };
        }

        if (paid_amount != due) {
          return {
            success: false,
            code: this.StatusCode.HTTP_BAD_REQUEST,
            message: "Invoice due and paid amount are not same",
          };
        }

        // ================= update invoice ================ //

        const remainingBalance = due - paid_amount;
        await invoiceModel.updateHotelInvoice(
          {
            due: remainingBalance,
          },
          { hotel_id, id: invoice_id }
        );

        //============ insert money reciept ========= //

        // get last money reciept
        const moneyRecieptData =
          await invoiceModel.getAllMoneyRecieptFoLastId();

        const moneyRecieptNo = moneyRecieptData.length
          ? moneyRecieptData[0].id + 1
          : 1;
        const year = new Date().getFullYear();

        // insert account transaction
        const transactionRes = await accountModel.insertAccountTransaction({
          ac_tr_ac_id,
          ac_tr_cash_in: paid_amount,
        });

        const moneyRecieptRes = await invoiceModel.createMoneyReciept({
          hotel_id,
          created_by: admin_id,
          user_id,
          payment_type: ac_type,
          total_collected_amount: paid_amount,
          description: `Money reciept for invoice id = ${invoice_id},Total amount ${grand_total} and Total due amount is ${remainingBalance}`,
          money_receipt_no: `${
            ac_type == "bank"
            ? `BNSMR-${year}-${moneyRecieptNo}`
            : ac_type == "cash"
            ? `CSSMR-${year}-${moneyRecieptNo}`
            : ac_type == "cheque"
            ? `CQSMR-${year}-${moneyRecieptNo}`
            : ac_type == "mobile-banking"
            ? `MBSMR-${year}-${moneyRecieptNo}`
            : ""
          }`,
          remarks,
          ac_tr_id: transactionRes[0],
        });

        //======== insert guest ledger =============//

        const guestLedgerLastBalance =
        parseFloat(userLastBalance.toString()) + parseFloat(paid_amount.toString()) ;

      await guestModel.insertGuestLedger({
        name: `${
          ac_type == "bank"
          ? `BNSMR-${year}-${moneyRecieptNo}`
          : ac_type == "cash"
          ? `CSSMR-${year}-${moneyRecieptNo}`
          : ac_type == "cheque"
          ? `CQSMR-${year}-${moneyRecieptNo}`
          : ac_type == "mobile-banking"
          ? `MBSMR-${year}-${moneyRecieptNo}`
          : ""
        }`,
        amount: paid_amount,
        pay_type: "credit",
        user_id: user_id,
        hotel_id,
        last_balance: guestLedgerLastBalance,
      });

        // money recipet item
        await invoiceModel.insertMoneyRecieptItem({
          money_reciept_id: moneyRecieptRes[0],
          invoice_id,
        });

        // ================= account transaction ================= //

        // get account ledger by id
        const ledgerLastBalance =
          await accountModel.getAllLedgerLastBalanceByAccount({
            hotel_id,
            ledger_account_id: ac_tr_ac_id,
          });

        const total_ledger_balance =
          parseFloat(ledgerLastBalance) + paid_amount;

        // insert account ledger
        await accountModel.insertAccountLedger({
          ac_tr_id: transactionRes[0],
          ledger_credit_amount: paid_amount,
          ledger_details: `Balance has been credited by Money Reciept, Money Reciept id =${moneyRecieptRes[0]}`,
          ledger_balance: total_ledger_balance,
        });

        // update account last balance
        await accountModel.upadateSingleAccount(
          { last_balance: total_ledger_balance },
          { hotel_id, id: ac_tr_ac_id }
        );

        // ============== update guest balance =============== //

        const nowTotalBalance =
          parseFloat(checkUser[0].last_balance) + paid_amount;

        await guestModel.updateSingleGuest(
          { last_balance: nowTotalBalance },
          { hotel_id, id: user_id }
        );
      } else {
        // overall payment step
        const allInvoiceByUser =
          await invoiceModel.getAllInvoiceForMoneyReciept({
            hotel_id,
            user_id,
            due_inovice: "1",
          });

        const unpaidInvoice: {
          invoice_id: number;
          grand_total: number;
          due: number;
        }[] = [];

        for (let i = 0; i < allInvoiceByUser?.length; i++) {
          if (parseFloat(allInvoiceByUser[i].due) !== 0) {
            unpaidInvoice.push({
              invoice_id: allInvoiceByUser[i].invoice_id,
              grand_total: allInvoiceByUser[i].grand_total,
              due: allInvoiceByUser[i].due,
            });
          }
        }

        if (!unpaidInvoice.length) {
          return {
            success: false,
            code: this.StatusCode.HTTP_NOT_FOUND,
            message: "No due invoice found",
          };
        }

        // total due amount
        let remainingPaidAmount = paid_amount;

        const paidingInvoice: {
          invoice_id: number;
          due: number;
        }[] = [];

        console.log({ unpaidInvoice });
        for (let i = 0; i < unpaidInvoice.length; i++) {
          if (remainingPaidAmount > 0) {
            if (paid_amount >= unpaidInvoice[i].due) {
              remainingPaidAmount = paid_amount - unpaidInvoice[i].due;

              paidingInvoice.push({
                invoice_id: unpaidInvoice[i].invoice_id,
                due: unpaidInvoice[i].due - unpaidInvoice[i].due,
              });
            } else {
              remainingPaidAmount = paid_amount - unpaidInvoice[i].due;
              paidingInvoice.push({
                invoice_id: unpaidInvoice[i].invoice_id,
                due: unpaidInvoice[i].due - paid_amount,
              });
            }
          }
        }

        // =============== update invoice ==============//
        Promise.all(
          paidingInvoice.map(async (item) => {
            await invoiceModel.updateHotelInvoice(
              { due: item.due },
              { hotel_id, id: item.invoice_id }
            );
          })
        );

        //============ insert money reciept ========= //

        // get last money reciept
        const moneyRecieptData =
          await invoiceModel.getAllMoneyRecieptFoLastId();

        const moneyRecieptNo = moneyRecieptData.length
          ? moneyRecieptData[0].id + 1
          : 1;
        const year = new Date().getFullYear();

        const moneyRecieptRes = await invoiceModel.createMoneyReciept({
          hotel_id,
          created_by: admin_id,
          user_id,
          payment_type: ac_type,
          total_collected_amount: paid_amount,
          description: `Money reciept for overall payment,Total payment amount ${paid_amount}`,
          money_receipt_no: `${
            ac_type == "bank"
            ? `BNOMR-${year}-${moneyRecieptNo}`
            : ac_type == "cash"
            ? `CSOMR-${year}-${moneyRecieptNo}`
            : ac_type == "cheque"
            ? `CQOMR-${year}-${moneyRecieptNo}`
            : ac_type == "mobile-banking"
            ? `MBOMR-${year}-${moneyRecieptNo}`
            : ""
          }`,
          remarks,
        });

        //======== insert guest ledger =============//

        const guestLedgerLastBalance =
        parseFloat(userLastBalance.toString()) + parseFloat(paid_amount.toString()) ;

      await guestModel.insertGuestLedger({
        name: `${
          ac_type == "bank"
          ? `BNOMR-${year}-${moneyRecieptNo}`
          : ac_type == "cash"
          ? `CSOMR-${year}-${moneyRecieptNo}`
          : ac_type == "cheque"
          ? `CQOMR-${year}-${moneyRecieptNo}`
          : ac_type == "mobile-banking"
          ? `MBOMR-${year}-${moneyRecieptNo}`
          : ""
        }`,
        amount: paid_amount,
        pay_type: "credit",
        user_id: user_id,
        hotel_id,
        last_balance: guestLedgerLastBalance,
      });

        // money recipet item
        Promise.all(
          paidingInvoice.map(async (item) => {
            await invoiceModel.insertMoneyRecieptItem({
              money_reciept_id: moneyRecieptRes[0],
              invoice_id: item.invoice_id,
            });
          })
        );

        // ================= account transaction ================= //

        // insert account transaction
        const transactionRes = await accountModel.insertAccountTransaction({
          ac_tr_ac_id,
          ac_tr_cash_in: paid_amount,
        });

        // get account ledger by id
        const ledgerLastBalance =
          await accountModel.getAllLedgerLastBalanceByAccount({
            hotel_id,
            ledger_account_id: ac_tr_ac_id,
          });

        const total_ledger_balance =
          parseFloat(ledgerLastBalance) + paid_amount;

        // insert account ledger
        await accountModel.insertAccountLedger({
          ac_tr_id: transactionRes[0],
          ledger_credit_amount: paid_amount,
          ledger_details: `Balance has been credited by overall Money Reciept, Money Reciept id =${moneyRecieptRes[0]}`,
          ledger_balance: total_ledger_balance,
        });

        // update account last balance
        await accountModel.upadateSingleAccount(
          { last_balance: total_ledger_balance },
          { hotel_id, id: ac_tr_ac_id }
        );

        // ============== update guest balance =============== //

        const nowTotalBalance =
          parseFloat(checkUser[0].last_balance) + paid_amount;

        await guestModel.updateSingleGuest(
          { last_balance: nowTotalBalance },
          { hotel_id, id: user_id }
        );
      }

      return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: this.ResMsg.HTTP_SUCCESSFUL,
      };
    });
  }

  // get all money reciept
  public async getAllMoneyReciept(req: Request) {
    const { hotel_id } = req.hotel_admin;

    const { from_date, to_date, key, limit, skip } = req.query;

    const { data, total } =
      await this.Model.hotelInvoiceModel().getAllMoneyReciept({
        hotel_id,
        from_date: from_date as string,
        to_date: to_date as string,
        key: key as string,
        limit: limit as string,
        skip: skip as string,
      });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total,
      data,
    };
  }

  // get all money reciept
  public async getSingleMoneyReciept(req: Request) {
    const { hotel_id } = req.hotel_admin;

    const data = await this.Model.hotelInvoiceModel().getSingleMoneyReciept({
      hotel_id,
      id: parseInt(req.params.id),
    });

    if (!data.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data: data[0],
    };
  }

  // advance return money reciept
  public async advanceReturnMoneyReciept(req: Request) {
    return await this.db.transaction(async (trx) => {
      const { hotel_id, id: admin_id } = req.hotel_admin;
      const { ac_tr_ac_id, user_id, return_amount, return_date, remarks } =
        req.body;

      //   checking user
      const guestModel = this.Model.guestModel(trx);

      const checkUser = await guestModel.getSingleGuest({ id: user_id });
      if (!checkUser.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_NOT_FOUND,
          message: "User not found",
        };
      }

      // const check account
      const accountModel = this.Model.accountModel(trx);

      const checkAccount = await accountModel.getSingleAccount({
        hotel_id,
        id: parseInt(ac_tr_ac_id),
      });

      if (!checkAccount.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_NOT_FOUND,
          message: "Account not found",
        };
      }

      const { ac_type } = checkAccount[0];

      const { last_balance } = checkUser[0];

      if (return_amount > last_balance) {
        return {
          success: false,
          code: this.StatusCode.HTTP_BAD_REQUEST,
          message: "Return amount is more than users payable amount",
        };
      }

      //============ insert money reciept ========= //
      const invoiceModel = this.Model.hotelInvoiceModel(trx);

      // get last money reciept
      const moneyRecieptData = await invoiceModel.getAllMoneyRecieptFoLastId();

      const moneyRecieptNo = moneyRecieptData.length
        ? moneyRecieptData[0].id + 1
        : 1;
      const year = new Date().getFullYear();

      const moneyRecieptRes = await invoiceModel.createMoneyReciept({
        hotel_id,
        created_by: admin_id,
        user_id,
        payment_type: ac_type,
        total_collected_amount: return_amount,
        description: `Money reciept for advance return,Total return amount ${return_amount}`,
        money_receipt_no: `${
          ac_type == "bank"
          ? `BNAMR-${year}-${moneyRecieptNo}`
          : ac_type == "cash"
          ? `CSAMR-${year}-${moneyRecieptNo}`
          : ac_type == "cheque"
          ? `CHAMR-${year}-${moneyRecieptNo}`
          : ac_type == "mobile-banking"
          ? `MBAMR-${year}-${moneyRecieptNo}`
          : ""
        }`,
        remarks,
      });

      // insert in advance return
      await invoiceModel.insertAdvanceReturn({
        hotel_id,
        remarks,
        money_reciept_id: moneyRecieptRes[0],
        return_date,
      });

      // ================= account transaction ================= //

      // insert account transaction
      const transactionRes = await accountModel.insertAccountTransaction({
        ac_tr_ac_id,
        ac_tr_cash_out: return_amount,
      });

      // get account ledger by id
      const ledgerLastBalance =
        await accountModel.getAllLedgerLastBalanceByAccount({
          hotel_id,
          ledger_account_id: ac_tr_ac_id,
        });

      const total_ledger_balance =
        parseFloat(ledgerLastBalance) - return_amount;

      // insert account ledger
      await accountModel.insertAccountLedger({
        ac_tr_id: transactionRes[0],
        ledger_debit_amount: return_amount,
        ledger_details: `Balance has been debited by Money Reciept, Money Reciept id =${moneyRecieptRes[0]}`,
        ledger_balance: total_ledger_balance,
      });

      // update account last balance
      accountModel.upadateSingleAccount(
        { last_balance: total_ledger_balance },
        { hotel_id, id: ac_tr_ac_id }
      );

      // ============== update guest balance =============== //

      const nowTotalBalance =
        parseFloat(checkUser[0].last_balance) - return_amount;

      await guestModel.updateSingleGuest(
        { last_balance: nowTotalBalance },
        { hotel_id, id: user_id }
      );

      return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: "Advance money reciept created",
      };
    });
  }
  // get alladvance return money reciept
  public async getAllAdvanceReturnMoneyReciept(req: Request) {
    const { hotel_id } = req.hotel_admin;

    const { from_date, to_date, key, limit, skip } = req.query;
    const { data, total } =
      await this.Model.hotelInvoiceModel().getAllAdvanceMoneyReciept({
        hotel_id,
        from_date: from_date as string,
        to_date: to_date as string,
        key: key as string,
        limit: limit as string,
        skip: skip as string,
      });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total,
      data,
    };
  }

  // get single advance return money reciept
  public async getSingleAdvanceReturnMoneyReciept(req: Request) {
    const { hotel_id } = req.hotel_admin;

    const data =
      await this.Model.hotelInvoiceModel().getSingleAdvanceMoneyReciept(
        hotel_id,
        parseInt(req.params.id)
      );

    if (!data.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data: data[0],
    };
  }
}

export default MoneyRecieptService;
