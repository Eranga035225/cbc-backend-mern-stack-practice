import express from "express";
import { addReview, getAllReviews } from "../controllers/reviewController.js";
import { auth } from "../middleware/auth.js";

const reviewRouter = express.Router();

reviewRouter.post("/add-review", auth, addReview);
reviewRouter.get("/", auth, getAllReviews);

export default reviewRouter;
