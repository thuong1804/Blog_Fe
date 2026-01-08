"use client";

import Button from "@/components/Button/Button";
import InputField from "@/components/InputField/InputField";
import { path } from "@/constant/path";
import { RESET_PASSWORD } from "@/graphql/Mutation/Auth";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const ChangePasswordContainer = () => {
    const router = useRouter();
    const [form, setForm] = useState({
        password: "",
        confirmPassword: "",
    });

    const [resetPassword] = useMutation(RESET_PASSWORD);

    const onChangeValueInput = (fieldName: string, value: string) => {
        setForm((prev) => ({
            ...prev,
            [fieldName]: value,
        }));
    };

    const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const resetToken = localStorage.getItem("resetToken");

            const res = await resetPassword({
                variables: {
                    token: resetToken,
                    newPassword: form.password,
                },
            });

            if (res.data.resetPassword.success) {
                toast.success(res.data.resetPassword.message);
                router.push(path.signin);
            } else if (
                res.data.resetPassword.message === "Token expired"
            ) {
                toast.error(
                    "Your password reset link has expired. Please request a new one.",
                );
            }
        } catch (error) {
            toast.error((error as Error).message);
        }

        setForm({ password: "", confirmPassword: "" });
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6">
            <div className="w-full max-w-lg bg-white rounded-box shadow-2xs p-6 sm:p-10 lg:p-14">
                <h1 className="text-center text-2xl sm:text-3xl font-semibold">
                    Change password
                </h1>

                <form
                    className="mt-8 sm:mt-10 w-full flex flex-col gap-5"
                    onSubmit={handleSubmitForm}
                >
                    <InputField.Password
                        title="New password"
                        required
                        placeholder="New password"
                        value={form.password}
                        onChange={(value) =>
                            onChangeValueInput("password", value)
                        }
                    />

                    <InputField.Password
                        title="Confirm password"
                        placeholder="Confirm password"
                        value={form.confirmPassword}
                        onChange={(value) =>
                            onChangeValueInput("confirmPassword", value)
                        }
                        customMsg={
                            form.confirmPassword &&
                            form.confirmPassword !== form.password
                                ? "Passwords do not match"
                                : undefined
                        }
                    />

                    <div className="flex w-full mt-4 sm:mt-6 justify-center sm:justify-end">
                        <Button
                            type="submit"
                            title="Save"
                            disabled={!form.confirmPassword}
                            classNames="w-full sm:w-max px-10"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordContainer;
