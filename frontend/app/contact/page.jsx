import { Badge } from "@/components/ui/badge";
import { FaInstagram, FaTwitter, FaFacebook, FaEnvelope, FaPhone } from "react-icons/fa";

export default function ContactPage() {
    return (
        <main className="min-h-fit max-w-[1200px] mx-auto px-4 pt-31 md:pt-41">
            <section className="mb-10 text-center">
                <Badge variant="outline" className="mb-4 text-base px-4 py-1 rounded-full bg-blue-100 text-blue-700 border-blue-300">
                    Contact Us
                </Badge>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-foreground tracking-tight">
                    Get in Touch
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                    Have a question, feedback, or need support? Reach out to us directly!
                </p>
            </section>

            <div className="space-y-6 border border-[#6200ff] bg-gradient-to-br from-[#792af759] via-[#782bf544] to-[#7521e221] rounded-xl shadow p-6">
                <div className="flex items-center gap-3">
                    <FaEnvelope className="text-blue-600 text-xl" />
                    <span className="font-medium text-foreground">Email:</span>
                    <a href="mailto:cleanbubble.project@gmail.com" className="text-blue-700 underline hover:text-blue-900">
                        cleanbubble.project@gmail.com
                    </a>
                </div>
                <div className="flex items-center gap-3">
                    <FaPhone className="text-green-600 text-xl" />
                    <span className="font-medium text-foreground">Phone:</span>
                    <a href="tel:+923001234567" className="text-green-700 underline hover:text-green-900">
                        +92 300 1234567
                    </a>
                </div>
                <div className="flex items-center gap-3">
                    <FaInstagram className="text-pink-500 text-xl" />
                    <a href="https://instagram.com/cleanbubble" target="_blank" rel="noopener noreferrer" className="text-pink-600 underline hover:text-pink-800">
                        @cleanbubble
                    </a>
                </div>
                <div className="flex items-center gap-3">
                    <FaTwitter className="text-blue-400 text-xl" />
                    <a href="https://twitter.com/cleanbubble" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-700">
                        @cleanbubble
                    </a>
                </div>
                <div className="flex items-center gap-3">
                    <FaFacebook className="text-blue-700 text-xl" />
                    <a href="https://facebook.com/cleanbubble" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline hover:text-blue-900">
                        facebook.com/cleanbubble
                    </a>
                </div>
            </div>

            <div className="mt-12 text-center text-muted-foreground text-xs">
                *All these are fake just for ui.
            </div>
        </main>
    );
}