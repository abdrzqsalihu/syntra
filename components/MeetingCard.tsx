"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";

interface MeetingCardProps {
  title: string;
  date: string;
  icon: React.ReactNode;
  isPreviousMeeting?: boolean;
  buttonIcon1?: string;
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
    <section className="flex min-h-[258px] w-full flex-col justify-between rounded-lg bg-dark-3/80 px-8 py-8 xl:max-w-[568px]">
      <article className="flex flex-col gap-5">
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
            <Button onClick={handleClick} className="rounded-md bg-dark-2 px-8">
              {buttonIcon1 && (
                <Image src={buttonIcon1} alt="feature" width={20} height={20} />
              )}
              &nbsp; {buttonText}
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
