
    import { Request } from "express";
    import AbstractServices from "../../abstarcts/abstract.service";
    import { IHallImage} from "../utlis/interfaces/hall.interface";
    import HallModel from "../../models/hallModel/hallModel";

        export class HallService extends AbstractServices {
        constructor() {
        super();
        }

        // create room
        public async createHall(req: Request) {
            return await this.db.transaction(async (trx) => {
            const { hall_amenities,hall_status, ...rest } = req.body;
            const { hotel_id } = req.hotel_admin;

        // Similar hall name check
        const hallModel = this.Model.hallModel();
        const check = await hallModel.getAllHallName(
            req.body.name,
            hotel_id);

        if (check) {
        return {
            success: false,
            code: this.StatusCode.HTTP_CONFLICT,
            message:
            "Hall Name already exists, give another unique name",
        };
        }

        // model
        const model = new HallModel(trx);

        // insert hall
        const res = await model.createHall({ ...rest, hall_status, hotel_id });

        const hall_id = res[0];

        // step hall amenities
        const hotel_hall_amenities_parse = hall_amenities
        ? JSON.parse(hall_amenities)
        : [];

        // insert hall amenities
        if (hotel_hall_amenities_parse.length) {
        const hotelRoomAmenitiesPayload = hotel_hall_amenities_parse.map(
            (id: number) => {
            return {
                hall_id,
                hotel_id,
                amenity_id: id,
            };
            }
        );
        await model.insertHallRoomAmenities(hotelRoomAmenitiesPayload);
        }

        const files = (req.files as Express.Multer.File[]) || [];

        // insert hall image
        if (files.length) {
        const hallImages: IHallImage[] = [];
        files.forEach((element) => {
            hallImages.push({
            hall_id,
            hotel_id,
            photo: element.filename,
            });
        });
        await model.createHallImage(hallImages);
        }

        return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: "Hall created successfully.",
            };
        });
        }

    // get All Hall
    public async getAllHall(req: Request) {
    const { key, limit, hall_status, skip } = req.query;

    const { hotel_id } = req.hotel_admin;
    // model
    const model = this.Model.hallModel();

    const { data , total } = await model.getAllHall({
        key: key as string,
        hall_status: hall_status as string,
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

    public async getAllAvailableAndUnavailableHall(req: Request) {
        const {
            limit,
            skip,
            start_time,
            end_time,
            event_date
        } = req.query;
    
    const { hotel_id } = req.hotel_admin;

    // model
    const model = this.Model.hallModel();

    const { data: allHall, total } = await model.getAllHall({
        limit: limit as string,
        skip: skip as string,
        hotel_id,
    });

    // getting all hall booking
    const getAllBookingHall = await model.getAllBookingHall({
        start_time: start_time as string,
        end_time: end_time as string,
        event_date: event_date as string,
        hotel_id,
    });

    const getAllBookingHallSdQuery =
        await model.getAllBookingHallForSdQueryAvailblityWithCheckout({
            start_time: start_time as string,
            end_time: end_time as string,
            event_date: event_date as string,
            hotel_id,
        });

    const availableHallForBooking: {
            hall_id: number;
            hall_name: string;
            rate_per_hour: number;
            hall_size: number;
            hall_status: string;
            capacity: number;
            location: string;
            guest_name?: string;
            guest_email?: string;
            start_time?: string;
            end_time?: string;
            event_date?: string;
            grand_total?: string;
            due_amount?: string;
            available_status: number;
            user_last_balance?: string;
            hall_amenities: [];
            hall_images: [];
        }[] = [];

    const allBookingHalls: {
        id: number;
        hall_id: number;
        start_time: string;
        end_time: string;
        event_date: string;
        name: string;
        email: string;
        grand_total: string;
        due: string;
        user_last_balance: string;
    }[] = [];

    if (getAllBookingHall?.length) {
        for (let i = 0; i < getAllBookingHall?.length; i++) {
            const booking_halls = getAllBookingHall[i]?.booking_halls;
            for (let j = 0; j < booking_halls?.length; j++) {
                allBookingHalls.push({
                    id: booking_halls[j].id,
                    hall_id: booking_halls[j].hall_id,
                    start_time: getAllBookingHall[i].start_time,
                    end_time: getAllBookingHall[i].end_time,
                    event_date: getAllBookingHall[i].event_date,
                    name: getAllBookingHall[i].name,
                    email: getAllBookingHall[i].email,
                    grand_total: getAllBookingHall[i].grand_total,
                    due: getAllBookingHall[i].due,
                    user_last_balance: getAllBookingHall[i].user_last_balance,
                });
            }
        }
    }

    if (getAllBookingHallSdQuery.length) {
        for (let i = 0; i < getAllBookingHallSdQuery?.length; i++) {
            const booking_halls = getAllBookingHallSdQuery[i]?.booking_halls;
            for (let j = 0; j < booking_halls?.length; j++) {
                allBookingHalls.push({
                    id: booking_halls[j].id,
                    hall_id: booking_halls[j].hall_id,
                    start_time: getAllBookingHallSdQuery[i].start_time,
                    end_time: getAllBookingHallSdQuery[i].end_time,
                    event_date: getAllBookingHallSdQuery[i].event_date,
                    name: getAllBookingHallSdQuery[i].name,
                    email: getAllBookingHallSdQuery[i].email,
                    grand_total: getAllBookingHallSdQuery[i].grand_total,
                    due: getAllBookingHallSdQuery[i].due,
                    user_last_balance: getAllBookingHallSdQuery[i].user_last_balance,
                });
            }
        }
    }

    if (allHall?.length) {
        for (let i = 0; i < allHall.length; i++) {
            let found = false;

            for (let j = 0; j < allBookingHalls?.length; j++) {
                if (allHall[i].id == allBookingHalls[j]?.hall_id) {
                    found = true;

                    availableHallForBooking.push({
                        hall_id: allHall[i].id,
                        hall_name: allHall[i].name,
                        rate_per_hour: allHall[i].rate_per_hour,
                        hall_status: allHall[i].hall_status,
                        hall_size: allHall[i].hall_size,
                        capacity: allHall[i].capacity,
                        location: allHall[i].location,
                        available_status: 0,
                        guest_name: allBookingHalls[j]?.name || "",
                        guest_email: allBookingHalls[j]?.email || "",
                        start_time: allBookingHalls[j]?.start_time || "",
                        end_time: allBookingHalls[j]?.end_time || "",
                        event_date: allBookingHalls[j]?.event_date || "",
                        grand_total: allBookingHalls[j]?.grand_total || "",
                        due_amount: allBookingHalls[j]?.due || "",
                        user_last_balance: allBookingHalls[j]?.user_last_balance || "",
                        hall_amenities: allHall[i].hall_amenities,
                        hall_images: allHall[i].hall_images,
                    });
                    break;
                }
            }

            if (!found) {
                availableHallForBooking.push({
                    hall_id: allHall[i].id,
                    hall_name: allHall[i].name,
                    rate_per_hour: allHall[i].rate_per_hour,
                    hall_status: allHall[i].hall_status,
                    hall_size: allHall[i].hall_size,
                    capacity: allHall[i].capacity,
                    location: allHall[i].location,
                    available_status: 1,
                    hall_amenities: allHall[i].hall_amenities,
                    hall_images: allHall[i].hall_images,
                });
            }
        }
    }

    return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        total,
        data: availableHallForBooking,
    };
    }
    

    // get All Hall
    public async getAllAvailableHall(req: Request) {
        const {
            hall_status,
            limit,
            skip,
            start_time,
            end_time,
            event_date
        } = req.query;
    
    const { hotel_id } = req.hotel_admin;
    const model = this.Model.hallModel();

    const { data: allHall, total } = await model.getAllHall({
        limit: limit as string,
        skip: skip as string,
        hotel_id,
    });

    const startTimeOnly = start_time as string;
    const endTimeOnly = end_time as string;

    // getting all hall booking
    const getAllBookingHall = await model.getAllBookingHall({
        start_time: startTimeOnly,
        end_time: endTimeOnly,
        hotel_id,
        event_date: event_date as string,
    });

    const getAllBookingHallSdQuery =
        await model.getAllBookingHallForSdQueryAvailblityWithCheckout({
            start_time: startTimeOnly,
            end_time: endTimeOnly,
            hotel_id,
            event_date: event_date as string,
        });

    const availableHallForBooking = [];

    const allBookingHalls = [];

    if (getAllBookingHall.length) {
        for (let i = 0; i < getAllBookingHall.length; i++) {
            const booking_halls = getAllBookingHall[i]?.booking_halls;
            for (let j = 0; j < booking_halls.length; j++) {
                allBookingHalls.push({
                    id: booking_halls[j].id,
                    hall_id: booking_halls[j].hall_id,
                });
            }
        }
    }

    if (getAllBookingHallSdQuery.length) {
        for (let i = 0; i < getAllBookingHallSdQuery?.length; i++) {
            const booking_halls = getAllBookingHallSdQuery[i]?.booking_halls;
            for (let j = 0; j < booking_halls?.length; j++) {
                allBookingHalls.push({
                    id: booking_halls[j].id,
                    hall_id: booking_halls[j].hall_id,
                });
            }
        }
    }

    if (allHall.length) {
        for (let i = 0; i < allHall.length; i++) {
            let found = false;

            for (let j = 0; j < allBookingHalls.length; j++) {
                if (allHall[i].id == allBookingHalls[j].hall_id) {
                    found = true;
                    break;
                }
            }

            if (!found) {
                availableHallForBooking.push({
                    hall_id: allHall[i].id,
                    hall_name: allHall[i].name,
                    rate_per_hour: allHall[i].rate_per_hour,
                    hall_status: allHall[i].hall_status,
                    hall_size: allHall[i].hall_size,
                    capacity: allHall[i].capacity,
                    location: allHall[i].location,
                    hall_amenities: allHall[i].hall_amenities,
                    hall_images: allHall[i].hall_images,
                });
            }
        }
    }

    return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        data: availableHallForBooking,
    };
    }

    // get Single Hall 
    public async getSingleHall(req: Request) {
        const { hall_id } = req.params;

    const model = this.Model.hallModel();
    const data = await model.getSingleHall(req.hotel_admin.hotel_id,parseInt(hall_id)
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
        data,
    };
    }

    // update hotel Hall
    public async updateHall(req: Request) {
        return await this.db.transaction(async (trx) => {
        const { hotel_id } = req.hotel_admin;
        const { hall_id } = req.params;
        const { remove_photos, hall_amenities, remove_amenities, ...rest } = req.body;

        const model = this.Model.hallModel(trx);

    // Update Hall details
    if (Object.keys(rest).length) {
        await model.updateHall(parseInt(hall_id), hotel_id, { ...rest });
        }

    // Insert Hall images
    const files = (req.files as Express.Multer.File[]) || [];
        if (files.length) {
        const hallImages: IHallImage[] = files.map((element) => ({
            hall_id: parseInt(hall_id),
            hotel_id,
            photo: element.filename,
        }));
        await model.insertHallImage(hallImages);
        }

    // Remove Hall images
    const rmv_photo = remove_photos ? JSON.parse(remove_photos) : [];
        if (rmv_photo.length) {
        await model.deleteHallImage(rmv_photo, Number(hall_id));
        }

    // Update hall amenities
    const hall_room_amenities_parse = hall_amenities
    ? JSON.parse(hall_amenities)
    : [];

    // Check if amenities already exist
    const hallModel = this.Model.hallModel(trx);

    const existingAmenities = await hallModel.getAllHallAmenities(
    parseInt(hall_id),
    hotel_id,
    hall_room_amenities_parse
    );

    let distinctAminities = [];

    if (existingAmenities.length) {
    for (let i = 0; i < hall_room_amenities_parse.length; i++) {
    let found = false;
    for (let j = 0; j < existingAmenities.length; j++) {
        if (hall_room_amenities_parse[i] == existingAmenities[j].amenity_id) {
        found = true;
        break;
        }
    }
    if (!found) {
        distinctAminities.push(hall_room_amenities_parse[i]);
    }
    }
    } else {
    distinctAminities = hall_room_amenities_parse;
    }

    if (distinctAminities.length) {
    const hotelRoomAmenitiesPayload = distinctAminities.map(
    (id: number) => ({
        hall_id: parseInt(hall_id),
        hotel_id,
        amenity_id: id,
    })
    );

    await model.insertHallRoomAmenities(hotelRoomAmenitiesPayload);
    }

    // remove hall amenities

    const rmv_amenities = remove_amenities? JSON.parse(remove_amenities): [];

    if (rmv_amenities.length) {
        await model.deleteHallAmenities(rmv_amenities, Number(hall_id));
    }

    return {
    success: true,
    code: this.StatusCode.HTTP_OK,
    message: "Hall updated successfully",
    };
    });
    }

    }
    export default HallService;