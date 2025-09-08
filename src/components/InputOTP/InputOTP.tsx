import React, { useState, useRef, ChangeEvent, KeyboardEvent } from "react";
import { twMerge } from "tailwind-merge";

interface OtpInputProps {
  length?: number;
  onChange?: (otp: string, flag: boolean) => void;
  disabled?: boolean
}

const OtpInput: React.FC<OtpInputProps> = ({ length = 6, onChange, disabled }) => {
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
    }

    else if (newOtp.every((digit) => digit !== "")) {
      onChange?.(newOtp.join(""), false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-3 justify-center">
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          disabled={disabled}
          value={digit}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleChange(e.target.value, index)
          }
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          className={twMerge("font-bold w-12 h-12 text-center border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg bg-white",
            disabled && "bg-gray-300"
          )}
        />
      ))}
    </div>
  );
};

export default OtpInput;
