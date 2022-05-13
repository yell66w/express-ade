import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import passport from "passport";
import prisma from "../lib/prisma";
const model = prisma.user;
class AuthController {
  static signIn = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({
          message: "Oh no, something is not right!",
          user: user,
        });
      }
      req.login(user, { session: false }, (err) => {
        if (err) {
          return res.send(err);
        }
        if (process.env.JWT_SECRET) {
          const token = jwt.sign(
            {
              id: user.id,
              username: user.username,
              roles: user.roles,
            },
            process.env.JWT_SECRET
          );
          return res.json({ user, token });
        }
        return res.status(401).send({
          message: "Something went wrong! Please contact the administrator.",
        });
      });
    })(req, res);
  };
}
export default AuthController;
