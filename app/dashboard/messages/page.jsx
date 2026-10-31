// Place this file at: app/dashboard/messages/page.jsx -- REPLACES your
// current version, which is missing the line below and therefore
// shows the "uncached data during a navigation" warning.
//
// WHY THE WARNING APPEARS (your error screenshot):
//   This page reads LIVE data from MongoDB (getMessagesData() +
//   connection()). Next 16.4's "instant navigation" can only work
//   for routes whose shell is static / cached. A route that waits
//   for uncached MongoDB data on every navigation CANNOT be
//   instant, so Next shows this warning in dev -- the page still
//   loads, it is just not instant.
//   It is NOT a crash, and it is NOT caused by the demo chats
//   seed script. It happens for any dashboard page that calls
//   connection() without opting out of instant navigation.
//
// FIX (the one line that matters):
//   export const instant = false;
//   This tells Next: "do NOT try instant navigation for this
//   route, do a normal navigation instead." The warning goes
//   away, and the page keeps working exactly as before (live
//   MongoDB data, no prerendering).
//   This line MUST be in THIS file, not only in
//   app/dashboard/layout.jsx -- Next checks it per route, and
//   your current file (error at line 19, await connection())
//   does not have it, which is why only Messages shows it.
//   Do NOT delete this line when you clean up comments.
//
// Route: /dashboard/messages
// This page lives inside app/dashboard/layout.jsx, so it already has
// the dashboard sidebar and NO Navbar/Footer -- do not add them here.
// Server component: it reads conversations + messages from MongoDB
// (lib/messages-data.js) and passes them to the client chat component.
// No conversation or message is hardcoded here.
//
// NEXT 16: do NOT use `export const dynamic = "force-dynamic"` -- with
// cacheComponents: true that export is rejected. `await connection()`
// below is the Next 16 replacement, so this page renders at request
// time and never shows a prerendered / cached chat.

import { connection } from "next/server";
import { getMessagesData } from "@/lib/messages-data";

// Same Next 16 "[block]" fix as the dashboard layout, PLUS the
// navigation fix: this page reads uncached MongoDB data, so it is
// intentionally a blocking route, not a prerendered / instant one.
// `instant = false` also opts this route OUT of Next 16.4 instant
// navigation, which is what stops the "uncached data during a
// navigation" warning. See app/dashboard/layout.jsx for why.
export const instant = false;
import MessagesChat from "@/components/dashboard/MessagesChat";

export default async function MessagesPage() {
  await connection();
  const data = await getMessagesData();

  return (
    <>
      {!data.connected && (
        <div className="mx-4 mt-8 border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-800 sm:mx-6 lg:mx-10">
          <p className="font-bold">MongoDB is not connected yet.</p>
          <p>
            Set <code className="font-mono text-xs">MONGODB_URI</code> in{" "}
            <code className="font-mono text-xs">.env.local</code> and run{" "}
            <code className="font-mono text-xs">node scripts/seed-messages.js</code>, then reload.
            The page shows an empty state instead of fake messages until then.
          </p>
        </div>
      )}
      <MessagesChat initialData={data} />
    </>
  );
}
