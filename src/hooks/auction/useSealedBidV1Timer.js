import { useEffect } from "react";
import useCountDown from "../useCountDown";
import { useState } from "react";

const useSealedBidV1Timer = ({data, callbackWhenEnd}) => {
  const [currentRemainingTime, setCurrentRemainingTime] = useState(
    data.startTime == "0" ? 
    (data.endTime > Date.now()/1000 ? data.endTime - Date.now()/1000 : 0) :
    (data.startTime + data.revealDuration > Date.now()/1000 ? 
      data.startTime + data.revealDuration - Date.now()/1000 : 
      0
    )
  );
  const { hours, minutes, seconds, ended } = useCountDown(currentRemainingTime, data.status != 1);
  useEffect(() => {
    if(ended){
      setTimeout(() => {
        setCurrentRemainingTime(
          data.startTime == "0" ? 
          (data.endTime > Date.now()/1000 ? data.endTime - Date.now()/1000 : 0) :
          (data.startTime + data.revealDuration > Date.now()/1000 ? 
            data.startTime + data.revealDuration - Date.now()/1000 : 
            0
          )
        );
      }, 1000);
      if(callbackWhenEnd) callbackWhenEnd();
    }
    const intervalId = setInterval(() => {
      setCurrentRemainingTime(
        data.startTime == "0" ? 
        (data.endTime > Date.now()/1000 ? data.endTime - Date.now()/1000 : 0) :
        (data.startTime + data.revealDuration > Date.now()/1000 ? 
          data.startTime + data.revealDuration - Date.now()/1000 : 
          0
        )
      );
    }, 5000);
    return () => clearInterval(intervalId);
  }, [data.endTime, data.startTime, data.revealDuration, ended]);
  return {
    hours, minutes, seconds, ended
  }
}

export default useSealedBidV1Timer;