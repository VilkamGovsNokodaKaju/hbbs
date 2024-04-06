'use client'

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface TimerProps {
    endTime: BigInt
    small?: boolean
}

export default function Timer({endTime, small}: TimerProps) {
    const [timeLeft, setTimeLeft] = useState(Number(endTime) - Date.now());
    const interval = useRef<number>();
    const router = useRouter();

    useEffect(() => {
        interval.current = window.setInterval(() => {
            setTimeLeft(Number(endTime) - Date.now());
            if (timeLeft < 1000) {
                router.refresh();
            }
        }, 1000);
        return () => clearInterval(interval.current as number);
    });

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return (
        <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
            <div className="flex flex-col">
                <span className={`countdown font-mono ${small ? "text-xl" : "text-5xl"}`}>
                <span style={{"--value":days, "display": "block", "margin": "0 auto"} as React.CSSProperties}></span>
                </span>
                dienām
            </div> 
            <div className="flex flex-col">
                <span className={`countdown font-mono ${small ? "text-xl" : "text-5xl"}`}>
                <span style={{"--value":hours, "display": "block", "margin": "0 auto"} as React.CSSProperties}></span>
                </span>
                stundām
            </div> 
            <div className="flex flex-col">
                <span className={`countdown font-mono ${small ? "text-xl" : "text-5xl"}`}>
                <span style={{"--value":minutes, "display": "block", "margin": "0 auto"} as React.CSSProperties}></span>
                </span>
                minūtēm
            </div> 
            <div className="flex flex-col">
                <span className={`countdown font-mono ${small ? "text-xl" : "text-5xl"}`}>
                <span style={{"--value":seconds, "display": "block", "margin": "0 auto"} as React.CSSProperties}></span>
                </span>
                sekundēm
            </div>
        </div>
    )
}
