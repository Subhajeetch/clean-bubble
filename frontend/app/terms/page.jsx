import { Badge } from "@/components/ui/badge";


export const metadata = {
    title: "Terms and Conditions - Clean Bubble",
    description:
        "Please read our terms and conditions carefully before using the Clean Bubble website. Clean Bubble is a university chemistry project, and the website is for educational purposes only.",
    keywords: [
        "Clean Bubble",
        "Terms and Conditions",
        "University Project",
        "Educational Website",
        "Hand Sanitizer",
        "Privacy Policy",
        "User Agreement",
        "Website Terms",
        "Project Terms and Conditions"
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
    authors: [{ name: "Clean Bubble" }],
    openGraph: {
        title: "Terms and Conditions - Clean Bubble",
        description:
            "Please read our terms and conditions carefully before using the Clean Bubble website. Clean Bubble is a university chemistry project, and the website is for educational purposes only.",
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
    alternates: {
        canonical: "/terms"
    },
};

export default function TermsPage() {
    return (
        <main className="min-h-screen max-w-2xl mx-auto px-4 pt-31 md:pt-41">
            <section className="mb-10 text-center">
                <Badge variant="outline" className="mb-4 text-base px-4 py-1 rounded-full bg-gray-100 text-gray-700 border-gray-300">
                    Terms & Conditions
                </Badge>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-foreground tracking-tight">
                    Terms and Conditions
                </h1>
                <p className="text-lg text-muted-foreground">
                    Please read these terms and conditions carefully before using the Clean Bubble website.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-2 text-foreground">1. Project Purpose</h2>
                <p className="text-muted-foreground mb-4">
                    Clean Bubble is a university chemistry project. The website and product are for educational and demonstration purposes only, not for commercial sale or distribution.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-2 text-foreground">2. Use of Website</h2>
                <p className="text-muted-foreground mb-4">
                    By accessing this website, you agree to use it for informational and educational purposes only. You may not use the website for any unlawful or unauthorized activities.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-2 text-foreground">3. Orders & Payments</h2>
                <p className="text-muted-foreground mb-4">
                    All orders placed through this website are for demonstration only. <span className="font-semibold text-foreground">Only Cash on Delivery (COD)</span> is available. No online payments are accepted or processed.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-2 text-foreground">4. Privacy</h2>
                <p className="text-muted-foreground mb-4">
                    We respect your privacy. Any information you provide is used solely for the purpose of fulfilling your order and is not shared with third parties. For more details, see our <a href="/privacy" className="underline text-blue-600 hover:text-blue-800">Privacy Policy</a>.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-2 text-foreground">5. Intellectual Property</h2>
                <p className="text-muted-foreground mb-4">
                    All content on this website, including text, images, and branding, is the property of the Clean Bubble project team and may not be used or reproduced without permission.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-2 text-foreground">6. Limitation of Liability</h2>
                <p className="text-muted-foreground mb-4">
                    The Clean Bubble team is not liable for any damages or losses resulting from the use of this website or the hand sanitizer product. The product is provided as part of a student project and is not intended for commercial or medical use.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-2 text-foreground">7. Changes to Terms</h2>
                <p className="text-muted-foreground mb-4">
                    We may update these terms and conditions at any time. Changes will be posted on this page. Continued use of the website constitutes acceptance of the updated terms.
                </p>
            </section>
        </main>
    );
}