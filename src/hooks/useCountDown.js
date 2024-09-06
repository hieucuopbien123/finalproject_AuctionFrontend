import { useState, useEffect } from 'react';

function useCountDown(timeInput, needCountdown = true) {
  const [timeLeft, setTimeLeft] = useState(timeInput);
  useEffect(() => {
    setTimeLeft(timeInput);
  }, [timeInput]);

  useEffect(() => {
    if(needCountdown == false) {
      return;
    }
    if (!timeLeft) return;

    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, needCountdown]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = Math.floor(timeLeft % 60);
  return { 
    hours: hours < 10 ? "0" + hours : hours, 
    minutes: minutes < 10 ? "0" + minutes : minutes,
    seconds: seconds < 10 ? "0" + seconds : seconds,
    ended: hours == 0 && minutes == 0 && seconds == 0,
  };
}

export default useCountDown;