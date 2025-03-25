import { Router } from "express";
import { getDevices, getDevicesId } from "../controllers/devices.controller.js"

const router = Router();
router.get("/devices", getDevices);
router.get("/devices/:id", getDevicesId);

export default router;