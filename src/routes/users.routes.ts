import { Router } from "express";
import { body } from "express-validator";
import UserController from "../controllers/UserController";
import checkRole from "../middlewares/checkRole";
const router = Router();
router.get("/", UserController.getAll);
router.get("/:id", UserController.getOne);
router.post(
  "/",
  checkRole("admin"),
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
router.put(
  "/:id",
  checkRole("admin"),
  body("username").isString().optional(),
  body("email").isString().isEmail().optional(),
  body("password").isString().optional(),
  body("fname").isString().optional(),
  body("lname").isString().optional(),
  body("phone").isString().optional(),
  body("address").isString().optional(),
  body("postcode").isString().optional(),
  body("phone").isString().optional(),
  UserController.update
);
router.delete(
  "/multiple",
  checkRole("admin"),

  body("*.*").isInt().optional().toInt(),
  UserController.deleteMany
);
router.delete(
  "/:id",
  checkRole("admin"),

  UserController.delete
);
export default router;
