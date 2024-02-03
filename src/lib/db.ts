import { eq } from "drizzle-orm";
import { users } from "./auth";
import { turso, db } from "./turso";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export type Bits = {
  id: number;
  text: string;
  date: string;
};

export const bits = sqliteTable("bits", {
  id: integer("id").primaryKey(),
  userid: integer("userid").references(() => users.userid),
  date: text("date").default("CURRENT_TIMESTAMP"),
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
  turso
    .batch([
      {
        sql: `insert into bits (userid, text)
              values (?, ?)`,
        args: [userid, text],
      },
      {
        sql: `SELECT id,text,date from bits 
              where rowid = last_insert_rowid();`,
        args: [],
      },
    ])
    .then((resp) => resp[1].rows);

export const createNewBitold = (userid: number, text: string) =>
  turso
    .execute({
      sql: `insert into bits (userid, text)
            values (?, ?)`,
      args: [userid, text],
    })
    .then((resp) => resp.rowsAffected === 1);

export const deleteUserBit = (userid: string, bitid: string) =>
  turso
    .execute({
      sql: `delete from bits 
                where userid = ? and id = ?`,
      args: [userid, bitid],
    })
    .then((resp) => resp.rowsAffected === 1);
