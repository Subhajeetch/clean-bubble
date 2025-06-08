import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MainHeader from "../universal/mainHeader";
import { ThemeProvider } from "@/components/theme-provider";
// toaster
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Clean Bubble",
  description: "Portable hand sanitizer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en"
      className="dark"
      style={{ colorScheme: "dark" }}
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MainHeader />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
