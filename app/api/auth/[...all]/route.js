// import { auth } from "@/lib/auth";
// import { toNextJsHandler } from "better-auth/next-js";
// import { getDb } from "@/lib/db";

// const handlers = toNextJsHandler(auth);

// async function handle(request) {
//   try {
//     await getDb();
//     const response = await handlers[request.method](request);
//     response.headers.set("Cache-Control", "no-store");
//     return response;
//   } catch (error) {
//     const serverErrors = error.reason?.servers
//       ? [...error.reason.servers.values()].map(server => server.error?.cause?.code || server.error?.name)
//       : [];
//     console.error("Auth database/request failure", { name: error.name, code: error.code, serverErrors });
//     const isConnectionError = ["MongoServerSelectionError", "MongoNetworkError", "MongoTopologyClosedError", "MongoOperationTimeoutError"].includes(error.name);
//     const message = isConnectionError && process.env.NODE_ENV !== "production"
//       ? "Cannot connect to MongoDB Atlas. Check the cluster is available and your current IP is allowed in Atlas Network Access, then retry."
//       : "Sign-in service is temporarily unavailable. Please try again.";
//     return Response.json({ message }, { status: 503, headers: { "Cache-Control": "no-store" } });
//   }
// }

// export { handle as GET, handle as POST };














import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { getDb } from "@/lib/db";

const handlers = toNextJsHandler(auth);

async function handle(request) {
  try {
    await getDb();
    const response = await handlers[request.method](request);
    if (response.status >= 500) {
      return Response.json({ message: "Sign-in service is temporarily unavailable. Please try again." }, { status: 503 });
    }
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch {
    return Response.json({ message: "Sign-in service is temporarily unavailable. Please try again." }, { status: 503 });
  }
}

export { handle as GET, handle as POST };