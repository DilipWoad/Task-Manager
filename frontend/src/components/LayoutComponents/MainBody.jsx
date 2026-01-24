import { Outlet } from "react-router";
import { useEffect } from "react";
import useToastCard from "../../hooks/useToastCard.js";
import ToastCard from "../../utils/ToastCard.jsx";

const MainBody = () => {
  const {
    showToastCard,
    animation,
    setAnimation,
    setToastCardMessage,
    toastCardMessage,
    setShowToastCard,
  } = useToastCard();

  useEffect(() => {
    if (showToastCard) {
      setAnimation(false); // Reset animation state
      const hideTimer = setTimeout(() => {
        setAnimation(true); // Start slide-out animation
        const resetTimer = setTimeout(() => {
          setShowToastCard(false);
          setAnimation(false); // Reset animation for next time
          setToastCardMessage("");
        }, 1000);
         // Allow animation to complete (e.g., 1000ms for slide-out)
        return () => clearTimeout(resetTimer);
      }, 3000); // Toast visible duration before slide-out starts (e.g., 1500ms)

      return () => clearTimeout(hideTimer);
    }
  }, [showToastCard]);
  return (
    <>
      <main className={`flex-1  rounded-r-md `}>
        <Outlet />
        {showToastCard && (
          <ToastCard
            animation={animation}
            toastCardMessage={toastCardMessage}
          />
        )}
        
      </main>
    </>
  );
};

export default MainBody;
