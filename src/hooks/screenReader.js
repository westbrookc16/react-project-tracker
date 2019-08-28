import { useState } from "react";
export const useScreenReader = () => {
  const [msg, setMsg] = useState("");
  const setScreenReaderMsg = msg => {
    setMsg(msg);
    setTimeout(() => {
      setMsg("");
    }, 5000);
  };
  return [msg, setScreenReaderMsg];
};
