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

describe("Users", () => {
  beforeEach((done) => {
    model.deleteMany({}).then(() => {
      done();
    });
  });
  /*
   * Test the /GET route
   */
  describe("/GET user", () => {
    it("it should GET all the users", (done) => {
      chaitest
        .request(server)
        .get("/users")
        .end((err: any, res: any) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });
  /*
   * Test the /POST route
   */
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
        .send(user)
        .end((err: any, res: any) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("errors");
          // res.body.errors.should.have.property("email");
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
      const res = await chaitest.request(server).post("/users").send(user);
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
      console.log(user.id);
      const res = await chaitest.request(server).get("/users/" + user.id);
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
          password: "password",
          phone: "0999-999-999",
          postcode: "4444",
          email: "dempupdate@gmail.com",
        },
      });
      console.log(user.id);
      const res = await chaitest
        .request(server)
        .put("/users/" + user.id)
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
      const res = await chaitest.request(server).delete("/users/" + user.id);
      assert.equal(res.status, 200);
    });
  });
});
