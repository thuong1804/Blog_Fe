'use client'

import Button from "@/components/Button/Button"
import ButtonLoginGoogle from "@/components/ButtonLoginGoogle/ButtonLoginGoogle";
import InputField from "@/components/InputField/InputField";
import { SIGNIN } from "@/graphql/Mutation/Signin";
import { useMutation } from "@apollo/client";
import Link from "next/link"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const SigninContainer = () => {
  const [signin, { loading, error}] = useMutation(SIGNIN)
    const [form, setForm] = useState({
      email: '',
      password: '',
    })

  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    signin({ variables: { ...form } })

    if (error) {
      return toast.error(error.message)
    }

    if (!loading) {
      toast.success("Login success")
      router.push('/')
    }
  }

  const onChangeValueInput = (fieldName: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [fieldName]: value
    }))
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className=" bg-white rounded-box shadow-2xs p-14 flex flex-col items-center gap-2">
        <h1>Login</h1>
        <form onSubmit={handleSubmit} className=" opacity-90 max-w-[400px] w-[400px] mt-10">
          <div className="flex flex-col gap-3">
            <InputField.Email
              title="Email"
              required
              type="email"
              placeholder="@email.com"
              value={form.email}
              onChange={(value) => onChangeValueInput('email', value)}
            />
            <InputField.Password
              title="Password"
              required
              type="password"
              value={form.password}
              placeholder="Password"
              onChange={(value) => onChangeValueInput('password', value)}
            />
          </div>
          <div className="w-full flex justify-end mt-5">
            <Link href='/' className="text-sm font-normal  hover:text-blue-400 hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center w-full mt-8">
            <Button type="submit" classNames="w-full rounded-[30px]" title="LOGIN" />
            <div className="divider before:bg-gray-300 after:bg-gray-300 text-gray-500">OR</div>
            <ButtonLoginGoogle/>
          </div>
          <div className="w-full flex justify-center mt-5">
            Don&apos;t have an account? <Link className="ml-2 text-blue-500 underline" href='/signup'>Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
export default SigninContainer