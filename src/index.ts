import cors from "cors";
import express from "express";
import prisma from "./lib/prisma";
import routes from "./routes/index.routes";
const app = express();
var passport = require("passport");
var LocalStrategy = require("passport-local");
var JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
import argon2 from "argon2";

passport.use(
  new LocalStrategy(async function verify(
    username: string,
    password: string,
    done: any
  ) {
    const model = prisma.user;
    try {
      const user = await model.findFirst({
        where: {
          username,
        },
        include: {
          roles: {
            include: {
              permissions: true,
            },
          },
        },
      });

      if (!user) {
        return done(null, false, {
          message: "Incorrect username or password.",
        });
      }
      if (await argon2.verify(user.password, password)) {
        return done(null, {
          id: user.id,
          username: user.username,
          roles: user.roles,
        });
      } else {
        return done(null, false, {
          message: "Incorrect username or password.",
        });
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

var opts: any = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;
passport.use(
  new JwtStrategy(opts, async function (jwt_payload: any, done: any) {
    const model = prisma.user;
    try {
      const user = await model.findFirst({
        where: {
          id: Number(jwt_payload.id),
        },
        include: {
          roles: {
            include: {
              permissions: true,
            },
          },
        },
      });
      if (!user) {
        return done(null, false);
      }
      return done(null, {
        id: user.id,
        username: user.username,
        roles: user.roles,
      });
    } catch (error) {
      return done(error, false);
    }
  })
);

var opts: any = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/", routes);
app.listen(6000, () => {
  console.log("🚀 Server ready at: http://localhost:6000");
});

export default app;
