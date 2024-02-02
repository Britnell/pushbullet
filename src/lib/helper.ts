export const cookieParser = (cookieStr: string) => {
  const cookies = new Map();
  cookieStr
    .split(";")
    .map((cookie) => cookie.split("=").map((s) => s.trim()))
    .map((pair) => cookies.set(pair[0], pair[1]));
  return cookies;
};
