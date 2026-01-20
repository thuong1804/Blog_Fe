import Link from "next/link";
import { FaBlogger } from "react-icons/fa";

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="w-screen h-screen text-(--text-color-title) bg-[url('/bg.jpg')] bg-center bg-no-repeat bg-cover">
            <Link href="/" className="fixed top-2.5 left-2.5 p-2 flex items-center gap-2 w-max">
                <FaBlogger className="text-5xl" />
                <span className="font-bold text-xl md:text-3xl">
                    TECHNEWS
                </span>
            </Link>
            {children}
        </main>
    );
}
