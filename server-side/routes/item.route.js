import express from "express";
import authorization from "../controllers/authorization.js";
import itemController from "../controllers/item.controller.js";

const router = express.Router();

router.get("/", authorization, itemController.getAllItems);

export default router;
