export const metadata = {
    title: "Privacy Policy - Clean Bubble",
    description:
        "Read our privacy policy to understand how we handle your data. Clean Bubble is a premium foaming hand sanitizer developed as part of a university chemistry project, ensuring your information is safe and secure.",
    keywords: [
        "Clean Bubble",
        "Privacy Policy",
        "Hand Sanitizer",
        "University Project",
        "Premium Foaming Hand Sanitizer",
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
    authors: [{ name: "Clean Bubble" }],
    openGraph: {
        title: "Privacy Policy - Clean Bubble",
        description:
            "Read our privacy policy to understand how we handle your data. Clean Bubble is a premium foaming hand sanitizer developed as part of a university chemistry project, ensuring your information is safe and secure.",
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
        canonical: "/privacy"
    },
};

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen max-w-[1200px] mx-auto px-4 pt-31 md:pt-41">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-foreground tracking-tight text-center">
                Privacy Policy
            </h1>
            <p className="text-lg text-muted-foreground text-center mb-10">
                Clean Bubble Foaming Hand Sanitizer
            </p>

            <h2 className="text-2xl font-semibold mb-2 text-foreground">About This Project</h2>
            <p className="text-muted-foreground mb-4">
                This hand sanitizer product is part of a university chemistry project. As students, we were tasked with creating a practical and effective solution for hand hygiene. Clean Bubble Foaming Hand Sanitizer was developed to meet this challenge, combining scientific principles with a focus on safety and user experience.
            </p>
            <p className="text-muted-foreground mb-8">
                <span className="font-semibold">Note:</span> This product is not commercially manufactured or distributed at scale. It is intended for educational and demonstration purposes only.
            </p>

            <h2 className="text-xl font-semibold mb-2 text-foreground">Your Privacy</h2>
            <p className="text-muted-foreground mb-2">
                We value your privacy and are committed to protecting your personal information. Any data collected through this website (such as your name, phone number, and delivery address) is used solely for the purpose of fulfilling your order and improving our service.
            </p>
            <ul className="list-disc ml-6 text-muted-foreground text-sm space-y-1 mb-4">
                <li>We do not share your information with third parties.</li>
                <li>Your data is stored securely and only accessible to authorized team members.</li>
                <li>No marketing or promotional messages will be sent to you.</li>
            </ul>
            <p className="text-muted-foreground mb-8">
                If you have any questions about your data or wish to have it deleted, please contact us using the information provided on our website.
            </p>

            <h2 className="text-xl font-semibold mb-2 text-foreground">Payment Information</h2>
            <p className="text-muted-foreground mb-8">
                <span className="font-semibold text-foreground">Only Cash on Delivery (COD) is available.</span> We do not collect or store any online payment details. Payment is made in person at the time of delivery, ensuring your financial information remains private and secure.
            </p>

            <h2 className="text-xl font-semibold mb-2 text-foreground">Contact</h2>
            <p className="text-muted-foreground mb-8">
                For any privacy-related concerns or questions about this project, please reach out to our team via the contact page. We are happy to address any inquiries regarding your data or our privacy practices.
            </p>

        </main>
    );
}