import type { APIRoute } from "astro";
import { checkUserCookie, getCookieUser } from "../../../lib/auth";
import { createNewBit } from "../../../lib/db";

const JWT_NAME = import.meta.env.JWT_NAME;

export const GET: APIRoute = () => {
  return new Response("please POST - ok love you bye", {
    status: 200,
  });
};

const cookieParser = (cookieStr: string) => {
  const cookies = new Map();
  const x = cookieStr
    .split(";")
    .map((cookie) => cookie.split("=").map((s) => s.trim()))
    .map((pair) => cookies.set(pair[0], pair[1]));
  return cookies;
};

export const POST: APIRoute = async ({ request, redirect }) => {
  const cookieString = request.headers.get("cookie");
  if (!cookieString) return redirect("/app");

  const text = await request.text();
  if (!text) return redirect("/app");

  const cookies = cookieParser(cookieString);
  const jwt = cookies.get(JWT_NAME);

  const cookieUser = await checkUserCookie(jwt);
  if (!cookieUser) return redirect("/app");

  const { userid, email } = cookieUser;
  console.log({ cookieUser });

  const [user] = await getCookieUser(userid, email);
  if (!user) return redirect("/app");

  const success = await createNewBit(userid, text);
  return new Response(success ? "ok" : "err");
};
