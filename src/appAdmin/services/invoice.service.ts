// invoice.service.ts
import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";
import { IcreateInvoicePayload } from "../utlis/interfaces/invoice.interface";

export class InvoiceService extends AbstractServices {
  constructor() {
    super();
  }

  // get All invoice service
  public async getAllInvoice(req: Request) {
    const { from_date, to_date, key, limit, skip, due_inovice, user_id } =
      req.query;
    const { hotel_id } = req.hotel_admin;

    // model
    const model = this.Model.hotelInvoiceModel();

    const { data, total } = await model.getAllInvoice({
      hotel_id,
      from_date: from_date as string,
      to_date: to_date as string,
      key: key as string,
      limit: limit as string,
      skip: skip as string,
      due_inovice: due_inovice as string,
      user_id: user_id as string,
    });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total,
      data,
    };
  }

  // get Single invoice service
  public async getSingleInvoice(req: Request) {
    const { invoice_id } = req.params;

    const model = this.Model.hotelInvoiceModel();
    const singleInvoiceData = await model.getSingleInvoice({
      hotel_id: req.hotel_admin.hotel_id,
      invoice_id: parseInt(invoice_id),
    });
    if (!singleInvoiceData.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data: singleInvoiceData[0],
    };
  }

  // get All invoice for money receipt service
  public async getAllInvoiceForMoneyReceipt(req: Request) {
    const { from_date, to_date, key, limit, skip, due_inovice, user_id } =
      req.query;
    const { hotel_id } = req.hotel_admin;

    // model
    const model = this.Model.hotelInvoiceModel();

    const data = await model.getAllInvoiceForMoneyReciept({
      hotel_id,
      from_date: from_date as string,
      to_date: to_date as string,
      key: key as string,
      limit: limit as string,
      skip: skip as string,
      due_inovice: due_inovice as string,
      user_id: user_id as string,
    });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,

      data,
    };
  }

  // create an invoice
  public async createInvoice(req: Request) {
    return await this.db.transaction(async (trx) => {
      const { hotel_id, id } = req.hotel_admin;
      const { user_id, discount_amount, tax_amount, invoice_item } =
        req.body as IcreateInvoicePayload;

      const guestModel = this.Model.guestModel(trx);

      //   checking user
      const checkUser = await guestModel.getSingleGuest({ id: user_id });
      if (!checkUser.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_NOT_FOUND,
          message: "User not found",
        };
      }

      let totalSubAmount = 0;

      if (invoice_item.length) {
        totalSubAmount = invoice_item.reduce((acc, item) => {
          const amount = (item.total_price || 0) * item.quantity;
          return acc + amount;
        }, 0);
      }

      const grandTotal = totalSubAmount + tax_amount - discount_amount;

      //=================== step for invoice ======================//

      // insert in invoice
      const invoiceModel = this.Model.hotelInvoiceModel(trx);

      // get last invoice
      const invoiceData = await invoiceModel.getAllInvoiceForLastId();

      const year = new Date().getFullYear();
      const InvoiceNo = invoiceData.length ? invoiceData[0].id + 1 : 1;

      // insert invoice
      const invoiceRes = await invoiceModel.insertHotelInvoice({
        invoice_no: `PNL-${year}${InvoiceNo}`,
        description: `Inovice created by invoice Module, ${`due amount is =${grandTotal}`}`,
        created_by: id,
        discount_amount: discount_amount,
        grand_total: grandTotal,
        tax_amount: tax_amount,
        sub_total: totalSubAmount,
        due: grandTotal,
        hotel_id,
        type: "front_desk",
        user_id,
      });

      // insert invoice item
      const invoiceItem = invoice_item.map((item) => {
        return {
          invoice_id: invoiceRes[0],
          name: item.name,
          quantity: item.quantity,
          total_price: item.total_price,
        };
      });

      await invoiceModel.insertHotelInvoiceItem(invoiceItem);

      // ============== update guest balance =============== //

      const lastGuestBalance = checkUser[0]?.last_balance
        ? parseFloat(checkUser[0].last_balance)
        : 0;

      const nowTotalBalance = lastGuestBalance - grandTotal;

      await guestModel.updateSingleGuest(
        { last_balance: nowTotalBalance },
        { hotel_id, id: user_id }
      );

      // ====================  invoice item end =================== //

      return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: "Invoice has been created",
      };
    });
  }

  // get all room booking invoice controller with filter
  public async getAllRoomBookingInvoice(req: Request) {
    const { from_date, to_date, key, limit, skip, due_inovice, user_id } =
      req.query;
    const { hotel_id } = req.hotel_admin;

    // model
    const model = this.Model.roomBookingInvoiceModel();

    const { data, total } = await model.getAllRoomBookingInvoice({
      hotel_id,
      from_date: from_date as string,
      to_date: to_date as string,
      key: key as string,
      limit: limit as string,
      skip: skip as string,
      due_inovice: due_inovice as string,
      user_id: user_id as string,
    });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total,
      data,
    };
  }

  // get Single room booking invoice service
  public async getSingleRoomBookingInvoice(req: Request) {
    const { invoice_id } = req.params;

    const model = this.Model.roomBookingInvoiceModel();
    const singleInvoiceData = await model.getSingleRoomBookingInvoice({
      hotel_id: req.hotel_admin.hotel_id,
      invoice_id: parseInt(invoice_id),
    });
    if (!singleInvoiceData.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data: singleInvoiceData[0],
    };
  }

  // get all hall booking invoice controller with filter
  public async getAllHallBookingInvoice(req: Request) {
    const { from_date, to_date, key, limit, skip, due_inovice, user_id } =
      req.query;
    const { hotel_id } = req.hotel_admin;

    // model
    const model = this.Model.hallBookingInvoiceModel();

    const { data, total } = await model.getAllHallBookingInvoice({
      hotel_id,
      from_date: from_date as string,
      to_date: to_date as string,
      key: key as string,
      limit: limit as string,
      skip: skip as string,
      due_inovice: due_inovice as string,
      user_id: user_id as string,
    });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total,
      data,
    };
  }

  // get Single hall booking invoice service
  public async getSingleHallBookingInvoice(req: Request) {
    const { invoice_id } = req.params;

    const model = this.Model.hallBookingInvoiceModel();
    const singleInvoiceData = await model.getSingleHallBookingInvoice({
      hotel_id: req.hotel_admin.hotel_id,
      invoice_id: parseInt(invoice_id),
    });
    if (!singleInvoiceData.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data: singleInvoiceData[0],
    };
  }
}
export default InvoiceService;
