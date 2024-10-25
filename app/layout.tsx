import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import Header from "./(components)/Header";
import Footer from "./(components)/Footer";
import TanStack from "@/utils/TanStack";
import Redux from "./(components)/Redux";
import Whatapp from "./(components)/Whatapp";
import { Toaster } from "@/components/ui/toaster";

const cairo = Cairo({
  subsets: ["latin", "arabic"],
  weight: ["400", "700"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "herStyle",
  description: "E-commerce website for women",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.moyasar.com/mpf/1.5.2/moyasar.css"
        ></link>
      </head>
      <body
        className={`${cairo.variable} bg-[#FBFBFC] font-sans flex flex-col min-h-screen justify-between relative`}
      >
        <TanStack>
          <Redux>
            <Header />
            <Toaster />
            {children}
          </Redux>
        </TanStack>
        <Whatapp />
        <Footer />
      </body>
    </html>
  );
}
