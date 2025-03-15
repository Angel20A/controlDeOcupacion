import { Router } from "express";
import { loginUsuario, logoutUsuario, tokenValidation, getUsuario, getUsuarioId, createUsuario, updateUsuario, deleteUsuario } from "../controllers/user.controller.js";
import { validateLoginUser,validateCreateUser, /*validateUpdateUser,*/ validateIdUser } from "../validators/user.validators.js";
import { validateToken, destroyToken } from "../token.js";

const router = Router();

router.post("/loginUsuario", validateLoginUser, loginUsuario);

router.get("/logoutUsuario", destroyToken, logoutUsuario)

router.get("/tokenValidation", validateToken, tokenValidation);

router.get("/usuario", getUsuario);

router.get("/usuario/:id", validateIdUser, getUsuarioId);

router.post("/usuario", validateCreateUser, createUsuario);

router.patch("/usuario/:id", /*validateUpdateUser,*/ updateUsuario);

router.delete("/usuario/:id", validateIdUser, deleteUsuario);

export default router;
