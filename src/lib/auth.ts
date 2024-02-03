import bcrypt from "bcryptjs";
import db from "./turso";
import { SignJWT, jwtVerify } from "jose";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { and, eq } from "drizzle-orm";

const JWT_NAME = import.meta.env.JWT_NAME;
const JWT_SECRET = import.meta.env.JWT_SECRET;

export const users = sqliteTable("users", {
  userid: integer("userid").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  username: text("username").notNull(),
  created: text("created").default("CURRENT_DATE"),
});

export const getUserSigninCookie = async (user: object) => {
  const jwt = await createJWT(user);
  const exp = 60 * 60 * 24 * 7;
  return makeCookie(jwt, exp);
};

export const signoutCookie = () => makeCookie("", 1);

const makeCookie = (value: string, age: string | number) =>
  `${JWT_NAME}=${value}; Max-Age=${age}; Path=/;  SameSite=Strict; HttpOnly`;

export const checkUserCookie = async (jwt: string) => {
  try {
    const resp = await validateJWT(jwt);
    return resp?.payload as { userid: number; email: string };
  } catch (e) {
    return null;
  }
};

export const createJWT = (user: object) => {
  const issAt = Math.floor(Date.now() / 1000);
  const exp = issAt + 60 * 60 * 24 * 7;

  return new SignJWT({
    payload: user,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(exp)
    .setIssuedAt(issAt)
    .setNotBefore(issAt)
    .sign(new TextEncoder().encode(JWT_SECRET));
};

export const validateJWT = async (jwt: string) =>
  jwtVerify(jwt, new TextEncoder().encode(JWT_SECRET)).then(
    (resp) => resp.payload
  );

export const getEmailUser = (email: string) =>
  db
    .select({
      userid: users.userid,
      email: users.email,
      password: users.password,
    })
    .from(users)
    .where(eq(users.email, email));

export const getCookieUser = (userid: number, email: string) =>
  db
    .select({
      userid: users.userid,
      email: users.email,
    })
    .from(users)
    .where(and(eq(users.email, email), eq(users.userid, userid)));

export const hashPassword = (pw: string) => bcrypt.hashSync(pw, 10);

export const checkPassword = (pw: string, hashed: string) =>
  bcrypt.compareSync(pw, hashed);

export const signupUser = async ({
  email,
  password,
  username,
}: {
  email: string;
  password: string;
  username: string;
}) => {
  const hashed = hashPassword(password);
  if (!hashed) return null;

  return db.insert(users).values({
    email,
    username,
    password: hashed,
  });
};
