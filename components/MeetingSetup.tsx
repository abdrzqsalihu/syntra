"use client";
import { useUser } from "@clerk/nextjs";
import {
  DeviceSelectorAudioInput,
  DeviceSelectorAudioOutput,
  DeviceSelectorVideo,
  VideoPreview,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { ArrowLeft, ChevronDown, Copy, Loader2, Mic, MicOff, Settings2, Video, VideoOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ControlButton } from "./meeting/ControlButton";
import { releaseDevices } from "./meeting/releaseDevices";

/** Shown in the preview when the camera is off, blocked or still starting. */
const CameraOffPreview = ({ name, image, message }: { name: string; image?: string; message: string }) => (
  <div className="flex size-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-dark-3 via-dark-4 to-dark-5">
    {image ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={image} alt="" className="size-20 rounded-full object-cover ring-2 ring-white/10 sm:size-24" />
    ) : (
      <span className="flex size-20 items-center justify-center rounded-full bg-dark-2/20 text-3xl font-bold text-white sm:size-24">
        {name.charAt(0).toUpperCase()}
      </span>
    )}
    <p className="text-sm text-white/70">{message}</p>
  </div>
);

const MeetingSetup = ({
  setIsSetupComplete,
}: {
  setIsSetupComplete: (value: boolean) => void;
}) => {
  const call = useCall();
  const { user } = useUser();
  const { toast } = useToast();
  const [joining, setJoining] = useState(false);
  const [showDevices, setShowDevices] = useState(false);

  if (!call) {
    throw new Error("usecall must be used within StreamCall component");
  }

  const { useMicrophoneState, useCameraState, useCallCustomData } = useCallStateHooks();
  const mic = useMicrophoneState();
  const cam = useCameraState();
  const custom = useCallCustomData();

  // Start with camera and mic on. Both can be switched off before joining.
  const joinedRef = useRef(false);
  useEffect(() => {
    call.camera.enable().catch(() => {});
    call.microphone.enable().catch(() => {});
    // Leaving the setup screen without joining must turn the camera and mic back off.
    return () => {
      if (!joinedRef.current) releaseDevices(call);
    };
  }, [call]);

  const name = user?.fullName || user?.username || "You";
  const title = (custom?.description as string | undefined) || "Meeting";
  const micOff = mic.optionsAwareIsMute || !mic.hasBrowserPermission;
  const camOff = cam.optionsAwareIsMute || !cam.hasBrowserPermission;
  const blocked = !mic.hasBrowserPermission || !cam.hasBrowserPermission;

  const join = async () => {
    setJoining(true);
    try {
      await call.join();
      joinedRef.current = true;
      setIsSetupComplete(true);
    } catch (e) {
      console.error(e);
      toast({
        title: "Could not join the meeting",
        description: "Check your connection and try again.",
      });
      setJoining(false);
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/meeting/${call.id}`);
    toast({ title: "Meeting link copied" });
  };

  return (
    <div className="flex min-h-dvh flex-col bg-ink text-white">
      <header className="flex items-center justify-between border-b border-gray-900/80 px-4 py-3 sm:px-8">
        <Link href="/dashboard" aria-label="Back to dashboard">
          <Image src="/logo-2.png" width={100} height={32} alt="Syntra" className="h-auto w-24" priority />
        </Link>
        <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/10 hover:text-white">
          <Link href="/dashboard">
            <ArrowLeft aria-hidden /> Dashboard
          </Link>
        </Button>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 content-center gap-6 px-4 pb-32 pt-6 sm:px-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-10 lg:pb-8 lg:pt-8">
        {/* Camera preview */}
        <section aria-label="Camera preview" className="min-w-0">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-gray-900/80 bg-dark-3 sm:aspect-video">
            <VideoPreview
              DisabledVideoPreview={() => (
                <CameraOffPreview name={name} image={user?.imageUrl} message="Camera is off" />
              )}
              NoCameraPreview={() => (
                <CameraOffPreview name={name} image={user?.imageUrl} message="No camera found" />
              )}
              StartingCameraPreview={() => (
                <CameraOffPreview name={name} image={user?.imageUrl} message="Starting camera…" />
              )}
            />
            <span className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-md bg-ink/70 px-2.5 py-1 text-xs font-semibold backdrop-blur">
              {micOff && <MicOff size={12} className="text-live" aria-hidden />}
              {name}
            </span>
            <div className="absolute inset-x-0 bottom-3 flex justify-center gap-3">
              <ControlButton
                label={micOff ? "Unmute microphone" : "Mute microphone"}
                tone={micOff ? "off" : "default"}
                pressed={!micOff}
                disabled={!mic.hasBrowserPermission || mic.isTogglePending}
                onClick={() => mic.microphone.toggle()}
                className="bg-ink/70 backdrop-blur"
              >
                {micOff ? <MicOff size={20} aria-hidden /> : <Mic size={20} aria-hidden />}
              </ControlButton>
              <ControlButton
                label={camOff ? "Turn camera on" : "Turn camera off"}
                tone={camOff ? "off" : "default"}
                pressed={!camOff}
                disabled={!cam.hasBrowserPermission || cam.isTogglePending}
                onClick={() => cam.camera.toggle()}
                className="bg-ink/70 backdrop-blur"
              >
                {camOff ? <VideoOff size={20} aria-hidden /> : <Video size={20} aria-hidden />}
              </ControlButton>
            </div>
          </div>
          {blocked && (
            <p role="alert" className="mt-3 rounded-lg bg-yellow-1/10 px-3 py-2 text-sm text-yellow-1">
              Camera or microphone access is blocked. Allow access in your browser&rsquo;s site settings to be seen and heard.
            </p>
          )}
        </section>

        {/* Details and devices */}
        <section className="min-w-0 space-y-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-white/50">Ready to join?</p>
            <h1 className="mt-1 truncate text-2xl font-bold md:text-3xl">{title}</h1>
            <button
              type="button"
              onClick={copyLink}
              className="mt-3 inline-flex items-center gap-2 rounded-lg border border-gray-900/80 bg-white/[0.04] px-3 py-1.5 text-xs text-white/70 transition-colors hover:bg-white/[0.08] hover:text-white"
            >
              <span className="tabular-nums">/meeting/{call.id.slice(0, 8)}…</span>
              <Copy size={12} aria-hidden />
              <span className="sr-only">Copy meeting link</span>
            </button>
          </div>

          <button
            type="button"
            aria-expanded={showDevices}
            onClick={() => setShowDevices((v) => !v)}
            className="flex w-full items-center justify-between rounded-xl border border-gray-900/80 bg-dark-3/80 px-4 py-3 text-sm font-semibold lg:hidden"
          >
            <span className="flex items-center gap-2">
              <Settings2 size={16} aria-hidden /> Audio and video settings
            </span>
            <ChevronDown size={16} className={cn("transition-transform", showDevices && "rotate-180")} aria-hidden />
          </button>

          <div
            className={cn(
              "space-y-5 rounded-xl border border-gray-900/80 bg-dark-3/80 p-4 sm:p-5 lg:block",
              showDevices ? "block" : "hidden"
            )}
          >
            <DeviceSelectorAudioInput visualType="dropdown" title="Microphone" />
            <DeviceSelectorVideo visualType="dropdown" title="Camera" />
            <DeviceSelectorAudioOutput visualType="dropdown" title="Speaker" speakerTestVisible={false} />
          </div>

          <div
            className={cn(
              "fixed inset-x-0 bottom-0 z-20 flex flex-col gap-2 border-t border-gray-900/80 bg-ink/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur",
              "lg:static lg:z-auto lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none"
            )}
          >
            <Button
              variant="accent"
              size="xl"
              className="w-full"
              disabled={joining}
              onClick={join}
            >
              {joining ? (
                <>
                  <Loader2 className="animate-spin" aria-hidden /> Joining…
                </>
              ) : (
                "Join meeting"
              )}
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MeetingSetup;
