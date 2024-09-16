// import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <script
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA_nwBxUgw4RTZLvfRpt__cS1DIcYprbQ0&libraries=places&callback=initMap"
        async
      ></script>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
