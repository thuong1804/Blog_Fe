'use client'

import { SEND_OTP, VERIFY_OTP } from "@/graphql/Mutation/Auth";
import { useMutation } from "@apollo/client";
import OtpInput from "@/components/InputOTP/InputOTP";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import OtpCountdown from "@/components/CountDown/CountDown";
import Button from "@/components/Button/Button";
import { useRouter } from "next/navigation";
import { path } from "@/constant/path";

const VerifyOTPContainer = () => {
  const [verifyOTP] = useMutation(VERIFY_OTP)
  const [sendOTP] = useMutation(SEND_OTP)
  const [email, setEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [resetCountdown, setResetCountdown] = useState<boolean>(false)
  const [resetFlag, setResetFlag] = useState(false);

  const router = useRouter();

  const handleOnChange = (otp: string) => {
    if (otp) {
      setLoading(true)
      try {
        setTimeout(async () => {
          const res = await verifyOTP({
            variables: { email: email, code: otp }
          })

          if (res.data.verifyOTP.success) {
            toast.success(res.data.verifyOTP.message)
            setLoading(false)

            localStorage.setItem("resetToken", res.data.verifyOTP.resetToken);
            router.push(path.changePassword)
          } else {
            toast.error(res.data.verifyOTP.message)
          }
        }, 2000)
      } catch (error) {
        const err = error as Error
        toast.error(err.message)
      }
    }
  };

  const handleResetOtp = async () => {
    const EXPIRE_KEY = 'otp_expire_time'
    localStorage.removeItem(EXPIRE_KEY)

    setResetCountdown(false)

    try {
      const res = await sendOTP({ variables: { email } })
      if (res.data.sendOTP.success) {
        toast.success('OTP has been sent to your email. Please check your inbox!')
        if (res.data.sendOTP.expiresAt) {
          localStorage.setItem(EXPIRE_KEY, String(Number(res.data.sendOTP.expiresAt)));
          setResetFlag(true)
        }
      } else {
        toast.error(res.data.sendOTP.message)
      }
    } catch (error) {
      const err = error as Error
      toast.error(err.message)
    }
  }

  useEffect(() => {
    fetch('/api/get-email')
      .then(res => res.json())
      .then(data => setEmail(data.email))
  }, [])

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className=" bg-white rounded-box shadow-2xs p-14 flex flex-col items-center gap-2">
        <div className="max-w-[400px] w-[400px] mt-10 flex flex-col items-center gap-10">
          <h1>OTP Verification</h1>
          <OtpInput onChange={handleOnChange} disabled={loading} />
          {resetCountdown ? (
            <Button title="Resend OTP" onClick={handleResetOtp} />
          ) : (
            <OtpCountdown
              resetFlag={resetFlag}
              onComplete={() => setResetCountdown(true)}
              onResetDone={() => setResetFlag(false)}
            />
          )}
        </div>
      </div>
    </div>
  )
}
export default VerifyOTPContainer;