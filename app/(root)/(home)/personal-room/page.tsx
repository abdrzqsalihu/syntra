"use client";

import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";

import { useGetCallById } from "@/hooks/useGetCallById";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy, LucideVideo } from "lucide-react";
import { Input } from "@/components/ui/input";

const PersonalRoom = () => {
  const router = useRouter();
  const { user } = useUser();
  const client = useStreamVideoClient();
  const { toast } = useToast();

  const meetingId = user?.id;

  const { call } = useGetCallById(meetingId!);

  const startRoom = async () => {
    if (!client || !user) return;

    const newCall = client.call("default", meetingId!);

    if (!call) {
      await newCall.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
        },
      });
    }

    router.push(`/meeting/${meetingId}?personal=true`);
  };

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingId}?personal=true`;

  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <div className="border border-gray-900/80 px-6 md:px-10 p-10 rounded-xl">
        <h1 className="text-base md:text-xl font-bold text-white">
          Your Personal Meeting Room
        </h1>
        <p className="text-white/90 text-sm mt-1">
          Use this room for quick meetings without scheduling
        </p>
        <section className="mt-6 space-y-5">
          <div className="flex flex-col md:flex-row gap-3 md:gap-0 md:items-center space-x-2">
            <div className="w-24">User:</div>
            <div className="flex-1 flex">
              <Input
                id="room-id"
                value={`${user?.username}'s Meeting Room`}
                readOnly
                className="rounded bg-dark-4 border border-gray-800/80 w-[90%]  md:w-full"
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-3 md:gap-0 md:items-center space-x-2">
            <div className="w-24">Room ID:</div>
            <div className="flex-1 flex">
              <Input
                id="room-id"
                value={meetingId}
                readOnly
                className="rounded-r-none bg-dark-4 border border-gray-800/80 w-[90%] md:w-full"
              />
              <Button
                className="rounded-l-none bg-dark-4 border border-gray-800/80 border-l-0"
                onClick={() => {
                  navigator.clipboard.writeText(meetingId!);
                  toast({
                    title: "Link Copied",
                  });
                }}
              >
                <Copy size={2} />
              </Button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-3 md:gap-0 md:items-center space-x-2">
            <div className="w-24">Meeting Link:</div>
            <div className="flex-1 flex">
              <Input
                id="room-id"
                value={meetingLink}
                readOnly
                className="rounded-r-none bg-dark-4 border border-gray-800/80 w-[90%] md:w-full"
              />
              <Button
                className="rounded-l-none bg-dark-4 border border-gray-800/80 border-l-0"
                onClick={() => {
                  navigator.clipboard.writeText(meetingLink);
                  toast({
                    title: "Link Copied",
                  });
                }}
              >
                <Copy size={2} />
              </Button>
            </div>
          </div>
        </section>

        <Button
          className="rounded-md bg-dark-2 w-full mt-10"
          onClick={startRoom}
        >
          <LucideVideo /> Start Instant Meeting
        </Button>
      </div>
    </section>
  );
};

export default PersonalRoom;
