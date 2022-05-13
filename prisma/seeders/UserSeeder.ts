import prisma from "../../src/lib/prisma";
import argon2 from "argon2";
import { createUserFactory } from "../factories/UserFactory";
const UserSeeder = async () => {
  const password = await argon2.hash("password");
  await prisma.user.create({
    data: {
      fname: "Admin",
      lname: "Developer",
      address: "Block 1 Lot 2",
      password: password,
      phone: "09123456789",
      postcode: "4301",
      username: "admin",
      email: "admin@dev.com",
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
  await createUserFactory(20);
};
export default UserSeeder;
