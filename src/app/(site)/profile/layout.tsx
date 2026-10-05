import HeaderProfile from "@/containers/Profile/HeaderProfile";
import MenuProfile from "@/containers/Profile/MenuProfile";

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-[80vh] bg-slate-50/70">
            <div className="mx-auto max-w-(--max-width-desktop) px-4 py-6 sm:px-6 sm:py-8">
                <HeaderProfile />
                <div className="mt-5 flex w-full flex-col gap-5 lg:flex-row">
                    <aside className="w-full shrink-0 lg:sticky lg:top-24 lg:h-fit lg:w-72">
                        <MenuProfile />
                    </aside>
                    <div className="min-w-0 flex-1">{children}</div>
                </div>
            </div>
        </div>
    );
}
