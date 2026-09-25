"use client";

import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { Check, X } from "lucide-react";
import { useState } from "react";

import { respondToJoinRequest } from "@/actions/meeting.actions";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type Respond = (callId: string, guestId: string, allow: boolean) => Promise<void>;

/**
 * Shown to the host inside the meeting: people who opened the link and are waiting to be let in.
 * Requests arrive in real time as call membership changes.
 */
export default function JoinRequests({ respond = respondToJoinRequest }: { respond?: Respond }) {
  const call = useCall();
  const { toast } = useToast();
  const { useCallMembers, useCallCreatedBy, useLocalParticipant } = useCallStateHooks();
  const members = useCallMembers();
  const createdBy = useCallCreatedBy();
  const me = useLocalParticipant();
  const [answered, setAnswered] = useState<Set<string>>(new Set());

  const isHost = !!me && !!createdBy && me.userId === createdBy.id;
  if (!call || !isHost) return null;

  const pending = (members ?? []).filter(
    (m) => m.role === "pending" && m.custom?.status !== "denied" && !answered.has(m.user_id)
  );
  if (pending.length === 0) return null;

  const answer = async (guestId: string, allow: boolean) => {
    setAnswered((s) => new Set(s).add(guestId));
    try {
      await respond(call.id, guestId, allow);
    } catch (e) {
      console.error(e);
      setAnswered((s) => {
        const next = new Set(s);
        next.delete(guestId);
        return next;
      });
      toast({ title: "Could not update the request", description: "Try again in a moment." });
    }
  };

  return (
    <div
      role="region"
      aria-live="polite"
      aria-label="People waiting to join"
      className="pointer-events-none absolute inset-x-0 top-2 z-20 flex flex-col items-center gap-2 px-3 md:items-end md:px-5"
    >
      {pending.map((m) => {
        const name = m.user?.name || m.user_id;
        return (
          <div
            key={m.user_id}
            className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl border border-gray-900/80 bg-dark-3 p-2.5 pl-3 shadow-2xl"
          >
            {m.user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.user.image} alt="" className="size-9 shrink-0 rounded-full object-cover" />
            ) : (
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-dark-2/35 bg-dark-2/15 text-sm font-bold">
                {name.charAt(0).toUpperCase()}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{name}</p>
              <p className="text-xs text-white/60">wants to join</p>
            </div>
            <Button
              variant="quiet"
              size="sm"
              className="h-9 px-3"
              onClick={() => answer(m.user_id, false)}
              aria-label={`Deny ${name}`}
            >
              <X aria-hidden /> Deny
            </Button>
            <Button
              variant="accent"
              size="sm"
              className="h-9 px-3"
              onClick={() => answer(m.user_id, true)}
              aria-label={`Admit ${name}`}
            >
              <Check aria-hidden /> Admit
            </Button>
          </div>
        );
      })}
    </div>
  );
}
