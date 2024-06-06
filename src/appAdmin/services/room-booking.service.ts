import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";
import { IRoomBookingBody } from "../utlis/interfaces/roomBooking.interface";
import { IgetAllRoom } from "../utlis/interfaces/Room.interfaces";

class RoomBookingService extends AbstractServices {
  constructor() {
    super();
  }

  // create room booking
  public async createRoomBooking(req: Request) {
    return await this.db.transaction(async (trx) => {
      const { hotel_id, id } = req.hotel_admin;

      const {
        name,
        email,
        booking_rooms,
        check_in_time,
        check_out_time,
        discount_amount,
        tax_amount,
        total_occupancy,
        paid_amount,
        payment_type,
        ac_tr_ac_id,
        passport_no,
        nid_no,
        check_in,
        extra_charge,
      } = req.body as IRoomBookingBody;

      // number of nights step
      const checkInTime: any = new Date(check_in_time);
      const checkOutTime: any = new Date(check_out_time);

      const timeDifference = checkOutTime - checkInTime;

      const millisecondsInADay = 24 * 60 * 60 * 1000;
      let numberOfNights = Math.floor(timeDifference / millisecondsInADay);

      if (!numberOfNights) numberOfNights = 1;

      const roomBookingModel = this.Model.roomBookingModel(trx);
      // number of nights end
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
          nid_no,
          passport_no,
        });
      }

      const userID = checkUser.length
        ? checkUser[0].id
        : (userRes[0] as number);

      if (!checkUser.length || checkUser[0].user_type !== "room-guest") {
        const existingUserType = await guestModel.getExistsUserType(
          userID,
          "room-guest"
        );

        if (!existingUserType) {
          await guestModel.createUserType({
            user_id: userID,
            user_type: "room-guest",
          });
        }
      }

      // ========== step for amount ============ //

      // room model
      const roomModel = this.Model.RoomModel(trx);

      const bookingRoomsList: number[] = booking_rooms.map(
        (item) => item.room_id
      );

      // get all room by rooms
      const { data: allBookingRoom }: { data: IgetAllRoom[]; total: any } =
        await roomModel.getAllRoom({
          hotel_id,
          rooms: bookingRoomsList,
        });

