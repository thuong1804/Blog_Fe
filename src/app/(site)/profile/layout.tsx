import HeaderProfile from "@/containers/Profile/HeaderProfile";
import MenuProfile from "@/containers/Profile/MenuProfile";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-(--max-width-desktop) mx-auto py-20">
      <HeaderProfile/>
      <div className="flex w-full mt-10">
        <div className="w-[20%]">
          <MenuProfile />
        </div>
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}