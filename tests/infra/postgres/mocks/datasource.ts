import { IMemoryDb, newDb } from "pg-mem";
import { DataSource } from "typeorm";

export const makeFakeDb = async (entities?: any): Promise<{ db: IMemoryDb, dataSource: DataSource }> => {
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
