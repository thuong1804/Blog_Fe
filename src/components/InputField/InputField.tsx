'use client'

import { InputHTMLAttributes, ReactNode, useState } from "react";
import { FaEye, FaEyeLowVision } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";

interface BaseInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  title?: string;
  classNames?: string;
  disabled?: boolean;
  required?: boolean;
  icon?: ReactNode;
  customMsg?: string,
  customIcon?: ReactNode,
  onChange?: (value: string) => void;
  type?: string;
}

const BaseInput: React.FC<BaseInputProps> = ({
  value,
  required,
  placeholder,
  customIcon,
  name,
  onChange,
  type = "text",
  title,
  customMsg,
  minLength,
  maxLength,
  disabled,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  const renderValidate = (type: string) => {
    const val = String(value ?? "");

    if (!val) {
      return `${title || "This field"} is required`
    }

    if (minLength && val.length < minLength) {
      return `${title || "This field"} must be at least ${minLength} characters`;
    }

    if (maxLength && val.length > maxLength) {
      return `${title || "This field"} must be at most ${maxLength} characters`;
    }

    switch (type) {
      case "email":
        return "Enter a valid email address";
      case "password":
        return (
          <>
            Must be more than 8 characters, including <br />
            At least one number <br />
            At least one lowercase letter <br />
            At least one uppercase letter
          </>
        );
      case "tel":
        return "Must be 10 digits";
      case "text":
      default:
        return null;
    }
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case "email":
        return (
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <rect width="20" height="16" x="2" y="4" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </g>
          </svg>
        );
      case "password":
        return (
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
              <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
            </g>
          </svg>
        );
      case "tel":
        return (
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
          >
            <g fill="none">
              <path
                d="M7.25 11.5C6.83579 11.5 6.5 11.8358 6.5 12.25C6.5 12.6642 6.83579 13 7.25 13H8.75C9.16421 13 9.5 12.6642 9.5 12.25C9.5 11.8358 9.16421 11.5 8.75 11.5H7.25Z"
                fill="currentColor"
              ></path>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 1C4.61929 1 3.5 2.11929 3.5 3.5V12.5C3.5 13.8807 4.61929 15 6 15H10C11.3807 15 12.5 13.8807 12.5 12.5V3.5C12.5 2.11929 11.3807 1 10 1H6ZM10 2.5H9.5V3C9.5 3.27614 9.27614 3.5 9 3.5H7C6.72386 3.5 6.5 3.27614 6.5 3V2.5H6C5.44771 2.5 5 2.94772 5 3.5V12.5C5 13.0523 5.44772 13.5 6 13.5H10C10.5523 13.5 11 13.0523 11 12.5V3.5C11 2.94772 10.5523 2.5 10 2.5Z"
                fill="currentColor"
              ></path>
            </g>
          </svg>
        );
      case "text":
        return (
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </g>
          </svg>
        );
      default:
        return null;
    }
  };

  const message = customMsg ? customMsg : renderValidate(type);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <fieldset className="fieldset relative w-full">
      <legend className="fieldset-legend text-black text-sm">{title}</legend>
      <label className={twMerge("input validator input-lg bg-white text-black border border-gray-400 w-full flex items-center gap-2 px-2",
        disabled && "bg-gray-300 text-gray-500 pointer-events-none "
      )}>
        {customIcon ? <span className="h-[1em] opacity-50">{customIcon}</span> : renderIcon(type)}
        <input
          type={inputType}
          name={name}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={handleOnChange}
          minLength={minLength}
          maxLength={maxLength}
          className="flex-1 outline-none bg-transparent"
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-500 hover:text-black text-sm cursor-pointer"
          >
            {showPassword ? <FaEyeLowVision /> : <FaEye />}
          </button>
        )}
      </label>
      {message && (
        <div className="validator-hint hidden">{message}</div>
      )}
    </fieldset>
  );
};

const InputField = {
  Text: (props: BaseInputProps) => <BaseInput {...props} type="text" />,
  Email: (props: BaseInputProps) => <BaseInput {...props} type="email" />,
  Password: (props: BaseInputProps) => <BaseInput {...props} pattern="(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{9,}" minLength={8} maxLength={15} type="password" />,
  Tel: (props: BaseInputProps) => <BaseInput {...props} type="tel" />,
};

export default InputField;
