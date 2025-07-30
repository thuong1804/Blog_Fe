import CardAbout from "@/containers/About/CardAbout"
import Image from "next/image"

const AboutPage = () => {
  return (
    <div className="w-full pb-20 pt-14 px-5">
      <div className="max-w-(--max-width-desktop) mx-auto">
        <div className=" flex flex-col items-center">
          <h4 className="text-center">ABOUT US</h4>
          <h1 className="max-w-[650px] text-center leading-18 mt-4">Creative Blog Writting and publishing site</h1>
          <p className="max-w-[1000px] text-center leading-6 mt-4">Leverage agile frameworks to provide a robust synopsis for high level overviews.
            Iterative approaches to corporate strategy foster collaborative thinking to further the overall
            value proposition. Organically grow the holistic world view of disruptive innovation
            via workplace diversity and empowerment.
          </p>
          <div className="relative w-full h-[500px] mt-20">
            <Image
              src="/images/image-about.jpg"
              alt="about"
              fill
              className="object-cover rounded-xl w-full"
            />
          </div>
        </div>
        <h4 className="mt-18">HOW WE WORK</h4>
        <div className="flex items-end justify-between  mt-5 ">
          <h1 className="max-w-[500px] text-left m-0 p-0 leading-16">I will show you how our team works</h1>
          <p>Bring to the table win-win market strategies to ensure <br/> perfect articles. </p>
        </div>
        <div className="mt-16">
          <CardAbout/>
        </div>
      </div>
    </div>
  )
}
export default AboutPage