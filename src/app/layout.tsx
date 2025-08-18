import type { Metadata } from "next";
import { Raleway, Roboto } from "next/font/google";
import "./globals.css";
import MainLayout from "@/components/Layouts/Main/Main";
import FooterLayout from "@/components/Layouts/Footer/Footer";
import ApolloWrapper from "@/lib/ApolloWrapper";
import HeaderLayout from "@/components/Layouts/Header/Header";

const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-raleway',
  weight: ['400', '700'],
})

const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  icons: {
    icon: '/global.svg',
  },
  title: "TECHNEWS",
  description: "Explore articles on programming, Next.js, React, Node.js, and web development best practices. Stay updated with the latest tech trends for developers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${raleway.variable} ${roboto.variable} antialiased`}
      >
        <ApolloWrapper>
          <HeaderLayout />
          <MainLayout>
            {children}
          </MainLayout>
          <FooterLayout/>
        </ApolloWrapper>
      </body>
    </html>
  );
}
