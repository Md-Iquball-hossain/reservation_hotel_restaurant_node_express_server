import { Request} from "express";
import AbstractServices from "../../abstarcts/abstract.service";

export class ClientRoomService extends AbstractServices {
    constructor() {
        super();
    }

    // get All Hotel Room
    public async getAllHotelRoom(req: Request) {

    const { key, availability, refundable, limit, skip, adult, child } = req.query;

    const { id: hotel_id } = req.web_token;

    // model
    const model = this.Model.clientModel();

    const { data, total } = await model.getAllRoom({
        key: key as string,
        availability: availability as string,
        refundable: refundable as string,
        adult: adult as string,
        child: child as string,
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

    // get all available and unavailable room
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

        const { id: hotel_id } = req.web_token;

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

        // getting all room booking
        const getAllBookingRoom = await model.getAllBookingRoom({
        from_date: from_date as string,
        to_date: to_date as string,
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

        available_status: number;
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

    // now find out all available room
    if (allRoom.length) {
    for (let i = 0; i < allRoom.length; i++) {
        let found = false;

        for (let j = 0; j < allBookingRooms.length; j++) {
        if (allRoom[i].id == allBookingRooms[j].room_id) {
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

    const { id: hotel_id } = req.web_token;

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

    const { id: hotel_id } = req.web_token;

    const model = this.Model.clientModel();

    const data = await model.getSingleRoom(
        hotel_id,
        parseInt(room_id)
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
        data : data[0],
    };

    }

    // get All Hotel room images
    public async getAllHotelRoomImages(req: Request) {

    const { limit, skip} = req.query;

    const { id: hotel_id } = req.web_token;

    // model
    const model = this.Model.clientModel();

    const {data} = await model.getHotelRoomImages({
        limit: limit as string,
        skip: skip as string,
        hotel_id,
    });

    return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        data,
        };
    }

    }
export default ClientRoomService;
