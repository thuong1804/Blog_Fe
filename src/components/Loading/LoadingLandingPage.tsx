export default function LoadingLandingPage() {
  return (
    <div className="h-auto w-full pb-24 animate-pulse">
      {/* Banner Featured */}
      <div className="bg-[#7C4EE4] p-24 relative">
        {/* Vector background */}
        <div className="w-[600px] h-[200px] bg-purple-300 opacity-30 absolute top-0 left-0 rounded-br-[200px]"></div>

        <div className="flex justify-between gap-12 max-w-(--max-width-desktop) w-full mx-auto">
          {/* Left side (text) */}
          <div className="w-1/2 flex flex-col gap-6">
            <div className="h-5 w-32 bg-gray-200 rounded"></div>
            <div className="h-16 w-3/4 bg-gray-200 rounded"></div>
            <div className="h-16 w-2/3 bg-gray-200 rounded"></div>
            <div className="h-4 w-2/3 bg-gray-200 rounded mt-4"></div>
            <div className="h-10 w-32 bg-gray-200 rounded mt-6"></div>
          </div>

          {/* Right side (image) */}
          <div className="w-[608px] h-[576px] bg-gray-200 rounded-xl"></div>
        </div>
      </div>

      {/* Another Post */}
      <div className="mt-[88px] max-w-(--max-width-desktop) mx-auto">
        <div className="h-8 w-40 bg-gray-200 rounded mb-6"></div>
        <div className="grid grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="h-64 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>

      {/* Recent Post */}
      <div className="mt-[88px] max-w-(--max-width-desktop) mx-auto">
        <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
        <div className="grid grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-64 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>

      {/* Popular Post */}
      <div className="mt-[88px] max-w-(--max-width-desktop) mx-auto">
        <div className="h-8 w-40 bg-gray-200 rounded mb-6"></div>
        <div className="grid grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-48 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    </div>
  )
}
