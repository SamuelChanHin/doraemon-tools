import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { Tools } from "./entity/tools";
import { Movies } from "./entity/movie";
import "reflect-metadata";

let AppDataSource: DataSource | null = null;

export async function getDataSource() {
  if (AppDataSource && AppDataSource.isInitialized) return AppDataSource;

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL not set");

  AppDataSource = new DataSource({
    type: "postgres",
    url: databaseUrl,
    entities: [Tools, Movies],
    synchronize: false,
    namingStrategy: new SnakeNamingStrategy(),
  });

  await AppDataSource.initialize();
  return AppDataSource;
}
