import "server-only";
import { StreamClient } from "@stream-io/node-sdk";

/**
 * Meeting access control, independent of how the caller was authenticated.
 * The server actions in actions/meeting.actions.ts call these with the signed-in Clerk user.
 *
 * Stream enforces who can join through role grants (see scripts/setup-stream-access.mjs):
 *   admin       the host, added when a meeting is created
 *   participant admitted by the host, can join
 *   pending     asked to join, read-only
 * Everyone else has no join permission, so the browser cannot bypass this.
 */

export type MeetingUser = { id: string; name: string; image?: string };

export type MeetingAccess =
  | { status: "notfound" }
  | { status: "none" | "pending" | "denied" | "host" | "member"; title: string; hostName: string };

const streamClient = () => {
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
  const apiSecret = process.env.STREAM_SECRET_KEY;
  if (!apiKey || !apiSecret) throw new Error("Stream credentials are not configured");
  return new StreamClient(apiKey, apiSecret);
};

export async function createMeetingFor(
  user: MeetingUser,
  input: { description?: string; startsAt?: string }
) {
  const client = streamClient();
  await client.upsertUsers([user]);

  const id = crypto.randomUUID();
  await client.video.call("default", id).getOrCreate({
    data: {
      created_by_id: user.id,
      starts_at: input.startsAt ? new Date(input.startsAt) : new Date(),
      custom: { description: input.description || "Instant Meeting" },
      members: [{ user_id: user.id, role: "admin" }],
    },
  });
  return id;
}

/** The personal room is a permanent meeting whose id is the owner's user id. */
export async function ensurePersonalRoomFor(user: MeetingUser) {
  const client = streamClient();
  await client.upsertUsers([user]);

  const call = client.video.call("default", user.id);
  await call.getOrCreate({
    data: {
      created_by_id: user.id,
      starts_at: new Date(),
      members: [{ user_id: user.id, role: "admin" }],
    },
  });
  await call.updateCallMembers({ update_members: [{ user_id: user.id, role: "admin" }] });
  return user.id;
}

/** Reads a user's access to a meeting. Hosts of older meetings are registered as admins here. */
export async function getAccessFor(user: MeetingUser, callId: string): Promise<MeetingAccess> {
  const client = streamClient();
  const call = client.video.call("default", callId);

  let res;
  try {
    res = await call.get();
  } catch {
    return { status: "notfound" };
  }

  const title = (res.call.custom?.description as string | undefined) || "Meeting";
  const hostName = res.call.created_by?.name || "the host";
  const base = { title, hostName };

  if (res.call.created_by?.id === user.id) {
    const me = res.members.find((m) => m.user_id === user.id);
    if (me?.role !== "admin") {
      await client.upsertUsers([user]);
      await call.updateCallMembers({ update_members: [{ user_id: user.id, role: "admin" }] });
    }
    return { status: "host", ...base };
  }

  const member = res.members.find((m) => m.user_id === user.id);
  if (!member) return { status: "none", ...base };
  if (member.role === "pending") {
    return { status: member.custom?.status === "denied" ? "denied" : "pending", ...base };
  }
  return { status: "member", ...base };
}

/** Asks the host to let a user in. The user gets no join permission until the host admits them. */
export async function requestToJoinFor(user: MeetingUser, callId: string): Promise<MeetingAccess> {
  const access = await getAccessFor(user, callId);
  // Hosts and admitted members are already in; a denied request stays denied.
  if (access.status !== "none") return access;

  const client = streamClient();
  await client.upsertUsers([user]);
  await client.video.call("default", callId).updateCallMembers({
    update_members: [
      { user_id: user.id, role: "pending", custom: { status: "pending", requestedAt: Date.now() } },
    ],
  });
  return { ...access, status: "pending" };
}

/** Withdraws a user's own pending request. */
export async function cancelRequestFor(user: MeetingUser, callId: string) {
  const call = streamClient().video.call("default", callId);
  const res = await call.get();
  const member = res.members.find((m) => m.user_id === user.id);
  if (member?.role === "pending") {
    await call.updateCallMembers({ remove_members: [user.id] });
  }
}

/** Host only: admit or deny someone who asked to join. */
export async function respondToRequestFor(
  user: MeetingUser,
  callId: string,
  guestId: string,
  allow: boolean
) {
  const call = streamClient().video.call("default", callId);
  const res = await call.get();

  if (res.call.created_by?.id !== user.id) throw new Error("Only the host can do this");
  const guest = res.members.find((m) => m.user_id === guestId);
  if (!guest || guest.role !== "pending") return;

  await call.updateCallMembers({
    update_members: [
      allow
        ? { user_id: guestId, role: "participant" }
        : { user_id: guestId, role: "pending", custom: { status: "denied" } },
    ],
  });
}
