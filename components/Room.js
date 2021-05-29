import React from "react";

import { useRouter } from "next/router";

export default function Room({ id, roomName }) {
  const router = useRouter();
  const goToChatRoom = () => {
    router.push(`/room/${id}`);
  };
  return (
    <>
      <h2 onClick={goToChatRoom}>{roomName}</h2>
    </>
  );
}
