import { Request} from "express";
import AbstractServices from "../../abstarcts/abstract.service";
import { IHallBookingBody, IbookingHalls } from "../utlis/interfaces/hallBooking.interface";
import { IgetAllHall } from "../utlis/interfaces/hall.interface";

class HallBookingService extends AbstractServices {
  constructor() {
    super();
  }

  // create hall booking
  public async createHallBooking(req: Request) {
  return await this.db.transaction(async (trx) => {
  const { hotel_id, id } = req.hotel_admin;

  const {
    name,
    email,
    booking_halls,
    start_time,
    end_time,
    check_in,
    booking_date,
    event_date,
    discount_amount,
    tax_amount,
    total_occupancy,
    paid_amount,
    payment_type,
    ac_tr_ac_id,
    extra_charge,
  } = req.body as IHallBookingBody;

  // number of hours
  const startTime: any = new Date(`2000-01-01 ${start_time}`);
  const endTime: any = new Date(`2000-01-01 ${end_time}`);

  const timeDifference = endTime - startTime;

  const millisecondsInHour = 60 * 60 * 1000;

  let numberOfHours = Math.round(timeDifference / millisecondsInHour);

  if (!numberOfHours) numberOfHours = 1;

  const hallBookingModel = this.Model.hallBookingModel(trx);

  // number of hours end
  const guestModel = this.Model.guestModel(trx);

  const checkUser = await guestModel.getSingleGuest({
    email,
    hotel_id,
  });
  
    let userRes: any;
  
    let userLastBalance = 0;
  
    if (checkUser.length) {
      const { last_balance } = checkUser[0];
  
    userLastBalance = last_balance;
    }
  

  if (!checkUser.length) {
    // create user
    userRes = await guestModel.createGuest({
      name,
      email,
      hotel_id,
    });
  }

  const userID = checkUser.length
    ? checkUser[0].id
    : (userRes[0] as number);

  if (!checkUser.length || checkUser[0].user_type !== "hall-guest") {
    const existingUserType = await guestModel.getExistsUserType(userID, "hall-guest");

  if (!existingUserType) {
    await guestModel.createUserType({
      user_id: userID,
      user_type: "hall-guest"
    });
  }
  }

  // ========== step for amount ============ //

  const hallModel = this.Model.hallModel(trx);
  // hall model
  const bookingHallsList: number[] = booking_halls.map(
    (item) => item.hall_id
  );

  // get all hall by halls
  const { data: allBookingHall }: { data: IgetAllHall[]; total: any } =
    await hallModel.getAllHall({
      hotel_id,
      halls: bookingHallsList,
    });

  // Check if all halls are available

  if (!allBookingHall.length) {
    return {
      success: false,
      code: this.StatusCode.HTTP_NOT_FOUND,
      message: "Hall is not found with this hotel",
    };
  }

  // check if unavaiable hall or not
  const checkUnavailableHall = allBookingHall.filter(
    (item) => !item.hall_status
  );

  if (checkUnavailableHall.length) {
    return {
      success: false,
      code: this.StatusCode.HTTP_BAD_REQUEST,
      message: `This Hall is unavailable`,
    };
  }

  const tempAllBookingHall: {
    hall_id: number;
    hall_name?: string;
    rate_per_hour: number;
    hall_status: string;
  }[] = [];

  for (let i = 0; i < allBookingHall.length; i++) {
    let found = false;

  for (let j = 0; j < booking_halls.length; j++) {
    if (allBookingHall[i].id === booking_halls[j].hall_id) {
      found = true;
      tempAllBookingHall.push({
        hall_id: allBookingHall[i].id,
        hall_name: allBookingHall[i].name,
        rate_per_hour: allBookingHall[i].rate_per_hour,
        hall_status: allBookingHall[i].hall_status,
      });
    }
  }

  if (!found) {
    tempAllBookingHall.push({
      hall_id: allBookingHall[i].id,
      hall_name: allBookingHall[i].name,
      rate_per_hour: allBookingHall[i].rate_per_hour,
      hall_status: allBookingHall[i].hall_status,
    });
  }
  }

  let totalSubAmount = 0;

  if (tempAllBookingHall.length) {
    totalSubAmount = tempAllBookingHall.reduce((acc, hall) => {
      const ratePerNight = (hall.rate_per_hour || 0) * numberOfHours;
      return acc + ratePerNight;
    }, 0);
  }

  const grandTotal =
    totalSubAmount + (extra_charge || 0) + tax_amount - discount_amount;

  // =============== step end amount =====================

  // get last booking id
  const checkLastBookingId = await hallBookingModel.getLastHallBookingId(
    hotel_id
  );

  const lastBookingId = checkLastBookingId.length
    ? checkLastBookingId[0].id + 1
    : 1;

  const booking_no = `HB-${new Date().getFullYear()}${lastBookingId}`;

  // insert hall booking
  const hbRes = await hallBookingModel.insertHallBooking({
    hotel_id,
    user_id: userID,
    grand_total: grandTotal,
    number_of_hours: numberOfHours,
    booking_no,
    start_time,
    end_time,
    event_date,
    extra_charge,
    booking_status: "confirmed",
    total_occupancy,
    booking_date,
    created_by: id,
  });

  // insert booking halls
  const BookingHallPayload = booking_halls.map((item) => {
    return {
      booking_id: hbRes[0],
      hall_id: item.hall_id,
    };
  });

  await hallBookingModel.insertBookingHall(BookingHallPayload);

  if (paid_amount > 0) {
    await hallBookingModel.updateHallBooking(
      { pay_status: 1, reserved_hall: 1 },
      { id: hbRes[0] }
    );
  }

  // Hall Check in

  const bookingModel = this.Model.hallBookingModel(trx);

  if (parseInt(check_in) === 1) {
    await bookingModel.insertHallBookingCheckIn({
      booking_id: hbRes[0],
      check_in: start_time,
      event_date: event_date,
      created_by: id,
    });
  }

  if (paid_amount == 0) {
    const lastGuestBalance = checkUser[0]?.last_balance
      ? checkUser[0].last_balance
      : 0;

  //======== insert guest ledger =============//
  const guestLedgerLastBalance =
  parseFloat(lastGuestBalance.toString()) -
  parseFloat(grandTotal.toString());

await guestModel.insertGuestLedger({
  name: booking_no,
  amount: grandTotal,
  pay_type: "debit",
  user_id: userID,
  hotel_id,
  last_balance: guestLedgerLastBalance,
});

const nowTotalBalance = lastGuestBalance - grandTotal;

// update single guest
await guestModel.updateSingleGuest(
  { last_balance: nowTotalBalance },
  { hotel_id, id: userID }
);

const hallBookingModel = this.Model.hallBookingModel(trx);

await hallBookingModel.updateHallBooking(
  { pay_status: 1, reserved_hall: 1 },
  { id: hbRes[0] }
);
}

  //=================== step for invoice ======================//

  let advanceAmount = 0;

  let due_amount = 0;

  if (grandTotal < paid_amount) {
    advanceAmount = paid_amount - grandTotal;
  } else {
    due_amount = grandTotal - paid_amount;
  }

  // insert in invoice
  const hallBokingInvoiceModel = this.Model.hallBookingInvoiceModel(trx);

  // insert in invoice
  const invoiceModel = this.Model.hotelInvoiceModel(trx);

  // get last invoice
  const invoiceData = await invoiceModel.getAllInvoiceForLastId();

  const year = new Date().getFullYear();
  const InvoiceNo = invoiceData.length ? invoiceData[0].id + 1 : 1;

  // insert invoice
  const invoiceRes = await invoiceModel.insertHotelInvoice({
    invoice_no: `HBPNL-${year}${InvoiceNo}`,
    description: `For Hall booking, booking id =${hbRes[0]}, ${
      due_amount
        ? `due amount is =${due_amount}`
        : `fully paid amount is = ${grandTotal}`
    }`,
    created_by: id,
    discount_amount: discount_amount,
    grand_total: grandTotal,
    tax_amount: tax_amount,
    sub_total: totalSubAmount,
    due: due_amount,
    hotel_id,
    type: "front_desk",
    user_id: userID,
  });

  // insert sub invoice
  const subInvoiceRes =
    await hallBokingInvoiceModel.insertHallBookingSubInvoice({
      inv_id: invoiceRes[0],
      hall_booking_id: hbRes[0],
    });

  // insert sub invoice item
  const invoiceItem = tempAllBookingHall.map((item) => {
    return {
      sub_inv_id: subInvoiceRes[0],
      hall_id: item.hall_id, 
      name: item.hall_name as string,
      total_price: item.rate_per_hour,
    };
  });

await hallBokingInvoiceModel.insertHallBookingSubInvoiceItem(invoiceItem);

  //=============== Money reciept step ============== //

    // get last money reciept
    const moneyRecieptData = await invoiceModel.getAllMoneyRecieptFoLastId();

    const moneyRecieptNo = moneyRecieptData.length
      ? moneyRecieptData[0].id + 1
      : 1;

    if (paid_amount > 0) {
      const moneyRecieptRes = await invoiceModel.createMoneyReciept({
    hotel_id,
    created_by: id,
    user_id: userID,
    payment_type,
    total_collected_amount: paid_amount,
    description: `Money reciept for invoice id = ${invoiceRes[0]},Total amount ${grandTotal} and Total due amount is ${due_amount}`,
    money_receipt_no: `${
      payment_type == "bank"
      ? `HLBBN-${year}-${moneyRecieptNo}`
      : payment_type == "cash"
      ? `HLBCS-${year}-${moneyRecieptNo}`
      : payment_type == "cheque"
      ? `HLBCQ-${year}-${moneyRecieptNo}`
      : payment_type == "mobile-banking"
      ? `HLBMB-${year}-${moneyRecieptNo}`
      : ""
    }`,
    remarks: "For Hall booking",
  });

    // insert money reciept item start
    await invoiceModel.insertMoneyRecieptItem({
      invoice_id: invoiceRes[0],
      money_reciept_id: moneyRecieptRes[0],
    });
  }

  // =================== accounting part ============== //

  const accountModel = this.Model.accountModel(trx);

  // full payment payment
  if (paid_amount === grandTotal) {
    // partial payment part
    if (!ac_tr_ac_id) {
      return {
        success: false,
        code: this.StatusCode.HTTP_BAD_REQUEST,
        message: "You have to give account transaction id",
      };
    }

  // check account
  const checkAccount = await accountModel.getSingleAccount({
    hotel_id,
    id: ac_tr_ac_id,
    type: payment_type,
  });

  if (!checkAccount.length) {
    return {
      success: false,
      code: this.StatusCode.HTTP_NOT_FOUND,
      message: "Account not found with this id and type",
    };
  }

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
    ledger_details: `Balance has been credited by room booking, Room booking id =${hbRes[0]}`,
    ledger_balance: total_ledger_balance,
  });

  // update account last balance
  await accountModel.upadateSingleAccount(
    { last_balance: total_ledger_balance },
    { hotel_id, id: ac_tr_ac_id }
  );


  //======== insert guest ledger =============//

  const guestLedgerLastBalance =
    parseFloat(userLastBalance.toString()) - 
    parseFloat(grandTotal.toString()) + 
    parseFloat(paid_amount.toString()) ;

  await guestModel.insertGuestLedger({
    name: `${
      payment_type == "bank"
      ? `HLBBN-${year}-${moneyRecieptNo}`
      : payment_type == "cash"
      ? `HLBCS-${year}-${moneyRecieptNo}`
      : payment_type == "cheque"
      ? `HLBCQ-${year}-${moneyRecieptNo}`
      : payment_type == "mobile-banking"
      ? `HLBMB-${year}-${moneyRecieptNo}`
      : ""
    }`,
    amount: paid_amount,
    pay_type: "credit",
    user_id: userID,
    hotel_id,
    last_balance: guestLedgerLastBalance,
  });

} else if (paid_amount > 0) {
  // partial payment part
  if (!ac_tr_ac_id) {
    return {
      success: false,
      code: this.StatusCode.HTTP_BAD_REQUEST,
      message: "You have to give account transaction id",
    };
  }

  // check account
  const checkAccount = await accountModel.getSingleAccount({
    hotel_id,
    id: ac_tr_ac_id,
    type: payment_type,
  });

  if (!checkAccount.length) {
    return {
      success: false,
      code: this.StatusCode.HTTP_NOT_FOUND,
      message: "Account not found with this id and type",
    };
  }

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
    ledger_details: `Balance has been credited by room booking with partial payment, Room booking id =${hbRes[0]}`,
    ledger_balance: total_ledger_balance,
  });

