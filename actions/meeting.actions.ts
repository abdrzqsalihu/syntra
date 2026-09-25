"use server";

import { currentUser } from "@clerk/nextjs/server";
import {
  cancelRequestFor,
  createMeetingFor,
  ensurePersonalRoomFor,
  getAccessFor,
  requestToJoinFor,
  respondToRequestFor,
  type MeetingAccess,
  type MeetingUser,
} from "@/lib/meetingAccess";

// Server actions: the signed-in Clerk user is the only identity these ever act as.
// See lib/meetingAccess.ts for how access is enforced.

async function requireUser(): Promise<MeetingUser> {
  const u = await currentUser();
  if (!u) throw new Error("You need to be signed in");
  // Same name the browser client registers with (providers/StreamClientProvider).
  return { id: u.id, name: u.username || u.id, image: u.imageUrl };
}

export async function createMeeting(input: { description?: string; startsAt?: string }) {
  return createMeetingFor(await requireUser(), input);
}

export async function ensurePersonalRoom() {
  return ensurePersonalRoomFor(await requireUser());
}

export async function getMeetingAccess(callId: string): Promise<MeetingAccess> {
  return getAccessFor(await requireUser(), callId);
}

export async function requestToJoin(callId: string): Promise<MeetingAccess> {
  return requestToJoinFor(await requireUser(), callId);
}

export async function cancelJoinRequest(callId: string) {
  return cancelRequestFor(await requireUser(), callId);
}

export async function respondToJoinRequest(callId: string, guestId: string, allow: boolean) {
  return respondToRequestFor(await requireUser(), callId, guestId, allow);
}
