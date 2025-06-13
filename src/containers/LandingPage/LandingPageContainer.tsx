import Button from "@/components/Button/Button"
import PostCard from "@/components/Post/PostCard"
import AnotherPost from "@/containers/LandingPage/AnotherPost/AnotherPost"
import Image from "next/image"

const LandingPage = () => {
  const items = [
    {
      title: "8 Rules of Travelling In Sea You Need To Know",
      link: "#",
      category: "Travel",
      date: "13 March 2023",
      image: "/images/banner-2.jpg",
      description:
        "Travelling in sea has many advantages. Some of the advantages of transporting goods by sea include: you can ship large volumes at costs",
    },
    {
      title: "How to build strong portfolio and get a Job in UI/UX",
      link: "#",
      category: "Development",
      date: "11 March 2023",
      image: "/images/banner-2.jpg",
      description:
        "Capitalize on low hanging fruit to identify a ballpark value added activity to beta test. Override the digital divide with additional clickthroughs from",
    },
    {
      title: "How to Be a Professional Footballer in 2023",
      link: "#",
      category: "Sports",
      date: "10 March 2023",
      image: "/images/banner-2.jpg",
      description:
        "Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment. Survival strategies to ensure proactive...",
    },
  ];
  return (
    <div className="h-auto w-full">
      <div className="bg-[#7C4EE4] p-24 relative">
        <div className="w-[600px] h-[200px] pointer-events-none overflow-hidden absolute top-0 left-0 ">
          <Image src={'/images/Vector.svg'} alt="vector-banner" className="pointer-events-none h-full w-full rounded-br-[300px] h-[300px] rounded-bt-[10%]" height={200} width={1000} />
        </div>
        <div className="flex justify-between gap-12 max-w-[1232px] lg-max-w-[1232px] w-full h-auto mx-auto">
          <div className="w-1/2">
            <span className="font-bold text-lg">Featured Post</span>
            <h1 className="text-[64px] font-bold leading-[1.5] pb-8">
              How AI will <br /> Change the Future
            </h1>
            <div className=" w-full max-w-[416px] pb-16">The future of AI will see home robots having enhanced intelligence,
              increased capabilities, and becoming more personal and possibly cute.
              For example, home robots will overcome navigation, direction
            </div>
            <Button title="Read more" classNames="bg-white text-black" />
          </div>
          <div className="w-[608px] h-[576px]">
            <Image src={'/images/banner.png'} className="rounded-xl w-full h-full object-contain" width={610} height={576} alt="banner" />
          </div>
        </div>
        <div>
        </div>
      </div>
      <div className="mt-[88px]">
        <AnotherPost />
      </div>
      <div className="mt-[88px]">
        <PostCard title="Our Recent Post" itemCards={items}/>
      </div>
    </div>

  )
}
export default LandingPage