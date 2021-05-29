import "../styles/globals.css";
import "../styles/RoomListContainer.scss";
import "../styles/ChatRoom.scss";
import "../styles/AppContainer.scss";
import "../styles/ImageUpload.scss"
import ContextWrapper from "../components/ContextWrapper";

function MyApp({ Component, pageProps }) {
  return (
    <ContextWrapper>
      <Component {...pageProps} />
    </ContextWrapper>
  );
}

export default MyApp;
