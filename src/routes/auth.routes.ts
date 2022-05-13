import { Router } from "express";
import { body } from "express-validator";
import AuthController from "../controllers/AuthController";
import UserController from "../controllers/UserController";
const router = Router();

router.post(
  "/sign-in",
  body("username").isString().notEmpty(),
  body("password").isString().notEmpty(),
  AuthController.signIn
);

router.post(
  "/sign-up",
  body("username").isString().notEmpty(),
  body("email").isString().isEmail().notEmpty(),
  body("password").isString().notEmpty(),
  body("fname").isString().notEmpty(),
  body("lname").isString().notEmpty(),
  body("phone").isString().notEmpty(),
  body("address").isString().notEmpty(),
  body("postcode").isString().notEmpty(),
  body("phone").isString().notEmpty(),
  UserController.create
);
export default router;
