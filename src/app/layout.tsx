import type { Metadata } from "next";
import { Raleway, Roboto } from "next/font/google";
import "./globals.css";
import ApolloWrapper from "@/lib/ApolloWrapper";
import ToastProvider from "@/context/ToastProvider/ToastProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/context/AuthContext/AuthContext";

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
      <script src="https://accounts.google.com/gsi/client" async defer></script>
      <body
        className={`${raleway.variable} ${roboto.variable} antialiased`}
      >
        <ApolloWrapper>
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string} >
            <ToastProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </ToastProvider>
          </GoogleOAuthProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
