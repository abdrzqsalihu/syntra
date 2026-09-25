"use client";
import Loader from "@/components/Loader";
import MeetingRoom from "@/components/MeetingRoom";
import AccessGate from "@/components/meeting/AccessGate";
import MeetingSetup from "@/components/MeetingSetup";
import { Button } from "@/components/ui/button";
import { useGetCallById } from "@/hooks/useGetCallById";
import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import Link from "next/link";
import React, { useState } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

const MeetingContent = ({ id }: { id: string }) => {
  const { isLoaded } = useUser();
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const { call, isCallLoading } = useGetCallById(id);

  if (!isLoaded || isCallLoading)
    return (
      <div className="flex h-dvh items-center justify-center bg-ink text-white">
        <Loader />
      </div>
    );

  if (!call)
    return (
      <main className="flex h-dvh flex-col items-center justify-center gap-4 bg-ink px-6 text-center text-white">
        <h1 className="text-2xl font-bold">Meeting not found</h1>
        <p className="max-w-sm text-sm text-white/70">
          This meeting link may be incorrect, or the meeting is no longer available.
        </p>
        <Button asChild variant="accent">
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </main>
    );

  return (
    <main className="h-dvh w-full bg-ink">
      <StreamCall call={call}>
        <StreamTheme className="syntra-call h-full">
          {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
          ) : (
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

const Meeting = ({ params }: PageProps) => {
  // Unwrap the params Promise using React.use()
  const { id } = React.use(params);

  // Only the host and people the host has admitted get past the gate.
  return (
    <AccessGate callId={id}>
      <MeetingContent id={id} />
    </AccessGate>
  );
};

export default Meeting;
