import SubscribeEmail from "@/containers/LandingPage/SubscribeEmail/SubscribeEmail";
import Link from "next/link";
import React from "react";
import { FaBlogger } from "react-icons/fa";


const FooterLayout = () => {
  const slug = [
    {
      title: 'Home',
      path: '/',
    },
    {
      title: 'Blog',
      path: '/blog',
    },
    {
      title: 'About',
      path: '/about',
    },
    {
      title: 'Contact Us',
      path: '/contact',
    },
  ]

  const contacts = [
    {
      title: 'FB',
      href: 'https://www.facebook.com/Thuongpro40/'
    },
    {
      title: 'IG',
      href: 'https://www.instagram.com/lehoaithuong20/'
    },
    {
      title: 'IN',
      href: 'https://www.linkedin.com/in/hoai-thuong1804/'
    },
    {
      title: 'YT',
      href: ''
    },
  ]

  return (
    <React.Fragment>
      <SubscribeEmail />
      <div className="bg-white py-14 h-auto">
        <div className="max-w-(--max-width-desktop) lg-max-w-(--max-width-desktop) mx-auto">
          <div className="flex flex-col items-center gap-10">
            <div className="flex items-center gap-2.5">
              <FaBlogger className="text-[70px] text-(--text-color-title)" />
              <span className="font-bold text-3xl text-(--text-color-title)">TECHNEWS</span>
            </div>
            <div className="flex items-center gap-11">
              {slug.map((item, key) => (<Link className="text-(--text-color-title) hover:text-[#7C4EE4]" href={item.path} key={key}>{item.title}</Link>))}
            </div>
            <div className="flex items-center gap-2">
              {contacts.map((item, key) => (
                <Link
                  target="_blank"
                  href={item.href}
                  key={key}
                  className=" transition-all duration-200 ease-in-out border-2 bg-[#7C4EE4] rounded-[50%] w-[40px] h-[40px] flex items-center justify-center hover:scale-105">
                    {item.title}
                </Link>
              ))}
            </div>
            <div className="w-full h-[1px]  bg-[#7C4EE4]" />
            <div className="text-[16px] text-(--text-color-title)">Copyright Ideapeel Inc © 2023. All Right Reserved</div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
export default FooterLayout;