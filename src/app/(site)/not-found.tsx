import Link from "next/link";

export default function SiteNotFound() {
    return (
        <div className="w-full flex items-center justify-center px-4 py-16 sm:py-24">
            <div className="w-full max-w-2xl rounded-2xl flex flex-col items-center justify-center gap-4 px-6 py-12 sm:px-12 text-center">
                <h1 className="text-gray-800 font-bold text-7xl sm:text-9xl leading-none">
                    404
                </h1>
                <p className="text-gray-800 text-xl sm:text-2xl font-semibold">
                    Sorry! Page not found
                </p>
                <p className="text-gray-600 text-base sm:text-lg">
                    The link is broken or the slug does not exist.
                    Try to refresh or go back home.
                </p>
                <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
                    <Link
                        href="/"
                        className="shadow bg-white px-7 py-3.5 rounded-xl text-black font-medium hover:bg-slate-100 transition-colors"
                    >
                        Return Home
                    </Link>
                    <Link
                        href="/blog"
                        className="px-7 py-3.5 rounded-xl font-medium border border-gray-400/40 text-gray-800 hover:bg-gray-800/10 transition-colors"
                    >
                        Explore Blog
                    </Link>
                </div>
            </div>
        </div>
    );
}
