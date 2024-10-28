import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import MobileNav from "./MobileNav";

function Navbar() {
  return (
    <nav className="flex justify-between items-center fixed z-50 w-full bg-dark-1 px-6 py-4 lg:px-10 border-b-2 border-dark-3">
      <Link href="/" className="flex items-center gap-1">
        <Image
          src="/logo-2.png"
          width={100}
          height={100}
          alt="yoom logo"
          className="w-[6rem] md:w-[7rem] mt-1"
        />
      </Link>
      <div className="flex justify-between items-center gap-6">
        <UserButton />
        <MobileNav />
      </div>
    </nav>
  );
}

export default Navbar;
