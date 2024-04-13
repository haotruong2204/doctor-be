import {updateUser, deleteUser, getAllUser, getSingleUser, getMyAppointment, getUserProfile} from "../Controllers/userController.js"
import express from "express"

import { authenticate , restrict} from "../auth/verifyToken.js";
const router = express.Router();
router.get("/:id",authenticate, restrict(["patient"]),getSingleUser)
router.get("/",authenticate, restrict(["admin"]), getAllUser)
router.put("/:id",authenticate, restrict(["patient"]), updateUser)
router.get("/profile/me",authenticate, restrict(["patient"]), getUserProfile)
router.get("/appointments/my-appointments",authenticate, restrict(["patient"]), getMyAppointment)

export default router;