import "mocha";
var chaitest = require("chai");
let chaiHttp = require("chai-http");
var assert = require("assert");
let should = chaitest.should();
import prisma from "../src/lib/prisma";
import server from "../src/index";
const model = prisma.user;
chaitest.use(chaiHttp);
const expect = chaitest.expect;
process.env.NODE_ENV = "test";

const password =
  "$argon2i$v=19$m=4096,t=3,p=1$h/anh+zg2//T/gOBnjK18A$56I3Hh2dXlZ9U1rrisjBFAxl51eTSpzzQal+Qo52ePo";

describe("Auth", () => {
  beforeEach((done) => {
    model.deleteMany({}).then(() => {
      done();
    });
  });
  // SIGN UP
  describe("/SIGN UP user", () => {
    it("it should not REGISTER a user without email field", (done) => {
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
        .post("/auth/sign-up")
        .send(user)
        .end((err: any, res: any) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("errors");
          // res.body.errors.should.have.property("email");
          done();
        });
    });
    it("it should REGISTER a user ", (done) => {
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
        .post("/auth/sign-up")
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
    it("it should not REGISTER a user with the same username ", async () => {
      await prisma.user.create({
        data: {
          username: "demotest",
          fname: "Test",
          lname: "Lname Test",
          address: "test address",
          password: "password",
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
        .post("/auth/sign-up")
        .send(user);
      assert.equal(res.status, 400);
      res.body.should.be.a("object");
    });
  });
  // SIGN IN
  describe("/SIGN IN user", () => {
    it("it should not SIGN a user in with wrong password", async () => {
      await prisma.user.create({
        data: {
          username: "demotest",
          fname: "Test",
          lname: "Lname Test",
          address: "test address",
          password: "password",
          phone: "0999-999-999",
          postcode: "4444",
          email: "demotest@gmail.com",
        },
      });
      const res = await chaitest
        .request(server)
        .post("/auth/sign-in")
        .send({ username: "demotest", password: "nice" });
      assert.equal(res.status, 400);
      res.body.should.be.a("object");
    });
    it("it should sign a user in ", async () => {
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
      const res = await chaitest
        .request(server)
        .post("/auth/sign-in")
        .send({ username: "demotest", password: "password" });
      assert.equal(res.status, 200);
    });
  });
});
