export default function LoadingBlogContainer() {
  return (
    <div className="w-full pt-16 pb-20">
      <div className="max-w-(--max-width-desktop) mx-auto">
        <div className="animate-pulse bg-gray-200 h-6 w-[200px] rounded">
        </div>
        <div className="flex flex-col items-center">
          <h4 className="animate-pulse bg-gray-200 h-6 w-32 rounded"></h4>
          <h1 className="mt-6 animate-pulse bg-gray-200 h-10 w-64 rounded"></h1>
          <p className="mt-6 max-w-[1010px] animate-pulse bg-gray-200 h-5 w-full rounded"></p>
        </div>

        <div className="grid grid-cols-3 gap-4 gap-y-10 mt-28">
          {Array.from({ length: 9 }).map((_, idx) => (
            <div
              key={idx}
              className="h-60 w-full bg-gray-200 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
