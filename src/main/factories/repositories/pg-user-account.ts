import { PgUserAccountRepository } from "@/infra/postgres/repositories";

export const makePgUserAccountRepository = (): PgUserAccountRepository => {
  return new PgUserAccountRepository();
};
