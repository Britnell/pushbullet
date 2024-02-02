import type { APIRoute } from "astro";
import { checkUserCookie, getCookieUser } from "../../../lib/auth";
import { getUserBits } from "../../../lib/db";
import { cookieParser } from "../../../lib/helper";

const JWT_NAME = import.meta.env.JWT_NAME;

const error = new Response("... nope - ok love you bye", { status: 402 });

export const GET: APIRoute = async ({ request }) => {
  const cookieString = request.headers.get("cookie");
  if (!cookieString) return error;

  const cookies = cookieParser(cookieString);
  const jwt = cookies.get(JWT_NAME);

  const cookieUser = await checkUserCookie(jwt);
  if (!cookieUser) return error;

  const { userid, email } = cookieUser;

  const [user] = await getCookieUser(userid, email);
  if (!user) return error;

  const bits = await getUserBits(userid.toString());

  return new Response(JSON.stringify(bits), {
    status: 200,
  });
};
