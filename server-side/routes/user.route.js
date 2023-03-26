import express from "express";
import userController from "../controllers/user.controller.js";

const router = express.Router();

router.post("/signup", userController.register);
router.post("/login", userController.login);
router.post("/login/google", userController.googleAuthentication);
router.post("/validate", userController.validateAccount);
router.post("/refresh", userController.refreshAccessToken);
router.post("/logout", userController.logout);
router.post("/forgetPassword", userController.forgetPassowrd);
router.post("/resetPassword", userController.resetPassword);

export default router;
