import Link from "next/link";

export default function PricingPage() {
    const basePrice = 299;
    const bulkDiscount = 0.2;
    const bulkPrice = basePrice - basePrice * bulkDiscount;

    return (
        <main className="min-h-screen max-w-[1200px] mx-auto px-4 pt-31 md:pt-41">
            <section className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-foreground tracking-tight">
                    Transparent, Simple Pricing
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                    Enjoy premium laundry service at a flat rate. No hidden fees, no surprises. Bulk orders get an exclusive discount!
                </p>
            </section>

            <div className="flex flex-col md:flex-row gap-8 justify-center items-center mb-16">
                {/* Standard Pricing Card */}
                <div className="bg-[#1f092462] shadow-xl rounded-2xl p-8 w-full max-w-sm border border-[#580069] flex flex-col items-center hover:scale-105 transition-transform duration-300">
                    <span className="text-2xl font-semibold text-blue-600 mb-2">Standard</span>
                    <span className="text-5xl font-extrabold text-foreground mb-2">
                        Rs. {basePrice}
                    </span>
                    <span className="text-lg text-muted-foreground mb-4">per order</span>
                    <ul className="text-left text-muted-foreground space-y-2 mb-6">
                        <li>✔️ Free pickup & delivery</li>
                        <li>✔️ 24-48 hour turnaround</li>
                        <li>✔️ Premium sanitizer</li>
                        <li>✔️ All garments included</li>
                    </ul>
                    <Link href="/" className="w-full flex items-center justify-center py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">
                        Buy Now
                    </Link>
                </div>

                {/* Bulk Pricing Card */}
                <div className="bg-gradient-to-br from-[#1d291d9d] via-[#1e382081] to-[#1d3825d8] shadow-xl rounded-2xl p-8 w-full max-w-sm border-2 border-green-400 flex flex-col items-center hover:scale-105 transition-transform duration-300">
                    <span className="text-2xl font-semibold text-green-700 mb-2">Bulk Order</span>
                    <div className="flex items-end gap-2 mb-2">
                        <span className="text-5xl font-extrabold text-green-800">
                            Rs. {bulkPrice.toFixed(0)}
                        </span>
                        <span className="text-lg text-green-700 line-through opacity-70">Rs. {basePrice}</span>
                    </div>
                    <span className="text-lg text-green-700 mb-4 font-semibold">per order <span className="bg-green-200 text-green-800 px-2 py-0.5 rounded ml-2 text-sm">20% OFF</span></span>
                    <ul className="text-left text-green-900 space-y-2 mb-6">
                        <li>✔️ All Standard benefits</li>
                        <li>✔️ Priority processing</li>
                        <li>✔️ Dedicated support</li>
                        <li>✔️ For 80+ orders at once</li>
                    </ul>
                    <Link href='/contact' className="w-full flex items-center justify-center py-2 rounded-lg bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition">
                        Get Bulk Discount
                    </Link>
                </div>
            </div>

            <section className="max-w-2xl mx-auto text-center mt-12">
                <h2 className="text-xl font-semibold mb-2 text-foreground">How Bulk Discount Works</h2>
                <p className="text-muted-foreground mb-4">
                    Place <span className="font-semibold text-foreground">80 or more orders</span> in a single checkout and your discount will be applied automatically.
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                    <div className="flex-1 bg-muted rounded-lg p-4">
                        <span className="font-bold text-green-700">✔️</span> No coupon needed
                    </div>
                    <div className="flex-1 bg-muted rounded-lg p-4">
                        <span className="font-bold text-green-700">✔️</span> Discount shown at checkout
                    </div>
                    <div className="flex-1 bg-muted rounded-lg p-4">
                        <span className="font-bold text-green-700">✔️</span> Applies to all eligible orders
                    </div>
                </div>
            </section>

            <div className="mt-16 text-center text-muted-foreground text-sm">
                *All prices are inclusive of taxes. For custom or corporate plans, <a href="/contact" className="underline hover:text-foreground">contact us</a>.
            </div>
        </main>
    );
}