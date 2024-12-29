import { Loader2 } from "lucide-react";
import React from "react";

function Loader() {
  return (
    <div className="flex-center h-screen w-full">
      <Loader2 className="animate-spin" />
    </div>
  );
}

export default Loader;
