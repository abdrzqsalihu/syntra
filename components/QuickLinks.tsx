"use client";
import React, { useState } from "react";
import HomeCard from "./HomeCard";
import { useRouter } from "next/navigation";
import { CalendarClock, Link, Plus, Video } from "lucide-react";

function QuickLinks() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [meetingState, setMeetingState] = useState<
    "isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined
  >(undefined);
  return (
    <div className="mt-8 md:mt-12 border border-gray-900/80 px-6 md:px-10 p-10 rounded-xl">
      <h1 className="text-base md:text-xl font-bold text-white">
        Quick Actions
      </h1>
      <p className="text-white/90 text-sm mt-1">Manage your meetings</p>
      <section className="grid grid-cols-1 gap-6 md:gap-16 md:grid-cols-2 lg:grid-cols-4 mt-6">
        <HomeCard
          icon={<Plus size={20} />}
          title="New Meeting"
          description="Start an instant meeting"
          className="bg-dark-2 hover:bg-dark-2/90"
          handleClick={() => setMeetingState("isInstantMeeting")}
        />
        <HomeCard
          icon={<Link size={16} />}
          title="Join Meeting"
          description="via invitation link"
          className="border border-gray-900/80 hover:bg-dark-3/30"
          handleClick={() => setMeetingState("isJoiningMeeting")}
        />
        <HomeCard
          icon={<CalendarClock size={20} />}
          title="Schedule Meeting"
          description="Plan your meeting"
          className="border border-gray-900/80 hover:bg-dark-3/30"
          handleClick={() => setMeetingState("isScheduleMeeting")}
        />
        <HomeCard
          icon={<Video size={20} />}
          title="View Recordings"
          description="Meeting Recordings"
          className="border border-gray-900/80 hover:bg-dark-3/30"
          handleClick={() => router.push("/recordings")}
        />
      </section>
    </div>
  );
}

export default QuickLinks;
