
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
