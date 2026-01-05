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
        <section className="w-full bg-[#7C4EE4] relative">
            <div className="max-w-desktop mx-auto px-6 py-12 flex flex-col items-center text-center text-white">

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl lg:max-w-[768px] font-bold">
                    Get our stories delivered From us to your inbox weekly.
                </h2>
                <form
                    onSubmit={handleSubmitEmail}
                    className="
                        mt-12
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
                        placeholder="Your email"
                        required
                        className="
                            input
                            w-full
                            h-[53px]
                            bg-white
                            text-black
                            placeholder:text-body
                        "
                    />

                    <Button
                        title="Get started"
                        type="submit"
                        classNames="border border-white text-white self-end"
                    />
                </form>

                {/* Description */}
                <p className="mt-6 text-sm text-white max-w-xl">
                    Get a response tomorrow if you submit by 9pm today.
                    If received after 9pm, you will get a response the following day.
                </p>
            </div>
        </section>
    );
};

export default SubscribeEmail;
