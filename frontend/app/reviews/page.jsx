import RatingOverview from "../UIforRating";

export const metadata = {
    title: "Reviews - Clean Bubble",
    description:
        "Read reviews from our customers about Clean Bubble, the premium foaming hand sanitizer developed as part of a university chemistry project. Experience the perfect balance of cleanliness and care with our unique formula.",
    keywords: [
        "Clean Bubble",
        "Hand Sanitizer",
        "Foaming Hand Sanitizer",
        "Premium Hand Sanitizer",
        "Germ Protection",
        "Skin Care",
        "Alcohol-Based Sanitizer",
        "Moisturizing Hand Sanitizer",
        "Lavender Scented Sanitizer",
        "Customer Reviews",
        "User Feedback",
        "University Chemistry Project",
        "Clean Bubble Reviews",
        "Hand Sanitizer Reviews",
        "Customer Testimonials",
        "User Experiences",
        "Hand Sanitizer Feedback",
        "Clean Bubble Feedback",
        "Hand Sanitizer Ratings"
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
        title: "Reviews - Clean Bubble",
        description:
            "Read reviews from our customers about Clean Bubble, the premium foaming hand sanitizer developed as part of a university chemistry project. Experience the perfect balance of cleanliness and care with our unique formula.",
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
        canonical: "/reviews"
    },
};

const Reviews = () => {
    return (
        <main className="min-h-screen max-w-[1200px] mx-auto px-4 pt-31 md:pt-41">
            <RatingOverview />
        </main>

    )
}

export default Reviews;