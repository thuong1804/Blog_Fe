'use client'

import { useState } from "react";
import Button from "@/components/Button/Button"
import { CONTACT_MUTATION } from "@/graphql/Mutation/SendMail";
import { useMutation } from "@apollo/client";
import Image from "next/image"
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

    if (loading) {
      return;
    }

    await contact({ variables: form });
    if (!loading) {
      toast.success("✅ Thanks for subscribing! Check your inbox for our latest stories.");
    }

    setForm({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="relative w-full h-[600px] mt-20">
        <Image
          src="/map.webp"
          alt="about"
          fill
          className="object-cover  w-full"
        />

        <form onSubmit={handleSubmit} className="absolute bottom-[-80%] left-1/2 -translate-x-1/2 bg-white rounded-box shadow-lg max-w-[700px] w-[700px] p-14 flex flex-col gap-10">
          <div className="grid grid-cols-2 gap-5">
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-black">Name</legend>
              <input
                name="name"
                value={form.name}
                type="text"
                onChange={handleChange}
                className="input input-neutral text-black bg-white border-1 border-gray-400"
              />
            </fieldset>
            <fieldset className="fieldset relative">
              <legend className="fieldset-legend text-black">Email</legend>
              <label className="input validator bg-white text-black border-1 border-gray-400">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </g>
                </svg>
                <input type="email" name="email" value={form.email} placeholder="mail@site.com" required onChange={handleChange} />
              </label>
              <div className="validator-hint hidden absolute bottom-[-20px]">Enter valid email address</div>
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-black">Phone</legend>
              <label className="input validator bg-white text-black border-1 border-gray-400">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                  <g fill="none">
                    <path
                      d="M7.25 11.5C6.83579 11.5 6.5 11.8358 6.5 12.25C6.5 12.6642 6.83579 13 7.25 13H8.75C9.16421 13 9.5 12.6642 9.5 12.25C9.5 11.8358 9.16421 11.5 8.75 11.5H7.25Z"
                      fill="currentColor"
                    ></path>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6 1C4.61929 1 3.5 2.11929 3.5 3.5V12.5C3.5 13.8807 4.61929 15 6 15H10C11.3807 15 12.5 13.8807 12.5 12.5V3.5C12.5 2.11929 11.3807 1 10 1H6ZM10 2.5H9.5V3C9.5 3.27614 9.27614 3.5 9 3.5H7C6.72386 3.5 6.5 3.27614 6.5 3V2.5H6C5.44771 2.5 5 2.94772 5 3.5V12.5C5 13.0523 5.44772 13.5 6 13.5H10C10.5523 13.5 11 13.0523 11 12.5V3.5C11 2.94772 10.5523 2.5 10 2.5Z"
                      fill="currentColor"
                    ></path>
                  </g>
                </svg>
                <input
                  type="tel"
                  className="tabular-nums"
                  required
                  value={form.phone}
                  name="phone"
                  onChange={handleChange}
                  placeholder="Phone"
                  maxLength={10}
                  pattern="[0-9]*"
                  title="Must be 10 digits"
                />
              </label>
              <p className="validator-hint">Must be 10 digits</p>
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend text-black">Subject</legend>
              <input type="text" value={form.subject} name="subject" className="input input-neutral text-black bg-white border-1 border-gray-400" onChange={handleChange} />
            </fieldset>
          </div>
          <div className="w-full h-[200px]">
            <fieldset className="fieldset w-full h-full">
              <legend className="fieldset-legend text-black">Message</legend>
              <textarea value={form.message} name="message" onChange={handleChange} className=" h-[150px] textarea w-full text-black bg-white border-1 border-gray-400" ></textarea>
            </fieldset>
          </div>
          <div className="flex items-center justify-center w-full">
            <Button type="submit" className="btn w-full" disabled={loading} title={loading ? 'Sending...' : 'Send email'}/>
          </div>
        </form>
      </div>
      <div className="bg-white h-[750px] w-full">
      </div>
    </div>

  )
}
export default SendMailContact