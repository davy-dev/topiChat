import { Button } from "@material-ui/core";
import React, { useState } from "react";
import firebase from "firebase";
import { db } from "../firebase";


export default function ImageUpload({ userName, roomId }) {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const handleUpload = () => {
    const uploadTask = firebase
      .storage()
      .ref(`images/${image.name}`)
      .put(image);

    uploadTask.on(
      "state-changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (err) => {
        console.log(err);
        alert(err.message);
      },
      () => {
        firebase
          .storage()
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("rooms").doc(roomId).collection("messages").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              userName: userName,
            });
            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };

  return (
    <div className="imageUpload">
      <progress className="imageUpload-progress" value={progress} max="100" />
      <input
        type="text"
        placeholder="Entrer un sous-titre..."
        onChange={(e) => setCaption(e.target.value)}
        value={caption}
      />
      <input type="file" onChange={handleChange} />

      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
}
