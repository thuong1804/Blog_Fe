import Button from "@/components/Button/Button";
import Image from "next/image";

const SubscribeEmail = () => {
  return (
    <div className="w-full bg-[#7C4EE4] h-auto relative flex justify-center items-center py-[132px]">
      <div className="w-[600px] h-[200px] pointer-events-none overflow-hidden absolute top-0 left-0 ">
       <Image src={'/images/vector.svg'} alt="vector-banner" className="pointer-events-none w-auto rounded-br-[200px] h-auto" fill sizes="(max-width: 608px)"/>
      </div>
      <div className="flex flex-col items-center">
        <div className="text-5xl font-bold">
          Get our stories delivered From
        </div>
        <div className="text-5xl font-bold">us to your inbox weekly.</div>
        <div className="flex items-center gap-2 mt-12 h-auto">
          <input type="text " placeholder="Type here" className="input ghost bg-white text-[#9999] font-normal w-80 h-[53px]" />
          <Button title="Get started" classNames="border border-white"/>
        </div>
        <div className="mt-6 text-[#BBBBBB]">Get a response tomorrow if you submit by 9pm today. If we received afte</div>
        <div className="text-[#BBBBBB]">9pm will get a reponse the following day.</div>
      </div>
    </div>
  )
}
export default SubscribeEmail;