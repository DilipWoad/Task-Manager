import { useEffect, useState } from "react";

const useIsMobileScreen = () => {
  const [isMobileScreen, setIsMobileScreen] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleSizeChange = () => {
      //just set mobile scrren width with the same window obj
      setIsMobileScreen(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleSizeChange);

    return () => window.removeEventListener("resize", handleSizeChange);
  }, []);

  return isMobileScreen;
};

export default useIsMobileScreen;
