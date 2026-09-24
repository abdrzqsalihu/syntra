"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CallStatsButton,
  DeviceSelectorAudioInput,
  DeviceSelectorAudioOutput,
  DeviceSelectorVideo,
  OwnCapability,
  Restricted,
  SpeakingWhileMutedNotification,
  StreamTheme,
  defaultEmojiReactionMap,
  defaultReactions,
  useCall,
  useCallStateHooks,
  useToggleCallRecording,
} from "@stream-io/video-react-sdk";
import {
  Check,
  Circle,
  Copy,
  LayoutGrid,
  LogOut,
  Mic,
  MicOff,
  MonitorUp,
  MoreHorizontal,
  PhoneOff,
  PictureInPicture2,
  Smile,
  Settings2,
  Square,
  Users,
  Video,
  VideoOff,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ControlButton, SheetAction } from "./ControlButton";
import { releaseDevices } from "./releaseDevices";

export type CallLayoutType = "grid" | "speaker-left" | "speaker-right";

const layoutLabels: Record<CallLayoutType, string> = {
  "speaker-left": "Speaker, participants on the right",
  "speaker-right": "Speaker, participants on the left",
  grid: "Grid",
};

/* ---------- individual controls ---------- */

function MicButton() {
  const { useMicrophoneState } = useCallStateHooks();
  const { microphone, optionsAwareIsMute, hasBrowserPermission, isTogglePending } =
    useMicrophoneState();
  const muted = optionsAwareIsMute || !hasBrowserPermission;
  return (
    <Restricted requiredGrants={[OwnCapability.SEND_AUDIO]}>
      <SpeakingWhileMutedNotification>
        <ControlButton
          label={
            !hasBrowserPermission
              ? "Microphone blocked. Check your browser permissions"
              : optionsAwareIsMute
              ? "Unmute"
              : "Mute"
          }
          tone={muted ? "off" : "default"}
          pressed={!muted}
          disabled={!hasBrowserPermission || isTogglePending}
          onClick={() => microphone.toggle()}
        >
          {muted ? <MicOff size={20} aria-hidden /> : <Mic size={20} aria-hidden />}
        </ControlButton>
      </SpeakingWhileMutedNotification>
    </Restricted>
  );
}

function CameraButton() {
  const { useCameraState } = useCallStateHooks();
  const { camera, optionsAwareIsMute, hasBrowserPermission, isTogglePending } =
    useCameraState();
  const off = optionsAwareIsMute || !hasBrowserPermission;
  return (
    <Restricted requiredGrants={[OwnCapability.SEND_VIDEO]}>
      <ControlButton
        label={
          !hasBrowserPermission
            ? "Camera blocked. Check your browser permissions"
            : optionsAwareIsMute
            ? "Turn camera on"
            : "Turn camera off"
        }
        tone={off ? "off" : "default"}
        pressed={!off}
        disabled={!hasBrowserPermission || isTogglePending}
        onClick={() => camera.toggle()}
      >
        {off ? <VideoOff size={20} aria-hidden /> : <Video size={20} aria-hidden />}
      </ControlButton>
    </Restricted>
  );
}

