import type { APIRoute } from "astro";
import { signupUser } from "../../../lib/auth";

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

  if (!resp) return redirect("/user/login");

  if (resp.rowsAffected === 1) return redirect("/user/login");

  return redirect("/user/signup");
};
