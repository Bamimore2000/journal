import { Inter } from "next/font/google";
import "./globals.css";
import { DataContextComp } from "./contexts/dataContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "iPhone Journal App",
  description: "Made by Sogo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DataContextComp>
        <div className="home">
          <div className="blur">
            <div className="content"></div>
          </div>
          
        {children}
        </div>
        </DataContextComp>
        
        </body>
    </html>
  );
}
