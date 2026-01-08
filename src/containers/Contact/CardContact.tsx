"use client";
import { RiHomeOfficeFill } from "react-icons/ri";
import { MdOutlineLocalPostOffice } from "react-icons/md";
import { FaPhone } from "react-icons/fa";

const items = [
    {
        icon: <RiHomeOfficeFill />,
        title: "Office",
        content: "Victoria Street, London, UK",
    },
    {
        icon: <MdOutlineLocalPostOffice />,
        title: "Email",
        content: "thuong123tvt@gmail.com",
    },
    {
        icon: <FaPhone />,
        title: "Phone",
        content: "09748292932",
    },
];

const CardContact = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {items.map((item, index) => (
                <div
                    key={index}
                    className="
                        flex flex-col items-center justify-center
                        p-6
                        h-[220px]
                        rounded-2xl
                        bg-white
                        shadow-xl
                        text-center
                    "
                >
                    <div className="w-[70px] h-[70px] bg-[#7C4EE4] rounded-full flex items-center justify-center text-2xl text-white">
                        {item.icon}
                    </div>

                    <div className="mt-3 text-[17px] font-bold text-[#7C4EE4]">
                        {item.title}
                    </div>

                    <p className="mt-1 text-sm text-[#666666]">
                        {item.content}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default CardContact;
