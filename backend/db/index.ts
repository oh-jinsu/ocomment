import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import * as schema from "./schema";
import { Table } from "drizzle-orm";

export const data = drizzle(sql, { schema });

export * from "./schema";

export type InferInsert<T extends Table> = T["$inferInsert"];

export type InferSelect<T extends Table> = T["$inferSelect"];
