import { IBackup, IMemoryDb, newDb } from "pg-mem";
import { DataSource, Repository } from "typeorm";

import { PgUser } from "@/infra/postgres/entities";
import { PgUserAccountRepository } from "@/infra/postgres/repositories";
import { makeFakeDb } from "@/tests/infra/postgres/mocks";

describe("PgUserAccountRepository", () => {
  let sut: PgUserAccountRepository;
  let dataSource: DataSource;
  let db: IMemoryDb;
  let pgUserRepository: Repository<PgUser>;
  let backup: IBackup;

  beforeAll(async () => {
    const result = await makeFakeDb([PgUser]);
    db = result.db;
    dataSource = result.dataSource;
    backup = db.backup();
    pgUserRepository = dataSource.getRepository(PgUser);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(() => {
    backup.restore();
    sut = new PgUserAccountRepository(pgUserRepository);
  });

  describe("load", () => {
    it("should return an account if email exists", async () => {
      await pgUserRepository.save({ email: "any_email" });

      const account = await sut.load({ email: "any_email" });

      expect(account).toEqual({ id: "1" });
    });

    it("should return undefined if email does not exists", async () => {
      const account = await sut.load({ email: "any_email" });

      expect(account).toBeUndefined();
    });
  });
});
