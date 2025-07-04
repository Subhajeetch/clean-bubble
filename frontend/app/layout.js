import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MainHeader from "../universal/mainHeader";
import MainFooter from "@/universal/mainFooter";
import { ThemeProvider } from "@/components/theme-provider";
// toaster
import { Toaster } from "@/components/ui/sonner";

// authprovider
import AuthProvider from "@/context/AuthProvider";

// cart provider
import { CartProvider } from '@/context/cartContext';

// cart sheet provider
import { SheetProvider } from '@/context/SheetContext';

// login tabs provider
import { LoginProvider } from '@/context/LoginContext';

// order success provider
import { OrderSuccessProvider } from '@/context/OrderSuccessContext';

// notification context
import { NotificationProvider } from "@/context/NotificationsContext";

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
        <AuthProvider>
          <LoginProvider>
            <NotificationProvider>
              <OrderSuccessProvider>
                <CartProvider>
                  <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                  >
                    <SheetProvider>
                      <MainHeader />
                      {children}

                      <Toaster />
                      <MainFooter />
                    </SheetProvider>
                  </ThemeProvider>
                </CartProvider>
              </OrderSuccessProvider>
            </NotificationProvider>
          </LoginProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