function ReactionsButton() {
  const call = useCall();
  return (
    <Restricted requiredGrants={[OwnCapability.CREATE_REACTION]}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ControlButton label="Reactions">
            <Smile size={20} aria-hidden />
          </ControlButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="top"
          align="center"
          className="flex gap-1 rounded-xl border-gray-900/80 bg-dark-3 p-1.5 text-white"
        >
          {defaultReactions.map((r) => (
            <DropdownMenuItem
              key={r.emoji_code}
              aria-label={(r.emoji_code ?? "").replace(/:/g, "")}
              onClick={() => call?.sendReaction(r)}
              className="size-11 cursor-pointer justify-center rounded-lg p-0 text-2xl focus:bg-white/10"
            >
              {r.emoji_code && defaultEmojiReactionMap[r.emoji_code]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </Restricted>
  );
}

function useScreenShare() {
  const { useHasOngoingScreenShare, useScreenShareState, useCallSettings } =
    useCallStateHooks();
  const someoneSharing = useHasOngoingScreenShare();
  const settings = useCallSettings();
  const { screenShare, optionsAwareIsMute, isTogglePending } = useScreenShareState();
  const [supported, setSupported] = useState(false);
  useEffect(() => {
    setSupported(!!navigator.mediaDevices?.getDisplayMedia);
  }, []);

  const sharing = !optionsAwareIsMute;
  const disabled =
    (!sharing && (someoneSharing || settings?.screensharing.enabled === false)) ||
    isTogglePending;
  return { supported, sharing, disabled, toggle: () => screenShare.toggle() };
}

function ShareButton() {
  const { supported, sharing, disabled, toggle } = useScreenShare();
  if (!supported) return null;
  return (
    <Restricted requiredGrants={[OwnCapability.SCREENSHARE]}>
      <ControlButton
        label={sharing ? "Stop sharing" : "Share screen"}
        tone={sharing ? "on" : "default"}
        pressed={sharing}
        disabled={disabled}
        onClick={toggle}
      >
        <MonitorUp size={20} aria-hidden />
      </ControlButton>
    </Restricted>
  );
}

function RecordButton({ onStopRequest }: { onStopRequest: () => void }) {
  const { toggleCallRecording, isAwaitingResponse, isCallRecordingInProgress } =
    useToggleCallRecording();
  return (
    <Restricted
      requiredGrants={[OwnCapability.START_RECORD_CALL, OwnCapability.STOP_RECORD_CALL]}
    >
      <ControlButton
        label={
          isAwaitingResponse
            ? "Please wait…"
            : isCallRecordingInProgress
            ? "Stop recording"
            : "Start recording"
        }
        tone={isCallRecordingInProgress ? "off" : "default"}
        pressed={isCallRecordingInProgress}
        disabled={isAwaitingResponse}
        onClick={() => (isCallRecordingInProgress ? onStopRequest() : toggleCallRecording())}
      >
        {isCallRecordingInProgress ? (
          <Square size={16} fill="currentColor" aria-hidden />
        ) : (
          <Circle size={20} aria-hidden />
        )}
      </ControlButton>
    </Restricted>
  );
}

function useCopyLink() {
  const call = useCall();
  const { toast } = useToast();
  return async () => {
    if (!call) return;
    await navigator.clipboard.writeText(`${window.location.origin}/meeting/${call.id}`);
    toast({ title: "Meeting link copied" });
  };
}

function useMeetingOwner() {
  const { useLocalParticipant, useCallCreatedBy } = useCallStateHooks();
  const me = useLocalParticipant();
  const createdBy = useCallCreatedBy();
  return !!me && !!createdBy && me.userId === createdBy.id;
}

function LeaveMenu({ isPersonal }: { isPersonal: boolean }) {
  const call = useCall();
  const router = useRouter();
  const { toast } = useToast();
  const isOwner = useMeetingOwner();

  const leave = async () => {
    try {
      await call?.leave();
    } catch (e) {
      console.error(e);
    }
    if (call) await releaseDevices(call);
    router.push("/dashboard");
  };
  const end = async () => {
    try {
      await call?.endCall();
      // Ending the call does not release the devices; leave and stop the tracks too.
      await call?.leave().catch(() => {});
      if (call) await releaseDevices(call);
      router.push("/dashboard");
    } catch (e) {
      console.error(e);
      toast({ title: "Could not end the meeting", description: "Try again in a moment." });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ControlButton label="Leave meeting" tone="danger" className="w-12">
          <PhoneOff size={20} aria-hidden />
        </ControlButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        align="end"
        className="min-w-[13rem] rounded-xl border-gray-900/80 bg-dark-3 p-1.5 text-white"
      >
        <DropdownMenuItem
          onClick={leave}
          className="cursor-pointer gap-2 rounded-lg py-2.5 focus:bg-white/10 focus:text-white"
        >
          <LogOut size={16} aria-hidden /> Leave meeting
        </DropdownMenuItem>
        {isOwner && !isPersonal && (
          <>
            <DropdownMenuSeparator className="bg-gray-900" />
            <DropdownMenuItem
              onClick={end}
              className="cursor-pointer gap-2 rounded-lg py-2.5 text-live focus:bg-live/15 focus:text-live"
            >
              <XCircle size={16} aria-hidden /> End for everyone
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function LayoutMenu({
  layout,
  onLayout,
}: {
  layout: CallLayoutType;
  onLayout: (l: CallLayoutType) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ControlButton label="Change layout">
          <LayoutGrid size={20} aria-hidden />
        </ControlButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        align="end"
        className="min-w-[16rem] rounded-xl border-gray-900/80 bg-dark-3 p-1.5 text-white"
      >
        {(Object.keys(layoutLabels) as CallLayoutType[]).map((l) => (
          <DropdownMenuItem
            key={l}
            onClick={() => onLayout(l)}
            className="cursor-pointer justify-between gap-3 rounded-lg py-2.5 focus:bg-white/10 focus:text-white"
          >
            {layoutLabels[l]}
            {layout === l && <Check size={16} className="text-dark-2" aria-hidden />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DevicesSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[85dvh] overflow-y-auto rounded-t-2xl border-gray-900/80 bg-ink px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 text-white md:inset-y-0 md:bottom-auto md:left-auto md:right-0 md:h-full md:max-h-none md:w-[24rem] md:rounded-none md:border-l md:border-t-0"
      >
        <SheetTitle className="text-lg font-bold">Devices</SheetTitle>
        {/* Sheets render in a portal, outside the call theme, so re-apply it here. */}
        <StreamTheme className="syntra-call mt-5 space-y-6 !bg-transparent">
          <DeviceSelectorAudioInput visualType="dropdown" title="Microphone" />
          <DeviceSelectorVideo visualType="dropdown" title="Camera" />
          <DeviceSelectorAudioOutput visualType="dropdown" title="Speaker" />
        </StreamTheme>
      </SheetContent>
    </Sheet>
  );
}

function MoreSheet({
  open,
  onOpenChange,
  layout,
  onLayout,
  onDevices,
  onStopRecording,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  layout: CallLayoutType;
  onLayout: (l: CallLayoutType) => void;
  onDevices: () => void;
  onStopRecording: () => void;
}) {
  const share = useScreenShare();
  const copy = useCopyLink();
  const { toggleCallRecording, isAwaitingResponse, isCallRecordingInProgress } =
    useToggleCallRecording();
  const close = () => onOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-2xl border-gray-900/80 bg-ink px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-6 text-white md:hidden"
      >
        <SheetTitle className="sr-only">More meeting options</SheetTitle>
        <div className="grid grid-cols-3 gap-3">
          {share.supported && (
            <Restricted requiredGrants={[OwnCapability.SCREENSHARE]}>
              <SheetAction
                label={share.sharing ? "Stop sharing" : "Share screen"}
                tone={share.sharing ? "on" : "default"}
                icon={<MonitorUp size={22} aria-hidden />}
                disabled={share.disabled}
                onClick={() => {
                  share.toggle();
                  close();
                }}
              />
            </Restricted>
          )}
          <Restricted
            requiredGrants={[OwnCapability.START_RECORD_CALL, OwnCapability.STOP_RECORD_CALL]}
          >
            <SheetAction
              label={isCallRecordingInProgress ? "Stop recording" : "Record"}
              tone={isCallRecordingInProgress ? "off" : "default"}
              icon={
                isCallRecordingInProgress ? (
                  <Square size={18} fill="currentColor" aria-hidden />
                ) : (
                  <Circle size={22} aria-hidden />
                )
              }
              disabled={isAwaitingResponse}
              onClick={() => {
                close();
                if (isCallRecordingInProgress) onStopRecording();
                else toggleCallRecording();
              }}
            />
          </Restricted>
          <SheetAction
            label="Copy invite link"
            icon={<Copy size={22} aria-hidden />}
            onClick={() => {
              copy();
              close();
            }}
          />
          <SheetAction
            label="Devices"
            icon={<Settings2 size={22} aria-hidden />}
            onClick={() => {
              close();
              onDevices();
            }}
          />
        </div>

        <p className="mb-2 mt-6 text-xs font-bold uppercase tracking-wider text-white/50">Layout</p>
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-white/[0.05] p-1">
          {(["speaker-left", "grid"] as CallLayoutType[]).map((l) => {
            const on = l === "grid" ? layout === "grid" : layout !== "grid";
            return (
              <button
                key={l}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  onLayout(l);
                  close();
                }}
                className={cn(
                  "flex h-11 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors",
                  on ? "bg-dark-2 text-white" : "text-white/70"
                )}
              >
                {l === "grid" ? <LayoutGrid size={16} aria-hidden /> : <PictureInPicture2 size={16} aria-hidden />}
                {l === "grid" ? "Grid" : "Speaker"}
              </button>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ---------- the bars ---------- */

export default function RoomControls({
  layout,
  onLayout,
  panelOpen,
  onTogglePanel,
  isPersonal,
}: {
  layout: CallLayoutType;
  onLayout: (l: CallLayoutType) => void;
  panelOpen: boolean;
  onTogglePanel: () => void;
  isPersonal: boolean;
}) {
  const { useParticipantCount } = useCallStateHooks();
  const count = useParticipantCount();
  const { toggleCallRecording, isAwaitingResponse } = useToggleCallRecording();
  const copy = useCopyLink();
  const [moreOpen, setMoreOpen] = useState(false);
  const [devicesOpen, setDevicesOpen] = useState(false);
  const [confirmStop, setConfirmStop] = useState(false);

  return (
    <>
      <div className="border-t border-gray-900/80 bg-ink/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur md:px-5">
        {/* Mobile: five primary controls; everything else lives in "More". */}
        <div className="mx-auto flex max-w-md items-center justify-between gap-1.5 md:hidden">
          <MicButton />
          <CameraButton />
          <ReactionsButton />
          <ControlButton
            label="Participants"
            tone={panelOpen ? "on" : "default"}
            pressed={panelOpen}
            badge={count}
            onClick={onTogglePanel}
          >
            <Users size={20} aria-hidden />
          </ControlButton>
          <ControlButton label="More options" onClick={() => setMoreOpen(true)}>
            <MoreHorizontal size={20} aria-hidden />
          </ControlButton>
          <LeaveMenu isPersonal={isPersonal} />
        </div>

        {/* Desktop and tablet */}
        <div className="mx-auto hidden max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center gap-4 md:grid">
          <div className="flex items-center">
            <Button variant="quiet" size="sm" onClick={copy} className="gap-2 text-white">
              <Copy aria-hidden /> Copy invite link
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <MicButton />
            <CameraButton />
            <ReactionsButton />
            <ShareButton />
            <RecordButton onStopRequest={() => setConfirmStop(true)} />
            <LeaveMenu isPersonal={isPersonal} />
          </div>
          <div className="flex items-center justify-end gap-2">
            <LayoutMenu layout={layout} onLayout={onLayout} />
            <ControlButton label="Devices" onClick={() => setDevicesOpen(true)}>
              <Settings2 size={20} aria-hidden />
            </ControlButton>
            <div className="[&_.str-video__composite-button]:!size-11 [&_.str-video__composite-button]:!rounded-xl">
              <CallStatsButton />
            </div>
            <ControlButton
              label={panelOpen ? "Hide participants" : "Show participants"}
              tone={panelOpen ? "on" : "default"}
              pressed={panelOpen}
              badge={count}
              onClick={onTogglePanel}
            >
              <Users size={20} aria-hidden />
            </ControlButton>
          </div>
        </div>
      </div>

      <MoreSheet
        open={moreOpen}
        onOpenChange={setMoreOpen}
        layout={layout}
        onLayout={onLayout}
        onDevices={() => setDevicesOpen(true)}
        onStopRecording={() => setConfirmStop(true)}
      />
      <DevicesSheet open={devicesOpen} onOpenChange={setDevicesOpen} />

      <Dialog open={confirmStop} onOpenChange={setConfirmStop}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-sm rounded-xl border-gray-900/80 bg-dark-3 p-6 text-white">
          <DialogTitle className="text-lg font-bold">Stop recording?</DialogTitle>
          <DialogDescription className="text-sm text-white/70">
            The recording will be saved to Recordings once it has finished processing.
          </DialogDescription>
          <div className="mt-2 flex justify-end gap-2">
            <Button variant="quiet" onClick={() => setConfirmStop(false)}>
              Keep recording
            </Button>
            <Button
              variant="accent"
              disabled={isAwaitingResponse}
              onClick={() => {
                toggleCallRecording();
                setConfirmStop(false);
              }}
            >
              Stop recording
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
