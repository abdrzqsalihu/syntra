/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import HomeCard from "./HomeCard";
import MeetingModal from "./MeetingModal";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/nextjs";
import Loader from "./Loader";
import { Textarea } from "./ui/textarea";
import ReactDatePicker from "react-datepicker";

import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  CalendarClock,
  CheckCircleIcon,
  Copy,
  Link,
  Plus,
  Video,
} from "lucide-react";

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

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetail?.id}`;

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

      {!callDetail ? (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Schedule New Meeting"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <label className="text-base font-normal leading-[22.4px] text-sky-2">
              Add a description
            </label>
            <Textarea
              className="border border-gray-900/80 bg-dark-3/80 focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <label className="text-base font-normal leading-[22.4px] text-sky-2">
              Select Date and Time
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full rounded border border-gray-900/80 bg-dark-3/80 p-2 focus:outline-none"
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Meeting Created"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({ title: "Link Copied" });
          }}
          icon={<CheckCircleIcon size={40} />}
          buttonIcon={<Copy size={12} />}
          className="text-center"
          buttonText="Copy Meeting Link"
        />
      )}

      <MeetingModal
        isOpen={meetingState === "isJoiningMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Paste the link here"
        className="text-center"
        buttonText="Join Meeting"
        handleClick={() => router.push(values.link)}
      >
        <Input
          placeholder="Meeting link"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
          className="border border-gray-900/80 bg-dark-3/80 focus-visible:ring-0 focus-visible:ring-offset-0"
          required
        />
      </MeetingModal>

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
