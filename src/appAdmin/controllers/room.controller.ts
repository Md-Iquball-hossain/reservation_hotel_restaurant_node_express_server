import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import RoomService from "../services/room.service";
import RoomValidator from "../utlis/validator/Room.validator";

class RoomController extends AbstractController {
  private roomService = new RoomService();
  private roomvalidator = new RoomValidator();
  constructor() {
    super();
  }
  // Create room
  public createroom = this.asyncWrapper.wrap(
    { bodySchema: this.roomvalidator.createRoomValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.roomService.createRoom(req);
      if (data.success) {
        res.status(code).json(data);
      } else {
        this.error(data.message, code);
      }
    }
  );

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
      const { code, ...data } = await this.roomService.getSingleHotelRoom(req);
      res.status(code).json(data);
    }
  );

  // update single hotel room
  public updateHotelRoom = this.asyncWrapper.wrap(
    { bodySchema: this.roomvalidator.updateHotelRoomValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.roomService.updateroom(req);
      res.status(code).json(data);
    }
  );
}
export default RoomController;
