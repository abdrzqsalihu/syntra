/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import HomeCard from "./HomeCard";
import MeetingModal from "./MeetingModal";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/nextjs";
import Loader from "./Loader";
// import { Textarea } from "./ui/textarea";
// import ReactDatePicker from "react-datepicker";

// import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";
import { CalendarClock, Link, Plus, Video } from "lucide-react";

const initialValues = {
  dateTime: new Date(),
  description: "",
  link: "",
};

function QuickLinks() {
  const router = useRouter();
  const [meetingState, setMeetingState] = useState<
    "isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined
  >(undefined);
  const [values, setValues] = useState(initialValues);
  const [callDetail, setCallDetail] = useState<Call>();
  const client = useStreamVideoClient();
  const { user } = useUser();
  const { toast } = useToast();

  const createMeeting = async () => {
    if (!client || !user) return;
    try {
      if (!values.dateTime) {
        toast({ title: "Please select a date and time" });
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call("default", id);
      if (!call) throw new Error("Failed to create meeting");
      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || "Instant Meeting";
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });
      setCallDetail(call);
      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }
      toast({
        title: "Meeting Created",
      });
    } catch (error) {
      console.error(error);
      toast({ title: "Failed to create Meeting" });
    }
  };

  if (!client || !user) return <Loader />;

  // const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetail?.id}`;

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

      <MeetingModal
        isOpen={meetingState === "isInstantMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Start an Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />
    </div>
  );
}

export default QuickLinks;
