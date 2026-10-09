"use client";

import Button from "@/components/Button/Button";
import InputField from "@/components/InputField/InputField";
import { path } from "@/constant/path";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const ChangePasswordContainer = () => {
    const router = useRouter();
    const [form, setForm] = useState({
        password: "",
        confirmPassword: "",
    });
    const [saving, setSaving] = useState(false);

    const onChangeValueInput = (fieldName: string, value: string) => {
        setForm((prev) => ({
            ...prev,
            [fieldName]: value,
        }));
    };

    const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (saving) return;

        if (form.password !== form.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setSaving(true);
        try {
            // The reset token lives in an httpOnly cookie; the API route
            // attaches it server-side so it never touches client JS.
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newPassword: form.password }),
            });
            const data = await res.json().catch(() => null);

            if (res.ok && data?.success) {
                toast.success("Password changed. Please sign in.");
                router.push(path.signin);
            } else if (res.status === 401) {
                toast.error(
                    "Your password reset link has expired. Please request a new one.",
                );
            } else {
                toast.error("Unable to reset password. Please try again.");
            }
        } catch {
            toast.error("Unable to reset password. Please try again.");
        } finally {
            setSaving(false);
        }

        setForm({ password: "", confirmPassword: "" });
    };

    return (
        <div className="w-full flex justify-center px-4 sm:px-6">
            <div className="w-full max-w-lg bg-white rounded-box shadow-2xs p-6 sm:p-8">
                <h1 className="text-center text-2xl sm:text-3xl font-semibold">
                    Change password
                </h1>

                <form
                    className="mt-6 w-full flex flex-col gap-4"
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
                            title={saving ? "Saving..." : "Save"}
                            disabled={!form.confirmPassword || saving}
                            loading={saving}
                            classNames="w-full sm:w-max px-10"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordContainer;
