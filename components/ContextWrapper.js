import React, { useState} from "react";
import UserContext from "../context/UserContext";


export default function ContextWrapper({ children }) {
  const [userInContext, setUserInContext] = useState(null);

  return (
    <UserContext.Provider value={{ userInContext, setUserInContext }}>
      {children}
    </UserContext.Provider>
  );
}
