"use client";
import { cn } from "@/lib/utils";

interface HomeCardProps {
  className?: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  handleClick?: () => void;
}

const HomeCard = ({
  className,
  icon,
  title,
  description,
  handleClick,
}: HomeCardProps) => {
  return (
    <section
      className={cn(
        " p-6 flex flex-col items-center justify-between w-full rounded-xl cursor-pointer text-center",
        className
      )}
      onClick={handleClick}
    >
      <div className="flex items-center justify-center text-white">{icon}</div>

      <div className="flex flex-col gap-1.5 mt-4">
        <h1 className="text-base md:text-lg font-bold text-white">{title}</h1>
        <p className="text-sm text-white/80">{description}</p>
      </div>
    </section>
  );
};

export default HomeCard;
