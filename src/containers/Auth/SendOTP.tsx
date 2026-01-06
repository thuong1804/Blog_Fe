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

                await fetch("/api/send-otp", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
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
            toast.error((error as Error).message);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6">
            <div className="w-full max-w-md bg-white rounded-box shadow-2xs p-6 sm:p-10 lg:p-14">
                <h1 className="text-center text-2xl sm:text-3xl font-semibold">
                    Verify your email
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="mt-8 sm:mt-10 w-full opacity-90"
                >
                    <div className="flex flex-col gap-3">
                        <InputField.Email
                            title="Email"
                            required
                            type="email"
                            placeholder="@email.com"
                            value={inputEmail}
                            onChange={setInputEmail}
                        />
                    </div>

                    <div className="flex w-full mt-6 sm:mt-8 justify-center sm:justify-end">
                        <Button
                            loading={loading}
                            type="submit"
                            disabled={loading}
                            title="Send email"
                            classNames="
                                w-full
                                sm:w-max
                                rounded-[10px]
                                px-8
                            "
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SendOTPContainer;
