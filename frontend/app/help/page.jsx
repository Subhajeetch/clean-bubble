import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

import axios from "axios";
import cred from "@/mine.config";

export const metadata = {
    title: "Help Center - Clean Bubble",
    description:
        "Find answers to common questions and learn how to get the most out of Clean Bubble. From placing orders to tracking your laundry, our Help Center has you covered.",
    keywords: [
        "Clean Bubble",
        "Help Center",
        "FAQ",
        "Customer Support",
        "Order Tracking",
        "Laundry Service",
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
    authors: [{ name: "Clean Bubble" }],
    openGraph: {
        title: "Help Center - Clean Bubble",
        description:
            "Find answers to common questions and learn how to get the most out of Clean Bubble. From placing orders to tracking your laundry, our Help Center has you covered.",
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
        canonical: "/help"
    },
};


async function fetchStoreConfig() {
    try {
        const res = await axios.get(`${cred.backendURL}/api/store/config`);
        //   console.log('Fetched Store Config:', res.data);
        if (res.data.success) {
            return {
                price: res.data.price || 299,
                discountPercent: res.data.discountPercent || 0,
                bulkDiscountPercent: res.data.bulkDiscountPercent || 0.2,
                bulkQuantityThreshold: res.data.bulkQuantityThreshold || 30,
            };
        }
    } catch (err) {
        console.error('Failed to fetch store config', err);
        // Return default values on error
        return {
            price: 299,
            discountPercent: 0,
            bulkDiscountPercent: 0.2,
            bulkQuantityThreshold: 30,
        };
    }
}

export default async function HelpCenterPage() {

    const storeConfig = await fetchStoreConfig();


    const bulkDiscountPercent = storeConfig.bulkDiscountPercent;
    const bulkQuantityThreshold = storeConfig.bulkQuantityThreshold;
    const bulkPrice = storeConfig.price - (storeConfig.price * (bulkDiscountPercent / 100));

    return (
        <main className="min-h-screen max-w-2xl mx-auto px-4 pt-31 md:pt-41">
            <section className="mb-10 text-center">
                <Badge variant="outline" className="mb-4 text-base px-4 py-1 rounded-full bg-blue-100 text-blue-700 border-blue-300">
                    Help Center
                </Badge>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-foreground tracking-tight">
                    How can we help you?
                </h1>
                <p className="text-lg text-muted-foreground">
                    Find answers to common questions and learn how to get the most out of Clean Bubble.
                </p>
            </section>

            <Accordion type="single" collapsible className="mb-8">
                <AccordionItem value="ordering">
                    <AccordionTrigger>How do I place an order?</AccordionTrigger>
                    <AccordionContent>
                        Go to the <strong>Order</strong> page, select your desired laundry service, add your garments, and proceed to checkout. Fill in your delivery details and confirm your order. You’ll receive a confirmation and can track your order status in your account.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="bulk">
                    <AccordionTrigger>How does the bulk discount work?</AccordionTrigger>
                    <AccordionContent>
                        If you place <strong>{bulkQuantityThreshold} or more orders</strong> at once, a {bulkDiscountPercent}% discount is automatically applied at checkout, making it <strong> only Rs. {bulkPrice.toFixed(2)} PKR</strong> per item. No coupon code is needed.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="tracking">
                    <AccordionTrigger>How can I track my order?</AccordionTrigger>
                    <AccordionContent>
                        After placing an order, you can view its progress on the <strong>Order Details</strong> page. You’ll see real-time updates as your order moves from <strong>Ordered</strong> to <strong>Delivered</strong>.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="cancel">
                    <AccordionTrigger>Can I cancel my order?</AccordionTrigger>
                    <AccordionContent>
                        You can cancel your order from the order details page as long as it hasn’t been shipped or delivered. Select a reason for cancellation and confirm. If your order is already shipped or delivered, cancellation is disabled.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="review">
                    <AccordionTrigger>How do I leave a review?</AccordionTrigger>
                    <AccordionContent>
                        Once your order is delivered, you can leave a review from the order details page or the reviews section. Share your experience and rate our service!
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="payment">
                    <AccordionTrigger>What payment methods are available?</AccordionTrigger>
                    <AccordionContent>
                        <strong>Only Cash on Delivery (COD)</strong> is available. Pay when your order is delivered—no online payment required.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="privacy">
                    <AccordionTrigger>Is my data safe?</AccordionTrigger>
                    <AccordionContent>
                        Yes! We only collect information needed to process your order. Your data is never shared with third parties and is stored securely. See our <a href="/privacy" className="underline text-blue-600 hover:text-blue-800">Privacy Policy</a> for details.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="account">
                    <AccordionTrigger>Do I need an account to order?</AccordionTrigger>
                    <AccordionContent>
                        Yes, you need to create an account to place orders, track your laundry, and leave reviews. This helps us keep your orders organized and secure.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="support">
                    <AccordionTrigger>How do I contact support?</AccordionTrigger>
                    <AccordionContent>
                        Visit our <a href="/contact" className="underline text-blue-600 hover:text-blue-800">Contact</a> page and fill out the form. Our team will get back to you as soon as possible.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </main>
    );
}