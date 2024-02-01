import type { APIRoute } from "astro";
import { hashPassword, signupUser } from "../../../lib/auth";

export const GET: APIRoute = () => {
  return new Response("please POST - ok love you bye", {
    status: 200,
  });
};

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();

  const email = form.get("email")?.toString();
  const username = form.get("username")?.toString();
  const password = form.get("password")?.toString();

  if (!email || !username || !password) return new Response(" boo");

  const resp = await signupUser({
    email,
    password,
    username,
  });

  if (!resp) return redirect("/user/signin");

  console.log(resp);

  if (resp.rowsAffected === 1) return redirect("/user/signin");

  if (resp.rowsAffected === 0) return redirect("/user/signup");

  return new Response("never");
};
