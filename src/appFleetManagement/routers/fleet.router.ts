import AbstractRouter from "../../abstarcts/abstract.router";
import DriverRouter from "./driver.router";
import FuelRouter from "./fuel.router";
import MaintenanceRouter from "./maintenance.router";
import OwnerRouter from "./owner.router";
import ParkingRouter from "./parking.router";
import TripRouter from "./trip.router";
import VehicleRouter from "./vehicle.router";

    class FleetRouter extends AbstractRouter {
        constructor() {
        super();
        this.callRouter();
    }

    private callRouter() {

    // driver
    this.router.use(
        "/owner", 
        new OwnerRouter().router);

    // driver
    this.router.use(
        "/driver", 
        new DriverRouter().router);

    // vehicle
    this.router.use(
        "/vehicle", 
        new VehicleRouter().router);

    // parking
    this.router.use(
        "/parking", 
        new ParkingRouter().router);

    // maintenance
    this.router.use(
        "/maintenance", 
        new MaintenanceRouter().router);

    // fuel
    this.router.use(
        "/fuel", 
        new FuelRouter().router);

    // trips
    this.router.use(
        "/trip", 
        new TripRouter().router);

    }
}
export default FleetRouter;
