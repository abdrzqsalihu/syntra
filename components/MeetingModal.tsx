"use client";
import { ReactNode } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import Image from "next/image";
import { DialogTitle } from "@radix-ui/react-dialog";

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  className?: string;
  children?: ReactNode;
  handleClick?: () => void;
  buttonText?: string;
  instantMeeting?: boolean;
  image?: string;
  buttonClassName?: string;
  buttonIcon?: string;
}

const MeetingModal = ({
  isOpen,
  onClose,
  title,
  className,
  children,
  handleClick,
  buttonText,
  buttonIcon,
}: MeetingModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex w-full max-w-md flex-col gap-6 border-none bg-dark-3/80 px-10 py-12 text-white">
        <div className="flex flex-col gap-6">
          <div className={cn("text-2xl font-bold leading-2", className)}>
            <DialogTitle>{title || "Dialog"}</DialogTitle>
          </div>
          {children}
          <Button
            className={
              "bg-dark-2 hover:bg-dark-2/90 focus-visible:ring-0 focus-visible:ring-offset-0 mt-0.5 mx-auto w-full md:w-[75%] rounded-lg"
            }
            onClick={handleClick}
          >
            {buttonIcon && (
              <Image
                src={buttonIcon}
                alt="button icon"
                width={13}
                height={13}
              />
            )}{" "}
            &nbsp;
            {buttonText || "Schedule Meeting"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingModal;
