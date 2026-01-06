"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";

const items = [
    {
        key: 1,
        title: "Brainstorming",
        content:
            "Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution. User generated",
    },
    {
        key: 2,
        title: "Analyzing",
        content:
            "Capitalize on low hanging fruit to identify a ballpark value added activity to beta test. Override the digital divide with additional clickthroughs from DevOps. Nanotechnology immersion along the information highway will close the loop on focusing solely on the bottom line solely on the bottom line.",
    },
    {
        key: 3,
        title: "News Publishing",
        content:
            "Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition. Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment.",
    },
];

const CardAbout = () => {
    const [active, setActive] = useState(1);

    return (
        <div
            className="
                w-full
                grid
                grid-cols-1
                gap-6
                md:grid-cols-2
                lg:grid-cols-3
            "
        >
            {items.map((item) => {
                const isActive = active === item.key;

                return (
                    <div
                        key={item.key}
                        onClick={() => setActive(item.key)}
                        className={twMerge(
                            `
                            flex flex-col gap-3 cursor-pointer
                            rounded-2xl p-5
                            transition-all duration-300 ease-in-out
                            min-h-[240px]
                            lg:min-h-[300px]
                            `,
                            isActive
                                ? "bg-[#7C4EE4] text-white shadow-xl"
                                : "bg-white text-[#7C4EE4] border border-gray-100"
                        )}
                    >
                        {/* NUMBER */}
                        <div
                            className={twMerge(
                                `
                                font-bold
                                text-3xl
                                md:text-4xl
                                lg:text-5xl
                                `,
                                isActive
                                    ? "text-white"
                                    : "text-[#666666] opacity-20"
                            )}
                        >
                            0{item.key}
                        </div>

                        {/* TITLE */}
                        <div
                            className={twMerge(
                                `
                                font-bold
                                text-base
                                md:text-lg
                                `,
                                isActive ? "text-white" : "text-[#7C4EE4]"
                            )}
                        >
                            {item.title}
                        </div>

                        {/* CONTENT */}
                        <p
                            className={twMerge(
                                `
                                text-sm
                                leading-6
                                `,
                                isActive ? "text-white" : "text-[#666666]"
                            )}
                        >
                            {item.content}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};
export default CardAbout;
