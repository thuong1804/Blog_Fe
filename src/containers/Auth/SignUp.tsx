import Button from "@/components/Button/Button";
import ButtonLoginGoogle from "@/components/ButtonLoginGoogle/ButtonLoginGoogle";
import InputField from "@/components/InputField/InputField";
import { SIGNUP } from "@/graphql/Mutation/Signup";
import { useMutation } from "@apollo/client";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const SignupContainer = () => {
    const [form, setForm] = useState({
        email: "",
        name: "",
        password: "",
        confirmPassword: "",
    });

    const [signup, { loading, error }] = useMutation(SIGNUP);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        signup({ variables: { ...form } });

        if (error) {
            return toast.error(error.message);
        }

        toast.success(
            "✅ Thanks for subscribing! Check your inbox for our latest stories.",
        );
    };

    const onChangeValueInput = (fieldName: string, value: string) => {
        setForm((prev) => ({
            ...prev,
            [fieldName]: value,
        }));
    };
return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6">
        <div
            className="
                w-full
                max-w-sm
                sm:max-w-md
                lg:max-w-lg
                bg-white
                rounded-2xl
                shadow-md
                p-4
                sm:p-6
                lg:p-8
                max-h-[85vh]
                flex
                flex-col
            "
        >
            {/* Header cố định */}
            <h1
                className="
                    text-center
                    text-lg
                    sm:text-xl
                    lg:text-2xl
                    font-semibold
                    shrink-0
                "
            >
                Sign Up
            </h1>

            {/* Form scroll */}
            <form
                onSubmit={handleSubmit}
                className="
                    mt-4
                    flex
                    flex-col
                    gap-3
                    overflow-y-auto
                    pr-1
                "
            >
                <InputField.Email
                    title="Email"
                    placeholder="@email.com"
                    value={form.email}
                    required
                    onChange={(value) =>
                        onChangeValueInput("email", value)
                    }
                />

                <InputField.Text
                    title="Name"
                    placeholder="Your name"
                    maxLength={100}
                    minLength={3}
                    required
                    value={form.name}
                    onChange={(value) =>
                        onChangeValueInput("name", value)
                    }
                />

                <InputField.Password
                    title="Password"
                    required
                    value={form.password}
                    placeholder="Password"
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

                <Button
                    type="submit"
                    title="Sign Up"
                    disabled={loading}
                    classNames="w-full rounded-full mt-1"
                />

                <div className="divider text-gray-400 text-xs">
                    OR
                </div>

                <ButtonLoginGoogle />

                <p className="text-center text-xs text-gray-600 pb-2">
                    Already have an account?
                    <Link
                        href="/signin"
                        className="ml-1 text-blue-500 hover:underline"
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
