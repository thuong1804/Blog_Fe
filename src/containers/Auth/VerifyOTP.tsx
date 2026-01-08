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

    const router = useRouter();

    const handleOnChange = (otp: string) => {
        if (!otp) return;

        setLoading(true);
        try {
            setTimeout(async () => {
                const res = await verifyOTP({
                    variables: { email, code: otp },
                });

                if (res.data.verifyOTP.success) {
                    toast.success(res.data.verifyOTP.message);
                    localStorage.setItem(
                        "resetToken",
                        res.data.verifyOTP.resetToken,
                    );
                    router.push(path.changePassword);
                } else {
                    toast.error(res.data.verifyOTP.message);
                }
                setLoading(false);
            }, 2000);
        } catch (error) {
            setLoading(false);
            toast.error((error as Error).message);
        }
    };

    const handleResetOtp = async () => {
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
        } catch (error) {
            toast.error((error as Error).message);
        }
    };

    useEffect(() => {
        fetch("/api/get-email")
            .then((res) => res.json())
            .then((data) => setEmail(data.email));
    }, []);

    return (
        <div className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6">
            <div className="w-full max-w-md bg-white rounded-box shadow-2xs p-6 sm:p-10 lg:p-14">
                <div className="w-full flex flex-col items-center gap-8 sm:gap-10">
                    <h1 className="text-center text-2xl sm:text-3xl font-semibold">
                        OTP Verification
                    </h1>

                    <OtpInput
                        onChange={handleOnChange}
                        disabled={loading}
                    />

                    <div className="w-full flex justify-center">
                        {resetCountdown ? (
                            <Button
                                title="Resend OTP"
                                onClick={handleResetOtp}
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
