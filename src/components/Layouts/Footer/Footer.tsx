import Link from "next/link";
import { FaBlogger } from "react-icons/fa";


const FooterLayout = () => {
  const slug = [
    {
      title: 'Home',
      path: '',
    },
    {
      title: 'Blog',
      path: '',
    },
    {
      title: 'About',
      path: '',
    },
    {
      title: 'Contact Us',
      path: '',
    },
  ]

  const contacts = [
    {
      title: 'FB',
      href: ''
    },
    {
      title: 'IG',
      href: ''
    },
    {
      title: 'LN',
      href: ''
    },
    {
      title: 'YT',
      href: ''
    },
  ]

  return (
    <div className="bg-white py-14 h-auto">
      <div className="max-w-[1232px] lg-max-w-[1232px] mx-auto">
        <div className="flex flex-col items-center gap-10">
          <div className="flex items-center gap-2.5">
            <FaBlogger className="text-[70px] text-black" />
            <span className="font-bold text-3xl text-black">TECHNEWS</span>
          </div>
          <div className="flex items-center gap-11">
            {slug.map((item, key) => (<Link className="text-black" href={item.path} key={key}>{item.title}</Link>))}
          </div>
          <div className="flex items-center gap-2">
            {contacts.map((item, key) => (
              <Link href={item.href} key={key} className="border-2 bg-[#7C4EE4] rounded-[50%] w-[40px] h-[40px] flex items-center justify-center">
                {item.title}
              </Link>
              ))}
          </div>
          <div className="w-full h-[1px]  bg-[#7C4EE4]"/>
          <div className="text-[16px] text-black">Copyright Ideapeel Inc © 2023. All Right Reserved</div>
        </div>
      </div>
    </div>
  )
}
export default FooterLayout;