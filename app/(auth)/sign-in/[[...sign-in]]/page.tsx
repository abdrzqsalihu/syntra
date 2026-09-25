import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import { authAppearance } from "@/components/auth/authAppearance";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return <SignIn appearance={authAppearance} />;
}
