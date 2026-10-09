export default function AuthorSkeleton() {
    return (
        <div className="w-full pb-20 pt-14 px-5 animate-pulse">
            <div className="max-w-(--max-width-desktop) mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-10 border-b border-gray-300 pb-8">
                    {/* Avatar */}
                    <div className="w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] md:w-[274px] md:h-[274px] bg-gray-200 rounded-2xl shrink-0" />

                    {/* User info */}
                    <div className="flex flex-col gap-4 w-full max-w-[500px]">
                        <div className="h-6 w-40 bg-gray-200 rounded" />
                        <div className="h-4 w-60 bg-gray-200 rounded" />
                        <div className="h-4 w-48 bg-gray-200 rounded" />

                        <div className="space-y-2 mt-2">
                            <div className="h-4 w-full bg-gray-200 rounded" />
                            <div className="h-4 w-5/6 bg-gray-200 rounded" />
                            <div className="h-4 w-4/6 bg-gray-200 rounded" />
                        </div>

                        <div className="h-9 w-32 bg-gray-200 rounded-xl mt-3" />
                    </div>
                </div>

                {/* Post section */}
                <div className="mt-20">
                    {/* Title */}
                    <div className="h-6 w-32 bg-gray-200 rounded mb-6" />

                    {/* Post cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 3 }).map((_, idx) => (
                            <div
                                key={idx}
                                className="h-[320px] bg-gray-200 rounded-xl"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
