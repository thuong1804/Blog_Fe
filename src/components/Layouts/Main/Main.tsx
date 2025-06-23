type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({children} : MainLayoutProps) => {
  return (
    <div className="bg-[#FAFAFA] h-auto w-full">
      {children}
    </div>
  )
}
export default MainLayout