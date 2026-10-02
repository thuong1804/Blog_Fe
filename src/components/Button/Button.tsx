import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type SizeButton = "btn-sm" | "btn-lg" | "btn-xl";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    title?: string;
    size?: SizeButton;
    classNames?: string;
    disabled?: boolean;
    loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    loading,
    children,
    title,
    size,
    classNames,
    disabled = false,
    ...rest
}) => {
    return (
        <button
            {...rest}
            disabled={disabled}
            className={twMerge(
                "btn bg-[#6D28D9] hover:bg-[#4C1D95] text-white rounded-[8px] shadow border-0 flex items-center justify-center px-[38px] py-[26px] w-max",
                "transition-all duration-300 ease-in-out",
                !disabled && "hover:shadow-lg hover:scale-105",
                disabled && "bg-[#EDE9FE] text-gray-500 cursor-not-allowed",
                size,
                classNames,
            )}
        >
            {children ? children : title}
            {loading && (
                <span className="loading loading-spinner loading-sm"></span>
            )}
        </button>
    );
};
export default Button;
