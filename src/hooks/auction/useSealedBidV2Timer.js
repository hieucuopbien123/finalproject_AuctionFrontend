import { useEffect } from "react";
import useCountDown from "../useCountDown";
import { useState } from "react";

const useSealedBidV2Timer = ({data, callbackWhenEnd}) => {
  const [currentRemainingTime, setCurrentRemainingTime] = useState(
    Date.now()/1000 < data.startTime ? 
    data.startTime - Date.now()/1000 :
    (data.endTime > Date.now()/1000 ? data.endTime - Date.now()/1000 : 
      (data.startTime + data.revealDuration > Date.now()/1000 ?
        data.startTime + data.revealDuration - Date.now()/1000 :
        0
      )
    )
  );
  const { hours, minutes, seconds, ended } = useCountDown(currentRemainingTime, data.status != 1);
  useEffect(() => {
    if(ended){
      setTimeout(() => {
        setCurrentRemainingTime(
          Date.now()/1000 < data.startTime ? 
          data.startTime - Date.now()/1000 :
          (data.endTime > Date.now()/1000 ? data.endTime - Date.now()/1000 : 
            (data.startTime + data.revealDuration > Date.now()/1000 ?
              data.startTime + data.revealDuration - Date.now()/1000 :
              0
            )
          )
        );
        if(callbackWhenEnd) callbackWhenEnd();
      }, 1000);
    }
    const intervalId = setInterval(() => {
      setCurrentRemainingTime(
        Date.now()/1000 < data.startTime ? 
        data.startTime - Date.now()/1000 :
        (data.endTime > Date.now()/1000 ? data.endTime - Date.now()/1000 : 
          (data.startTime + data.revealDuration > Date.now()/1000 ?
            data.startTime + data.revealDuration - Date.now()/1000 :
            0
          )
        )
      );
    }, 5000);
    return () => clearInterval(intervalId);
  }, [data.endTime, data.startTime, ended, data.revealDuration]);
  return {
    hours, minutes, seconds, ended
  }
}

export default useSealedBidV2Timer;