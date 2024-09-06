import { useEffect } from "react";
import useCountDown from "../useCountDown";
import { useState } from "react";

const useEnglishTimer = ({data, callbackWhenEnd}) => {
  const [currentRemainingTime, setCurrentRemainingTime] = useState(
    Date.now()/1000 < data.startTime 
      ? data.startTime - Date.now()/1000 
      : (Date.now()/1000 > data.endTime ? 0 : data.endTime - Date.now()/1000)
  );
  const { hours, minutes, seconds, ended } = useCountDown(currentRemainingTime, data.status != 1);
  useEffect(() => {
    if(ended){
      setTimeout(() => {
        setCurrentRemainingTime(
          Date.now()/1000 < data.startTime 
          ? data.startTime - Date.now()/1000 
          : (Date.now()/1000 > data.endTime ? 0 : data.endTime - Date.now()/1000)
        );
        if(callbackWhenEnd) callbackWhenEnd();
      }, 1000);
    }
    const intervalId = setInterval(() => {
      setCurrentRemainingTime(
        Date.now()/1000 < data.startTime 
        ? data.startTime - Date.now()/1000 
        : (Date.now()/1000 > data.endTime ? 0 : data.endTime - Date.now()/1000)
      );
    }, 5000);
    return () => clearInterval(intervalId);
  }, [data.endTime, data.startTime, ended]);
  return {
    hours, minutes, seconds, ended
  }
}

export default useEnglishTimer;