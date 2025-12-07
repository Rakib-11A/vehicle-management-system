import { Router } from "express";
import auth from "../middlewares/auth.middleware";
import { USER_ROLES } from "../config/constants";
import * as userController from "../controllers/user.controller"
const router = Router();

router.get('/', auth(USER_ROLES.ADMIN), userController.getAllUsers);
router.get('/:userId', auth(), userController.getUserById);
router.put('/:userId', auth(), userController.updateUser);
router.delete('/:userId', auth(USER_ROLES.ADMIN), userController.deleteUser);
export default router;