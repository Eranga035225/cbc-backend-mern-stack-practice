import express from "express";
import { createUser, loginUser } from "../controllers/userController.js";
import { loginWithGoogle } from "../controllers/userController.js";
import { sendOTP } from "../controllers/userController.js";





const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.post("/login/google", loginWithGoogle);
userRouter.post("/send-otp", sendOTP);
export default userRouter;