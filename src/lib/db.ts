import { turso } from "./turso";

export type Bits = {
  text: string;
};

export const createNewBit = (userid: number, text: string) =>
  turso
    .execute({
      sql: `INSERT INTO bits (userid, text)
        VALUES (?, ?)`,
      args: [userid, text],
    })
    .then((resp) => resp.rowsAffected === 1);

export const getUserBits = (userid: string) =>
  turso
    .execute({
      sql: `select text,date 
          from bits 
          where userid = ?
          order by date ASC`,
      args: [userid],
    })
    .then((resp) => resp.rows);
