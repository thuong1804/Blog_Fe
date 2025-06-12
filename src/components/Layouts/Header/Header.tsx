import { FaBlogger } from "react-icons/fa";
import Button from "@/components/Button/Button";
import SearchBar from "@/components/SearchBar/SearchBar";

const HeaderLayout = () => {
  return (
    <div className="flex justify-center items-center w-full bg-white  text-[#333333] py-5 border-0">
      <div className="max-w-[1234px] flex justify-between items-center w-full ">
        <div className="flex items-center">
          <FaBlogger className="text-[70px]" />
          <span className="font-bold text-3xl">TECHNEWS</span>
        </div>
        <div className="flex-1 pr-5"><SearchBar /></div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1 flex items-center text-[16px] gap-5">
            <li><a>Blog</a></li>
            <li><a>About</a></li>
            <li>
              <Button title="Contact Us" classNames="w-[180px] h-[56px]" />
            </li>
          </ul>
        </div>
      </div>
    </div>

  )
}
export default HeaderLayout;