      if (!allBookingRoom.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_NOT_FOUND,
          message: "Room not found with this hotel",
        };
      }

      // check if unavaiable room or not

      const { data: allRoom } = await roomModel.getAllRoom({
        hotel_id,
      });

      // getting all room booking
      const getAllBookingRoom = await roomModel.getAllBookingRoom({
        from_date: check_in_time as string,
        to_date: check_out_time as string,
        hotel_id,
      });

      const newFromDate = new Date(check_in_time as string);
      newFromDate.setDate(newFromDate.getDate());

      // get all booking room sd query
      const getAllBookingRoomSdQuery =
        await roomModel.getAllBookingRoomForSdQueryAvailblityWithCheckout({
          from_date: newFromDate.toISOString(),
          to_date: new Date(check_out_time as string),
          hotel_id,
        });

      const availableRoomForBooking: {
        id: number;
      }[] = [];

      // all rooms combined from different bookings
      const allBookingRooms: { id: number; room_id: number }[] = [];

      if (getAllBookingRoom.length) {
        for (let i = 0; i < getAllBookingRoom.length; i++) {
          const booking_rooms = getAllBookingRoom[i]?.booking_rooms;
          for (let j = 0; j < booking_rooms.length; j++) {
            allBookingRooms.push({
              id: booking_rooms[j].id,
              room_id: booking_rooms[j].room_id,
            });
          }
        }
      }

      // get all booking room second query result
      if (getAllBookingRoomSdQuery.length) {
        for (let i = 0; i < getAllBookingRoomSdQuery?.length; i++) {
          const booking_rooms = getAllBookingRoomSdQuery[i]?.booking_rooms;
          for (let j = 0; j < booking_rooms?.length; j++) {
            allBookingRooms.push({
              id: booking_rooms[j].id,
              room_id: booking_rooms[j].room_id,
            });
          }
        }
      }

      // now find out all available room
      if (allRoom.length) {
        for (let i = 0; i < allRoom.length; i++) {
          let found = false;

          for (let j = 0; j < allBookingRooms.length; j++) {
            if (allRoom[i].id == allBookingRooms[j].room_id) {
              found = true;
              break;
            }
          }
          if (!found) {
            availableRoomForBooking.push({
              id: allRoom[i].id,
            });
          }
        }
      }

      if (!availableRoomForBooking.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_NOT_FOUND,
          message: "Room not availabe with check in  and checkout time",
        };
      }

      //

      const tempAllBokingRoom: {
        id: number;
        room_number?: string;
        rate_per_night: number;
      }[] = [];

      for (let i = 0; i < allBookingRoom.length; i++) {
        let found = false;

        for (let j = 0; j < booking_rooms.length; j++) {
          if (allBookingRoom[i].id === booking_rooms[j].room_id) {
            found = true;
            tempAllBokingRoom.push({
              id: allBookingRoom[i].id,
              room_number: allBookingRoom[i].room_number,
              rate_per_night: allBookingRoom[i].rate_per_night,
            });
          }
        }

        if (!found) {
          tempAllBokingRoom.push({
            id: allBookingRoom[i].id,
            room_number: allBookingRoom[i].room_number,
            rate_per_night: allBookingRoom[i].rate_per_night,
          });
        }
      }

      let totalSubAmount = 0;

      if (tempAllBokingRoom.length) {
        totalSubAmount = tempAllBokingRoom.reduce((acc, room) => {
          const ratePerNight = (room.rate_per_night || 0) * numberOfNights;
          return acc + ratePerNight;
        }, 0);
      }

      const grandTotal =
        totalSubAmount + (extra_charge || 0) + tax_amount - discount_amount;

      // =============== step end amount =====================

      // get last booking id
      const checkLastBookingId = await roomBookingModel.getLastRoomBookingId(
        hotel_id
      );

      const lastBookingId = checkLastBookingId.length
        ? checkLastBookingId[0].id + 1
        : 1;

      const booking_no = `RB-${new Date().getFullYear()}${lastBookingId}`;

      // insert room booking
      const rmbRes = await roomBookingModel.insertRoomBooking({
        hotel_id,
        check_in_time,
        check_out_time,
        number_of_nights: numberOfNights,
        total_occupancy,
        status: "approved",
        user_id: userID,
        grand_total: grandTotal,
        booking_no,
        extra_charge,
        created_by: id,
      });

      // insert booking rooms
      const BookingRoomPayload = booking_rooms.map((item) => {
        return {
          booking_id: rmbRes[0],
          room_id: item.room_id,
        };
      });

      await roomBookingModel.insertBookingRoom(BookingRoomPayload);

      if (paid_amount > 0) {
        await roomBookingModel.updateRoomBooking(
          { pay_status: 1, reserved_room: 1 },
          { id: rmbRes[0] }
        );
      }

      // Room Check in
      const bookingModel = this.Model.roomBookingModel(trx);

      if (check_in) {
        await bookingModel.insertRoomBookingCheckIn({
          booking_id: rmbRes[0],
          check_in: check_in_time,
          created_by: id,
        });

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

          const roomBookingModel = this.Model.roomBookingModel(trx);

          await roomBookingModel.updateRoomBooking(
            { pay_status: 1, reserved_room: 1 },
            { id: rmbRes[0] }
          );
        }
      }

      //=================== step for invoice ======================//

      let advanceAmount = 0;

      let due_amount = 0;

      if (grandTotal < paid_amount) {
        advanceAmount = paid_amount - grandTotal;
      } else {
        due_amount = grandTotal - paid_amount;
      }

      const roomBokingInvoiceModel = this.Model.roomBookingInvoiceModel(trx);

      // insert in invoice
      const invoiceModel = this.Model.hotelInvoiceModel(trx);

      // get last invoice
      const invoiceData = await invoiceModel.getAllInvoiceForLastId();

      const year = new Date().getFullYear();

      const InvoiceNo = invoiceData.length ? invoiceData[0].id + 1 : 1;

      // insert invoice
      const invoiceRes = await invoiceModel.insertHotelInvoice({
        invoice_no: `RMBPNL-${year}${InvoiceNo}`,
        description: `For room booking, booking id =${rmbRes[0]}, ${
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
        await roomBokingInvoiceModel.insertRoomBookingSubInvoice({
          inv_id: invoiceRes[0],
          room_booking_id: rmbRes[0],
        });

      // insert sub invoice item
      const invoiceItem = tempAllBokingRoom.map((item) => {
        return {
          sub_inv_id: subInvoiceRes[0],
          room_id: item.id,
          name: item.room_number as string,
          total_price: item.rate_per_night,
        };
      });

      await roomBokingInvoiceModel.insertRoomBookingSubInvoiceItem(invoiceItem);

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
              ? `RMBBN-${year}-${moneyRecieptNo}`
              : payment_type == "cash"
              ? `RMBCS-${year}-${moneyRecieptNo}`
              : payment_type == "cheque"
              ? `RMBCQ-${year}-${moneyRecieptNo}`
              : payment_type == "mobile-banking"
              ? `RMBMB-${year}-${moneyRecieptNo}`
              : ""
          }`,
          remarks: "For room booking",
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
          ledger_details: `Balance has been credited by room booking with full payment, Room booking id =${rmbRes[0]}`,
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
          parseFloat(paid_amount.toString());

        await guestModel.insertGuestLedger({
          name: `${
            payment_type == "bank"
              ? `RMBBN-${year}-${moneyRecieptNo}`
              : payment_type == "cash"
              ? `RMBCS-${year}-${moneyRecieptNo}`
              : payment_type == "cheque"
              ? `RMBCQ-${year}-${moneyRecieptNo}`
              : payment_type == "mobile-banking"
              ? `RMBMB-${year}-${moneyRecieptNo}`
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
          ledger_details: `Balance has been credited by room booking with partial payment, Room booking id =${rmbRes[0]}`,
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
          parseFloat(grandTotal.toString());

        await guestModel.insertGuestLedger({
          name: `${
            payment_type == "bank"
              ? `RMBBN-${year}-${moneyRecieptNo}`
              : payment_type == "cash"
              ? `RMBCS-${year}-${moneyRecieptNo}`
              : payment_type == "cheque"
              ? `RMBCQ-${year}-${moneyRecieptNo}`
              : payment_type == "mobile-banking"
              ? `RMBMB-${year}-${moneyRecieptNo}`
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
                ? `RMBBN-${year}-${moneyRecieptNo}`
                : payment_type == "cash"
                ? `RMBCS-${year}-${moneyRecieptNo}`
                : payment_type == "cheque"
                ? `RMBCQ-${year}-${moneyRecieptNo}`
                : payment_type == "mobile-banking"
                ? `RMBMB-${year}-${moneyRecieptNo}`
                : ""
            }`,
            amount: paid_amount,
            pay_type: "credit",
            user_id: userID,
            hotel_id,
            last_balance: guestLedgerLastBalance,
          });

          // insert guest ledger for due amount
          await guestModel.insertGuestLedger({
            name: `${
              payment_type == "bank"
                ? `RMBBN-${year}-${moneyRecieptNo}`
                : payment_type == "cash"
                ? `RMBCS-${year}-${moneyRecieptNo}`
                : payment_type == "cheque"
                ? `RMBCQ-${year}-${moneyRecieptNo}`
                : payment_type == "mobile-banking"
                ? `RMBMB-${year}-${moneyRecieptNo}`
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
        message: "Room succesfully booked",
      };
    });
  }

  // get all room booking
  public async getAllRoomBooking(req: Request) {
    const { hotel_id } = req.hotel_admin;
    const { limit, skip, name, from_date, to_date, status, user_id } =
      req.query;

    const model = this.Model.roomBookingModel();

    const { data, total } = await model.getAllRoomBooking({
      limit: limit as string,
      skip: skip as string,
      name: name as string,
      from_date: from_date as string,
      to_date: to_date as string,
      hotel_id,
      status: status as string,
      user_id: user_id as string,
    });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total,
      data,
    };
  }

  // get single room booking
  public async getSingleRoomBooking(req: Request) {
    const { id } = req.params;
    const { hotel_id } = req.hotel_admin;

    const data = await this.Model.roomBookingModel().getSingleRoomBooking(
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

  // insert check in room booking
  public async insertBookingCheckIn(req: Request) {
    return await this.db.transaction(async (trx) => {
      const { hotel_id, id } = req.hotel_admin;
      const { booking_id, check_in } = req.body;

      const bookingModel = this.Model.roomBookingModel(trx);

      const checkBooking = await bookingModel.getSingleRoomBooking(
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
        await bookingModel.getAllRoomBookingCheckIn({ booking_id, hotel_id });

      if (checkBookingCheckedIn.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_CONFLICT,
          message: "Already checked in by this booking ID",
        };
      }

      const { check_out_time, pay_status, grand_total, user_id, booking_no } =
        checkBooking[0];

      // room booking check in time
      const rmb_last_check_in_time = new Date(check_out_time);
      const after_rmb_check_in_time = new Date(check_in);

      if (after_rmb_check_in_time > rmb_last_check_in_time) {
        return {
          success: false,
          code: this.StatusCode.HTTP_BAD_REQUEST,
          message:
            "Room booking check in time expired, so you can not check in for this booking",
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

        const roomBookingModel = this.Model.roomBookingModel(trx);

        await roomBookingModel.updateRoomBooking(
          { pay_status: 1, reserved_room: 1 },
          { id: booking_id }
        );
      }

      // insert room booking check in
      await bookingModel.insertRoomBookingCheckIn({
        booking_id,
        check_in,
        created_by: id,
      });

      return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: "Booking checked in",
      };
    });
  }

  // get all room booking check in
  public async getAllRoomBookingCheckIn(req: Request) {
    const { hotel_id } = req.hotel_admin;
    const { limit, skip, key, from_date, to_date } = req.query;

    const model = this.Model.roomBookingModel();

    const { data, total } = await model.getAllRoomBookingCheckIn({
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

  // add check out room booking
  public async addBookingCheckOut(req: Request) {
    return await this.db.transaction(async (trx) => {
      const { hotel_id } = req.hotel_admin;
      const { check_out } = req.body;

      const bookingModel = this.Model.roomBookingModel(trx);

      const checkBooking = await bookingModel.getSingleRoomBookingCheckIn(
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

      const otherInvoiceModel = this.Model.hotelInvoiceModel(trx);
      // get all invoice by user
      const { data: checkUpaidInvoice } = await otherInvoiceModel.getAllInvoice(
        {
          user_id,
          due_inovice: "1",
          hotel_id,
        }
      );

      if (checkUpaidInvoice.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_BAD_REQUEST,
          data: {
            other_due: 1,
          },
          message:
            "This user has others due amount. So cannot check out at this moment",
        };
      }

      // check room booking due invoice or not

      const roomBookingInvoiceModel = this.Model.roomBookingInvoiceModel(trx);

      const { data: checkUpaidRbInvoice } =
        await roomBookingInvoiceModel.getAllRoomBookingInvoice({
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
      await bookingModel.addRoomBookingCheckOut(
        { check_out, status: "checked-out" },
        parseInt(req.params.id)
      );

      //====================  update room booking ================== //

      // update room booking status
      await bookingModel.updateRoomBooking(
        { status: "left" },
        { id: booking_id }
      );

      return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: "Booking checked out",
      };
    });
  }

  // refund room booking
  public async refundRoomBooking(req: Request) {
    return await this.db.transaction(async (trx) => {
      const { hotel_id } = req.hotel_admin;
      const { id } = req.params;
      const { charge, refund_from_acc, refund_type } = req.body;

      const accModel = this.Model.accountModel(trx);
      const rmbModel = this.Model.roomBookingModel(trx);
      const userModel = this.Model.guestModel(trx);
      const rmbInvModel = this.Model.roomBookingInvoiceModel(trx);

      // get room booking
      const getSingleRB = await rmbModel.getSingleRoomBooking(
        parseInt(id),
        hotel_id
      );

      if (!getSingleRB.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_NOT_FOUND,
          message: this.ResMsg.HTTP_NOT_FOUND,
        };
      }

      const {
        pay_status,
        grand_total,
        status,
        check_in_out_status,
        booking_no,
        user_id,
      } = getSingleRB[0];

      if (!pay_status) {
        return {
          success: false,
          code: this.StatusCode.HTTP_BAD_REQUEST,
          message: "You cannot refund cause payment not done",
        };
      }
      if (status != "approved") {
        return {
          success: false,
          code: this.StatusCode.HTTP_BAD_REQUEST,
          message: "You cannot refund without status approved",
        };
      }
      if (check_in_out_status != null) {
        return {
          success: false,
          code: this.StatusCode.HTTP_BAD_REQUEST,
          message: "Refund only if not checked in",
        };
      }

      // get single room booking inv
      const getSingleRBInv = await rmbInvModel.getSingleRoomBookingInvoice({
        hotel_id,
        room_booking_id: parseInt(id),
      });

      const { due } = getSingleRBInv[0];

      // get single account
      const getSingleAcc = await accModel.getSingleAccount({
        hotel_id,
        id: refund_from_acc,
      });

      if (!getSingleAcc.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_NOT_FOUND,
          message: "Account not found",
        };
      }

      const { last_balance } = getSingleAcc[0];

      // user paid amount
      const userPaidAmount = parseFloat(grand_total) - parseFloat(due);

      const nowUserRefundBlnc = userPaidAmount - charge;

      if (last_balance < nowUserRefundBlnc) {
        return {
          success: false,
          code: this.StatusCode.HTTP_BAD_REQUEST,
          message:
            "You cannot refund cause account balance is lower than refund balance",
        };
      }

      // get user ledger last balance
      const getULgBlnce = await userModel.getLedgerLastBalanceByUser({
        hotel_id,
        user_id,
      });

      if (refund_type == "adjust_money") {
        // charge added in user ledger
        // const nowLedgerLastBalance
        // const userLdg = await userModel.insertGuestLedger({
        //   amount: charge,
        //   hotel_id,
        //   name: booking_no,
        //   pay_type: "debit",
        //   user_id,
        //   last_balance:,
        // });
        // user balance update
        // account transaction for debit
      }

      // Fetch additional fields
      // await rmbModel.refundRoomBooking(
      //   {
      //     hotel_id,
      //     pay_status: 0,
      //     reserved_room: 0,
      //     status: "refunded",
      //   },
      //   { id: parseInt(id) }
      // );

      return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: "Booking room successfully refunded",
      };
    });
  }

  // //======== extend Room Booking  =============//

  public async extendRoomBooking(req: Request) {
    return await this.db.transaction(async (trx) => {
      const { hotel_id, id: admin_id } = req.hotel_admin;
      const { id } = req.params;
      const { check_out_time, booking_rooms } = req.body;

      const roomModel = this.Model.RoomModel(trx);

      const bookingRoomsList: number[] = booking_rooms.map(
        (item: { room_id: number }) => item.room_id
      );

      console.log({bookingRoomsList})

        // get all room by rooms
        const { data: allBookingRoom }: { data: IgetAllRoom[]; total: any } =
        await roomModel.getAllRoom({
          hotel_id,
          rooms: bookingRoomsList,
        });

      if (!allBookingRoom.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_NOT_FOUND,
          message: "Room is not found with this hotel",
        };
      }

      const getSingleBookingRoom =
      await this.Model.roomBookingModel().getSingleRoomBooking(
        parseInt(id),
        hotel_id
      );

    const checkTime =
      getSingleBookingRoom.length > 0
        ? getSingleBookingRoom[0].check_in_time
        : 0;

      const checkInTime: any = new Date(checkTime);
      const checkOutTime: any = new Date(check_out_time);

      console.log ({checkInTime})
      console.log ({checkOutTime})

      // check if unavaiable room or not

      const { data: allRoom } = await roomModel.getAllRoom({
        hotel_id,
      });

      // getting all room booking
      const getAllBookingRoom = await roomModel.getAllBookingRoom({
        from_date: checkInTime as string,
        to_date: checkOutTime as string,
        hotel_id,
      });

      console.log ({getAllBookingRoom})

      const newFromDate = new Date(checkInTime as string);
      newFromDate.setDate(newFromDate.getDate());

      console.log ({newFromDate})

      // get all booking room sd query
      const getAllBookingRoomSdQuery =
        await roomModel.getAllBookingRoomForSdQueryAvailblityWithCheckout({
          from_date: newFromDate.toISOString(),
          to_date: new Date(checkOutTime as string),
          hotel_id,
        });

        const formDate = newFromDate.toISOString();

        const to_date = new Date(checkOutTime as string);


        console.log({formDate})

        console.log({to_date})

      console.log ({getAllBookingRoomSdQuery})

      const availableRoomForBooking: {
        id: number;
      }[] = [];

      console.log ({availableRoomForBooking})

      // all rooms combined from different bookings
      const allBookingRooms: { id: number; room_id: number }[] = [];

      console.log ({allBookingRooms})

      if (getAllBookingRoom.length) {
        for (let i = 0; i < getAllBookingRoom.length; i++) {
          const booking_rooms = getAllBookingRoom[i]?.booking_rooms;
          for (let j = 0; j < booking_rooms.length; j++) {
            allBookingRooms.push({
              id: booking_rooms[j].id,
              room_id: booking_rooms[j].room_id,
            });
          }
        }
      }

      console.log ({getAllBookingRoom})

      // get all booking room second query result
      if (getAllBookingRoomSdQuery.length) {
        for (let i = 0; i < getAllBookingRoomSdQuery?.length; i++) {
          const booking_rooms = getAllBookingRoomSdQuery[i]?.booking_rooms;
          for (let j = 0; j < booking_rooms?.length; j++) {
            allBookingRooms.push({
              id: booking_rooms[j].id,
              room_id: booking_rooms[j].room_id,
            });
          }
        }
      }

      // now find out all available room
      if (allRoom.length) {
        for (let i = 0; i < allRoom.length; i++) {
          let found = false;

          for (let j = 0; j < allBookingRooms.length; j++) {
            if (allRoom[i].id == allBookingRooms[j].room_id) {
              found = true;
              break;
            }
          }
          if (!found) {
            availableRoomForBooking.push({
              id: allRoom[i].id,
            });
          }
        }
      }

      console.log ({allRoom})

      if (!availableRoomForBooking.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_NOT_FOUND,
          message: "The Room is unavilable so can't extend the Booking",
        };
      }

      const tempAllBookingRoom: {
        id: number;
        room_number?: string;
        rate_per_night: number;
      }[] = [];

      for (let i = 0; i < allBookingRoom.length; i++) {
        let found = false;

        for (let j = 0; j < booking_rooms.length; j++) {
          if (allBookingRoom[i].id === booking_rooms[j].room_id) {
            found = true;
            tempAllBookingRoom.push({
              id: allBookingRoom[i].id,
              room_number: allBookingRoom[i].room_number,
              rate_per_night: allBookingRoom[i].rate_per_night,
            });
          }
        }

        if (!found) {
          tempAllBookingRoom.push({
            id: allBookingRoom[i].id,
            room_number: allBookingRoom[i].room_number,
            rate_per_night: allBookingRoom[i].rate_per_night,
          });
        }
      }

      const timeDifference = checkOutTime - checkInTime;

      const millisecondsInADay = 24 * 60 * 60 * 1000;

      const numberOfNights = Math.floor(timeDifference / millisecondsInADay);

      const previousNights =
        getSingleBookingRoom.length > 0
          ? getSingleBookingRoom[0].number_of_nights
          : 0;

      const extendNights = numberOfNights - parseInt(previousNights);

      const totalExtendNights =
        getSingleBookingRoom.length > 0
          ? getSingleBookingRoom[0].total_extended_nights
          : 0;

      const totalExtendedNights = extendNights + parseInt(totalExtendNights);

      const TotalExtendedNights =
        totalExtendedNights === 0 ? extendNights : totalExtendedNights;

      let totalSubAmount = 0;

      if (tempAllBookingRoom.length) {
        totalSubAmount = tempAllBookingRoom.reduce((acc, room) => {
          const ratePerNight = (room.rate_per_night || 0) * numberOfNights;
          return acc + ratePerNight;
        }, 0);
      }

      let due = 0;

      if (tempAllBookingRoom.length) {
        due = tempAllBookingRoom.reduce((acc, room) => {
          const ratePerNight = (room.rate_per_night || 0) * extendNights;
          return acc + ratePerNight;
        }, 0);
      }

      const grandTotal = totalSubAmount;

      const existingDue =
        getSingleBookingRoom.length > 0 ? getSingleBookingRoom[0].due : 0;

      const totalDue = due + parseInt(existingDue);

      const invoiceModel = this.Model.hotelInvoiceModel(trx);

      const { inv_id } = await invoiceModel.getRoomBookingSubInv(parseInt(id));

      await invoiceModel.updateBookingUpdateInvoice(
        { due: totalDue, grand_total: grandTotal, sub_total: totalSubAmount },
        { id: inv_id, hotel_id: hotel_id }
      );

      const model = this.Model.roomBookingModel(trx);

      const userID =
        getSingleBookingRoom.length > 0 ? getSingleBookingRoom[0].user_id : 0;

      const userLastBalance =
        getSingleBookingRoom.length > 0
          ? getSingleBookingRoom[0].user_last_balance
          : 0;

      const guestModel = this.Model.guestModel(trx);

      //====== Guest balance update ======//

      const nowTotalBalance = userLastBalance - due;

      const checkBooking = await model.getRoomCheckInOutStatusByBookingID(
        parseInt(req.params.id),
        hotel_id
      );

      const status = checkBooking.length > 0 ? checkBooking[0].status : null;

      if (status !== "checked-out"){
        await model.updateBookingRoom(
            {
                check_in_time: checkInTime,
                check_out_time: checkOutTime,
                number_of_nights: numberOfNights,
                total_extended_nights: TotalExtendedNights,
                extend_status: 1,
                grand_total: grandTotal,
                created_by: admin_id,
            },
            parseInt(id)
        );

        const bookingNo =
          getSingleBookingRoom.length > 0
            ? getSingleBookingRoom[0].booking_no
            : 0;

        await guestModel.insertGuestLedger({
          name: `RMBEX-${bookingNo}`,
          amount: due,
          pay_type: "debit",
          user_id: userID,
          hotel_id,
          last_balance: nowTotalBalance,
        });

        await guestModel.updateSingleGuest(
          { last_balance: nowTotalBalance },
          { hotel_id, id: userID }
        );

        return {
          success: true,
          code: this.StatusCode.HTTP_SUCCESSFUL,
          message: "Room Booking extended",
        };
      } else {
        return {
          success: false,
          code: this.StatusCode.HTTP_NOT_FOUND,
          message: "Booking can't extend",
        };
      }
    });
  }
}

export default RoomBookingService;
