import type { Metadata } from "next";
import {  Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme";
import { ClerkProvider } from '@clerk/nextjs';

const manrope = Manrope({
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "StreamEdge",
  description: "Streame Ai powered video",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) 
{
  return (
    <html lang="en">
      <body
        className={`${manrope.className} bg-[#171717]`}
      >
        <ClerkProvider>
        <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
        >
          
          {children}
        </ThemeProvider>
        </ClerkProvider>
       
      </body>
    </html>
  );
}
