"use client";
import * as React from "react";

interface MeetingParams {
  id: string;
}

interface MeetingProps {
  params: Promise<MeetingParams>;
}

function Meeting({ params }: MeetingProps) {
  // asynchronous access of `params.id`
  const { id } = React.use(params);
  return <p>ID: {id}</p>;
}

export default Meeting;
