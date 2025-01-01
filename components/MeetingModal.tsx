"use client";
import { ReactNode } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
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
  icon?: React.ReactNode;
  buttonClassName?: string;
  buttonIcon?: React.ReactNode;
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
  icon,
}: MeetingModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex w-full max-w-md flex-col gap-6 border-none bg-dark-3/80 px-10 py-12 text-white">
        <div className="flex flex-col gap-6">
          {icon && <div className="flex justify-center">{icon}</div>}

          <div
            className={cn(
              "text-2xl font-bold leading-2 text-center",
              className
            )}
          >
            <DialogTitle>{title || "Dialog"}</DialogTitle>
          </div>
          {children}
          <Button
            className={`bg-dark-2 hover:bg-dark-2/90 focus-visible:ring-0 focus-visible:ring-offset-0 mt-0.5 mx-auto flex gap-1 ${
              buttonText === "Start Meeting" ? "w-[80%]" : "w-full"
            } rounded-lg`}
            onClick={handleClick}
          >
            {buttonIcon && buttonIcon} &nbsp;
            {buttonText || "Schedule Meeting"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingModal;
