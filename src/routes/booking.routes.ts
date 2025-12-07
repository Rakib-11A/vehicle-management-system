import { Router } from "express";
import auth from "../middlewares/auth.middleware";
import * as bookingController from "../controllers/booking.controller";
import { USER_ROLES } from "../config/constants";

const router = Router();

router.post('/', auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER), bookingController.createBooking);
router.get('/', auth(), bookingController.getAllBookings);
router.put('/:bookingId', auth(), bookingController.updateBooking);

export default router;

