import { useEffect, useState } from 'react';
import styles from './Timer.module.css';

interface TimerProps {
  time: number | undefined; 
  question: string; 
}

export const Timer = ({ time, question }: TimerProps) => {
  const [timer, setTimer] = useState((time ?? 0) / 1000); 

  useEffect(() => {
    setTimer((time ?? 0) / 1000);
  }, [time, question]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0)); 
    }, 1000);

    return () => clearInterval(interval); 
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return <div className={styles.timer}>{formatTime(timer)}</div>;
};
