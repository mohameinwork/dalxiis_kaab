import type { Metadata } from "next";
import { Lato } from "next/font/google";
import { AuthProvider } from "@/context/AuthProvider";
import GlobalProvider from "@/context/GlobalProvider";
import "./globals.css";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Dhaqan Kaab App",
  description: "dhaqan kaab booking management system.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={` ${lato.variable} h-full antialiased overflow-x-hidden`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <GlobalProvider>{children}</GlobalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
