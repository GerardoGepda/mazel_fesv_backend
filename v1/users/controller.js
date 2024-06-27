import db from "../../models/index.cjs";
import bycrypt from "bcrypt";
import { validationResult } from 'express-validator';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } from "../../utils/httpStatusCodes.js";
import { sendEmail } from "../../mail/sendEmail.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await db.User.findAll();
    res.json({ message: "Get all users", users });
  } catch (error) {
    console.log(error);
    res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

export const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(BAD_REQUEST).json({ errors: errors.array() });
    } else {
      const newUser = await db.User.create({ ...req.body, password: bycrypt.hashSync(req.body.password, 12) });
      res.json({ message: "Usuario creado con exito", newUser });
    }
  } catch (error) {
    console.log(error);
    res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

export const sendEmailForgotPassword = async (req, res) => {
  try {
    const user = await db.User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(NOT_FOUND).json({ message: "El correo no esta conectado a un usuario" });
    }
    try {
      let code;
      // confirm not exist this active code 
      while (!code) {
        const temporalCode = Math.floor(Math.random()*1000000).toString().padStart(6, '0');
        const resResetPassword = await db.ResetPassword.findOne({ where: { code: temporalCode, state: 1} });
        if(!resResetPassword){
          code = temporalCode;
        }
      }
      // disabled codes for User
      await db.ResetPassword.update({ state:0 },{ where:{ userId: user.id } });
      // create code in table Reset password
      await db.ResetPassword.create({
        code,
        state: 1,
        userId: user.id,
      });
      // send Email to user email address
      await sendEmail({
          from: process.env.EMAIL, 
          to: `${req.body.email}`,
          subject: `RECUPERACIÓN DE CONTRASEÑA`, 
          text: "",
          templateLayoutName: "layoutTemplate",
          templateData: {
              code:`${code}`.toUpperCase(),
          }
      });
      res.json({ message: "Enviando correo de recuperación" , code });
    } catch (error) {
      res.json({"ERROR":error}).status(INTERNAL_SERVER_ERROR);
    }

  } catch (error) {
    console.log(error);
    res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

export const confirmCode = async (req, res) => {
  try {
    const codeBool = await db.ResetPassword.count({ where: { code: req.params.code, state: 1 } });
    if(codeBool>0){
      return res.json({ message: "Codigo valido" , exist: true });
    }
    return res.status(NOT_FOUND).json({ message: "Codigo invalido" , exist:false });
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { code } = req.params;
    const { password } = req.body;
    const user = await db.ResetPassword.findOne({ where: { code, state :1 } });
    if(!user){
      return res.status(NOT_FOUND).json({ message: "El codigo de recuperación no es valido"});
    }
    const resUser = await db.User.update({ password: bycrypt.hashSync(password, 12)},{ where: { id: user.userId } });
    if(resUser){
      await db.ResetPassword.update({ state: 0 }, { where: { userId: user.userId } });
      return res.json({ message: "Contraseña actualizada" , success: true });
    }
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Ocurrio un problema contacta con mantenimiento" });
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};