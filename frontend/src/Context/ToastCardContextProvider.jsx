import { createContext, useState } from "react";

const ToastCardContext = createContext({});

export const ToastCardContextProvider = ({ children }) => {
  const [showToastCard, setShowToastCard] = useState(false);
  const [toastCardMessage, setToastCardMessage] = useState("");
  const [animation, setAnimation] = useState(false);

  console.log("show toast ::",showToastCard)
  console.log("show toast msg::",toastCardMessage)
  console.log("show toast animation::",animation)

  return (
    <ToastCardContext.Provider
      value={{
        showToastCard,
        setShowToastCard,
        toastCardMessage,
        setToastCardMessage,
        animation,
        setAnimation,
      }}
    >
      {children}
    </ToastCardContext.Provider>
  );
};

export default ToastCardContext;
