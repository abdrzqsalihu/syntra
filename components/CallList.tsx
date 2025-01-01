"use client";

import { Call, CallRecording } from "@stream-io/video-react-sdk";
import Loader from "./Loader";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useGetCalls } from "@/hooks/useGetCall";
import MeetingCard from "./MeetingCard";
import {
  CalendarClock,
  LucideCalendarFold,
  PlayCircle,
  Video,
} from "lucide-react";

const CallList = ({ type }: { type: "ended" | "upcoming" | "recordings" }) => {
  const router = useRouter();
  const { endedCalls, upcomingCalls, callRecordings, isLoading } =
    useGetCalls();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  const [isLoadingRecordings, setIsLoadingRecordings] = useState(false);
  const { toast } = useToast();

  const getCalls = () => {
    switch (type) {
      case "ended":
        return endedCalls;
      case "recordings":
        return recordings;
      case "upcoming":
        return upcomingCalls;
      default:
        return [];
    }
  };

  const getNoCallsMessage = () => {
    switch (type) {
      case "ended":
        return "No Previous Calls";
      case "upcoming":
        return "No Upcoming Calls";
      case "recordings":
        return "No Recordings";
      default:
        return "";
    }
  };

  useEffect(() => {
    const fetchRecordings = async () => {
      if (!callRecordings?.length) return;

      setIsLoadingRecordings(true);
      try {
        const callData = await Promise.all(
          callRecordings.map(async (meeting) => {
            try {
              return await meeting.queryRecordings();
            } catch (error) {
              console.error(`Failed to fetch recording for meeting:`, error);
              return { recordings: [] };
            }
          })
        );

        const fetchedRecordings = callData
          .filter((call) => call?.recordings?.length > 0)
          .flatMap((call) => call.recordings);

        setRecordings(fetchedRecordings);
      } catch (error) {
        console.error("Failed to fetch recordings:", error);
        toast({
          title: "Failed to load recordings",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsLoadingRecordings(false);
      }
    };

    if (type === "recordings") {
      fetchRecordings();
    }
  }, [type, callRecordings, toast]);

  // Show loader while initial data is loading
  if (isLoading) return <Loader />;

  // Show loader while recordings are being fetched
  if (type === "recordings" && isLoadingRecordings) return <Loader />;

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();

  return (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording) => (
          <MeetingCard
            key={
              type === "recordings"
                ? (meeting as CallRecording).url
                : (meeting as Call).id
            }
            icon={
              type === "ended" ? (
                <LucideCalendarFold size={25} />
              ) : type === "upcoming" ? (
                <CalendarClock size={25} />
              ) : (
                <Video size={25} />
              )
            }
            title={
              (meeting as Call).state?.custom?.description?.substring(0, 26) ||
              (meeting as CallRecording).filename?.substring(0, 20) ||
              "Personal Meeting"
            }
            date={
              (meeting as Call).state?.startsAt?.toLocaleString() ||
              (meeting as CallRecording).start_time?.toLocaleString()
            }
            isPreviousMeeting={type === "ended"}
            link={
              type === "recordings"
                ? (meeting as CallRecording).url
                : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${
                    (meeting as Call).id
                  }`
            }
            buttonIcon1={type === "recordings" ? <PlayCircle /> : undefined}
            buttonText={type === "recordings" ? "Play" : "Start"}
            handleClick={
              type === "recordings"
                ? () => router.push(`${(meeting as CallRecording).url}`)
                : () => router.push(`/meeting/${(meeting as Call).id}`)
            }
          />
        ))
      ) : (
        <h1 className="text-2xl font-bold text-white">{noCallsMessage}</h1>
      )}
    </div>
  );
};

export default CallList;
