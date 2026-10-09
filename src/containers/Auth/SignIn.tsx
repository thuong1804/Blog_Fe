"use client";

import Button from "@/components/Button/Button";
import ButtonLoginGoogle from "@/components/ButtonLoginGoogle/ButtonLoginGoogle";
import InputField from "@/components/InputField/InputField";
import { path } from "@/constant/path";
import { SIGNIN } from "@/graphql/Mutation/Signin";
import { useAuth } from "@/context/AuthContext/AuthContext";
import { useMutation } from "@apollo/client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { getSafeNextPath } from "@/utils/guards";

const SigninContainer = () => {
    const [signin] = useMutation(SIGNIN);
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const router = useRouter();
    const searchParams = useSearchParams();
    const returnTo = getSafeNextPath(searchParams.get("next"));
    const { refreshUser } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const resData = await signin({ variables: { ...form } });
            if (resData.data.login) {
                const response = await fetch("/api/auth/signin", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        token: resData.data.login.token,
                        refreshToken: resData.data.login.refreshToken,
                    }),
                });

                if (response.ok) {
                    // Reload the session into context BEFORE navigating —
                    // AuthProvider lives in the root layout and won't remount
                    // on client-side navigation, so without this user stays
                    // null until a manual refresh.
                    await refreshUser();
                    router.push(returnTo);
                    router.refresh();
                } else {
                    toast.error("Failed to set cookie");
                }
            }
        } catch {
            toast.error("Sign in failed. Please check your details and try again.");
        }
    };

    const onChangeValueInput = (fieldName: string, value: string) => {
        setForm((prev) => ({
            ...prev,
            [fieldName]: value,
        }));
    };

    return (
        <div className="w-full flex justify-center px-4 sm:px-6">
            <div className="w-full max-w-md bg-white rounded-box shadow-2xs p-6 sm:p-8">
                <h1 className="text-center text-2xl sm:text-3xl font-semibold">
                    Login
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 w-full opacity-90"
                >
                    <div className="flex flex-col gap-3">
                        <InputField.Email
                            title="Email"
                            required
                            type="email"
                            placeholder="@email.com"
                            value={form.email}
                            onChange={(value) =>
                                onChangeValueInput("email", value)
                            }
                        />
                        <InputField.Password
                            title="Password"
                            required
                            type="password"
                            value={form.password}
                            placeholder="Password"
                            onChange={(value) =>
                                onChangeValueInput("password", value)
                            }
                        />
                    </div>

                    <div className="w-full flex justify-end mt-4 sm:mt-5">
                        <Link
                            href={path.sendOtp}
                            className="text-sm text-blue-400 hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <div className="flex flex-col items-center justify-center w-full mt-6 sm:mt-8">
                        <Button
                            type="submit"
                            classNames="w-full rounded-[30px]"
                            title="LOGIN"
                        />

                        <div className="divider before:bg-gray-300 after:bg-gray-300 text-gray-500">
                            OR
                        </div>

                        <ButtonLoginGoogle next={returnTo} />
                    </div>

                    <div className="w-full flex justify-center mt-4 sm:mt-5 text-sm text-black">
                        Don&apos;t have an account?
                        <Link
                            className="ml-2 text-blue-500 underline"
                            href="/signup"
                        >
                            Sign up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SigninContainer;
