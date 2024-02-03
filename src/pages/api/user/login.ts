import type { APIRoute } from "astro";
import {
  checkPassword,
  getEmailUser,
  getUserSigninCookie,
} from "../../../lib/auth";

export const GET: APIRoute = () => {
  return new Response("please POST - ok love you bye", {
    status: 200,
  });
};

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();

  const email = form.get("email")?.toString();
  const password = form.get("password")?.toString();

  if (!email || !password) return new Response(" boo");

  const rows = await getEmailUser(email);

  if (rows.length === 0) return redirect("/user/login");

  const userid = rows[0].userid;
  const hash = rows[0].password;

  if (!hash) return redirect("/user/login");

  const match = checkPassword(password, hash.toString());

  if (!match) return redirect("/user/login");

  const cookie = await getUserSigninCookie({ userid, email });

  return new Response(null, {
    status: 301,
    headers: {
      Location: "/",
      "Set-Cookie": cookie,
    },
  });
};
