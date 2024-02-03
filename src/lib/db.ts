import { and, eq, sql } from "drizzle-orm";
import { users } from "./auth";
import db from "./turso";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export type Bits = {
  id: number;
  text: string;
  date: string;
};

export const bits = sqliteTable("bits", {
  id: integer("id").primaryKey(),
  userid: integer("userid").references(() => users.userid),
  date: text("date").default(sql`CURRENT_TIMESTAMP`),
  text: text("text"),
  url: text("url"),
});

export const getUserBits = (userid: number) =>
  db
    .select({
      id: bits.id,
      text: bits.text,
      date: bits.date,
    })
    .from(bits)
    .where(eq(bits.userid, userid))
    .orderBy(bits.date);

export const createNewBit = (userid: number, text: string) =>
  db.insert(bits).values({ userid, text }).returning();

export const deleteUserBit = (userid: number, bitid: number) =>
  db
    .delete(bits)
    .where(and(eq(bits.id, bitid), eq(bits.userid, userid)))
    .then((resp) => resp.rowsAffected === 1);
