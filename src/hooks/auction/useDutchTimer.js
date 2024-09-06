import { useEffect } from "react";
import useCountDown from "../useCountDown";
import { useState } from "react";

const useDutchTimer = ({data, callbackWhenEnd}) => {
  // Don't touch this!
  const [currentRemainingTime, setCurrentRemainingTime] = useState(
    Date.now()/1000 < data.startTime 
      ? data.startTime - Date.now()/1000 
      : (
        Math.min(
          Math.floor((Date.now()/1000 - data.startTime)/data.stepDuration) + 1, data.numberOfStep
        ) + 1 <= data.numberOfStep 
        ? data.stepDuration - (Math.ceil(Date.now()/1000) - data.startTime) % data.stepDuration 
        : 0
      )
  );
  const [currentStep, setCurrentStep] = useState(
    Date.now()/1000 < data.startTime 
    ? 0
    : Math.min(
      Math.floor((Math.ceil(Date.now()/1000) - data.startTime)/data.stepDuration) + 1, 
      data.numberOfStep
    )
  );  
  const [currentPrice, setCurrentPrice] = useState(
    Date.now()/1000 < data.startTime 
    ? data.startingPrice
    : data.startingPrice - BigInt(currentStep - 1) * ((data.startingPrice - data.minimumPrice) / BigInt(data.numberOfStep - 1))
  );
  const { hours, minutes, seconds, ended } = useCountDown(currentRemainingTime, data.status != 1);
  useEffect(() => {
    if(ended && currentStep < data.numberOfStep) {
      setTimeout(() => {
        setCurrentRemainingTime(
          Date.now()/1000 < data.startTime 
          ? data.startTime - Date.now()/1000 
          : (
            currentStep + 1 <= data.numberOfStep 
            ? data.stepDuration - (Math.ceil(Date.now()/1000) - data.startTime) % data.stepDuration 
            : 0
          )
        );
        const tempCurrentStep = 
          Date.now()/1000 < data.startTime 
          ? 0
          : Math.min(Math.floor((Math.ceil(Date.now()/1000) - data.startTime)/data.stepDuration) + 1, data.numberOfStep);
        setCurrentStep(tempCurrentStep);
        setCurrentPrice(
          Date.now()/1000 < data.startTime 
          ? data.startingPrice
          : (data.startingPrice - BigInt(tempCurrentStep - 1) * ((data.startingPrice - data.minimumPrice) / BigInt(data.numberOfStep - 1)))
        );
        if(callbackWhenEnd) callbackWhenEnd();
      }, 1000);
    }
    const intervalId = setInterval(() => { // setInterval để giảm sai số của JS
      setCurrentRemainingTime(
        Date.now()/1000 < data.startTime 
        ? data.startTime - Date.now()/1000 
        : (
          currentStep + 1 <= data.numberOfStep 
          ? data.stepDuration - (Math.ceil(Date.now()/1000) - data.startTime) % data.stepDuration 
          : 0
        )
      );
      const tempCurrentStep = 
        Date.now()/1000 < data.startTime 
        ? 0
        : Math.min(Math.floor((Math.ceil(Date.now()/1000) - data.startTime)/data.stepDuration) + 1, data.numberOfStep);
      setCurrentStep(tempCurrentStep);
      setCurrentPrice(
        Date.now()/1000 < data.startTime 
        ? data.startingPrice
        : (data.startingPrice - BigInt(tempCurrentStep - 1) * ((data.startingPrice - data.minimumPrice) / BigInt(data.numberOfStep - 1)))
      );
    }, 5000);
    return () => clearInterval(intervalId);
  }, [ended, data.stepDuration, data.startTime, data.startingPrice, data.minimumPrice, data.numberOfStep, currentStep]);
  return {
    hours, minutes, seconds, ended, currentStep, currentPrice
  }
}

export default useDutchTimer;