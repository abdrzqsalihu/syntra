"use client";

import { ArrowLeft, DoorClosed, Loader2, ShieldCheck, UserX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";

import {
  cancelJoinRequest,
  getMeetingAccess,
  requestToJoin,
} from "@/actions/meeting.actions";
import { Button } from "@/components/ui/button";
import type { MeetingAccess } from "@/lib/meetingAccess";
import Loader from "../Loader";

export type AccessApi = {
  get: (callId: string) => Promise<MeetingAccess>;
  request: (callId: string) => Promise<MeetingAccess>;
  cancel: (callId: string) => Promise<void>;
};

const serverApi: AccessApi = {
  get: getMeetingAccess,
  request: requestToJoin,
  cancel: cancelJoinRequest,
};

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-ink text-white">
      <header className="flex items-center justify-between border-b border-gray-900/80 px-4 py-3 sm:px-8">
        <Link href="/dashboard" aria-label="Syntra dashboard">
          <Image src="/logo-2.png" width={100} height={32} alt="Syntra" className="h-auto w-24" priority />
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-gray-900/80 bg-dark-3/80 p-6 text-center sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

const Badge = ({ children }: { children: ReactNode }) => (
  <span className="mx-auto flex size-14 items-center justify-center rounded-full border border-dark-2/30 bg-dark-2/15 text-dark-2">
    {children}
  </span>
);

/**
 * Only lets people who are the host or have been admitted through to the meeting.
 * This screen is guidance for the visitor; the real enforcement is Stream refusing
 * to let a non-admitted user join (see lib/meetingAccess.ts).
 */
export default function AccessGate({
  callId,
  children,
  api = serverApi,
}: {
  callId: string;
  children: ReactNode;
  api?: AccessApi;
}) {
  const [access, setAccess] = useState<MeetingAccess>();
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setAccess(await api.get(callId));
      setFailed(false);
    } catch (e) {
      console.error(e);
      setFailed(true);
    }
  }, [api, callId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // While waiting, check whether the host has answered.
  const waiting = access?.status === "pending";
  useEffect(() => {
    if (!waiting) return;
    const t = setInterval(refresh, 2000);
    return () => clearInterval(t);
  }, [waiting, refresh]);

  if (!access) {
    if (failed)
      return (
        <Shell>
          <h1 className="text-xl font-bold">Could not check your access</h1>
          <p className="mt-2 text-sm text-white/70">Check your connection and try again.</p>
          <Button variant="accent" className="mt-6" onClick={refresh}>
            Try again
          </Button>
        </Shell>
      );
    return (
      <div className="flex h-dvh items-center justify-center bg-ink">
        <Loader />
      </div>
    );
  }

  if (access.status === "host" || access.status === "member") return <>{children}</>;

  if (access.status === "notfound")
    return (
      <Shell>
        <Badge>
          <DoorClosed size={26} aria-hidden />
        </Badge>
        <h1 className="mt-5 text-xl font-bold">Meeting not found</h1>
        <p className="mt-2 text-sm text-white/70">
          This link may be incorrect, or the meeting is no longer available.
        </p>
        <Button asChild variant="accent" className="mt-6">
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </Shell>
    );

  if (access.status === "denied")
    return (
      <Shell>
        <Badge>
          <UserX size={26} aria-hidden />
        </Badge>
        <h1 className="mt-5 text-xl font-bold">Request declined</h1>
        <p className="mt-2 text-sm text-white/70">
          {access.hostName} did not let you into &ldquo;{access.title}&rdquo;.
        </p>
        <Button asChild variant="accent" className="mt-6">
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </Shell>
    );

  if (access.status === "pending")
    return (
      <Shell>
        <Badge>
          <Loader2 size={26} className="animate-spin" aria-hidden />
        </Badge>
        <h1 className="mt-5 text-xl font-bold">Waiting to be let in</h1>
        <p role="status" className="mt-2 text-sm text-white/70">
          {access.hostName} has been notified. You will join &ldquo;{access.title}&rdquo; as soon as they
          admit you. Keep this page open.
        </p>
        <Button
          variant="quiet"
          className="mt-6"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await api.cancel(callId);
              await refresh();
            } finally {
              setBusy(false);
            }
          }}
        >
          Cancel request
        </Button>
      </Shell>
    );

  // status: "none". The visitor is signed in but has not been admitted.
  return (
    <Shell>
      <Badge>
        <ShieldCheck size={26} aria-hidden />
      </Badge>
      <h1 className="mt-5 text-xl font-bold">{access.title}</h1>
      <p className="mt-2 text-sm text-white/70">
        {access.hostName} needs to let you in before you can join this meeting.
      </p>
      <Button
        variant="accent"
        size="lg"
        className="mt-6 w-full"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            setAccess(await api.request(callId));
          } catch (e) {
            console.error(e);
            setFailed(true);
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? <Loader2 className="animate-spin" aria-hidden /> : "Ask to join"}
      </Button>
      <Button asChild variant="ghost" size="sm" className="mt-3 text-white hover:bg-white/10 hover:text-white">
        <Link href="/dashboard">
          <ArrowLeft aria-hidden /> Back to dashboard
        </Link>
      </Button>
    </Shell>
  );
}
