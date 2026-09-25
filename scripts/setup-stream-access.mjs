// Configures Stream so that only people the host has admitted can join a meeting.
//
//   pnpm stream:access
//
// Idempotent. Run it once per Stream app (development and production).
// It creates two roles and rewrites the grants of the "default" call type:
//   - user        every signed-in user: can create and read calls, but cannot join or manage them
//   - pending     someone who asked to join: read-only, cannot join
//   - participant someone the host admitted: can join and use audio, video, screen share and reactions
//   - admin       the host (added by the server when a meeting is created): unchanged
// Nothing here can be bypassed from the browser, because Stream enforces it on its API.
import { StreamClient } from "@stream-io/node-sdk";
import fs from "node:fs";

const env = { ...Object.fromEntries(
  (fs.existsSync(".env.local") ? fs.readFileSync(".env.local", "utf8") : "")
    .split(/\r?\n/).filter((l) => l.includes("=")).map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
), ...process.env };

const apiKey = env.NEXT_PUBLIC_STREAM_API_KEY;
const secret = env.STREAM_SECRET_KEY;
if (!apiKey || !secret) throw new Error("NEXT_PUBLIC_STREAM_API_KEY and STREAM_SECRET_KEY are required");

const client = new StreamClient(apiKey, secret);

for (const name of ["pending", "participant"]) {
  try {
    await client.createRole({ name });
    console.log("created role", name);
  } catch {
    console.log("role exists", name);
  }
}

const grants = {
  user: ["create-call", "read-call"],
  pending: ["read-call"],
  participant: [
    "join-call",
    "read-call",
    "send-audio",
    "send-video",
    "screenshare",
    "create-call-reaction",
    "send-event",
    "list-recordings",
    "enable-noise-cancellation-any-team",
  ],
};

await client.video.updateCallType({ name: "default", grants });
const t = await client.video.getCallType({ name: "default" });
for (const role of Object.keys(grants)) console.log(role.padEnd(12), (t.grants[role] || []).join(", "));
