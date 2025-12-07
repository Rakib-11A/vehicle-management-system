import { Router } from "express";
import authRoutes from './auth.routes'
import vehicleRoutes from './vehicle.routes';
import userRoutes from './user.routes';
import bookingRoutes from './booking.routes';
const router = Router();

router.use('/auth', authRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/users', userRoutes);
router.use('/bookings', bookingRoutes);

export default router;