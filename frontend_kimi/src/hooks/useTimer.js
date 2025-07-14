import { useState, useRef } from "react";

export default function useTimer() {
    const [time, setTime] = useState(0);
    const intervalRef = useRef(null);

    const startTimer = () => {
        if (intervalRef.current) return;
        intervalRef.current = setInterval(() => setTime((t) => t + 1), 1000);
    };

    const addPenalty = (sec) => setTime((t) => t + sec);

    return { time, startTimer, addPenalty };
}
