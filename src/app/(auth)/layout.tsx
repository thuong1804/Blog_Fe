import Link from "next/link";
import Image from "next/image";
import { FaBlogger } from "react-icons/fa";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="relative w-screen h-screen text-(--text-color-title) overflow-hidden">
            <div className="absolute inset-0 -z-10">
                <Image
                    src="/bg.jpg"
                    alt="Background"
                    fill
                    priority
                    className="object-cover"
                />
            </div>

            <div className="relative z-10 w-full h-full">
                <Link
                    href="/"
                    className="fixed top-2.5 left-2.5 p-2 flex items-center gap-2 w-max hover:opacity-80 transition-opacity"
                >
                    <FaBlogger className="text-5xl" />
                    <span className="font-bold text-xl md:text-3xl">
                        TECHNEWS
                    </span>
                </Link>

                <div className="w-full h-full">
                    {children}
                </div>
            </div>
        </main>
    );
}