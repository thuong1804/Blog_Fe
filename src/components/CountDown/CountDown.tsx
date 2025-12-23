import { useEffect, useState } from "react";

interface OtpCountdownProps {
    onComplete: () => void;
    resetFlag: boolean;
    onResetDone: () => void;
}

export default function OtpCountdown({
    onComplete,
    resetFlag,
    onResetDone,
}: OtpCountdownProps) {
    const [counter, setCounter] = useState(0);
    const [expireTime, setExpireTime] = useState<number | null>(null);
    const minutes = Math.floor(counter / 60);
    const seconds = counter % 60;

    useEffect(() => {
        const storedExpire = localStorage.getItem("otp_expire_time");
        if (storedExpire) {
            setExpireTime(Number(storedExpire));
        }
    }, [resetFlag]);

    useEffect(() => {
        if (!expireTime) return;

        const updateCounter = () => {
            const now = Date.now();
            const remaining = Math.max(
                0,
                Math.floor((expireTime - now) / 1000),
            );
            setCounter(remaining);
            if (remaining === 0) onComplete();
        };

        updateCounter();
        const timer = setInterval(updateCounter, 1000);

        return () => clearInterval(timer);
    }, [expireTime, onComplete]);

    useEffect(() => {
        if (resetFlag) onResetDone();
    }, [resetFlag, onResetDone]);

    return (
        <span className="countdown text-lg font-bold">
            <span style={{ "--value": minutes } as React.CSSProperties}></span>:
            <span style={{ "--value": seconds } as React.CSSProperties}></span>
        </span>
    );
}
