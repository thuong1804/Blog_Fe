import { twMerge } from "tailwind-merge";

type SizeButton = 'btn-sm' | 'btn-lg' | 'btn-xl';
type ButtonProps = {
  title: string,
  onClick?: () => void;
  size?: SizeButton;
  classNames?: string,
}

const Button: React.FC<ButtonProps> =  ({title, onClick, size, classNames}) => {
   return (
    <button className={twMerge('btn bg-[#7C4EE4] shadow border-0 flex items-center justify-center px-[48px] py-[16px]', size, classNames)} onClick={onClick}>
      {title}
    </button>
  );
}
export default Button;