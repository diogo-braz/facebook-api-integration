import { PrismaUserAccountRepository } from "@/infra/prisma/repositories";

export const makePrismaUserAccountRepository = (): PrismaUserAccountRepository => {
  return new PrismaUserAccountRepository();
};
