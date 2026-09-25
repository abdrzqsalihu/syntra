"use client";
import {
  CallParticipantsList,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  StreamTheme,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { Circle, Copy, Users, WifiOff } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useToast } from "@/hooks/use-toast";
import Loader from "./Loader";
import JoinRequests from "./meeting/JoinRequests";
import RoomControls, { type CallLayoutType } from "./meeting/RoomControls";
import { releaseDevices } from "./meeting/releaseDevices";

const MeetingRoom = () => {
  const { toast } = useToast();
  const call = useCall();
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get("personal");
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const [layout, setLayout] = useState<CallLayoutType>("speaker-left");
  const [showParticipants, setShowParticipants] = useState(false);

  const {
    useCallCallingState,
    useCallCustomData,
    useIsCallRecordingInProgress,
    useParticipantCount,
  } = useCallStateHooks();
  const callingState = useCallCallingState();
  const custom = useCallCustomData();
  const isRecording = useIsCallRecordingInProgress();
  const participantCount = useParticipantCount();

  // If the page is left any other way (back button, closing the route), leave the call and free the devices.
  // The timer keeps React StrictMode's simulated unmount from leaving the call in development.
  const leaveTimer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    if (!call) return;
    clearTimeout(leaveTimer.current);
    return () => {
      leaveTimer.current = setTimeout(async () => {
        await call.leave().catch(() => {});
        await releaseDevices(call);
      }, 0);
    };
  }, [call]);

  const hasLeft = callingState === CallingState.LEFT;
  useEffect(() => {
    if (hasLeft && call) releaseDevices(call);
  }, [hasLeft, call]);

  if (hasLeft) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-4 bg-ink px-6 text-center text-white">
        <h1 className="text-2xl font-bold">Meeting ended</h1>
        <p className="max-w-sm text-sm text-white/70">You have left this meeting.</p>
        <Button asChild variant="accent">
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    );
  }

  if (callingState === CallingState.JOINING || callingState === CallingState.IDLE) {
    return (
      <div className="flex h-dvh items-center justify-center bg-ink text-white">
        <Loader />
      </div>
    );
  }

  const title =
    (custom?.description as string | undefined) ||
    (isPersonalRoom ? "Personal room" : "Meeting");
  const disconnected =
    callingState === CallingState.RECONNECTING ||
    callingState === CallingState.OFFLINE ||
    callingState === CallingState.MIGRATING;

  const copyLink = async () => {
    if (!call) return;
    await navigator.clipboard.writeText(`${window.location.origin}/meeting/${call.id}`);
    toast({ title: "Meeting link copied" });
  };

  const renderLayout = () => {
    if (layout === "grid") return <PaginatedGridLayout />;
    // On small screens the participant strip sits below the speaker.
    if (!isDesktop) return <SpeakerLayout participantsBarPosition="bottom" />;
    return (
      <SpeakerLayout
        participantsBarPosition={layout === "speaker-right" ? "left" : "right"}
      />
    );
  };

  return (
    <section className="relative flex h-dvh w-full flex-col overflow-hidden bg-ink text-white">
      <header className="flex shrink-0 items-center justify-between gap-3 px-3 pb-1.5 pt-[max(0.5rem,env(safe-area-inset-top))] md:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <h1 className="truncate text-sm font-bold">{title}</h1>
          <span
            className="flex shrink-0 items-center gap-1 rounded-full bg-white/[0.07] px-2 py-0.5 text-xs tabular-nums text-white/70"
            aria-label={`${participantCount} ${participantCount === 1 ? "participant" : "participants"}`}
          >
            <Users size={12} aria-hidden />
            {participantCount}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isRecording && (
            <span
              role="status"
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-live/15 px-2.5 py-1 text-[11px] font-bold text-live"
            >
              <Circle size={7} fill="currentColor" className="animate-pulse-live" aria-hidden />
              Recording
            </span>
          )}
          <Button
            variant="quiet"
            size="sm"
            onClick={copyLink}
            className="hidden h-8 gap-1.5 px-3 text-xs text-white md:inline-flex"
          >
            <Copy size={14} aria-hidden /> Copy invite link
          </Button>
        </div>
      </header>

      {disconnected && (
        <div
          role="status"
          className="mx-3 mb-2 flex items-center gap-2 rounded-lg bg-yellow-1/15 px-3 py-2 text-sm font-semibold text-yellow-1 md:mx-5"
        >
          <WifiOff size={16} aria-hidden /> Reconnecting…
        </div>
      )}

      <div className="relative flex min-h-0 flex-1 justify-center px-2 pb-2 md:px-5">
        <JoinRequests />
        <div className="relative flex h-full w-full max-w-[1400px] gap-3">
        <div className="relative min-w-0 flex-1">
          <div className="h-full">{renderLayout()}</div>

          {participantCount <= 1 && (
            <div className="pointer-events-none absolute inset-x-0 top-3 z-10 flex justify-center px-3">
              <div className="pointer-events-auto flex max-w-full items-center gap-2 rounded-xl border border-gray-900/80 bg-dark-3/95 py-1.5 pl-3 pr-1.5 text-xs shadow-xl backdrop-blur">
                <span className="truncate text-white/80">You&rsquo;re the only one here.</span>
                <Button variant="accent" size="sm" onClick={copyLink} className="h-8 shrink-0 gap-1.5 px-3 text-xs">
                  <Copy aria-hidden /> Copy link
                </Button>
              </div>
            </div>
          )}
        </div>

        {showParticipants && isDesktop && (
          <aside className="w-72 shrink-0" aria-label="Participants">
            <CallParticipantsList onClose={() => setShowParticipants(false)} />
          </aside>
        )}
        </div>
      </div>

      <RoomControls
        layout={layout}
        onLayout={setLayout}
        panelOpen={showParticipants}
        onTogglePanel={() => setShowParticipants((v) => !v)}
        isPersonal={isPersonalRoom}
      />

      {!isDesktop && (
        <Sheet open={showParticipants} onOpenChange={setShowParticipants}>
          <SheetContent
            side="bottom"
            className="h-[75dvh] rounded-t-2xl border-gray-900/80 bg-ink p-0 text-white"
          >
            <SheetTitle className="sr-only">Participants</SheetTitle>
            {/* The sheet supplies its own close button, so hide the list's. */}
            <StreamTheme className="syntra-call h-full !bg-transparent p-3 pt-12 [&_.str-video__participant-list]:border-0 [&_.str-video__participant-list]:p-0 [&_.str-video__participant-list-header__close-button]:hidden">
              <CallParticipantsList onClose={() => setShowParticipants(false)} />
            </StreamTheme>
          </SheetContent>
        </Sheet>
      )}
    </section>
  );
};

export default MeetingRoom;
