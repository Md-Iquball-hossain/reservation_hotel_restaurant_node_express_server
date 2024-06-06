import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";
import RoomModel from "../../models/RoomModel/Room.Model";
import {
  IcreateRoomBody,
  IroomImage,
  IupdateroomPayload,
} from "../utlis/interfaces/Room.interfaces";

export class RoomService extends AbstractServices {
  constructor() {
    super();
  }

  // create room
  public async createRoom(req: Request) {
    return await this.db.transaction(async (trx) => {
      const { room_amenities, ...rest } = req.body as IcreateRoomBody;
      const { hotel_id } = req.hotel_admin;

      // room number check
      const roomModel = this.Model.RoomModel();
      const check = await roomModel.getRoomByNumber(
        req.body.room_number,
        hotel_id
      );

      if (check) {
        return {
          success: false,
          code: this.StatusCode.HTTP_CONFLICT,
          message:
            "Room Number already exists, give another unique room number",
        };
      }

      // model
      const model = new RoomModel(trx);

      // insert room
      const res = await model.createRoom({ ...rest, hotel_id });

      const room_id = res[0];

      // step room amenities
      const hotel_room_amenities_parse = room_amenities
        ? JSON.parse(room_amenities)
        : [];

      // insert room amenities
      if (hotel_room_amenities_parse.length) {
        const hotelRoomAmenitiesPayload = hotel_room_amenities_parse.map(
          (id: number) => {
            return {
              room_id,
              rah_id: id,
            };
          }
        );
        await model.insertHotelRoomAmenities(hotelRoomAmenitiesPayload);
      }

      const files = (req.files as Express.Multer.File[]) || [];

      // insert room image
      if (files.length) {
        const roomImages: IroomImage[] = [];
        files.forEach((element) => {
          roomImages.push({
            room_id,
            photo: element.filename,
          });
        });
        await model.createRoomImage(roomImages);
      }

      return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: "Room created successfully.",
      };
    });
  }

  // get All Hotel Room
  public async getAllHotelRoom(req: Request) {
    const { key, availability, limit, skip, refundable, occupancy } = req.query;

    const { hotel_id } = req.hotel_admin;

    // model
    const model = this.Model.RoomModel();

    const { data, total } = await model.getAllRoom({
      key: key as string,
      availability: availability as string,
      refundable: refundable as string,
      occupancy: occupancy as string,
      limit: limit as string,
      skip: skip as string,
      hotel_id,
    });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total,
      data,
    };
  }

  // get available and unavailable Room
  public async getAllAvailableAndUnavailableRoom(req: Request) {
    const {
      key,
      availability,
      limit,
      skip,
      refundable,
      occupancy,
      from_date,
      to_date,
    } = req.query;

    const { hotel_id } = req.hotel_admin;

    // model
    const model = this.Model.RoomModel();

    const { data: allRoom, total } = await model.getAllRoom({
      key: key as string,
      availability: availability as string,
      refundable: refundable as string,
      occupancy: occupancy as string,
      limit: limit as string,
      skip: skip as string,
      hotel_id,
    });

    const newFromDate = new Date(from_date as string);
    newFromDate.setDate(newFromDate.getDate());
    const newToDate = new Date(to_date as string);

    // getting all room booking
    const getAllBookingRoom = await model.getAllBookingRoom({
      from_date: newFromDate.toISOString(),
      to_date: newToDate.toISOString(),
      hotel_id,
    });

    // get all booking room sd query
    const getAllBookingRoomSdQuery =
      await model.getAllBookingRoomForSdQueryAvailblityWithCheckout({
        from_date: newFromDate.toISOString(),
        to_date: new Date(to_date as string),
        hotel_id,
      });

    const availableRoomForBooking: {
      id: number;
      room_number: string;
      room_type: string;
      bed_type: string;
      refundable: number;
      rate_per_night: number;
      discount: number;
      discount_percent: number;
      child: number;
      adult: number;
      guest_name?: string;
      guest_email?: string;
      check_in_time?: string;
      check_out_time?: string;
      grand_total?: string;
      due_amount?: string;
      available_status: number;
      user_last_balance?: string;
      room_description: string;
      room_amenities: [];
      room_images: [];
    }[] = [];

    const allBookingRooms: {
      id: number;
      room_id: number;
      check_in_time: string;
      check_out_time: string;
      name: string;
      email: string;
      grand_total: string;
      due: string;
      user_last_balance: string;
    }[] = [];

    // get all booking room
    if (getAllBookingRoom?.length) {
      for (let i = 0; i < getAllBookingRoom?.length; i++) {
        const booking_rooms = getAllBookingRoom[i]?.booking_rooms;
        for (let j = 0; j < booking_rooms?.length; j++) {
          allBookingRooms.push({
            id: booking_rooms[j].id,
            room_id: booking_rooms[j].room_id,
            check_in_time: getAllBookingRoom[i].check_in_time,
            check_out_time: getAllBookingRoom[i].check_out_time,
            name: getAllBookingRoom[i].name,
            email: getAllBookingRoom[i].email,
            grand_total: getAllBookingRoom[i].grand_total,
            due: getAllBookingRoom[i].due,
            user_last_balance: getAllBookingRoom[i].user_last_balance,
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
            check_in_time: getAllBookingRoomSdQuery[i].check_in_time,
            check_out_time: getAllBookingRoomSdQuery[i].check_out_time,
            name: getAllBookingRoomSdQuery[i].name,
            email: getAllBookingRoomSdQuery[i].email,
            grand_total: getAllBookingRoomSdQuery[i].grand_total,
            due: getAllBookingRoomSdQuery[i].due,
            user_last_balance: getAllBookingRoomSdQuery[i].user_last_balance,
          });
        }
      }
    }

    if (allRoom?.length) {
      for (let i = 0; i < allRoom.length; i++) {
        let found = false;
        for (let j = 0; j < allBookingRooms?.length; j++) {
          if (allRoom[i].id == allBookingRooms[j]?.room_id) {
            found = true;
            availableRoomForBooking.push({
              id: allRoom[i].id,
              room_number: allRoom[i].room_number,
              room_type: allRoom[i].room_type,
              bed_type: allRoom[i].bed_type,
              refundable: allRoom[i].refundable,
              rate_per_night: allRoom[i].rate_per_night,
              discount: allRoom[i].discount,
              discount_percent: allRoom[i].discount_percent,
              child: allRoom[i].child,
              adult: allRoom[i].adult,
              available_status: 0,
              guest_name: allBookingRooms[j]?.name || "",
              guest_email: allBookingRooms[j]?.email || "",
              check_in_time: allBookingRooms[j]?.check_in_time || "",
              check_out_time: allBookingRooms[j]?.check_out_time || "",
              grand_total: allBookingRooms[j]?.grand_total || "",
              due_amount: allBookingRooms[j]?.due || "",
              user_last_balance: allBookingRooms[j]?.user_last_balance || "",
              room_description: allRoom[i].room_description,
              room_amenities: allRoom[i].room_amenities,
              room_images: allRoom[i].room_images,
            });
            break;
          }
        }

        if (!found) {
          availableRoomForBooking.push({
            id: allRoom[i].id,
            room_number: allRoom[i].room_number,
            room_type: allRoom[i].room_type,
            bed_type: allRoom[i].bed_type,
            refundable: allRoom[i].refundable,
            rate_per_night: allRoom[i].rate_per_night,
            discount: allRoom[i].discount,
            discount_percent: allRoom[i].discount_percent,
            child: allRoom[i].child,
            adult: allRoom[i].adult,
            available_status: 1,
            room_description: allRoom[i].room_description,
            room_amenities: allRoom[i].room_amenities,
            room_images: allRoom[i].room_images,
          });
        }
      }
    }

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total,
      data: availableRoomForBooking,
    };
  }

  // get All available Room
  public async getAllAvailableRoom(req: Request) {
    const {
      key,
      availability,
      limit,
      skip,
      from_date,
      to_date,
      refundable,
      occupancy,
    } = req.query;

    const { hotel_id } = req.hotel_admin;
    // model
    const model = this.Model.RoomModel();

    // get all booking
    const { data: allRoom } = await model.getAllRoom({
      key: key as string,
      availability: availability as string,
      refundable: refundable as string,
      occupancy: occupancy as string,
      limit: limit as string,
      skip: skip as string,
      hotel_id,
    });

    // getting all room booking
    const getAllBookingRoom = await model.getAllBookingRoom({
      from_date: from_date as string,
      to_date: to_date as string,
      hotel_id,
    });

    const newFromDate = new Date(from_date as string);
    newFromDate.setDate(newFromDate.getDate());

    // get all booking room sd query
    const getAllBookingRoomSdQuery =
      await model.getAllBookingRoomForSdQueryAvailblityWithCheckout({
        from_date: newFromDate.toISOString(),
        to_date: new Date(to_date as string),
        hotel_id,
      });

    const availableRoomForBooking: {
      id: number;
      room_number: string;
      room_type: string;
      bed_type: string;
      refundable: number;
      rate_per_night: number;
      discount: number;
      discount_percent: number;
      child: number;
      adult: number;
      availability: number;
      room_description: string;
      room_amenities: [];
      room_images: [];
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
            room_number: allRoom[i].room_number,
            room_type: allRoom[i].room_type,
            bed_type: allRoom[i].bed_type,
            refundable: allRoom[i].refundable,
            rate_per_night: allRoom[i].rate_per_night,
            discount: allRoom[i].discount,
            discount_percent: allRoom[i].discount_percent,
            child: allRoom[i].child,
            adult: allRoom[i].adult,
            availability: allRoom[i].availability,
            room_description: allRoom[i].room_description,
            room_amenities: allRoom[i].room_amenities,
            room_images: allRoom[i].room_images,
          });
        }
      }
    }

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data: availableRoomForBooking,
    };
  }

  // get Single Hotel Room
  public async getSingleHotelRoom(req: Request) {
    const { room_id } = req.params;
    console.log(req.hotel_admin.hotel_id, "hotel admin");
    const model = this.Model.RoomModel();
    const data = await model.getSingleRoom(
      req.hotel_admin.hotel_id,
      parseInt(room_id)
    );
    if (!data.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }

    // get all active room booking
    const roomBookingModel = this.Model.roomBookingModel();

    const bookingData = await roomBookingModel.getAllRoomBookingByRoomId(
      req.hotel_admin.hotel_id,
      parseInt(room_id)
    );

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data: { ...data[0], bookingData: bookingData[0] },
    };
  }

  // update hotel room
  public async updateroom(req: Request) {
    return await this.db.transaction(async (trx) => {
      const { hotel_id } = req.hotel_admin;
      const { room_id } = req.params;

      const { remove_photos, room_amenities, remove_amenities, ...rest } =
        req.body as IupdateroomPayload;

      const model = this.Model.RoomModel(trx);

      // Update room details
      if (Object.keys(rest).length) {
        await model.updateRoom(parseInt(room_id), hotel_id, { ...rest });
      }

      // Insert room images
      const files = (req.files as Express.Multer.File[]) || [];
      if (files.length) {
        const roomImages: IroomImage[] = files.map((element) => ({
          room_id: parseInt(room_id),
          photo: element.filename,
        }));
        await model.insertRoomImage(roomImages);
      }

      // Remove room images
      const rmv_photo = remove_photos ? JSON.parse(remove_photos) : [];
      if (rmv_photo.length) {
        await model.deleteRoomImage(rmv_photo, Number(room_id));
      }

      // Insert room amenities
      const hotel_room_amenities_parse = room_amenities
        ? JSON.parse(room_amenities)
        : [];

      // Check if amenities already exist
      const roomModel = this.Model.RoomModel();

      const existingAmenities = await roomModel.getAllAmenities(
        Number(room_id),
        hotel_room_amenities_parse
      );

      let distinctAminities = [];

      if (existingAmenities.length) {
        for (let i = 0; i < hotel_room_amenities_parse.length; i++) {
          let found = false;
          for (let j = 0; j < existingAmenities.length; j++) {
            if (hotel_room_amenities_parse[i] == existingAmenities[j].rah_id) {
              found = true;
              break;
            }
          }
          if (!found) {
            distinctAminities.push(hotel_room_amenities_parse[i]);
          }
        }
      }

      if (distinctAminities.length) {
        const hotelRoomAmenitiesPayload = distinctAminities.map(
          (id: number) => ({
            room_id: parseInt(room_id),
            rah_id: id,
          })
        );

        await model.insertHotelRoomAmenities(hotelRoomAmenitiesPayload);
      }

      // Remove room amenities
      const rmv_amenities = remove_amenities
        ? JSON.parse(remove_amenities)
        : [];
      if (rmv_amenities.length) {
        await model.deleteHotelRoomAmenities(rmv_amenities, Number(room_id));
      }

      return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: "Room updated successfully",
      };
    });
  }
}
export default RoomService;
