export default function LoadingLandingPage() {
    return (
        <div className="w-full pb-24 animate-pulse">
            {/* ===== Featured Banner ===== */}
            <section className="bg-[#7C4EE4] relative">
                <div className="max-w-desktop mx-auto px-6 py-12 lg:py-24 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Left content */}
                        <div className="w-full lg:w-1/2 flex flex-col gap-5">
                            <div className="h-5 w-32 bg-white/40 rounded"></div>

                            <div className="h-12 sm:h-14 lg:h-20 w-full bg-white/40 rounded"></div>
                            <div className="h-12 sm:h-14 lg:h-20 w-5/6 bg-white/40 rounded"></div>

                            <div className="h-4 w-3/4 bg-white/40 rounded mt-4"></div>
                            <div className="h-4 w-2/3 bg-white/40 rounded"></div>

                            <div className="h-10 w-32 bg-white rounded mt-6"></div>
                        </div>

                        {/* Right image */}
                        <div className="w-full lg:w-[608px] h-[240px] sm:h-[360px] lg:h-[576px] bg-white/40 rounded-xl"></div>
                    </div>
                </div>
            </section>

            {/* ===== Another Post ===== */}
            <section className="max-w-desktop mx-auto px-6 mt-20">
                <div className="h-8 w-40 bg-gray-200 rounded mb-6"></div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, idx) => (
                        <div
                            key={idx}
                            className="h-64 bg-gray-200 rounded-xl"
                        />
                    ))}
                </div>
            </section>

            {/* ===== Recent Post ===== */}
            <section className="max-w-desktop mx-auto px-6 mt-20">
                <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, idx) => (
                        <div
                            key={idx}
                            className="h-64 bg-gray-200 rounded-xl"
                        />
                    ))}
                </div>
            </section>

            {/* ===== Popular Post ===== */}
            <section className="max-w-desktop mx-auto px-6 mt-20">
                <div className="h-8 w-40 bg-gray-200 rounded mb-6"></div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, idx) => (
                        <div
                            key={idx}
                            className="h-48 bg-gray-200 rounded-xl"
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}
