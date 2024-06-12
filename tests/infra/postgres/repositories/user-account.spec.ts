import { IBackup, IMemoryDb, newDb } from "pg-mem";
import { DataSource, Repository } from "typeorm";

import { PgUser } from "@/infra/postgres/entities";
import { PgUserAccountRepository } from "@/infra/postgres/repositories";

const makeFakeDb = async (entities?: any): Promise<{ db: IMemoryDb, dataSource: DataSource }> => {
  const db = newDb();
  db.public.registerFunction({
    implementation: () => "test",
    name: "current_database"
  });
  db.public.registerFunction({
    implementation: () => "version",
    name: "version"
  });
  db.public.interceptQueries((queryText) => {
    if (
      queryText.search(
        /(pg_views|pg_matviews|pg_tables|pg_enum|table_schema)/g
      ) > -1
    ) {
      return [];
    }
    return null;
  });
  const dataSource: DataSource = await db.adapters.createTypeormDataSource({
    type: "postgres",
    entities: entities ?? ["src/infra/postgres/entities/index.ts"]
  });
  await dataSource.initialize();
  await dataSource.synchronize();

  return { db, dataSource };
};

describe("PgUserAccountRepository", () => {
  describe("load", () => {
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
