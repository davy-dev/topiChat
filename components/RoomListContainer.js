import React, { useEffect, useState, useContext, useMemo } from "react";
import { db } from "../firebase";
import firebase from "firebase";
import UserContext from "../context/UserContext";
import { Avatar } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import DeleteIcon from "@material-ui/icons/Delete";
import Room from "./Room";
import { useRouter } from "next/router";

export default function RoomListContainer() {
  const [roomList, setRoomList] = useState([]);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const { userInContext } = useContext(UserContext);

  const createRoom = () => {
    if (userInContext.isAnonymous) {
      alert("Vous ne pouvez pas créer de salons en étant anonyme");
    } else {
      const roomName = prompt("Entrer un nom de Salon");
      db.collection("rooms").add({
        roomEditor: userInContext.displayName,
        roomName: roomName,
      });
    }
  };

  useEffect(() => {
    const unsub = db.collection("rooms").onSnapshot((snapshot) =>
      setRoomList(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          roomName: doc.data().roomName,
          roomEditor: doc.data().roomEditor,
        }))
      )
    );
    return () => {
      unsub();
    };
  }, [roomList]);

  const logout = () => {
    firebase.auth().signOut();
    router.push("/");
  };

  const deleteRoom = (roomId, roomName) => {
    console.log(roomId, roomName);
    if (
      confirm(`Voulez vous vraiment supprimez le salon nommé : ${roomName}`)
    ) {
      db.collection("rooms")
        .doc(roomId)
        .delete()
        .then(() => {
          console.log(`Salon ${roomName} supprimé`);
        });
    }
  };

  return (
    <div className="RoomListContainer">
      <div className="user__profile">
        <Avatar src={userInContext?.photoURL} className="avatar" />
        <h3>
          {userInContext?.isAnonymous === true
            ? userInContext.uid
            : userInContext?.displayName}
        </h3>
        <button onClick={logout}>
          <PowerSettingsNewIcon /> Se déconnecter
        </button>
      </div>
      <div className="room__list">
        <div className="searchBar__Container">
          <SearchIcon />
          <input
            placeholder="Rechercher un salon..."
            type="text"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div onClick={createRoom}>
          <h2 className="addRoom">Ajouter un nouveau salon ...</h2>
        </div>

        {roomList
          .filter((room) => {
            if (searchTerm == "") {
              return room;
            } else if (
              room.roomName
                ?.toLowerCase()
                .includes(searchTerm.toLocaleLowerCase())
            ) {
              return room;
            }
          })
          .map((room, i) => (
            <div className="room" key={i}>
              <Room key={room.id} id={room.id} roomName={room.roomName} />
              {room.roomEditor === userInContext?.displayName && (
                <DeleteIcon
                  onClick={() => deleteRoom(room.id, room.roomName)}
                  className="delete__room"
                />
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
