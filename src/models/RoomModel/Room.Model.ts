// RoomModel
import {
  IcreateRoomPayload,
  IupdateroomPayload,
} from "../../appAdmin/utlis/interfaces/Room.interfaces";
import { TDB } from "../../common/types/commontypes";
import Schema from "../../utils/miscellaneous/schema";

class RoomModel extends Schema {
  private db: TDB;
  constructor(db: TDB) {
    super();
    this.db = db;
  }

  // create room
  public async createRoom(payload: IcreateRoomPayload) {
    return await this.db("hotel_room")
      .withSchema(this.RESERVATION_SCHEMA)
      .insert(payload);
  }

  // room number fetch
  public async getRoomByNumber(room_number: string, hotel_id: number) {
    return this.db("hotel_room")
      .withSchema(this.RESERVATION_SCHEMA)
      .where({
        room_number: room_number,
        hotel_id: hotel_id,
      })
      .first();
  }

  // insert hotel room amenities
  public async insertHotelRoomAmenities(
    payload: { rah_id: number; room_id: number }[]
  ) {
    return await this.db("hotel_room_amenities")
      .withSchema(this.RESERVATION_SCHEMA)
      .insert(payload);
  }

  // Create room image
  public async createRoomImage(payload: { photo: string; room_id: number }[]) {
    return await this.db("hotel_room_images")
      .withSchema(this.RESERVATION_SCHEMA)
      .insert(payload);
  }

