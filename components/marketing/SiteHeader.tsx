import { auth } from "@clerk/nextjs/server";
import SiteHeaderBar from "./SiteHeaderBar";

// The session is read on the server so the header buttons are in the first HTML,
// instead of waiting for Clerk's browser script to load and resolve.
export default async function SiteHeader() {
  const { userId } = await auth();
  return <SiteHeaderBar signedIn={!!userId} />;
}
