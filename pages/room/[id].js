import React from "react";
import RoomListContainer from "../../components/RoomListContainer";
import ChatRoom from "../../components/ChatRoom";
import { db } from "../../firebase";

export default function Room({ roomName }) {
  return (
    <div className="container ">
      <div className="app__container">
        <RoomListContainer />

        <ChatRoom roomName={roomName} />
      </div>
    </div>
  );
}
export async function getServerSideProps(context) {
  const rooms = db.collection("rooms").doc(context.query.id);

  const roomId = await rooms.get();

  const room = {
    id: roomId.id,
    ...roomId.data(),
  };

  return {
    props: {
      roomName: JSON.stringify(room),
    },
  };
}
