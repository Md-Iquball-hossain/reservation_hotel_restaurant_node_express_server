import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import RoomValidator from "../../appAdmin/utlis/validator/Room.validator";
import ClientRoomService from "../services/room.service";

class ClientRoomController extends AbstractController {
    private roomService=new ClientRoomService();
    private roomvalidator = new RoomValidator();
    constructor() {
        super();
}

    // get all hotel room with filter
    public getAllHotelRoom = this.asyncWrapper.wrap(
        { querySchema: this.roomvalidator.getAllHotelRoomQueryValidator },
        async (req: Request, res: Response) => {
        const { code, ...data } = await this.roomService.getAllHotelRoom(req);
        res.status(code).json(data);
        }
    );

    // get all hotel available and unavailable room
    public getAllAvailableAndUnavailableRoom = this.asyncWrapper.wrap(
        { querySchema: this.roomvalidator.getAllHotelRoomQueryValidator },
        async (req: Request, res: Response) => {
        const { code, ...data } =
            await this.roomService.getAllAvailableAndUnavailableRoom(req);
        res.status(code).json(data);
        }
    );

    // get all available room
    public getAllAvailableRoom = this.asyncWrapper.wrap(
        { querySchema: this.roomvalidator.getAllHotelRoomQueryValidator },
        async (req: Request, res: Response) => {
        const { code, ...data } = await this.roomService.getAllAvailableRoom(req);
        res.status(code).json(data);
        }
    );


    // get single hotel room
    public getSingleHotelRoom = this.asyncWrapper.wrap(
        { paramSchema: this.commonValidator.singleParamValidator("room_id") },
        async (req: Request, res: Response) => {
        const { code, ...data } =
            await this.roomService.getSingleHotelRoom(req);
        res.status(code).json(data);
        }
    );

    // get all hotel room with filter
    public getAllHotelRoomImages = this.asyncWrapper.wrap(
        null,
        async (req: Request, res: Response) => {
        const { code, ...data } = await this.roomService.getAllHotelRoomImages(req);
        res.status(code).json(data);
        }
    );

}
export default ClientRoomController;