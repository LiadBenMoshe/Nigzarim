export async function onRequest(context) {
  const auth = context.request.headers.get("Authorization") || "";
  const expectedUser = "user";
  const expectedPass = context.env.PASSWORD || "welcome";

  const isAuthorized = (() => {
    if (!auth.startsWith("Basic ")) return false;
    const decoded = atob(auth.slice(6));
    const [u, p] = decoded.split(":");
    return p === expectedPass;
  })();

  if (!isAuthorized) {
    return new Response("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="TA-35 Protected", charset="UTF-8"',
        "Cache-Control": "no-store",
      },
    });
  }

  return context.next();
}
