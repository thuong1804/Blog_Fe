'use client'

import { useAuth } from "@/context/AuthContext/AuthContext";
import { renderImage } from "@/utils";
import { usePathname } from "next/navigation";

const HeaderProfile = () => {
  const pathName = usePathname()
  const formatPathName = pathName.split('/')[2]
  const {user} = useAuth()

  const labelPathName: Record<string, string> = {
    ['edit-profile']: 'Edit Profile',
    ['password']: 'Password',
  };

  return (
    <div className="flex items-center gap-3">
      <div className="avatar">
        <div className="w-16 rounded-full">
          {renderImage(user?.avatar)}
        </div>
      </div>
      <p className="text-2xl text-black font-normal">{user?.name}</p>
      <p className="text-2xl">/</p>
      <p className="text-2xl text-black font-normal">{labelPathName[formatPathName]}</p>
    </div>
  )
}
export default HeaderProfile;