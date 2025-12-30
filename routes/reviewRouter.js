import express from "express";
import { addReview, getAllReviews } from "../controllers/reviewController.js";


const reviewRouter = express.Router()


reviewRouter.post("/add-review",addReview)
reviewRouter.get("/",getAllReviews )



export default reviewRouter;