"use client";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";

interface MeetingCardProps {
  title: string;
  date: string;
  icon: React.ReactNode;
  isPreviousMeeting?: boolean;
  buttonIcon1?: React.ReactNode;
  buttonText?: string;
  handleClick: () => void;
  link: string;
}

const MeetingCard = ({
  icon,
  title,
  date,
  isPreviousMeeting,
  buttonIcon1,
  handleClick,
  link,
  buttonText,
}: MeetingCardProps) => {
  const { toast } = useToast();

  return (
    <section className="flex w-full flex-col gap-3 justify-between rounded-lg bg-dark-3/80 px-8 py-10 xl:max-w-[568px]">
      <article className="flex flex-col gap-3">
        {icon}
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-lg md:text-2xl font-bold">{title}</h1>
            <p className="text-sm md:text-base font-normal text-white/70">
              {date}
            </p>
          </div>
        </div>
      </article>
      <article className={cn("flex md:justify-end relative", {})}>
        {!isPreviousMeeting && (
          <div className="flex gap-2.5">
            <Button
              onClick={handleClick}
              className="rounded-md bg-dark-2 px-8 flex gap-1"
            >
              {buttonIcon1 && <div>{buttonIcon1}</div>}
              {buttonText}
            </Button>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(link);
                toast({
                  title: "Link Copied",
                });
              }}
              className="bg-dark-4 border border-gray-800/80 p-4 py-5 flex gap-0.5 rounded-md"
            >
              <Copy />
              &nbsp; Copy Link
            </Button>
          </div>
        )}
      </article>
    </section>
  );
};

export default MeetingCard;
