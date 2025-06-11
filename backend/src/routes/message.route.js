import express from "express";
const router=express.Router();
import {getUsersForSidebar} from "../controllers/message.controller.js";

import { protectRoute } from "../middleware/auth.middleware.js";

import {getMessages} from "../controllers/message.controller.js";
import {sendMessage} from "../controllers/message.controller.js";

router.get("/users",protectRoute,getUsersForSidebar)
router.get("/:id",protectRoute,getMessages)

router.use("/send/:id",protectRoute,sendMessage)

export default router;