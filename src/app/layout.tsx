import { type Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Wrapper from "@/components/Redux/Wrapper";
import { AuthProvider } from "@/context/Context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
``
export const metadata: Metadata = {
  title: "VersaStore",
  description: "VersaStore",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-black to-gray-900  text-gray-100 font-sans`}
        suppressHydrationWarning
      >
        <Wrapper>
          <AuthProvider>
            {children}
            </AuthProvider>
        </Wrapper>
      </body>
    </html>
  );
}
