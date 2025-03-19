import { Router } from "express";
import { getDevices } from "../controllers/devices.controller.js"

const router = Router();
router.get("/devices", getDevices);

export default router;