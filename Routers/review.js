import express from "express"
import { createReview, getAllReviews } from "../Controllers/reviewController.js"
import {authenticate, restrict} from "../auth/verifyToken.js"


const router = express({mergeParams:true})
//doctors/doctor/reviews
router.route('/').get(getAllReviews).post(authenticate, restrict(["patient"]), createReview)

export default router