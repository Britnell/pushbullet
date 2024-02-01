import type { APIRoute } from "astro";
import { signoutCookie } from "../../../lib/auth";

export const GET: APIRoute = () => {
  return new Response(null, {
    status: 301,
    headers: {
      Location: "/app",
      "Set-Cookie": signoutCookie(),
    },
  });
};
