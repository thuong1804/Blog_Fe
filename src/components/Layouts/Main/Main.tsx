type MainLayoutProps = {
    children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
    return <div className="bg-[#FAF9F7] h-auto w-full">{children}</div>;
};
export default MainLayout;
