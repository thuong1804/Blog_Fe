import MenuProfile from "@/containers/Profile/MenuProfile";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-(--max-width-desktop) mx-auto py-20">
      <div className="flex items-center gap-3">
        <div className="avatar">
          <div className="w-16 rounded-full">
            <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
          </div>
        </div>
        <p className="text-2xl text-black font-normal">Hello</p>
        <p className="text-2xl">/</p>
        <p className="text-2xl text-black font-normal">Edit Profile</p>
      </div>
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