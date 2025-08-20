'use client'
import { RiHomeOfficeFill } from "react-icons/ri";
import { MdOutlineLocalPostOffice } from "react-icons/md";
import { FaPhone } from "react-icons/fa";

const items = [
  {
    icon: <RiHomeOfficeFill/>,
    title: 'Office',
    content: 'Victoria Street, London, UK'
  },
  {
    icon: <MdOutlineLocalPostOffice />,
    title: 'Email',
    content: 'thuong123tvt@gmail.com'
  },
  {
    icon: <FaPhone />,
    title: 'Phone',
    content: '09748292932'
  },
]

const CardContact = () => {
  return (
    <div className="flex w-full items-center gap-5">
      {items.map((item, index) => {
        return (
          <div
            key={index}
            className="flex flex-col items-center p-4 rounded-2xl gap-3 min-w-[400px] h-[250px] text-white shadow-xl justify-center bg-white">
            <div className="w-[70px] h-[70px] bg-[#7C4EE4] rounded-[50%] flex items-center justify-center text-2xl">
              {item.icon}
            </div>
              <div className="text-[17px] font-bold text-[#7C4EE4]">{item.title}</div>
              <p className="text-[17px] text-sm text-[#666666]">{item.content}</p>
          </div>
        )
      })}
    </div>
  )
}
export default CardContact;