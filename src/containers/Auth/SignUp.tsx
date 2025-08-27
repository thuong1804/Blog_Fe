import Button from "@/components/Button/Button"
import InputField from "@/components/InputField/InputField";
import { SIGNUP } from "@/graphql/Mutation/Signup";
import { useMutation } from "@apollo/client";
import Link from "next/link"
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

const SignupContainer = () => {

  const [form, setForm] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  })

  const [signup, { loading, error }] = useMutation(SIGNUP);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    signup({ variables: { ...form } });

    if (error) {
      return toast.error(error.message)
    }

    toast.success("✅ Thanks for subscribing! Check your inbox for our latest stories.");
  };

  const onChangeValueInput = (fieldName: string, value:string) => {
    setForm((prev) => ({
      ...prev,
      [fieldName]: value
    }))
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className=" bg-white rounded-box shadow-2xs p-14 flex flex-col items-center gap-2">
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit} className=" opacity-90 max-w-[400px] w-[400px] mt-10">
          <div className="flex flex-col gap-3">
            <InputField.Email
              title="Email"
              placeholder="@email.com"
              value={form.email}
              required
              onChange={(value) => onChangeValueInput('email', value)}
            />
            <InputField.Text
              title="Name"
              placeholder="Name"
              maxLength={100}
              required
              value={form.name}
              minLength={10}
              onChange={(value) => onChangeValueInput('name', value)}
            />
            <InputField.Password
              title="Password"
              required
              value={form.password}
              placeholder="Password"
              onChange={(value) => onChangeValueInput('password', value)}
            />
            <InputField.Password
              title="Password"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={(value) => onChangeValueInput('confirmPassword', value)}
              customMsg={
                form.confirmPassword && form.confirmPassword !== form.password
                  ? "Passwords do not match"
                  : undefined
              }
            />
          </div>
          <div className="w-full flex justify-end mt-5">
            <Link href='/' className="text-sm font-normal  hover:text-blue-400 hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center w-full mt-8">
            <Button type="submit" classNames="w-full rounded-[30px]" title="Sign Up" disabled={loading}/>
            <div className="divider before:bg-gray-300 after:bg-gray-300 text-gray-500">OR</div>
            <Button type="button" classNames=" bg-white w-full rounded-[30px] flex items-center justify-center gap-2 w-full  hover:bg-gray-100 transition">
              <FcGoogle className="text-xl" />
              <span className="text-gray-700 font-medium">Login with Google</span>
            </Button>
          </div>
          <div className="w-full flex justify-center mt-5">
            Already have an account? <Link className="ml-2 text-blue-500 underline" href='/signin'>Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
export default SignupContainer