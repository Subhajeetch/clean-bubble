import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, Droplets, Sparkles, Flower, Hand } from "lucide-react";

export default function FeaturesPage() {
    ;
    return (
        <main className="min-h-screen max-w-[1200px] mx-auto px-4 pt-31 md:pt-41">
            <section className="mb-12 text-center">
                <Badge variant="outline" className="mb-4 text-base px-4 py-1 rounded-full bg-purple-100 text-purple-700 border-purple-300">
                    Clean Bubble - Foaming Hand Sanitizer
                </Badge>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-foreground tracking-tight">
                    Superior Hygiene, Effortless Clean
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                    Experience superior hygiene with our Clean Bubble Foaming Hand Sanitizer, engineered for rich lather and minimal water use. It effectively removes dirt and kills <span className="font-semibold text-foreground">99.9% of germs</span> without rinsing. Enriched with <span className="font-semibold text-purple-700">lavender essential oil</span>, it leaves hands clean, fresh, and lightly scented—without dryness.
                </p>
            </section>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
                {/* Feature 1 */}
                <Card className="shadow-lg border border-[#920c92] bg-gradient-to-br from-[#5e0f5ea2] via-[#61076452] to-[#a608ac18]">
                    <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="text-purple-600" />
                            <CardTitle>Rich Foaming Lather</CardTitle>
                        </div>
                        <CardDescription>
                            Enjoy a luxurious, thick foam that spreads easily and covers every part of your hands.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="text-muted-foreground space-y-2 text-sm">
                            <li className="flex items-center gap-2"><CheckCircle className="text-green-500" size={18} /> Deep cleans without harshness</li>
                            <li className="flex items-center gap-2"><Droplets className="text-blue-400" size={18} /> Minimal water use</li>
                        </ul>
                    </CardContent>
                </Card>
                {/* Feature 2 */}
                <Card className="shadow-lg border border-[#250fa1] bg-gradient-to-br from-[#1d118d63] via-[#09085f4b] to-[#220d8346]">
                    <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                            <Hand className="text-blue-600" />
                            <CardTitle>No Rinsing Needed</CardTitle>
                        </div>
                        <CardDescription>
                            Kills 99.9% of germs and removes dirt—no water required.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="text-muted-foreground space-y-2 text-sm">
                            <li className="flex items-center gap-2"><CheckCircle className="text-green-500" size={18} /> Fast-drying, non-sticky finish</li>
                            <li className="flex items-center gap-2"><Sparkles className="text-purple-400" size={18} /> Leaves hands fresh and clean</li>
                        </ul>
                    </CardContent>
                </Card>
                {/* Feature 3 */}
                <Card className="shadow-lg border border-[#6200ff] bg-gradient-to-br from-[#792af759] via-[#782bf544] to-[#7521e221]">
                    <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                            <Flower className="text-purple-700" />
                            <CardTitle>Lavender Essential Oil</CardTitle>
                        </div>
                        <CardDescription>
                            Enriched with natural lavender for a gentle, calming scent and soft skin.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="text-muted-foreground space-y-2 text-sm">
                            <li className="flex items-center gap-2"><CheckCircle className="text-green-500" size={18} /> No dryness or irritation</li>
                            <li className="flex items-center gap-2"><Flower className="text-purple-400" size={18} /> Light, pleasant fragrance</li>
                        </ul>
                    </CardContent>
                </Card>
                {/* Feature 4 */}
                <Card className="shadow-lg border border-[#18beff] bg-gradient-to-br from-[#0cb2ff50] via-[#0089c949] to-[#005d6e34]">
                    <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                            <Droplets className="text-blue-500" />
                            <CardTitle>Minimal Water Use</CardTitle>
                        </div>
                        <CardDescription>
                            Perfect for on-the-go hygiene—no sink or towel needed.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="text-muted-foreground space-y-2 text-sm">
                            <li className="flex items-center gap-2"><CheckCircle className="text-green-500" size={18} /> Use anytime, anywhere</li>
                            <li className="flex items-center gap-2"><Droplets className="text-blue-400" size={18} /> Eco-friendly formula</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {/* Ingredients & Usage */}
            <section className="max-w-2xl mx-auto mb-16">
                <Card className="bg-muted border-0 shadow-md">
                    <CardHeader>
                        <CardTitle>Ingredients</CardTitle>
                        <CardDescription>
                            Safe, effective, and gentle on your skin.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc ml-6 text-muted-foreground text-sm space-y-1">
                            <li>Water</li>
                            <li>Alcohol (for germ killing)</li>
                            <li>Glycerin (for moisture)</li>
                            <li>Lavender Essential Oil</li>
                            <li>Gentle surfactants</li>
                            <li>Skin conditioners</li>
                            <li>Fragrance</li>
                        </ul>
                    </CardContent>
                </Card>
                <Card className="bg-muted border-0 shadow-md mt-8">
                    <CardHeader>
                        <CardTitle>How to Use</CardTitle>
                        <CardDescription>
                            Simple steps for effective hand hygiene.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ol className="list-decimal ml-6 text-muted-foreground text-sm space-y-1">
                            <li>Dispense a small amount of foam onto dry hands.</li>
                            <li>Rub thoroughly across all areas of the hands until completely dry.</li>
                            <li>No rinsing or water required.</li>
                            <li>Use as needed to maintain effective hand hygiene.</li>
                        </ol>
                    </CardContent>
                </Card>
            </section>
        </main>
    );
}