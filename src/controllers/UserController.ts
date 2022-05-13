import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import prisma from "../lib/prisma";
const model = prisma.user;
const argon2 = require("argon2");
class UserController {
  static getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await model.findMany();
      return res.status(200).send(data);
    } catch (error: any) {
      return res.status(404).send(error.message);
    }
  };
  static getOne = async (req: Request, res: Response) => {
    try {
      const data = await model.findFirst({
        where: {
          id: Number(req.params.id),
        },
      });
      return res.status(200).send(data);
    } catch (error: any) {
      return res.status(404).send(error.message);
    }
  };

  static create = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }
    const { password } = req.body;
    const hash = await argon2.hash(password);
    try {
      const data = await model.create({
        data: {
          ...req.body,
          password: hash,
        },
      });
      return res.status(200).send(data);
    } catch (e: any) {
      return res.status(400).send(e.message);
    }
  };
  static update = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const data = await model.update({
        where: {
          id: Number(req.params.id),
        },
        data: req.body,
      });
      return res.status(200).json(data);
    } catch (e: any) {
      return res.status(400).send(e.message);
    }
  };

  static delete = async (req: Request, res: Response) => {
    try {
      const data = await model.delete({
        where: {
          id: Number(req.params.id),
        },
      });
      return res.status(200).send(data);
    } catch (error: any) {
      return res.status(400).send(error.message);
    }
  };
  static deleteMany = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await model.deleteMany({
        where: {
          id: {
            in: req.body,
          },
        },
      });
      return res.status(200).send(data);
    } catch (error: any) {
      return res.status(404).send(error.message);
    }
  };
}
export default UserController;
