import { CircleCheck, Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";

// accordion
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


// embla carousel
import '../components/carousel/css/embla.css';
import EmblaCarousel from '../components/carousel/js/EmblaCarousel';
import EmblaButtons from '../components/ProductPicSlideButton';
import { EmblaProvider } from '../components/EmblaContext'



export default function App() {

  const OPTIONS = {}
  const SLIDE_COUNT = 5
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys())


  return (
    <main className="min-h-screen flex flex-col max-w-[1200px] mx-auto px-4">
      <div className="flex items-center justify-center relative h-40">
        <div className="w-60 h-60 md:w-80 md:h-80 rounded-full border-2 border-muted  flex items-center justify-center absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <img
            src="/clean-bubble-logo.png"
            alt="Clean Bubble Logo"
            className="w-12 h-12 mt-18"
          />
        </div>

      </div>

      {/* main div */}
      <EmblaProvider>
        <div className="flex flex-col lg:flex-row gap-4">

          <div className="order-2 lg:order-1 max-w-[300px] w-full flex flex-col">
            <h1 className="text-6xl font-bold mt-8 flex flex-col gap-2 mb-14">
              <span className="font-bold">Foaming</span>
              <span>Hand</span>
              <span>Sanitizer</span>
            </h1>

            <p className="price text-5xl mb-20">
              <span itemProp="priceCurrency" content="PKR">₹</span>
              <span itemProp="price" content="149.99">249.99</span>
            </p>

            <p className="text-dimmer-foreground">
              Goodbye to sticky hands and hello to clean, soft skin!
            </p>

            <div className="flex flex-col gap-4 mt-8">
              <div className="flex items-center gap-2">
                <Button size="xl"
                  className="flex items-center rounded-full px-6 py-3">
                  <CircleCheck />
                  <span className="font-semibold">Add To Cart</span>
                </Button>
                <Button variant="outline">
                  <Heart />
                </Button>

              </div>
              <p></p>
            </div>

          </div>
          <div className="order-1 lg:order-2 max-w-[500px] flex justify-center mx-auto bg-blue-500">
            <EmblaCarousel slides={SLIDES} options={OPTIONS} />
          </div>


          <div className="order-3 max-w-[300px] w-full flex flex-col justify-between">

            <EmblaButtons options={OPTIONS} />


            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Description</AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Ingredients</AccordionTrigger>
                <AccordionContent>
                  Yes. It comes with default styles that matches the other
                  components&apos; aesthetic.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Usage</AccordionTrigger>
                <AccordionContent>
                  Yes. It's animated by default, but you can disable it if you prefer.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </EmblaProvider>
      {/* main div end */}
    </main >
  );
}
