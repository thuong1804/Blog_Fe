'use client'

import { useState } from "react"
import { twMerge } from "tailwind-merge";

const items = [
  {
    key: 1,
    title: 'Brainstorming',
    content: 'Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution. User generated'
  },
  {
    key: 2,
    title: 'Analyzing',
    content: 'Capitalize on low hanging fruit to identify a ballpark value added activity to beta test. Override the digital divide with additional clickthroughs from DevOps. Nanotechnology immersion along the information highway will close the loop on focusing solely on the bottom line solely on the bottom line.'
  },
  {
    key: 3,
    title: 'News Publishing',
    content: 'Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition. Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment.'
  },
]

const CardAbout = () => {
  const [active, setActive] = useState(1);

  const handleClickCard = (index: number) => {
    setActive(index)
  }

  return (
    <div className="flex w-full justify-between items-center gap-5">
      {items.map((item, index) => {
        const isActive = active === item.key;
        return (
          <div key={index} onClick={() => handleClickCard(item.key)}
            className={twMerge("flex flex-col p-4 rounded-2xl gap-3 max-w-[400px] h-[300px] cursor-pointer transition-all duration-300 ease-in-out",
            active === item.key ? "bg-[#7C4EE4]  text-white shadow-xl" : 'text-[#7C4EE4]'
          )}>
            <div className={twMerge("text-[50px] font-bold", isActive ? "text-white" : "text-[#666666] opacity-10")}>0{item.key}</div>
            <div className={twMerge("text-[17px] font-bold", isActive ? "text-white" : "text-[#7C4EE4]")}>{item.title}</div>
            <p className={twMerge("text-[17px] text-sm", isActive ? "text-white" : "text-[#666666]")}>{item.content}</p>
          </div>
        )
      })}
    </div>
  )
}
export default CardAbout;