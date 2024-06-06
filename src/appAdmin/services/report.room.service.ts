import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";

export class RoomReportService extends AbstractServices {
    constructor() {
        super();
    }

    public async getRoomReport(req: Request) {
    const {
        limit,
        skip,
        from_date,
        to_date,
        room_number,
    } = req.query;

    const { hotel_id } = req.hotel_admin;

    // model
    const model = this.Model.reportModel();

    const { data: allRoom, total } = await model.getAllRoom({
        limit: limit as string,
        skip: skip as string,
        room_number: room_number as string,
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

        // Count of total available rooms
        let totalAvailableRoomCount = 0;

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
            totalAvailableRoomCount++;
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
        total_available_room: totalAvailableRoomCount,
        data: availableRoomForBooking,
    };
}

}
export default RoomReportService;