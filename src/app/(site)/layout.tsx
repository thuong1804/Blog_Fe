import FooterLayout from "@/components/Layouts/Footer/Footer";
import HeaderLayout from "@/components/Layouts/Header/Header";
import MainLayout from "@/components/Layouts/Main/Main";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeaderLayout />
      <MainLayout>{children}</MainLayout>
      <FooterLayout />
    </>
  );
}