import { faker } from "@faker-js/faker";
import argon2 from "argon2";
import prisma from "../../src/lib/prisma";
export const createUserFactory = async (count: number) => {
  const password = await argon2.hash("password");
  for (let i = 0; i < count; i++) {
    await prisma.user.create({
      data: {
        fname: faker.name.firstName(),
        lname: faker.name.lastName(),
        address: faker.address.streetAddress(),
        email: faker.internet.email(),
        password: password,
        roles: {
          connectOrCreate: {
            create: {
              name: "guest",
              permissions: {
                connectOrCreate: {
                  create: {
                    name: "view-only",
                  },
                  where: {
                    name: "view-only",
                  },
                },
              },
            },
            where: {
              name: "guest",
            },
          },
        },
        phone: faker.phone.phoneNumber("+63-###-###-###"),
        postcode: faker.address.zipCode(),
        username: faker.internet.userName(),
      },
    });
  }
};
