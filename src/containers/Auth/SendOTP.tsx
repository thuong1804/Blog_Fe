"use client";

import Button from "@/components/Button/Button";
import InputField from "@/components/InputField/InputField";
import { path } from "@/constant/path";
import { SEND_OTP } from "@/graphql/Mutation/Auth";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const SendOTPContainer = () => {
    const [inputEmail, setInputEmail] = useState<string>("");
    const [sendOtp, { loading }] = useMutation(SEND_OTP);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const res = await sendOtp({ variables: { email: inputEmail } });
            if (res.data.sendOTP.success) {
                const EXPIRE_KEY = "otp_expire_time";
                localStorage.removeItem(EXPIRE_KEY);

                if (res.data.sendOTP.expiresAt) {
                    localStorage.setItem(
                        EXPIRE_KEY,
                        String(Number(res.data.sendOTP.expiresAt)),
                    );
                }
                console.log(res.data.sendOTP);

                await fetch("/api/send-otp", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: inputEmail }),
                });

                toast.success(
                    "OTP has been sent to your email. Please check your inbox!",
                );
                router.push(path.verifyOtp);
            } else {
                toast.error(res.data.sendOTP.message);
            }
        } catch (error) {
            const err = error as Error;
            toast.error(err.message);
        }
    };

    return (
        <div className="w-full h-full flex justify-center items-center">
            <div className=" bg-white rounded-box shadow-2xs p-14 flex flex-col items-center gap-2">
                <h1>Verify your email</h1>
                <form
                    onSubmit={handleSubmit}
                    className="opacity-90 max-w-[450px] w-[450px] mt-10"
                >
                    <div className="flex flex-col gap-3">
                        <InputField.Email
                            title="Email"
                            required
                            type="email"
                            placeholder="@email.com"
                            value={inputEmail}
                            onChange={(value) => setInputEmail(value)}
                        />
                    </div>
                    <div className="flex items-center justify-end w-full mt-8">
                        <Button
                            loading={loading}
                            type="submit"
                            classNames="w-max rounded-[10px]"
                            title="Send email"
                            disabled={loading}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};
export default SendOTPContainer;
