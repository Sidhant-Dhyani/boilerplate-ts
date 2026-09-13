import { Router } from "express";
import { userController } from "../../controllers";
import { auth, protect } from "../../middleware/auth";
import { UserRoleEnum } from "../../enums";

const router = Router();

router.use(protect);

router.get("/me", userController.getMe);
router.get("/", auth(UserRoleEnum.admin), userController.getUsers);
router.post("/", auth(), userController.createUser);

export default router;
