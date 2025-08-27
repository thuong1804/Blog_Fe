export default function Loading() {
  return (
    <div className="w-full pb-20 pt-14 animate-pulse">
      <div className="max-w-(--max-width-desktop) mx-auto">
        <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
      </div>

      <div className="flex flex-col items-center mt-10">
        <div className="h-10 w-1/3 bg-gray-200 rounded mb-6"></div>

        <div className="relative w-full h-[600px] max-w-(--max-width-desktop) mt-14">
          <div className="w-full h-full bg-gray-200 rounded-2xl"></div>
        </div>

        <div className="max-w-[1024px] flex flex-col w-full mt-5 gap-4">
          {/* Author + Tags */}
          <div className="flex justify-between flex-wrap items-center">
            <div className="flex items-center gap-2">
              <div className="w-[30px] h-[30px] bg-gray-200 rounded-full"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
            <div className="flex gap-2 items-center">
              {Array.from({ length: 3 }).map((_, idx) => (
                <span
                  key={idx}
                  className="h-6 w-16 bg-gray-200 rounded-xl"
                />
              ))}
            </div>
          </div>

          {/* Date + Update */}
          <div className="flex gap-4">
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-[1024px] mt-10 w-full">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="h-5 w-full bg-gray-200 rounded mb-3"
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}
