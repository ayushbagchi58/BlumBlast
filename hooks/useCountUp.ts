import { useEffect, useRef, useState } from "react";

interface UseCountUpOptions {
  start?: number;
  end: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
  delay?: number;
}

export function useCountUp({
  start = 0,
  end,
  duration = 2000,
  decimals = 0,
  prefix = "",
  suffix = "",
  separator = ",",
  delay = 0,
}: UseCountUpOptions) {
  const [count, setCount] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);
  const countRef = useRef(start);
  const frameRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true);
      startTimeRef.current = undefined;

      const animate = (currentTime: number) => {
        if (!startTimeRef.current) {
          startTimeRef.current = currentTime;
        }

        const elapsed = currentTime - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);

        const easeOutExpo = (t: number) => {
          return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        };

        const currentCount = start + (end - start) * easeOutExpo(progress);
        countRef.current = currentCount;
        setCount(currentCount);

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
        }
      };

      frameRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timer);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [start, end, duration, delay]);

  const formatNumber = (num: number) => {
    const fixedNum = num.toFixed(decimals);
    const [integer, decimal] = fixedNum.split(".");
    const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, separator);

    const formattedNumber = decimal ? `${formattedInteger}.${decimal}` : formattedInteger;
    return `${prefix}${formattedNumber}${suffix}`;
  };

  return {
    count: formatNumber(count),
    isAnimating,
  };
}
