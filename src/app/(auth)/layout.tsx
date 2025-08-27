export default function LoginLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <main className="w-screen h-screen text-(--text-color-title) bg-[url('/bg.jpg')] bg-center bg-no-repeat bg-cover">
      {children}
    </main>
  );
}
