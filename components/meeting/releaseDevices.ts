import type { Call } from "@stream-io/video-react-sdk";

/** Fully stops camera, microphone and screen share tracks so the browser's camera indicator turns off. */
export async function releaseDevices(call: Call) {
  await Promise.allSettled([
    call.camera.disable(true),
    call.microphone.disable(true),
    call.screenShare.disable(true),
  ]);
}
