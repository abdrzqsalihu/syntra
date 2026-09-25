import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import { authAppearance } from "@/components/auth/authAppearance";

export const metadata: Metadata = { title: "Create account" };

export default function SignUpPage() {
  return <SignUp appearance={authAppearance} />;
}
