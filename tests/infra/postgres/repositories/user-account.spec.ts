import { newDb } from "pg-mem";

import { LoadUserAccountRepository } from "@/data/contracts/repositories";
import { Column, DataSource, Entity, PrimaryGeneratedColumn, Repository } from "typeorm";

class PgUserAccountRepository implements LoadUserAccountRepository {
  constructor (private readonly userRepository: Repository<PgUser>) {}

  async load (params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const user = await this.userRepository.findOneBy({ email: params.email });
    if (user !== undefined) {
      return {
        id: user!.id.toString(),
        name: user?.name ?? undefined
      };
    }
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
    it("should return an account if email exists", async () => {
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
        entities: [PgUser]
      });
      await dataSource.initialize();
      await dataSource.synchronize();

      const usersRepo = dataSource.getRepository(PgUser);
      const user = new PgUser();
      user.email = "existing_email";
      await usersRepo.save(user);

      const sut = new PgUserAccountRepository(usersRepo);

      const account = await sut.load({ email: "existing_email" });
      expect(account).toEqual({ id: "1" });
    });
  });
});