  // update account last balance
  await accountModel.upadateSingleAccount(
    { last_balance: total_ledger_balance },
    { hotel_id, id: ac_tr_ac_id }
  );

  //======== insert guest ledger =============//

  const guestLedgerBalance =
  parseFloat(userLastBalance.toString()) -
  parseFloat(grandTotal.toString())

  await guestModel.insertGuestLedger({
    name: `${
      payment_type == "bank"
      ? `HLBBN-${year}-${moneyRecieptNo}`
      : payment_type == "cash"
      ? `HLBCS-${year}-${moneyRecieptNo}`
      : payment_type == "cheque"
      ? `HLBCQ-${year}-${moneyRecieptNo}`
      : payment_type == "mobile-banking"
      ? `HLBMB-${year}-${moneyRecieptNo}`
      : ""
    }`,
    amount: paid_amount,
    pay_type: "debit",
    user_id: userID,
    hotel_id,
    last_balance: guestLedgerBalance,
  });

  //====== guest balance update ======//
  const lastGuestBalance = checkUser[0]?.last_balance
  ? checkUser[0].last_balance
  : 0;

  if (due_amount) {
    const nowTotalBalance = lastGuestBalance - due_amount;

    await guestModel.updateSingleGuest(
      { last_balance: nowTotalBalance },
      { hotel_id, id: userID }
    );

    const guestLedgerLastBalance =
    parseFloat(userLastBalance.toString()) -
    parseFloat(grandTotal.toString()) +
    parseFloat(paid_amount.toString());

    // insert guest ledger for due amount
    await guestModel.insertGuestLedger({
      name: `${
        payment_type == "bank"
        ? `HLBBN-${year}-${moneyRecieptNo}`
        : payment_type == "cash"
        ? `HLBCS-${year}-${moneyRecieptNo}`
        : payment_type == "cheque"
        ? `HLBCQ-${year}-${moneyRecieptNo}`
        : payment_type == "mobile-banking"
        ? `HLBMB-${year}-${moneyRecieptNo}`
        : ""
      }`,
      amount: paid_amount,
      pay_type: "credit",
      user_id: userID,
      hotel_id,
      last_balance: guestLedgerLastBalance,
    });

    await guestModel.insertGuestLedger({
      name: `${
        payment_type == "bank"
        ? `HLBBN-${year}-${moneyRecieptNo}`
        : payment_type == "cash"
        ? `HLBCS-${year}-${moneyRecieptNo}`
        : payment_type == "cheque"
        ? `HLBCQ-${year}-${moneyRecieptNo}`
        : payment_type == "mobile-banking"
        ? `HLBMB-${year}-${moneyRecieptNo}`
        : ""
      }`,
      amount: due_amount,
      pay_type: "debit",
      user_id: userID,
      hotel_id,
      last_balance: guestLedgerLastBalance,
    });
  }
  }

