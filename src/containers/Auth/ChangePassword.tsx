'use client'

import Button from "@/components/Button/Button"
import InputField from "@/components/InputField/InputField"
import { path } from "@/constant/path"
import { RESET_PASSWORD } from "@/graphql/Mutation/Auth"
import { useMutation } from "@apollo/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

const ChangePasswordContainer = () => {
  const router = useRouter()
  const [form, setForm] = useState({
    password: '',
    confirmPassword: ''
  })
  const [resetPassword] = useMutation(RESET_PASSWORD)

  const onChangeValueInput = (fieldName: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const resetToken = localStorage.getItem("resetToken");

      const res = await resetPassword({
        variables: {
          token: resetToken,
          newPassword: form.password
        } });

      if (res.data.resetPassword.success) {
        toast.success(res.data.resetPassword.message)
        router.push(path.signin)
      } else if (res.data.resetPassword.message === 'Token expired') {
        toast.error("Your password reset link has expired. Please request a new one.")
      }

    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
    }

    setForm({
      password: '',
      confirmPassword: ''
    })
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className=" bg-white rounded-box shadow-2xs p-14 flex flex-col items-center gap-10 w-[550px]" >
        <h1>Change password</h1>
        <form className="w-full flex flex-col gap-5" onSubmit={handleSubmitForm}>
          <InputField.Password
            title="New password"
            required
            placeholder="New password"
            value={form.password}
            onChange={(value) => onChangeValueInput('password', value)}
          />
          <InputField.Password
            title="Confirm password"
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={(value) => onChangeValueInput('confirmPassword', value)}
            customMsg={
              form.confirmPassword && form.confirmPassword !== form.password
                ? "Passwords do not match"
                : undefined
            }
          />
          <div className="flex justify-end mt-5">
            <Button type="submit" title="Save" disabled={!form.confirmPassword} />
          </div>
        </form>
      </div>
    </div>
  )
}
export default ChangePasswordContainer