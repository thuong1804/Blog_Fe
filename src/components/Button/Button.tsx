import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type SizeButton = 'btn-sm' | 'btn-lg' | 'btn-xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  size?: SizeButton;
  classNames?: string;
  disabled?: boolean,
}

const Button: React.FC<ButtonProps> = ({children, title, onClick, size, classNames, disabled = false, ...rest }) => {
  return (
    <button
      {...rest}
      className={twMerge(
        "btn bg-[#7C4EE4] rounded-[8px] shadow border border-gray-300 flex items-center justify-center px-[38px] py-[16px] w-[170px] h-[53px]",
        "transition-all duration-300 ease-in-out",
        !disabled && "hover:bg-[#6A3FD6] hover:shadow-lg hover:scale-105",
        disabled && "bg-[#D1C4E9] text-gray-500 cursor-not-allowed",
        size, classNames)}
        onClick={ !disabled ? onClick : undefined}
    >
      {children ? children : title}
    </button>
  );
}
export default Button;