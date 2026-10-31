// Place this file at: lib/company-session-data.js
//
// Company header / sidebar user, from the REAL logged-in user --
// NOT the hardcoded "Nomad" from the screenshot.
// Uses the same Better Auth session pattern as lib/logins-data.js:
//   auth.api.getSession({ headers: await headers() })
// Better Auth stores only ONE name per user (session.user.name).
// So the company header shows that name: if the company account was
// signed up with the company name as its name, the company name
// shows; if it was signed up with a person's name, that person's
// name shows. That is exactly what the user asked for: "mera company
// login name kuch aur hai, wo display ho" -- no more hardcoded Nomad.
// If you want a SEPARATE company name (person name + company name
// as two different fields), that needs a new companyName field on
// sign-up / profile -- a separate next step, not done here.
// If no one is logged in, this returns loggedIn: false and the
// company page/layout fall back to the demo user (Maria Kelly /
// Nomad) so the page still renders -- that fallback is ONLY for a
// logged-out preview, it is not shown to a logged-in company user.

import { headers } from "next/headers";
import { auth } from "./auth";

export async function getCompanySessionUser() {
  let session = null;
  try {
    session = await auth.api.getSession({ headers: await headers() });
  } catch {
    session = null;
  }

  if (!session?.user) {
    return { loggedIn: false, user: null };
  }

  const name = session.user.name || "";
  return {
    loggedIn: true,
    user: {
      id: session.user.id,
      name,
      firstName: name.split(" ")[0] || name,
      initial: name.charAt(0) || "C",
      email: session.user.email || "",
      image: session.user.image || "",
      accountType: session.user.accountType || "company",
    },
  };
}
