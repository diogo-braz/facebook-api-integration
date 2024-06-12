import { IBackup, newDb } from "pg-mem";

import { LoadUserAccountRepository } from "@/data/contracts/repositories";
import { Column, DataSource, Entity, PrimaryGeneratedColumn, Repository } from "typeorm";

class PgUserAccountRepository implements LoadUserAccountRepository {
  constructor (private readonly userRepository: Repository<PgUser>) {}

  async load (params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const user = await this.userRepository.findOneBy({ email: params.email });
    if (user) {
      return {
        id: user?.id.toString(),
        name: user?.name ?? undefined
      };
    }

    return;
  }
}

@Entity({ name: "usuarios" })
export class PgUser {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "nome", nullable: true })
    name?: string;

    @Column()
    email!: string;

    @Column({ name: "id_facebook", nullable: true })
    facebookId?: number;
}

describe("PgUserAccountRepository", () => {
  describe("load", () => {
    let sut: PgUserAccountRepository;
    let dataSource: DataSource;
    let pgUserRepository: Repository<PgUser>;
    let backup: IBackup;

    beforeAll(async () => {
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
      dataSource = await db.adapters.createTypeormDataSource({
        type: "postgres",
        entities: [PgUser]
      });
      await dataSource.initialize();
      await dataSource.synchronize();
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
