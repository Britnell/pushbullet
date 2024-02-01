import type { APIRoute } from "astro";
import {
  checkPassword,
  createJWT,
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

  const resp = await getEmailUser(email);

  if (resp.rows.length === 0) return redirect("/user/signin");

  const userid = resp.rows[0].userid;
  const hash = resp.rows[0].password;

  console.log({ userid, email, password });

  if (!hash) return redirect("/user/signin");

  const match = await checkPassword(password, hash.toString());

  if (!match) return redirect("/user/signin");

  console.log({ hash, match });

  const cookie = await getUserSigninCookie({ userid, email });
  console.log({ cookie });

  return new Response(null, {
    status: 301,
    headers: {
      Location: "/app",
      "Set-Cookie": cookie,
    },
  });

  return redirect("/user/signin");
  return new Response("never");
};