// =========== advance amount =========== //

if (advanceAmount) {
  const guestLedgerLastBalance =
    parseFloat(userLastBalance.toString()) +
    parseFloat(advanceAmount.toString());

  const lastGuestBalance = checkUser[0]?.last_balance
    ? checkUser[0].last_balance
    : 0;

  const nowTotalBalance = lastGuestBalance + advanceAmount;

  // insert guest ledger for due amount
  await guestModel.insertGuestLedger({
    name: booking_no,
    amount: due_amount,
    pay_type: "debit",
    user_id: userID,
    hotel_id,
    last_balance: guestLedgerLastBalance,
  });

  // update single guest
  await guestModel.updateSingleGuest(
    { last_balance: nowTotalBalance },
    { hotel_id, id: userID }
  );
  }

  return {
    success: true,
    code: this.StatusCode.HTTP_OK,
    message: "Hall booked succesfully",
  };
  });
  }

  // get all hall booking
  public async getAllHallBooking(req: Request) {
  const { hotel_id } = req.hotel_admin;
  const { limit, skip, key, booking_status, from_date, to_date, event_date, user_id } = req.query;

  const model = this.Model.hallBookingModel();

  const { data, total } = await model.getAllHallBooking({
    limit: limit as string,
    skip: skip as string,
    key: key as string,
    from_date: from_date as string,
    to_date: to_date as string,
    hotel_id,
    event_date: event_date as string,
    booking_status: booking_status as string,
    user_id: user_id as string,
  });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total,
      data,
    };
  }

  // get single hall booking
  public async getSingleHallBooking(req: Request) {
    const { id } = req.params;
    const { hotel_id } = req.hotel_admin;

  const data = await this.Model.hallBookingModel().getSingleHallBooking(
    parseInt(id),
    hotel_id
  );

  if (!data.length) {
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data: data,
    };
  }

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data: data[0],
    };
  }

  // insert check in hall booking
  public async insertHallBookingCheckIn(req: Request) {
    return await this.db.transaction(async (trx) => {
      const { hotel_id, id } = req.hotel_admin;
      const { booking_id, check_in, event_date } = req.body;

  const bookingModel = this.Model.hallBookingModel(trx);

  const checkBooking = await bookingModel.getSingleHallBooking(
    booking_id,
    hotel_id
  );

  if (!checkBooking.length) {
    return {
      success: false,
      code: this.StatusCode.HTTP_NOT_FOUND,
      message: "Booking not found",
    };
  }

  // check already checked in or not with this booking id
  const { data: checkBookingCheckedIn } =
    await bookingModel.getAllHallBookingCheckIn({ booking_id, hotel_id });

  if (checkBookingCheckedIn.length) {
    return {
      success: false,
      code: this.StatusCode.HTTP_CONFLICT,
      message: "Already checked in by this booking ID",
    };
  }

  const {check_out_time , pay_status, grand_total, user_id, booking_no } = checkBooking[0];

  // hall booking check in time
  const hb_last_check_in_time = new Date(check_out_time);
  const after_hb_check_in_time = new Date(check_in);

  if (after_hb_check_in_time > hb_last_check_in_time) {
    return {
      success: false,
      code: this.StatusCode.HTTP_BAD_REQUEST,
      message:
        "Hall booking check in time expired, so you can not check in for this booking",
    };
  }

  if (!pay_status) {
    const guestModel = this.Model.guestModel(trx);

    const checkUser = await guestModel.getSingleGuest({
      id: user_id,
      hotel_id,
    });
    const lastGuestBalance = checkUser[0]?.last_balance
      ? checkUser[0].last_balance
      : 0;

    //======== insert guest ledger =============//
    const guestLedgerLastBalance =
      parseFloat(lastGuestBalance.toString()) -
      parseFloat(grand_total.toString());

    await guestModel.insertGuestLedger({
      name: booking_no,
      amount: grand_total,
      pay_type: "debit",
      user_id,
      hotel_id,
      last_balance: guestLedgerLastBalance,
    });

    const nowTotalBalance = lastGuestBalance - grand_total;

    // update single guest
    await guestModel.updateSingleGuest(
      { last_balance: nowTotalBalance },
      { hotel_id, id: user_id }
    );

    const hallBookingModel = this.Model.hallBookingModel(trx);

    await hallBookingModel.updateHallBooking(
      { pay_status: 1, reserved_hall: 1 },
      { id: booking_id }
    );
  }

  // insert hall booking check in
  await bookingModel.insertHallBookingCheckIn({
      booking_id,
      check_in,
      event_date,
      created_by: id,
  });

  return {
    success: true,
    code: this.StatusCode.HTTP_SUCCESSFUL,
    message: "Hall Booking checked in",
  };
});
  }

  // get all Hall booking check in
  public async getAllHallBookingCheckIn(req: Request) {
  const { hotel_id } = req.hotel_admin;
  const { limit, skip, key, from_date, to_date } = req.query;

  const model = this.Model.hallBookingModel();

  const { data, total } = await model.getAllHallBookingCheckIn({
    limit: limit as string,
    skip: skip as string,
    hotel_id,
    key: key as string,
    from_date: from_date as string,
    to_date: to_date as string,
  });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total,
      data,
    };
  }

  // add check out hall booking
  public async updateBookingCheckOut(req: Request) {
  return await this.db.transaction(async (trx) => {
  const { hotel_id } = req.hotel_admin;
  const { check_out } = req.body;

  const bookingModel = this.Model.hallBookingModel(trx);

  const checkBooking = await bookingModel.getSingleHallBookingCheckIn(
  parseInt(req.params.id),
  hotel_id
  );
  if (!checkBooking.length) {
    return {
      success: false,
      code: this.StatusCode.HTTP_NOT_FOUND,
      message: "Booking not found",
    };
  }

  const { user_id, booking_id, status } = checkBooking[0];

  if (status === "checked-out") {
    return {
      success: false,
      code: this.StatusCode.HTTP_CONFLICT,
      message: "Already checked out",
    };
  }

  const invoiceModel = this.Model.hotelInvoiceModel(trx);
  // get all invoice by user
  const { data: checkUpaidInvoice } = await invoiceModel.getAllInvoice({
    user_id,
    due_inovice: "1",
    hotel_id,
  });

  if (checkUpaidInvoice.length) {
    return {
      success: false,
      code: this.StatusCode.HTTP_BAD_REQUEST,
      data: {
        other_due: 1,
      },
      message:
        "This user has due amount. So cannot check out at this moment",
    };
  }

  // check hall booking due invoice or not

  const hallBookingInvoiceModel = this.Model.hallBookingInvoiceModel(trx);

  const { data: checkUpaidRbInvoice } =
    await hallBookingInvoiceModel.getAllHallBookingInvoice({
      user_id,
      due_inovice: "1",
      hotel_id,
    });

  if (checkUpaidRbInvoice.length) {
    return {
      success: false,
      code: this.StatusCode.HTTP_BAD_REQUEST,
      data: {
        other_due: 1,
      },
      message:
        "This user has due amount. So cannot check out at this moment",
    };
  }
  
  // add checkout time
  const checkout = await bookingModel.updateBookingCheckOut(
    { check_out, status: "checked-out" },
    parseInt(req.params.id)
  );

  //==================== steps for room update ================== //

  const getAllHallByBookingId = await bookingModel.getSingleHallBooking(
    booking_id,
    hotel_id
  );
  const { booking_halls }: { booking_halls: IbookingHalls[] } =
    getAllHallByBookingId[0];

  const bookingHallsList = booking_halls.map((item) => item.hall_id);
  const hallModel = this.Model.hallModel(trx);

  // hall update for avaliblity
  await hallModel.updateManyHall(bookingHallsList, hotel_id, {
    hall_status: "available",
  });

  // update hall booking status
  await bookingModel.updateHallBooking(
    { booking_status: "left" },
    { id: booking_id}
  );

    return {
      success: true,
      code: this.StatusCode.HTTP_SUCCESSFUL,
      message: "Booking checked out",
    };
  });
  }

  }
export default HallBookingService;