import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";
import { IUpdateSupplierPayload } from "../utils/interfaces/supplier.interface";


class SupplierService extends AbstractServices {
    constructor() {
        super();
    }

    //=================== Supplier service ======================//

    // create Supplier
    public async createSupplier(req: Request) {
    return await this.db.transaction(async (trx) => {
    const { res_id } = req.rest_user;
    const { name, phone } = req.body;

    // Supplier name check
    const Model = this.Model.restaurantModel();

    const {data} = await Model.getAllSupplier({name, res_id});

    if (data.length) {
    return {
        success: false,
        code: this.StatusCode.HTTP_CONFLICT,
        message: "Supplier name already exists, give another unique Supplier",
    };
    }

    await Model.createSupplier({
        res_id,
        name,
        phone
    });

    return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: "Supplier created successfully.",
    };
    });
    }

    // Get all Supplier
    public async getAllSupplier(req: Request) {
        const { res_id } = req.rest_user;
        const { limit, skip, name, status} = req.query;

        const model = this.Model.restaurantModel();

        const { data, total } = await model.getAllSupplier({
        name : name as string,
        status: status as string,
        limit: limit as string,
        skip: skip as string,
        res_id,

        });
        return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        total,
        data
        };
    }
    
    // Update Supplier
    public async updateSupplier(req: Request) {
        return await this.db.transaction(async (trx) => {
        const { res_id } = req.rest_user;
        const { id } = req.params;

        const updatePayload =
            req.body as IUpdateSupplierPayload;

        const model = this.Model.restaurantModel(trx);
        const res = await model.updateSupplier(parseInt(id), {
            res_id,
            name: updatePayload.name,
            phone: updatePayload.phone,
            status: updatePayload.status,
        });

        if (res === 1) {
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: "Supplier updated successfully",
            };
        } else {
            return {
                success: false,
                code: this.StatusCode.HTTP_NOT_FOUND,
                message: "Supplier didn't find  from this ID",
            };
        }
        });
    }

    // Delete Supplier
    public async deleteSupplier(req: Request) {
        return await this.db.transaction(async (trx) => {
        const { id } = req.params;

        const model = this.Model.restaurantModel(trx);
        const res = await model.deleteSupplier(parseInt(id));

        if (res === 1) {
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: "Supplier deleted successfully",
            };
        } else {
            return {
                success: false,
                code: this.StatusCode.HTTP_NOT_FOUND,
                message: "Supplier didn't find from this ID",
            };
        }
        });
    }

}
export default SupplierService;