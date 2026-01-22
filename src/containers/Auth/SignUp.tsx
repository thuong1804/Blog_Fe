import Button from "@/components/Button/Button";
import ButtonLoginGoogle from "@/components/ButtonLoginGoogle/ButtonLoginGoogle";
import InputField from "@/components/InputField/InputField";
import { SIGNUP } from "@/graphql/Mutation/Signup";
import { useMutation } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const SignupContainer = () => {
    const [form, setForm] = useState({
        email: "",
        name: "",
        password: "",
        confirmPassword: "",
    });

    const router = useRouter()

    const [signup, { loading }] = useMutation(SIGNUP);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            await signup({ variables: { ...form } });
            toast.success("✅ Thanks for subscribing! Check your inbox for our latest stories.");
            router.push('/signin')
        } catch (err) {
            const error = err as Error
            toast.error(error.message || "Something went wrong");
        }
    };

    const onChangeValueInput = (fieldName: keyof typeof form, value: string) => {
        setForm((prev) => ({
            ...prev,
            [fieldName]: value,
        }));
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
            <div
                className="
                    w-full
                    max-w-md
                    bg-white
                    rounded-2xl
                    shadow-lg
                    p-6
                    sm:p-8
                    lg:p-10
                    flex
                    flex-col
                    gap-6
                "
            >
                {/* Header */}
                <h1 className="text-center text-2xl sm:text-3xl font-bold text-gray-900">
                    Sign Up
                </h1>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <InputField.Email
                        title="Email"
                        placeholder="you@example.com"
                        value={form.email}
                        required
                        onChange={(value) => onChangeValueInput("email", value)}
                    />

                    <InputField.Text
                        title="Name"
                        placeholder="Your full name"
                        maxLength={100}
                        minLength={3}
                        required
                        value={form.name}
                        onChange={(value) => onChangeValueInput("name", value)}
                    />

                    <InputField.Password
                        title="Password"
                        placeholder="••••••••"
                        required
                        value={form.password}
                        onChange={(value) => onChangeValueInput("password", value)}
                    />

                    <InputField.Password
                        title="Confirm password"
                        placeholder="••••••••"
                        value={form.confirmPassword}
                        onChange={(value) => onChangeValueInput("confirmPassword", value)}
                        customMsg={
                            form.confirmPassword && form.confirmPassword !== form.password
                                ? "Passwords do not match"
                                : undefined
                        }
                    />

                    <Button
                        type="submit"
                        title={loading ? "Creating account..." : "Sign Up"}
                        disabled={loading}
                        classNames="w-full rounded-full py-3 text-base font-medium hover:opacity-90"
                    />

                    {/* Divider */}
                    <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-4 text-sm text-gray-500 bg-white px-2">OR</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    <ButtonLoginGoogle />

                    {/* Sign in link */}
                    <p className="text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link
                            href="/signin"
                            className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors"
                        >
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignupContainer;