import { PrismaClient } from "@prisma/client";
import UserSeeder from "./seeders/UserSeeder";
const prisma = new PrismaClient();

async function main() {
  await UserSeeder();
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
