import { LucideLoader } from "lucide-react";
import React from "react";

function Loader() {
  return (
    <div className="flex justify-center items-center w-full">
      <LucideLoader className="animate-spin" />
    </div>
  );
}

export default Loader;
