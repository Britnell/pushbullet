import * as bcrypt from "bcrypt";
import { turso } from "./turso";
import { SignJWT, jwtVerify } from "jose";

const JWT_NAME = import.meta.env.JWT_NAME;
const JWT_SECRET = import.meta.env.JWT_SECRET;

export const getUserSigninCookie = async (user: object) => {
  const jwt = await createJWT(user);
  const exp = 60 * 60 * 24 * 7;
  return `${JWT_NAME}=${jwt}; Path=/; Max-Age=${exp}; SameSite=Strict; HttpOnly`;
};

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
  turso.execute({
    sql: ` select userid,email,password from users where email = ?`,
    args: [email],
  });

export const getCookieUser = (userid: number, email: string) =>
  turso
    .execute({
      sql: ` select userid,email,password from users where email = ? and userid = ?`,
      args: [email, userid],
    })
    .then((resp) => resp.rows);

export const hashPassword = (pw: string) => bcrypt.hash(pw, 10);

export const checkPassword = (pw: string, hashed: string) =>
  bcrypt.compare(pw, hashed);

export const signupUser = async ({
  email,
  password,
  username,
}: {
  email: string;
  password: string;
  username: string;
}) => {
  const hashed = await hashPassword(password);
  if (!hashed) return null;

  return turso.execute({
    sql: `INSERT INTO users (email, username, password)
        VALUES (?, ?, ?)
        ON CONFLICT(email) DO NOTHING;
        `,
    args: [email, username, hashed],
  });
};
