import { Router } from "express";
import users from "./users.routes";
import auth from "./auth.routes";
const routes = Router();
routes.use("/users", users);
routes.use("/auth", auth);
export default routes;
