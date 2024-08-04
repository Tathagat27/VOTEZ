import { Inter } from "next/font/google";
import "./globals.css";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "VOTEZ",
  description: "An online voting system using blockchain(Ethereum).",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} h-screen w-screen m-0 bg-orange-50 p-0 `}>
     
        {children}
      </body>
    </html>
  );
}
