import { turso } from "./turso";

export type Bits = {
  text: string;
};

export const createNewBit = (userid: number, text: string) =>
  turso
    .execute({
      sql: `insert into bits (userid, text)
        values (?, ?)`,
      args: [userid, text],
    })
    .then((resp) => resp.rowsAffected === 1);

export const getUserBits = (userid: string) =>
  turso
    .execute({
      sql: `select id,text,date
          from bits 
          where userid = ?
          order by date ASC`,
      args: [userid],
    })
    .then((resp) => resp.rows);
