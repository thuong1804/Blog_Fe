import Link from "next/link";

export default function NotFound() {
    return (
        <div className="w-full min-h-[70vh] flex items-center justify-center px-4 py-10">
            <div className="shadow bg-[#7C4EE4] rounded-2xl w-full max-w-3xl flex flex-col items-center justify-center gap-5 px-6 py-12 sm:py-16 text-center">
                <h1 className=" text-white font-bold text-9xl">404</h1>
                <p className="text-white text-2xl">Sorry!</p>
                <p className="text-white text-2xl">
                    The link is broken, try to refresh or go to home
                </p>
                <Link
                    href="/"
                    className="shadow bg-white px-7 py-5 rounded-xl text-black font-medium"
                >
                    Return Home
                </Link>
            </div>
        </div>
    );
}
