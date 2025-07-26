import { Badge } from "@/components/ui/badge";
import { Briefcase } from "lucide-react";

export const metadata = {
    title: "Careers - Clean Bubble",
    description:
        "Explore opportunities to grow with Clean Bubble, a premium foaming hand sanitizer brand. Join our team and help us make a difference in hygiene and skin care.",
    keywords: [
        "Careers",
        "Jobs",
        "Clean Bubble",
        "Hand Sanitizer",
        "Hygiene",
        "Skin Care",
        "Join Our Team"
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
        title: "Careers - Clean Bubble",
        description:
            "Explore opportunities to grow with Clean Bubble, a premium foaming hand sanitizer brand. Join our team and help us make a difference in hygiene and skin care.",
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
        canonical: "/careers"
    },
};

export default function CareersPage() {
    return (
        <main className="min-h-fit max-w-[1200px] mx-auto px-4 pt-31 md:pt-41">
            <section className="mb-10 text-center">
                <Badge variant="outline" className="mb-4 text-base px-4 py-1 rounded-full bg-green-100 text-green-700 border-green-300">
                    Careers
                </Badge>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-foreground tracking-tight flex justify-center items-center gap-2">
                    <Briefcase className="inline-block text-green-600" size={32} />
                    Join the Team
                </h1>
                <p className="text-lg text-muted-foreground">
                    Explore opportunities to grow with us.
                </p>
            </section>

            <div className="flex flex-col items-center justify-center py-24 bg-muted rounded-xl shadow">
                <span className="text-3xl mb-2 text-muted-foreground font-bold">🚫</span>
                <h2 className="text-xl font-semibold text-foreground mb-2">No careers for now.</h2>
                <p className="text-muted-foreground text-sm">
                    We are not hiring at the moment. Please check back later!
                </p>
            </div>
        </main>
    );
}