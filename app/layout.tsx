import type { Metadata } from "next";
import { Big_Shoulders, Newsreader, Public_Sans } from "next/font/google";
import "./globals.css";

const bigShoulders = Big_Shoulders({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--display",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--serif",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--sans",
});

export const metadata: Metadata = {
  title: "IBEW LU60 Endorsements",
  description: "2026 Candidates endorsed by the IBEW Local 60 Union",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bigShoulders.variable} ${newsreader.variable} ${publicSans.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
