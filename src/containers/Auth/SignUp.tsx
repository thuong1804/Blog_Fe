import Button from "@/components/Button/Button";
import ButtonLoginGoogle from "@/components/ButtonLoginGoogle/ButtonLoginGoogle";
import InputField from "@/components/InputField/InputField";
import { SIGNUP } from "@/graphql/Mutation/Signup";
import { useMutation } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
    FaBolt,
    FaCheck,
    FaPenNib,
    FaShieldHalved,
    FaStar,
    FaUsers,
} from "react-icons/fa6";
import { toast } from "sonner";

const SignupContainer = () => {
    const [form, setForm] = useState({
        email: "",
        name: "",
        password: "",
        confirmPassword: "",
    });

    const router = useRouter();

    const [signup, { loading }] = useMutation(SIGNUP);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            await signup({ variables: { ...form } });
            toast.success(
                "✅ Thanks for subscribing! Check your inbox for our latest stories.",
            );
            router.push("/signin");
        } catch (err) {
            const error = err as Error;
            toast.error(error.message || "Something went wrong");
        }
    };

    const onChangeValueInput = (fieldName: keyof typeof form, value: string) => {
        setForm((prev) => ({
            ...prev,
            [fieldName]: value,
        }));
    };

    const passwordStrength = useMemo(() => {
        const pwd = form.password || "";
        let score = 0;
        if (pwd.length >= 8) score++;
        if (pwd.length >= 12) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;
        return Math.min(score, 4);
    }, [form.password]);

    const strengthLabel = ["Weak", "Fair", "Good", "Strong"][passwordStrength] ?? "Weak";
    const strengthColor = [
        "bg-red-500",
        "bg-orange-400",
        "bg-yellow-400",
        "bg-emerald-500",
    ][passwordStrength];

    return (
        <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-[0_32px_80px_-16px_rgba(0,0,0,0.65)] ring-1 ring-white/20">
            <div className="grid lg:grid-cols-[1.02fr_1fr]">
                {/* Left showcase panel */}
                <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 via-40% to-[#0B1026] p-9 text-white lg:flex xl:p-11">
                    {/* Decorative */}
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/30 blur-3xl" />
                        <div className="absolute -bottom-28 -left-16 h-80 w-80 rounded-full bg-fuchsia-500/25 blur-3xl" />
                        <div
                            className="absolute inset-0 opacity-20"
                            style={{
                                backgroundImage:
                                    "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)",
                                backgroundSize: "26px 26px",
                            }}
                        />
                    </div>

                    <div className="relative">
                        <h2 className="mt-6 text-3xl font-extrabold leading-[1.12] tracking-tight xl:text-[2.6rem]">
                            Stay ahead of
                            <br />
                            the tech curve.
                        </h2>
                        <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-blue-100/90">
                            Daily insights, tutorials and breaking stories —
                            curated by editors, loved by developers.
                        </p>

                        <ul className="mt-8 space-y-4">
                            {[
                                {
                                    icon: <FaPenNib />,
                                    title: "Curated stories daily",
                                    desc: "Top picks from 120+ sources, no noise.",
                                },
                                {
                                    icon: <FaUsers />,
                                    title: "Vibrant community",
                                    desc: "Comment, bookmark & follow authors.",
                                },
                                {
                                    icon: <FaShieldHalved />,
                                    title: "No spam, ever",
                                    desc: "Unsubscribe anytime. We respect inbox.",
                                },
                            ].map((item) => (
                                <li key={item.title} className="flex gap-3.5">
                                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/12 text-lg ring-1 ring-white/20 backdrop-blur">
                                        {item.icon}
                                    </span>
                                    <span>
                                        <span className="block text-[15px] font-semibold">
                                            {item.title}
                                        </span>
                                        <span className="block text-sm text-blue-100/80">
                                            {item.desc}
                                        </span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="relative mt-10">
                        <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
                            <div className="flex gap-1 text-amber-300">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <FaStar key={i} className="text-sm" />
                                ))}
                            </div>
                            <p className="mt-3 text-[14.5px] leading-relaxed text-white/90">
                                “TechNews is my morning coffee. Short, sharp
                                and always relevant — I haven&apos;t missed an
                                AI trend in months.”
                            </p>
                            <div className="mt-4 flex items-center gap-3">
                                <div className="flex -space-x-2.5">
                                    {["AK", "MT", "LP"].map((t, i) => (
                                        <span
                                            key={t}
                                            className={`grid h-9 w-9 place-items-center rounded-full text-[11px] font-bold ring-2 ring-[#2b3a9b] ${
                                                [
                                                    "bg-amber-400 text-black",
                                                    "bg-emerald-400 text-black",
                                                    "bg-cyan-300 text-black",
                                                ][i]
                                            }`}
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">
                                        Loved by readers
                                    </p>
                                    <p className="text-xs text-blue-100/70">
                                        4.9/5 from 3,200+ reviews
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right form panel */}
                <div className="flex flex-col bg-white px-6 py-8 text-gray-900 sm:px-10 sm:py-10">
                    {/* Mobile badge */}
                    <div className="mb-6 lg:hidden">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
                            <FaBolt className="text-amber-500" />
                            Join 24,000+ tech readers
                        </span>
                    </div>

                    <div>
                        <h1 className="text-[26px] font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                            Create your account
                        </h1>
                        <p className="mt-1.5 text-[14.5px] text-gray-500">
                            Start reading in less than a minute. Free forever.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="mt-7 flex flex-col gap-4"
                    >
                        <InputField.Email
                            title="Email"
                            placeholder="you@example.com"
                            value={form.email}
                            required
                            onChange={(value) =>
                                onChangeValueInput("email", value)
                            }
                        />

                        <InputField.Text
                            title="Name"
                            placeholder="Your full name"
                            maxLength={100}
                            minLength={3}
                            required
                            value={form.name}
                            onChange={(value) =>
                                onChangeValueInput("name", value)
                            }
                        />

                        <div>
                            <InputField.Password
                                title="Password"
                                placeholder="••••••••"
                                required
                                value={form.password}
                                onChange={(value) =>
                                    onChangeValueInput("password", value)
                                }
                            />
                            {form.password && (
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="flex flex-1 gap-1">
                                        {Array.from({ length: 4 }).map(
                                            (_, i) => (
                                                <span
                                                    key={i}
                                                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                                                        i <= passwordStrength
                                                            ? strengthColor
                                                            : "bg-gray-200"
                                                    }`}
                                                />
                                            ),
                                        )}
                                    </div>
                                    <span className="text-xs font-medium text-gray-500">
                                        {strengthLabel}
                                    </span>
                                </div>
                            )}
                        </div>

                        <InputField.Password
                            title="Confirm password"
                            placeholder="••••••••"
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

                        {form.confirmPassword &&
                            form.confirmPassword === form.password &&
                            form.password && (
                                <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                                    <FaCheck /> Passwords match
                                </p>
                            )}

                        <Button
                            type="submit"
                            title={loading ? "Creating account..." : "Create account →"}
                            disabled={loading}
                            classNames="mt-1 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-[15px] font-semibold shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30"
                        />

                        <div className="relative flex items-center py-1">
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="mx-4 bg-white px-1 text-xs font-medium uppercase tracking-wider text-gray-400">
                                or continue with
                            </span>
                            <div className="flex-grow border-t border-gray-200"></div>
                        </div>

                        <ButtonLoginGoogle />

                        <p className="text-center text-sm text-gray-500">
                            Already have an account?{" "}
                            <Link
                                href="/signin"
                                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                            >
                                Sign in
                            </Link>
                        </p>

                        <p className="text-center text-[11.5px] leading-relaxed text-gray-400">
                            By signing up, you agree to our{" "}
                            <Link
                                href="#"
                                className="underline hover:text-gray-500"
                            >
                                Terms
                            </Link>{" "}
                            and{" "}
                            <Link
                                href="#"
                                className="underline hover:text-gray-500"
                            >
                                Privacy Policy
                            </Link>
                            .
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignupContainer;
