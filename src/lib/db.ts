import { turso } from "./turso";

export type Bits = {
  id: number;
  text: string;
  date: string;
};

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

export const createNewBit = (userid: number, text: string) =>
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
