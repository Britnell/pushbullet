import { createClient } from "@libsql/client/web";
import { drizzle } from "drizzle-orm/libsql";

const client = createClient({
  url: import.meta.env.TURSO_URL,
  authToken: import.meta.env.TURSO_TOKEN,
});

export const turso = client;

export const db = drizzle(client);
