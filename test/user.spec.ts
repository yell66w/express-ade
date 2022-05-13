import "mocha";
var chaitest = require("chai");
let chaiHttp = require("chai-http");
var assert = require("assert");
import argon2 from "argon2";
let should = chaitest.should();
import prisma from "../src/lib/prisma";
import server from "../src/index";
const model = prisma.user;
chaitest.use(chaiHttp);
const expect = chaitest.expect;
process.env.NODE_ENV = "test";
import jwt from "jsonwebtoken";
process.env.NODE_ENV = "test";
import { password } from "./auth.spec";
describe("Users API", () => {
  beforeEach(async () => {
    await model.deleteMany({});
  });

  it("should register, login, check token, and test api", async () => {
    await prisma.user.create({
      data: {
        username: "admin",
        fname: "Admin",
        lname: "Test",
        address: "test address",
        password,
        phone: "0999-999-999",
        postcode: "4444",
        email: "admin@gmail.com",
        roles: {
          connectOrCreate: {
            create: {
              name: "admin",
              permissions: {
                connectOrCreate: {
                  create: {
                    name: "crud-access",
                  },
                  where: {
                    name: "crud-access",
                  },
                },
              },
            },
            where: {
              name: "admin",
            },
          },
        },
      },
    });
    const res = await chaitest
      .request(server)
      .post("/auth/sign-in")
      .send({ username: "admin", password: "password" });
    assert.equal(res.status, 200);
    res.body.should.have.property("token");
    var token = res.body.token;

    describe("/GET user", () => {
      it("it should GET all the users", (done) => {
        chaitest
          .request(server)
          .get("/users")
          .set({ Authorization: `Bearer ${token}` })
          .end((err: any, res: any) => {
            res.should.have.status(200);
            res.body.should.be.a("array");
            res.body.length.should.be.eql(1);
            done();
          });
      });
      it("it should not GET all the users", (done) => {
        chaitest
          .request(server)
          .get("/users")
          .end((err: any, res: any) => {
            res.should.have.status(401);
            done();
          });
      });
    });
    describe("/POST user", () => {
      it("it should not POST a user without email field", (done) => {
        let user = {
          username: "testusername",
          fname: "Test",
          lname: "Lname Test",
          address: "test address",
          password: "password",
          phone: "0999-999-999",
          postcode: "4444",
        };
        chaitest
          .request(server)
          .post("/users")
          .set({ Authorization: `Bearer ${token}` })
          .send(user)
          .end((err: any, res: any) => {
            res.should.have.status(400);
            res.body.should.be.a("object");
            res.body.should.have.property("errors");
            done();
          });
      });
      it("it should POST a user ", (done) => {
        let user = {
          username: "testusername",
          fname: "Test",
          lname: "Lname Test",
          address: "test address",
          password: "password",
          phone: "0999-999-999",
          postcode: "4444",
          email: "test@gmail.com",
        };
        chaitest
          .request(server)
          .post("/users")
          .set({ Authorization: `Bearer ${token}` })
          .send(user)
          .end((err: any, res: any) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("id");
            res.body.should.have.property("username");
            res.body.should.have.property("email");
            res.body.should.have.property("password");
            res.body.should.have.property("fname");
            res.body.should.have.property("lname");
            res.body.should.have.property("address");
            res.body.should.have.property("postcode");
            res.body.should.have.property("phone");
            done();
          });
      });
      it("it should not POST a user with the same username ", async () => {
        await prisma.user.create({
          data: {
            username: "demotest",
            fname: "Test",
            lname: "Lname Test",
            address: "test address",
            password,
            phone: "0999-999-999",
            postcode: "4444",
            email: "demotest@gmail.com",
          },
        });
        let user = {
          username: "demotest",
          fname: "Test",
          lname: "Lname Test",
          address: "test address",
          password: "password",
          phone: "0999-999-999",
          postcode: "4444",
          email: "demotest@gmail.com",
        };
        const res = await chaitest
          .request(server)
          .post("/users")
          .send(user)
          .set({ Authorization: `Bearer ${token}` });
        assert.equal(res.status, 400);
        res.body.should.be.a("object");
      });
    });

    /*
     * Test the /GET/:id route
     */
    describe("/GET/:id user", () => {
      it("it should GET a user", async () => {
        const user = await prisma.user.create({
          data: {
            username: "demoget",
            fname: "Test",
            lname: "Lname Test",
            address: "test address",
            password,
            phone: "0999-999-999",
            postcode: "4444",
            email: "demoget@gmail.com",
          },
        });
        console.log(user.id);
        const res = await chaitest
          .request(server)
          .get("/users/" + user.id)
          .set({ Authorization: `Bearer ${token}` });
        res.body.should.have.property("id");
        res.body.should.have.property("username");
        res.body.should.have.property("email");
        res.body.should.have.property("password");
        res.body.should.have.property("fname");
        res.body.should.have.property("lname");
        res.body.should.have.property("address");
        res.body.should.have.property("postcode");
        res.body.should.have.property("phone");
        assert.equal(res.status, 200);
      });
    });

    // UPDATE

    describe("/PUT/:id user", () => {
      it("it should UPDATE a user", async () => {
        const user = await prisma.user.create({
          data: {
            username: "demoupdate",
            fname: "Test",
            lname: "Lname Test",
            address: "test address",
            password,
            phone: "0999-999-999",
            postcode: "4444",
            email: "dempupdate@gmail.com",
          },
        });
        console.log(user.id);
        const res = await chaitest
          .request(server)
          .put("/users/" + user.id)
          .set({ Authorization: `Bearer ${token}` })

          .send({
            username: "demoupdate2",
          });

        res.body.should.have.property("id");
        res.body.should.have.property("username").eql("demoupdate2");
        res.body.should.have.property("email");
        res.body.should.have.property("password");
        res.body.should.have.property("fname");
        res.body.should.have.property("lname");
        res.body.should.have.property("address");
        res.body.should.have.property("postcode");
        res.body.should.have.property("phone");
        assert.equal(res.status, 200);
      });
    });
    // DELETE
    describe("/DELETE/:id user", () => {
      it("it should DELETE a user", async () => {
        const user = await prisma.user.create({
          data: {
            username: "demodelete",
            fname: "Test",
            lname: "Lname Test",
            address: "test address",
            password,
            phone: "0999-999-999",
            postcode: "4444",
            email: "demodelete@gmail.com",
          },
        });
        const res = await chaitest
          .request(server)
          .delete("/users/" + user.id)
          .set({ Authorization: `Bearer ${token}` });
        assert.equal(res.status, 200);
      });
      it("it should not DELETE a user", async () => {
        const user = await prisma.user.create({
          data: {
            username: "demodelete99",
            fname: "Test",
            lname: "Lname Test",
            address: "test address",
            password,
            phone: "0999-999-999",
            postcode: "4444",
            email: "demodelete99@gmail.com",
          },
        });
        const res = await chaitest.request(server).delete("/users/" + user.id);
        assert.equal(res.status, 401);
      });
    });
    // DELETE MANY
    describe("/DELETE MANY user", () => {
      it("it should DELETE MANY users", async () => {
        const user1 = await prisma.user.create({
          data: {
            username: "manydemodelete1",
            email: "manydemodelete1@gmail.com",
            fname: "Test",
            lname: "Lname Test",
            address: "test address",
            password,
            phone: "0999-999-999",
            postcode: "4444",
          },
        });
        const user2 = await prisma.user.create({
          data: {
            username: "manydemodelete2",
            email: "manydemodelete2@gmail.com",
            fname: "Test",
            lname: "Lname Test",
            address: "test address",
            password,
            phone: "0999-999-999",
            postcode: "4444",
          },
        });
        const res = await chaitest
          .request(server)
          .delete("/users/multiple")
          .send([user1.id, user2.id])
          .set({ Authorization: `Bearer ${token}` });
        res.body.should.have.property("count");
        assert.equal(res.status, 200);
      });
    });
  });
});
