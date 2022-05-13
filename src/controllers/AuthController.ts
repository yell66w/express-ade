import { Request, Response } from "express";
import { validationResult } from "express-validator";
import prisma from "../lib/prisma";
const argon2 = require("argon2");
const model = prisma.user;
class AuthController {
  static signIn = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }
    const { username, password } = req.body;
    try {
      const user = await model.findFirst({
        where: {
          username,
        },
      });
      if (await argon2.verify(user?.password, password)) {
        return res.status(200).send("signed in");
      } else {
        return res.status(200).send("Incorrect username/password.");
      }
    } catch (e: any) {
      return res.status(400).send(e.message);
    }
  };
}
export default AuthController;
