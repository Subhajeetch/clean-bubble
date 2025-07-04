import { Badge } from "@/components/ui/badge";
import { FlaskConical } from "lucide-react";

export default function AboutPage() {
    return (
        <main className="min-h-fit max-w-2xl mx-auto px-4 pt-31 md:pt-41">
            <section className="mb-10 text-center">
                <Badge variant="outline" className="mb-4 text-base px-4 py-1 rounded-full bg-purple-100 text-purple-700 border-purple-300">
                    About Us
                </Badge>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-foreground tracking-tight flex justify-center items-center gap-2">
                    <FlaskConical className="inline-block text-purple-600" size={32} />
                    Our Story
                </h1>
                <p className="text-lg text-muted-foreground">
                    The journey behind Clean Bubble Foaming Hand Sanitizer
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2 text-foreground">How It Started</h2>
                <p className="text-muted-foreground mb-4">
                    Clean Bubble was born out of a university chemistry project. As a team of passionate students, we were challenged to create a product that combined scientific knowledge with real-world impact. Our goal was to develop a hand sanitizer that not only cleans effectively but also cares for your skin and the environment.
                </p>
                <p className="text-muted-foreground mb-4">
                    We researched, experimented, and refined our formula in the university lab. After many trials, we created a foaming hand sanitizer that delivers a rich lather, kills 99.9% of germs, and leaves hands feeling fresh and soft.
                </p>
                <p className="text-muted-foreground mb-4">
                    We showcased Clean Bubble at our university, receiving great feedback from students and faculty. This website was created to share our project, our process, and our passion for science-driven solutions.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2 text-foreground">How It's Made</h2>
                <p className="text-muted-foreground mb-4">
                    Every bottle of Clean Bubble is crafted with care, using quality ingredients and safe lab practices. Our formula is designed for superior hygiene, gentle skin feel, and a pleasant lavender scent.
                </p>
                <p className="text-muted-foreground mb-4">
                    Curious about the ingredients and features? <a href="/features" className="underline text-purple-700 hover:text-purple-900">Check out our Features page</a> for a full breakdown of what makes Clean Bubble special.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2 text-foreground">Why This Website?</h2>
                <p className="text-muted-foreground mb-4">
                    This website is part of our project showcase. Here, you can learn about our process, see the science behind the product, and discover what makes Clean Bubble unique. While not a commercial product, we hope our work inspires others to combine chemistry and creativity for a cleaner, healthier world.
                </p>
            </section>
        </main>
    );
}