'use client'

import EditorForm from "@/components/Editor/Editor";
import DropdownInfoProfile from "@/components/Layouts/Header/DropdownInfoProfile";
import { useAuth } from "@/context/AuthContext/AuthContext";
import Image from "next/image";
import Link from "next/link";
import FormPostField from "./FormPostField";
import Button from "@/components/Button/Button";

const FormNewPostContainer = () => {
  const {user} = useAuth()

  const handleSubmit = (values) => {
    console.log(values)
  }

  return (
    <div className="max-w-[1400px] mx-auto p-5">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center pr-2.5 gap-2">
          <div className="avatar relative">
            <div className="w-15 rounded-full h-auto">
              <Image src="/images/blog-icon.png" alt="icon" fill/>
            </div>
          </div>
          <span className="font-bold text-3xl">TECHNEWS</span>
        </Link>
        {user && <DropdownInfoProfile user={user} />}
      </div>
      <div className="w-full h-[1000px] flex gap-3 mt-5">
        <div className="flex flex-col w-[55%] bg-white rounded-xl border-2 gap-2 p-2 pt-5 shadow-md">
          <h1 className="text-center">New post</h1>
          <div className="divider before:bg-gray-300 after:bg-gray-300 text-gray-500"/>
          <div className="mt-2 flex-1">
            <FormPostField user={user} onSubmit={handleSubmit}/>
            <EditorForm />
            <div className="flex justify-end mt-5">
              <Button type="submit" title="Save profile" />
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 items-center bg-white rounded-xl h-full w-full border-2 gap-5 p-2 pt-5 shadow-md">
          <h3 className="text-(--text-color-title) text-aline text-2xl font-medium">Preview</h3>
        </div>
      </div>
    </div>
  )
}
export default FormNewPostContainer;