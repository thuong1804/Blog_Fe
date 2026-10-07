import Link from "next/link";
import { FaBlogger } from "react-icons/fa";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="relative min-h-screen w-full overflow-x-hidden bg-[#070B18] text-white">
            {/* Background decoration (clipped: glow orbs bleed outside) */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#080D1A] via-[#0F172A] to-[#1E293B]" />
                {/* Glow orbs */}
                <div className="absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full bg-blue-600/25 blur-[120px]" />
                <div className="absolute top-1/3 -right-40 h-[520px] w-[520px] rounded-full bg-indigo-600/20 blur-[130px]" />
                <div className="absolute bottom-0 left-1/3 h-[380px] w-[480px] rounded-full bg-cyan-500/10 blur-[120px]" />
                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.15]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
                        backgroundSize: "56px 56px",
                        maskImage:
                            "radial-gradient(ellipse 90% 70% at 50% 30%, black 40%, transparent 100%)",
                    }}
                />
            </div>

            <div className="relative z-10 flex min-h-screen flex-col w-full">
                <header className="absolute top-0 left-0 z-20 flex items-center px-4 py-4 sm:px-8">
                    <Link
                        href="/"
                        className="group flex w-max items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-md transition hover:border-white/20 hover:bg-white/10"
                    >
                        <span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-black">
                            <FaBlogger className="text-2xl" />
                        </span>
                        <span className="font-extrabold tracking-tight text-lg sm:text-xl">
                            TECHNEWS
                        </span>
                    </Link>
                </header>

                <div className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
                    {children}
                </div>
            </div>
        </main>
    );
}