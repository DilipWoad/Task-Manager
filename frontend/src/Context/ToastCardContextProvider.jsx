import { createContext, useState } from "react";

const ToastCardContext = createContext({});

export const ToastCardContextProvider = ({ children }) => {
  const [showToastCard, setShowToastCard] = useState(false);
  const [toastCardMessage, setToastCardMessage] = useState("");
  const [animation, setAnimation] = useState(false);

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
