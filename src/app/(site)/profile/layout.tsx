import HeaderProfile from "@/containers/Profile/HeaderProfile";
import MenuProfile from "@/containers/Profile/MenuProfile";

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="max-w-(--max-width-desktop) mx-auto py-6 px-6">
            <HeaderProfile />
            <div className="flex flex-col lg:flex-row w-full mt-10">
                <div className="w-full lg:w-1/4">
                    <MenuProfile />
                </div>
                <div className="flex-1">{children}</div>
            </div>
        </div>
    );
}