  // Get All room
  public async getAllRoom(payload: {
    id?: number;
    hotel_id: number;
    key?: string;
    availability?: string;
    refundable?: string;
    occupancy?: string;
    limit?: string;
    skip?: string;
    adult?: string;
    child?: string;
    rooms?: number[];
  }) {
    const {
      key,
      availability,
      refundable,
      limit,
      skip,
      hotel_id,
      adult,
      child,
      rooms,
    } = payload;
    console.log({ hotel_id });
    const dtbs = this.db("room_view as rv");

    if (limit && skip) {
      dtbs.limit(parseInt(limit as string));
      dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs

      .withSchema(this.RESERVATION_SCHEMA)
      .select(
        "rv.room_id as id",
        "rv.room_number",
        "rv.room_type",
        "rv.bed_type",
        "rv.refundable",
        "rv.rate_per_night",
        "rv.discount",
        "rv.discount_percent",
        "rv.child",
        "rv.adult",
        "rv.occupancy",
        "rv.tax_percent",
        "rv.availability",
        "rv.room_description",
        "rv.room_amenities",
        "rv.room_images"
      )
      .where({ hotel_id })
      .andWhere(function () {
        if (key) {
          this.andWhere("rv.room_number", "like", `%${key}%`)
            .orWhere("rv.room_type", "like", `%${key}%`)
            .orWhere("rv.bed_type", "like", `%${key}%`);
        }
      })
      .andWhere(function () {
        if (availability) {
          this.andWhere({ availability });
        }
        if (refundable) {
          this.andWhere({ refundable });
        }
        if (child) {
          this.andWhere({ child });
        }
        if (adult) {
          this.andWhere({ adult });
        }
        if (rooms) {
          this.whereIn("rv.room_id", rooms);
        }
      })
      .orderBy("rv.room_id", "desc");

    const total = await this.db("room_view as rv")
      .withSchema(this.RESERVATION_SCHEMA)
      .count("rv.room_id as total")
      .where({ hotel_id })
      .andWhere(function () {
        if (key) {
          this.andWhere("rv.room_number", "like", `%${key}%`)
            .orWhere("rv.room_type", "like", `%${key}%`)
            .orWhere("rv.bed_type", "like", `%${key}%`);
        }
      })
      .andWhere(function () {
        if (availability) {
          this.andWhere({ availability });
        }
        if (refundable) {
          this.andWhere({ refundable });
        }
        if (child) {
          this.andWhere({ child });
        }
        if (adult) {
          this.andWhere({ adult });
        }
        if (rooms) {
          this.whereIn("rv.room_id", rooms);
        }
      });

    return { data, total: total[0].total };
  }

  // Get all booking room
  public async getAllBookingRoom(payload: {
    hotel_id: number;
    key?: string;
    from_date?: any;
    to_date?: any;
    availability?: string;
    refundable?: string;
    limit?: string;
    skip?: string;
    occupancy?: string;
    rooms?: number[];
  }) {
    const { limit, skip, hotel_id, to_date, from_date } = payload;

    const dtbs = this.db("room_booking_view");

    if (limit && skip) {
      dtbs.limit(parseInt(limit as string));
      dtbs.offset(parseInt(skip as string));
    }

    return await dtbs
      .select(
        "id",
        "hotel_id",
        "check_in_time",
        "check_out_time",
        "name",
        "email",
        "grand_total",
        "due",
        "user_last_balance",
        "booking_rooms"
      )
      .withSchema(this.RESERVATION_SCHEMA)
      .where((qb) => {
        qb.andWhere({ hotel_id });
        qb.andWhere({ reserved_room: 1 });
        qb.andWhereNot({ status: "left" });
        if (from_date && to_date) {
          qb.andWhereBetween("check_in_time", [from_date, to_date]);
        }
      });
  }

  // get all booking room second query avaibility with checkout
  public async getAllBookingRoomForSdQueryAvailblityWithCheckout(payload: {
    hotel_id: number;
    key?: string;
    from_date?: any;
    to_date?: any;
    availability?: string;
    refundable?: string;
    limit?: string;
    skip?: string;
    occupancy?: string;
    rooms?: number[];
  }) {
    const { limit, skip, hotel_id, to_date, from_date } = payload;

    const dtbs = this.db("room_booking_view");

    if (limit && skip) {
      dtbs.limit(parseInt(limit as string));
      dtbs.offset(parseInt(skip as string));
    }

    return await dtbs
      .select(
        "id",
        "hotel_id",
        "check_in_time",
        "check_out_time",
        "name",
        "email",
        "grand_total",
        "due",
        "user_last_balance",
        "booking_rooms"
      )
      .withSchema(this.RESERVATION_SCHEMA)
      .where((qb) => {
        qb.andWhere({ hotel_id });
        qb.andWhere({ reserved_room: 1 });
        qb.andWhereNot({ status: "left" });
        if (from_date && to_date) {
          qb.andWhere("check_out_time", ">=", to_date).andWhere(
            "check_in_time",
            "<=",
            from_date
          );
        }
      });
  }

  // Get single room
  public async getSingleRoom(hotel_id: number, room_id?: number) {
    return await this.db("room_view")
      .withSchema(this.RESERVATION_SCHEMA)
      .where({ room_id })
      .andWhere({ hotel_id });
  }

  // update hotel room
  public async updateRoom(
    roomId: number,
    hotel_id: number,
    payload: IupdateroomPayload
  ) {
    return await this.db("hotel_room")
      .withSchema(this.RESERVATION_SCHEMA)
      .update(payload)
      .where({ id: roomId })
      .andWhere({ hotel_id });
  }

  // update many room
  public async updateManyRoom(
    roomIds: number[],
    hotel_id: number,
    payload: IupdateroomPayload
  ) {
    return await this.db("hotel_room")
      .withSchema(this.RESERVATION_SCHEMA)
      .update(payload)
      .whereIn("id", roomIds)
      .andWhere({ hotel_id });
  }

  // insert room new photo
  public async insertRoomImage(payload: { photo: string; room_id: number }[]) {
    return await this.db("hotel_room_images")
      .withSchema(this.RESERVATION_SCHEMA)
      .insert(payload);
  }

  // remove room photo
  public async deleteRoomImage(payload: number[], room_id: number) {
    return await this.db("hotel_room_images")
      .withSchema(this.RESERVATION_SCHEMA)
      .delete()
      .whereIn("id", payload)
      .andWhere("room_id", room_id);
  }

  // get all Room Amenities
  public async getAllAmenities(room_id: number, rah_id: number[]) {
    return await this.db("hotel_room_amenities")
      .withSchema(this.RESERVATION_SCHEMA)
      .where({ room_id })
      .whereIn("rah_id", rah_id);
  }

  // delete hotel room amnities
  public async deleteHotelRoomAmenities(payload: number[], room_id: number) {
    return await this.db("hotel_room_amenities")
      .withSchema(this.RESERVATION_SCHEMA)
      .delete()
      .whereIn("id", payload)
      .andWhere("room_id", room_id);
  }
}
export default RoomModel;
