import type { APIRoute } from "astro";
import { checkUserCookie, getCookieUser } from "../../../lib/auth";
import { createNewBit } from "../../../lib/db";
import { cookieParser } from "../../../lib/helper";

const JWT_NAME = import.meta.env.JWT_NAME;

export const GET: APIRoute = () => {
  return new Response("please POST - ok love you bye", {
    status: 200,
  });
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

  const [user] = await getCookieUser(userid, email);
  if (!user) return redirect("/app");

  const success = await createNewBit(userid, text);

  if (success) return new Response("ok", { status: 200 });

  return new Response("error", { status: 500 });
};
