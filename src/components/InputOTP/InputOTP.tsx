import React, { useState, useRef, ChangeEvent, KeyboardEvent } from "react";
import { twMerge } from "tailwind-merge";

interface OtpInputProps {
    length?: number;
    onChange?: (otp: string, flag: boolean) => void;
    disabled?: boolean;
}

const OtpInput: React.FC<OtpInputProps> = ({
    length = 6,
    onChange,
    disabled,
}) => {
    const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (value: string, index: number) => {
        if (/[^0-9]/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < length - 1) {
            inputsRef.current[index + 1]?.focus();
        }

        if (newOtp.every((digit) => digit === "")) {
            onChange?.("", true);
        } else if (newOtp.every((digit) => digit !== "")) {
            onChange?.(newOtp.join(""), false);
        }
    };

    const handleKeyDown = (
        e: KeyboardEvent<HTMLInputElement>,
        index: number,
    ) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    return (
        <div className="flex justify-center gap-2 sm:gap-3">
            {otp.map((digit, index) => (
                <input
                    key={index}
                    type="text"
                    maxLength={1}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    disabled={disabled}
                    value={digit}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleChange(e.target.value, index)
                    }
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => {
                        inputsRef.current[index] = el;
                    }}
                    className={twMerge(
                        `
                font-bold
                text-center
                border
                border-gray-300
                rounded-lg
                focus:outline-none
                focus:border-blue-500
                bg-white

                w-10 h-10 text-base
                sm:w-12 sm:h-12 sm:text-lg
                md:w-14 md:h-14 md:text-xl
                `,
                        disabled &&
                        "bg-gray-200 cursor-not-allowed focus:border-gray-300",
                    )}
                />
            ))}
        </div>

    );
};

export default OtpInput;
