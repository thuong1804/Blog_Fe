'use client'

import { path } from "@/constant/path"
import Link from "next/link"
import { usePathname } from "next/navigation"

const MenuProfile = () => {
  const pathName = usePathname()
  console.log(pathName)
  const itemMenu = [
    {
    title: 'Edit Profile',
    slug: 'edit-profile',
    },
    {
      title: 'Password',
      slug: 'password'
    }]

  return (
    <div className="flex flex-col gap-2">
      {itemMenu.map((item, key) => {
        return (
          <Link href={`${path.profile}/${item.slug}`} key={key} className="text-gray-600 text-[18px]">{item.title}</Link>
        )
      })}
    </div>
  )
}
export default MenuProfile