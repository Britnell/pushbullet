import type { APIRoute } from "astro";
import { signoutCookie } from "../../../lib/auth";

export const GET: APIRoute = () => {
  console.log(" LOGOUT==");

  return new Response(null, {
    status: 301,
    headers: {
      Location: "/",
      "Set-Cookie": signoutCookie(),
    },
  });
};
