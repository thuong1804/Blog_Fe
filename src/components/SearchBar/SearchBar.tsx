'use client'

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = () => {
  const [showInput, setShowInput] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push('/blog' + '?' + createQueryString('search', inputValue))
    setInputValue('')
    setShowInput(false)
  }

  const handelOnclickShow = () => {
    setShowInput(pre => !pre)
    inputRef.current?.focus()
  }

  return (
    <div className="w-full relative h-full">
      <form
        className={`w-full transition-all duration-500 ease-out transform
          ${showInput
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-95 translate-y-[-4px] pointer-events-none'}`}
        onSubmit={handleSubmit}
      >
        <div
          className="z-50 flex items-center justify-between bg-white border-2 border-gray-500  rounded-md pl-2 h-12 w-full transition-all duration-200 ease-in-out transform origin-top"
          onBlur={() => setShowInput(false)}
        >
          <input
            type="text"
            placeholder="Search here..."
            name="search"
            className="outline-none text-black flex-1 w-full h-full transition-all duration-300 "
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            className="h-full text-gray-600 hover:text-black p-3 transition-colors duration-300"
            type="submit"
            onMouseDown={(e) => e.preventDefault()}
          >
            <FaSearch className="text-base cursor-pointer" />
          </button>
        </div>
      </form>
      <FaSearch
        className={`text-[20px] text-gray-500 cursor-pointer absolute right-0 top-1/2 transform -translate-y-1/2 transition-all duration-200 ease-out
          ${showInput ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}
        onClick={handelOnclickShow}
      />
    </div>
  )
}
export default SearchBar;