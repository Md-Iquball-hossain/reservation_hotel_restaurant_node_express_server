import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";

class HotelService extends AbstractServices {
  constructor() {
    super();
  }

  // get my hotel
  public async getMyHotel(req: Request) {
    const { hotel_id } = req.hotel_admin;

    const checkHotel = await this.Model.HotelModel().getSingleHotel({
      id: hotel_id,
    });

    if (!checkHotel.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data: checkHotel[0],
    };
  }

  // update my hotel
  public async updateMyHotel(req: Request) {
    const { hotel_id } = req.hotel_admin;

    const model = this.Model.HotelModel();
    const checkHotel = await model.getSingleHotel({
      id: hotel_id,
    });

    if (!checkHotel.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }

    const files = (req.files as Express.Multer.File[]) || [];

    const hotelImages: { hotel_id: number; photo: string }[] = [];

    const { remove_photo, hotel_amnities, remove_amnities, ...rest } = req.body;

    if (files.length) {
      files.forEach((element) => {
        if (element.fieldname === "logo") {
          rest["logo"] = element.filename;
        } else {
          hotelImages.push({
            hotel_id: hotel_id,
            photo: element.filename,
          });
        }
      });
    }
    const { email } = checkHotel[0];
    // update hotel user
    if (Object.keys(rest).length) {
      await model.updateHotel(rest, { email });
    }

    // insert photo
    if (hotelImages.length) {
      await model.insertHotelImage(hotelImages);
    }

    const rmv_photo = remove_photo ? JSON.parse(remove_photo) : [];

    // delete hotel image
    if (rmv_photo.length) {
      await model.deleteHotelImage(rmv_photo, hotel_id);
    }

    const hotel_amnities_parse = hotel_amnities
      ? JSON.parse(hotel_amnities)
      : [];

    // insert hotel amnities
    if (hotel_amnities_parse.length) {
      const hotelAmnitiesPayload = hotel_amnities_parse.map((item: string) => {
        return {
          hotel_id,
          name: item,
        };
      });
      await model.insertHotelAmnities(hotelAmnitiesPayload);
    }

    const remove_amnities_parse = remove_amnities
      ? JSON.parse(remove_amnities)
      : [];

    // delete hotel amnities
    if (remove_amnities_parse.length) {
      await model.deleteHotelAmnities(remove_amnities_parse, hotel_id);
    }

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: "Update successfully",
    };
  }
}

export default HotelService;
