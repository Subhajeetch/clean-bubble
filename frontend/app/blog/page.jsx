import { Badge } from "@/components/ui/badge";
import { PencilLine } from "lucide-react";

export default function BlogPage() {
    return (
        <main className="min-h-fit max-w-[1200px] mx-auto px-4 pt-31 md:pt-41">
            <section className="mb-10 text-center">
                <Badge variant="outline" className="mb-4 text-base px-4 py-1 rounded-full bg-yellow-100 text-yellow-700 border-yellow-300">
                    Blog
                </Badge>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-foreground tracking-tight flex justify-center items-center gap-2">
                    <PencilLine className="inline-block text-yellow-600" size={32} />
                    Clean Bubble Blog
                </h1>
                <p className="text-lg text-muted-foreground">
                    Insights, tips, and updates from the Clean Bubble team.
                </p>
            </section>

            <div className="flex flex-col items-center justify-center py-24 bg-muted rounded-xl shadow">
                <span className="text-3xl mb-2 text-muted-foreground font-bold">📝</span>
                <h2 className="text-xl font-semibold text-foreground mb-2">No blogs yet.</h2>
                <p className="text-muted-foreground text-sm">
                    Check back soon for updates and articles!
                </p>
            </div>
        </main>
    );
}