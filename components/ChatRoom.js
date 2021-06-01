import React, { useEffect, useState, useContext } from "react";
import UserContext from "../context/UserContext";
import { db } from "../firebase";
import firebase from "firebase";
import moment from "moment";
import ImageUploader from "../components/ImageUpload";

export default function ChatRoom({ roomName }) {
  const [inputValue, setInputValue] = useState("");
  const { userInContext } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [title, setTitle] = useState("");
  moment.locale("fr");

  useEffect(() => {
    const serverSideData = JSON.parse(roomName);
    setTitle(serverSideData.roomName);
    setRoomId(serverSideData.id);
    const unsub = db
      .collection("rooms")
      .doc(serverSideData.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) =>
        setMessages(snapshot.docs.map((doc) => doc.data()))
      );

    return () => {
      unsub();
    };
  }, [roomName, roomId]);

  const sendMessage = () => {
    setMessage(inputValue);
    db.collection("rooms")
      .doc(roomId)
      .collection("messages")
      .add({
        userName:
          userInContext.isAnonymous === true
            ? userInContext.uid
            : userInContext.displayName,
        message: inputValue,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    setInputValue("");
  };

  return (
    <div className="ChatRoom">
      <div className="room__title">
        <h1>{title}</h1>
        <ImageUploader roomId={roomId} userName={userInContext?.displayName} />
      </div>
      <div className="room__messages">
        {messages.map((message, i) => (
          <div key={i} className="message__model">
            {userInContext.isAnonymous && (
              <div
                className="message"
                style={
                  userInContext.uid === message.userName
                    ? {
                        background: "#376e16", marginLeft: "auto",
                      }
                    : { background: "#1158b6" }
                }
              >
                {message.imageUrl && <img src={message.imageUrl} alt="image" />}
                <span>{message.userName}</span>
                {message.message}
                <span className="timestamp">
                  {moment(message.timestamp?.toDate()).format("LLL")}
                </span>
              </div>
            )}
            {!userInContext.isAnonymous && (
              <p
                className="message"
                style={
                  userInContext.displayName === message.userName
                    ? { background: "#376e16", marginLeft: "auto" }
                    : { background: "#1158b6" }
                }
              >
                {" "}
                {message.imageUrl && <img src={message.imageUrl} alt="image" />}
                <span
                  style={
                    userInContext.displayName === message.userName
                      ? { right: "20px" }
                      : {}
                  }
                >
                  {message.userName}
                </span>
                {message.message}
                <span
                  className="timestamp"
                  style={
                    userInContext.displayName === message.userName
                      ? { right: "-20px" }
                      : {}
                  }
                >
                  {moment(message.timestamp?.toDate()).format("LLL")}
                </span>
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="input__container">
        <input
          type="text"
          value={inputValue}
          placeholder="Taper message"
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          disabled={inputValue === "" ? true : false}
          onClick={sendMessage}
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}
