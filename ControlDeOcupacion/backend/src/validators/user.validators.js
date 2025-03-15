import { check, param } from "express-validator";
import { validateResult } from "../helpers/validationHelper.js";


export const validateLoginUser = [
    check('usuario')
        .exists()
        .isEmail().withMessage("El usuario debe ser un correo electronico")
        .not().isEmpty().withMessage("El campo no debe estar vacío"),
    check('contrasena')
        .exists()
        .not().isEmpty().withMessage("El campo no debe estar vacío"),
    (req, res, next) => {
        validateResult(req, res, next); //valida si hay errores en la request
    }
]

export const validateIdUser = [
    param('id')
        .exists()
        .isNumeric().withMessage("El campo debe ser un número")
        .not().isEmpty().withMessage("El campo no debe estar vacío"),
    (req, res, next) => {
        validateResult(req, res, next); //valida si hay errores en la request
    }
]

export const validateCreateUser = [
    check('nombre')
        .exists()
        .not().isEmpty().withMessage("El campo no debe estar vacío"),
    check('usuario')
        .exists()
        .isEmail().withMessage("El usuario debe ser un correo electronico")
        .not().isEmpty().withMessage("El campo no debe estar vacío"),
    check('contrasena')
        .exists()
        .not().isEmpty().withMessage("El campo no debe estar vacío")
        .isLength({ min: 8, max:20}).withMessage("La contraseña debe tener entre 8 y 20 caracteres"),
    (req, res, next) => {
        validateResult(req, res, next); //valida si hay errores en la request
    }
];
/*
export const validateUpdateUser = [
    param('id')
        .exists()
        .isNumeric().withMessage("El campo debe ser un número")
        .not().isEmpty().withMessage("El campo no debe estar vacío"),
    check('nombre').if(check('nombre').exists()), //si el nombre existe
    check('usuario').if(check('usuario').exists()) //si el usuario existe
        .isEmail().withMessage("El usuario debe ser un correo electronico"),
    check('contrasena').if(check('contrasena').exists()) //si la contraseña existe
        .isLength({ min: 8, max:20}).withMessage("La contraseña debe tener entre 8 y 20 caracteres"),
    (req, res, next) => {
        validateResult(req, res, next); //valida si hay errores en la request
    }
];*/