import { useEffect, useState } from 'react';

const useCountdown = (targetDate: any) => {
  const countDownDate = targetDate;
  const [countDown, setCountDown] = useState(
    countDownDate - new Date().getTime() / 1000
  );
  const refreshInterval = countDown < 86400 ? 1000 : 5000;

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime() / 1000);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [countDownDate]);

  return getReturnValues(countDown);
};
const getReturnValues = (countDown: any) => {
  // calculate time left
  if (countDown < 0) return [0, 0, 0];
  const days = Math.floor(countDown / (60 * 60 * 24));
  const hours = Math.floor((countDown % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((countDown % (60 * 60)) / 60);
  const seconds = Math.floor(countDown % 60);
  return [days, hours, minutes, seconds];
};

export default useCountdown;
