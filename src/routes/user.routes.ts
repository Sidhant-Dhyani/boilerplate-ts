import { Router } from "express";
import { createUser, getMe, getUsers } from "../controllers/user.controller";
import { authorize, protect } from "../middleware/auth";

const router = Router();

router.use(protect);

router.get("/me", getMe);
router.get("/", authorize("admin"), getUsers);
router.post("/", authorize("admin"), createUser);

export default router;
