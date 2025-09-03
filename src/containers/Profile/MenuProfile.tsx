'use client'

import { path } from "@/constant/path"
import { useAuth } from "@/context/AuthContext/AuthContext"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { twMerge } from "tailwind-merge"

const MenuProfile = () => {
  const pathName = usePathname()
  const formatPathName = pathName.split('/')[2]
  const {user} = useAuth()

  const itemMenu = [
    {
      title: 'Edit Profile',
      slug: 'edit-profile',
    },
    ...(user?.provider !== 'google' ? [{
      title: 'Password',
      slug: 'password',
    }] : []),
  ];

  return (
    <div className="flex flex-col gap-2">
      {itemMenu.map((item, key) => {
        return (
          <Link href={`${path.profile}/${item.slug}`} key={key} className={
            twMerge("text-gray-400 text-[18px]", formatPathName === item.slug && "text-black font-medium")
          }>{item.title}</Link>
        )
      })}
    </div>
  )
}
export default MenuProfile