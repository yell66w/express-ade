import { Router } from "express";
import users from "./users.routes";
import auth from "./auth.routes";
import passport from "passport";
const routes = Router();
routes.use("/auth", auth);
routes.use("/users", passport.authenticate("jwt", { session: false }), users);
export default routes;
