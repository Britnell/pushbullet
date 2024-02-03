import { createClient } from "@libsql/client/web";
import { drizzle } from "drizzle-orm/libsql";

const client = createClient({
  url: import.meta.env.TURSO_URL,
  authToken: import.meta.env.TURSO_TOKEN,
});

const db = drizzle(client);

export default db;
