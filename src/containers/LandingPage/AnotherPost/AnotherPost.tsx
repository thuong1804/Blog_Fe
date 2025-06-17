import Button from "@/components/Button/Button"

const AnotherPost = () => {
  return (
    <div>
      <div className="rounded-xl w-full max-w-(--max-width-desktop) lg-max-w-(--max-width-desktop) mx-auto h-[567px] relative bg-[url('/images/banner-2.jpg')] bg-center bg-no-repeat bg-cover">
        <div className="shadow absolute bottom-0 right-0  translate-y-1/4 max-w-[920px] bg-white pt-8 pb-11 pl-8 rounded-xl text-black w-full pr-[106px]">
          <div className="font-bold text-xs pb-6">
            DEVELOPMENT <span className="font-medium text-[#999999] ml-2">16 March 2023</span>
          </div>
          <h4 className="text-3xl font-bold leading-[1.2] pb-2 border-">How to make a Game look more attractive with New VR & AI Technology</h4>
          <div className="max-w-[784px] text-[#999999] text-[16px] font-normal pb-9">Google has been investing in AI for many years and bringing its benefits to individuals,
            businesses and communities. Whether it’s publishing state-of-the-art research, building helpful
            products or developing tools and resources that enable others, we’re committed to making AI accessible to everyone.
          </div>
          <Button title="Read more" classNames="border border-[#7C4EE4] bg-white text-[#7C4EE4]" />
        </div>
      </div>
      <div className="h-[100px]"/>
    </div>
  )
}
export default AnotherPost