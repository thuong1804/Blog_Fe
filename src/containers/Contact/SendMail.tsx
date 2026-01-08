"use client";

import { useState } from "react";
import Button from "@/components/Button/Button";
import { CONTACT_MUTATION } from "@/graphql/Mutation/SendMail";
import { useMutation } from "@apollo/client";
import Image from "next/image";
import { toast } from "sonner";

const SendMailContact = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });

    const [contact, { loading }] = useMutation(CONTACT_MUTATION);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loading) return;

        try {
            await contact({ variables: form });

            toast.success(
                "Thanks for contacting us! We will get back to you soon.",
            );

            setForm({
                name: "",
                email: "",
                phone: "",
                subject: "",
                message: "",
            });
        } catch (error) {
            const er = error as Error
            console.log(er)
            toast.error("Something went wrong. Please try again.");
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <div className="w-full">
            {/* MAP */}
            <div className="relative w-full h-[280px] sm:h-[400px] lg:h-[600px] mt-20">
                <Image
                    src="/map.webp"
                    alt="map"
                    fill
                    priority
                    className="object-cover"
                />
            </div>

            {/* FORM */}
            <form
                onSubmit={handleSubmit}
                className="
                    relative
                    mx-auto
                    -mt-24 sm:-mt-40 lg:-mt-60
                    bg-white
                    rounded-2xl
                    shadow-xl
                    max-w-[700px]
                    w-[95%] sm:w-full
                    p-6 sm:p-10 lg:p-14
                    flex
                    flex-col
                    gap-8
                "
            >
                {/* INPUT GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* NAME */}
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend text-black">
                            Name
                        </legend>
                        <input
                            name="name"
                            value={form.name}
                            type="text"
                            onChange={handleChange}
                            required
                            className="input input-neutral text-black bg-white border border-gray-400 w-full"
                        />
                    </fieldset>

                    {/* EMAIL */}
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend text-black">
                            Email
                        </legend>
                        <label className="input validator bg-white text-black border border-gray-400 w-full flex items-center gap-2">
                            <svg
                                className="h-[1em] opacity-50"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <g
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    strokeWidth="2.5"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <rect
                                        width="20"
                                        height="16"
                                        x="2"
                                        y="4"
                                        rx="2"
                                    />
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                </g>
                            </svg>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                placeholder="mail@site.com"
                                required
                                onChange={handleChange}
                                className="grow"
                            />
                        </label>
                    </fieldset>

                    {/* PHONE */}
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend text-black">
                            Phone
                        </legend>
                        <input
                            type="tel"
                            value={form.phone}
                            name="phone"
                            onChange={handleChange}
                            placeholder="0123456789"
                            maxLength={10}
                            pattern="[0-9]{10}"
                            required
                            className="input input-neutral text-black bg-white border border-gray-400 w-full"
                        />
                    </fieldset>

                    {/* SUBJECT */}
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend text-black">
                            Subject
                        </legend>
                        <input
                            type="text"
                            value={form.subject}
                            name="subject"
                            onChange={handleChange}
                            required
                            className="input input-neutral text-black bg-white border border-gray-400 w-full"
                        />
                    </fieldset>
                </div>

                {/* MESSAGE */}
                <fieldset className="fieldset">
                    <legend className="fieldset-legend text-black">
                        Message
                    </legend>
                    <textarea
                        value={form.message}
                        name="message"
                        onChange={handleChange}
                        required
                        className="
                            textarea
                            w-full
                            text-black
                            bg-white
                            border
                            border-gray-400
                            min-h-[120px] sm:min-h-[150px]
                        "
                    />
                </fieldset>

                {/* BUTTON */}
                <Button
                    type="submit"
                    className="btn w-full"
                    disabled={loading}
                    title={loading ? "Sending..." : "Send email"}
                />
            </form>

            {/* SPACER */}
            <div className="h-[150px] sm:h-[200px] lg:h-[250px]" />
        </div>
    );
};

export default SendMailContact;
