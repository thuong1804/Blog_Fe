import Button from "@/components/Button/Button"
import InputField from "@/components/InputField/InputField"
import { useAuth } from "@/context/AuthContext/AuthContext"
import { CHANGE_PASSWORD, VALIDATE_PASSWORD } from "@/graphql/Mutation/AuthorQuery"
import { useMutation } from "@apollo/client"
import { useState } from "react"
import { toast } from "sonner"

const FormChangePassword = () => {
  const [form, setForm] = useState({
    password: '',
    confirmPassword: '',
  })

  const [inputOldPassword, setInputOldPassword] = useState<string>('')

  const [changePassword] = useMutation(CHANGE_PASSWORD)
  const [validatePassword] = useMutation(VALIDATE_PASSWORD)
  const { user } = useAuth()
  const [step, setStep] = useState<number>(0)

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const res = await changePassword({
        variables: {
          id: user?.id,
          password: form.password
        }
      })

      if (res.data.changePassword.success) {
        toast.success(res.data.changePassword.message)
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

  const onChangeValueInput = (fieldName: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const handleSubmitOldPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const res = await validatePassword({
        variables: {
          id: user?.id,
          password: inputOldPassword
        }
      })
      if (res.data.validatePassword.success) {
        setStep((pre) => pre + 1)
      } else {
        toast.error('Old password is incorrect!')
      }

    } catch (error) {
      console.log(error)
      const err = error as Error;
      toast.error(err.message);
    }
  }

  return (
    <>
      {step === 0 ? (
        <form className="w-[70%]" onSubmit={handleSubmitOldPassword}>
          <InputField.Password
            title="Old password"
            placeholder="Old password"
            value={inputOldPassword}
            onChange={(value) => setInputOldPassword(value)}
          />
          <div className="flex justify-end mt-5">
            <Button type="submit" title="Next step" disabled={!inputOldPassword} />
          </div>
        </form>
      ) : (
        <form className="w-[70%]" onSubmit={handleSubmitForm}>
          <InputField.Password
            title="New password"
            required
            placeholder="New password"
            value={form.password}
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
          <div className="flex justify-end mt-5">
            <Button type="submit" title="Change password" disabled={!form.confirmPassword} />
          </div>
        </form>
      )
    }
    </>
  )
}
export default FormChangePassword