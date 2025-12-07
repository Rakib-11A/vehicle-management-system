import { Router } from "express";
import * as vehicleController from "../controllers/vehicle.controller";
import auth from "../middlewares/auth.middleware";
import { USER_ROLES } from "../config/constants";

const router = Router();

router.post('/',auth(USER_ROLES.ADMIN), vehicleController.createVehicle);
router.get('/', vehicleController.getAllVehicle);
router.get('/:id', vehicleController.getVehicleById);
router.put('/:id',auth(USER_ROLES.ADMIN), vehicleController.updateVehicle);
router.delete('/:id', auth(USER_ROLES.ADMIN), vehicleController.deleteVehicle);

export default router;