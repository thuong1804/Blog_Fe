"use client";

import Button from "@/components/Button/Button";
import { SUBSCRIBE_SUBMIT } from "@/graphql/Mutation/SendMail";
import { useMutation } from "@apollo/client";
import { useState } from "react";
import { toast } from "sonner";

const SubscribeEmail = () => {
    const [inputEmail, setInputEmail] = useState("");
    const [subscribe, { loading }] = useMutation(SUBSCRIBE_SUBMIT);

    const handleSubmitEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loading) return;

        await subscribe({
            variables: { email: inputEmail },
        });

        toast.success("🎉 Email sent! We'll get back to you soon.");
        setInputEmail("");
    };

    return (
        <section className="w-full bg-gradient-to-br from-[#080D1A] via-[#0F172A] to-[#1E293B] relative overflow-hidden text-white">
            {/* Top border accent */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
            
            {/* Ambient glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[250px] bg-indigo-600/15 blur-[120px] pointer-events-none" />

            <div className="max-w-desktop mx-auto px-6 py-16 flex flex-col items-center text-center relative z-10">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 mb-4 shadow-sm">
                    Newsletter
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl lg:max-w-[768px] font-extrabold tracking-tight text-white leading-tight">
                    Get our stories delivered from us to your inbox weekly.
                </h2>
                <form
                    onSubmit={handleSubmitEmail}
                    className="
                        mt-10
                        flex
                        flex-col
                        sm:flex-row
                        items-stretch
                        sm:items-center
                        gap-3
                        w-full
                        max-w-md
                    "
                >
                    <input
                        value={inputEmail}
                        onChange={(e) => setInputEmail(e.target.value)}
                        type="email"
                        placeholder="Enter your email address"
                        required
                        className="
                            input
                            w-full
                            h-[50px]
                            bg-slate-900/90
                            border
                            border-slate-700
                            focus:border-cyan-400
                            focus:outline-none
                            text-white
                            placeholder:text-slate-400
                            rounded-xl
                            px-4
                        "
                    />

                    <Button
                        title="Subscribe"
                        type="submit"
                        classNames="border-0 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl px-7 py-3 shadow-lg shadow-blue-600/25 transition-all duration-300 hover:scale-[1.02] self-stretch sm:self-auto"
                    />
                </form>

                {/* Description */}
                <p className="mt-5 text-sm text-slate-400 max-w-xl">
                    Get a response tomorrow if you submit by 9pm today.
                    If received after 9pm, you will get a response the following day.
                </p>
            </div>
        </section>
    );
};

export default SubscribeEmail;
