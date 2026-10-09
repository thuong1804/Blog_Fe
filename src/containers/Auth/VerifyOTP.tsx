"use client";

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
    const [verifyOTP] = useMutation(VERIFY_OTP);
    const [sendOTP] = useMutation(SEND_OTP);
    const [email, setEmail] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [resetCountdown, setResetCountdown] = useState<boolean>(false);
    const [resetFlag, setResetFlag] = useState(false);
    const [resending, setResending] = useState(false);
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));

    const router = useRouter();

    const handleOnChange = (otp: string) => {
        if (!otp) return;

        setLoading(true);

        setTimeout(async () => {
            try {
                const res = await verifyOTP({
                    variables: { email, code: otp },
                });

                if (res.data.verifyOTP.success) {
                    toast.success(res.data.verifyOTP.message);
                    // Token goes to an httpOnly cookie (never localStorage).
                    await fetch("/api/auth/reset-token", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            token: res.data.verifyOTP.resetToken,
                        }),
                    });
                    router.push(path.changePassword);
                } else {
                    toast.error(res.data.verifyOTP.message);
                    setOtp(Array(6).fill(""))
                }
            } catch {
                toast.error("Verification failed. Please try again.");
                setOtp(Array(6).fill(""))
            } finally {
                setLoading(false);
            }
        }, 2000);
    };

    const handleResetOtp = async () => {
        if (resending) return; // throttle: one resend at a time
        setResending(true);
        const EXPIRE_KEY = "otp_expire_time";
        localStorage.removeItem(EXPIRE_KEY);
        setResetCountdown(false);

        try {
            const res = await sendOTP({ variables: { email } });
            if (res.data.sendOTP.success) {
                toast.success(
                    "OTP has been sent to your email. Please check your inbox!",
                );

                if (res.data.sendOTP.expiresAt) {
                    localStorage.setItem(
                        EXPIRE_KEY,
                        String(Number(res.data.sendOTP.expiresAt)),
                    );
                    setResetFlag(true);
                }
            } else {
                toast.error(res.data.sendOTP.message);
            }
        } catch {
            toast.error("Could not resend the code. Please try again.");
        } finally {
            setResending(false);
        }
    };
    console.log(otp)
    useEffect(() => {
        fetch("/api/get-email")
            .then((res) => res.json())
            .then((data) => setEmail(data.email));
    }, []);

    return (
        <div className="w-full flex justify-center px-4 sm:px-6">
            <div className="w-full max-w-md bg-white rounded-box shadow-2xs p-6 sm:p-8">
                <div className="w-full flex flex-col items-center gap-8 sm:gap-10">
                    <h1 className="text-center text-2xl sm:text-3xl font-semibold">
                        OTP Verification
                    </h1>

                    <OtpInput
                        onChange={handleOnChange}
                        disabled={loading}
                        setOtp={setOtp}
                        otp={otp}
                    />

                    <div className="w-full flex justify-center">
                        {resetCountdown ? (
                            <Button
                                title={resending ? "Sending..." : "Resend OTP"}
                                onClick={handleResetOtp}
                                disabled={resending}
                                loading={resending}
                                classNames="w-full sm:w-max px-8"
                            />
                        ) : (
                            <OtpCountdown
                                resetFlag={resetFlag}
                                onComplete={() =>
                                    setResetCountdown(true)
                                }
                                onResetDone={() => setResetFlag(false)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTPContainer;
