import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import BackToTop from "@/components/BackToTop";
import Splash from "@/components/Splash";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vegety - Healthy food to live a healthier life",
  description:
    "Fresh, healthy meals made with premium ingredients. Browse our menu of salads, bowls and wholesome dishes - crafted by the best chefs.",
  openGraph: {
    title: "Vegety - Healthy food for a healthier life",
    description: "Fresh, healthy meals made with premium ingredients.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <Splash />
        {children}
        <BackToTop />
      </body>
    </html>
  );
}
