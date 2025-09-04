'use client'

import { usePathname } from "next/navigation";
import FormEditProfile from "./FormEditProfile";
import FormChangePassword from "./FormChangePassword";
import { useAuth } from "@/context/AuthContext/AuthContext";

const ProfileContainer = () => {
  const pathName = usePathname()
  const formatPathName = pathName.split('/')[2]
  const {user} = useAuth()
  const isEdit = formatPathName === 'edit-profile'
  return (
    <>
      {isEdit ? <FormEditProfile /> : user?.provider !== 'google' ? <FormChangePassword /> : null}
    </>
  )
}
export default ProfileContainer;