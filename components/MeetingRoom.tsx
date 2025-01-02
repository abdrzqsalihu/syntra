"use client";
import { cn } from "@/lib/utils";
import {
  CallControls,
  CallingState,
  CallParticipantsList,
  CallStatsButton,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import React, { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, LayoutList, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import Loader from "./Loader";
import EndCallButton from "./EndCallButton";
import { useToast } from "@/hooks/use-toast";

type CallLayoutType = "grid" | "speaker-left" | "speaker-right";
const MeetingRoom = () => {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isPersonalRoom = !!searchParams.get("personal");
  const [layout, setLayout] = useState<CallLayoutType>("speaker-left");

  const [showParticipants, setShowParticipants] = useState(false);

  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) return;
  <Loader />;

  const CallLayout = () => {
    switch (layout) {
      case "grid":
        return <PaginatedGridLayout />;
      case "speaker-right":
        return <SpeakerLayout participantsBarPosition="left" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };

  interface GetMeetingId {
    (url: string): string;
  }

  const getMeetingId: GetMeetingId = (url) => {
    return url.split("/meeting/")[1];
  };

  const url = window.location.href;

  const meetingId = getMeetingId(url);

  const meetingLink = `/meeting/${meetingId}`;

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white ">
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center">
          <CallLayout />
        </div>

        <div
          className={cn("h-[calc(100vh-86px)] hidden ml-2", {
            "show-block": showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>

      <div className="fixed bottom-4 flex w-full items-center justify-center gap-5 flex-wrap px-3">
        <CallControls onLeave={() => router.push("/")} />

        <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
              <LayoutList size={20} className="text-white" />
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
            {["Grid", "Speaker-Left", "Speaker-Right"].map((item, index) => (
              <div key={index}>
                <DropdownMenuItem
                  onClick={() =>
                    setLayout(item.toLowerCase() as CallLayoutType)
                  }
                  className="cursor-pointer"
                >
                  {item}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="border-dark-1" />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <CallStatsButton />

        <button onClick={() => setShowParticipants((prev) => !prev)}>
          <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
            <Users size={20} className="text-white" />
          </div>
        </button>

        <div className="flex items-center gap-5">
          {!isPersonalRoom && (
            <div>
              <button
                className="cursor-pointer rounded-lg bg-dark-4 border border-gray-900/80 px-4 py-3.5 flex items-center text-xs gap-2 hover:opacity-90"
                onClick={() => {
                  navigator.clipboard.writeText(meetingLink);
                  toast({
                    title: "Link Copied",
                  });
                }}
              >
                {" "}
                <Copy size={14} /> Copy Meet link
              </button>
            </div>
          )}

          {!isPersonalRoom && <EndCallButton />}
        </div>
      </div>
    </section>
  );
};

export default MeetingRoom;
