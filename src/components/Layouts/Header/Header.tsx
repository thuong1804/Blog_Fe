import { FaBlogger } from "react-icons/fa";
import Link from "next/link";
import SearchBar from "@/components/SearchBar/SearchBar";
import CategoriesPage from "@/containers/Categories/Categories";
import Button from "@/components/Button/Button";
import { cookies } from "next/headers";
import { getCurrentUserFromToken } from "@/lib/Session";
import DropdownInfoProfile from "./DropdownInfoProfile";

export default async function HeaderLayout(){
  const token = (await cookies()).get("accessToken")?.value
  const user = await getCurrentUserFromToken(token);

  return (
    <div className="w-full bg-white py-5 border-0">
      <div className="flex justify-center items-center text-(--text-color-title)">
        <div className="max-w-[1234px] flex justify-between items-center w-full">
          <Link href="/" className="flex items-center pr-2.5">
            <FaBlogger className="text-[70px]" />
            <span className="font-bold text-3xl">TECHNEWS</span>
          </Link>
          <div className="flex-1 pr-5">
            <SearchBar />
          </div>
          <div className="flex-none">
            <ul className="px-1 flex items-center text-[16px] gap-7 text-(--text-color-title)">
              <li className="font-bold hover:text-purple-400 transition">
                <Link href="/blog">Blog</Link>
              </li>
              <li className="font-bold hover:text-purple-400 transition">
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/contact">
                  <Button title="Contact Us" />
                </Link>
              </li>
              <li>
                <DropdownInfoProfile user={user}/>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-[1234px] mx-auto text-(--text-color-title) w-full flex items-center justify-between relative mt-2.5">
        <CategoriesPage />
      </div>
    </div>
  );
};
