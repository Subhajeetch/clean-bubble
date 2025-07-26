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
  metadataBase: new URL("https://clean-bubble.vercel.app"),
  title: "Clean Bubble - Premium Foaming Hand Sanitizer",
  description:
    "Clean Bubble is a premium foaming hand sanitizer that kills 99.9% of germs while being gentle on your skin. Experience the perfect balance of cleanliness and care with our unique formula.",
  keywords: [
    "Clean Bubble",
    "Hand Sanitizer",
    "Foaming Hand Sanitizer",
    "Premium Hand Sanitizer",
    "Germ Protection",
    "Skin Care",
    "Alcohol-Based Sanitizer",
    "Moisturizing Hand Sanitizer",
    "Lavender Scented Sanitizer"
  ],
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true
    }
  },
  icons: {
    icon: "/logo-1800.png",
    shortcut: "/logo-1800.png",
    apple: [
      { url: "/logo-1800.png" },
      { url: "/logo-1800.png", sizes: "192x192", type: "image/png" }
    ],
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/logo-1800.png"
    }
  },
  authors: [{ name: "Clean Bubble" }],
  openGraph: {
    title: "Clean Bubble - Premium Foaming Hand Sanitizer",
    description:
      "Clean Bubble is a premium foaming hand sanitizer that kills 99.9% of germs while being gentle on your skin. Experience the perfect balance of cleanliness and care with our unique formula.",
    url: "https://clean-bubble.vercel.app",
    siteName: "Clean Bubble",
    images: [
      {
        url: "https://i.imgur.com/IJGMd4a.png",
        width: 1200,
        height: 1200,
        alt: "Clean Bubble Website Banner"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  verification: {
    google: "google",
    yandex: "yendex",
    yahoo: "yahoo"
  },
  alternates: {
    canonical: "/"
  },

  other: {
    "theme-color": "#FFFFFF",
    "apple-mobile-web-app-title": "Clean Bubble",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black",
  }
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
