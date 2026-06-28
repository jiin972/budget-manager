import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../app/generated/prisma";
import Database from "better-sqlite3";

const sqlite = new Database("./database.db");

const adapter = new PrismaBetterSqlite3({
  url: "file:./database.db",
});

const db = new PrismaClient({ adapter });

export default db;
