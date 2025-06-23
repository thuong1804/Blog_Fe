import Image from "next/image"

const NotFoundBlog = () => {
  return (
    <div className="flex flex-col items-center justify-center text-gray-400 py-16 gap-2 w-full">
      <Image alt="not found" src={'/images/no-result.png'} height={400} width={400} />
      <p className="text-lg font-medium">No posts found</p>
      <p className="text-sm">Try selecting a different category.</p>
    </div>
  )
}
export default NotFoundBlog