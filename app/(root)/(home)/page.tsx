"use client";
import { useUser } from "@clerk/nextjs";
import { CalendarDaysIcon, User } from "lucide-react";
import Link from "next/link";
import React from "react";

const Home = () => {
  const { user } = useUser();
  // Get current date
  const currentDate = new Date();
  const month = currentDate.toLocaleString("default", { month: "long" });
  const day = currentDate.toLocaleDateString("default", { weekday: "long" });
  const date = currentDate.getDate();
  const year = currentDate.getFullYear();
  return (
    <div>
      <p className="text-white/90 text-sm">Welcome,</p>
      <h1 className="text-2xl font-bold text-white">{user?.fullName}</h1>

      <div className="flex items-center justify-between mt-12 border border-gray-900/80 px-10 p-6 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-white flex items-center gap-1.5">
              <CalendarDaysIcon size={16} />
              <span className="mt-1">{month}</span>
            </span>
            <span className="text-white/70">
              {day} {date}, {year}
            </span>
          </div>
        </div>
        <Link
          href={"personal-room"}
          className="text-white bg-dark-2 hover:bg-dark-2/90 p-2 px-3 rounded-md flex items-center gap-1 shadow-sm"
        >
          <User size={20} /> Personal Room
        </Link>
      </div>
    </div>
  );
};

export default Home;
