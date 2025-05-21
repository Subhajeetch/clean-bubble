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
      <div className="flex items-center justify-center relative h-30 md:h-40">
        <div className="w-60 h-60 md:w-80 md:h-80 rounded-full border-2 border-muted  flex items-center justify-center absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
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

          <div className="order-2 lg:order-1 lg:max-w-[300px] w-full flex flex-col md:flex-row lg:flex-col justify-between gap-6 lg:pt-32">
            <h1 className="text-6xl font-bold mt-8 flex flex-col gap-2 mb-14">
              <span className="font-bold">Foaming</span>
              <span>Hand</span>
              <span>Sanitizer</span>
            </h1>

            <div className='flex flex-col lg:items-start lg:justify-start  md:items-center md:justify-center'>
              <p className="price text-5xl sm:mb-20 lg:mb-20 mb-8">
                <span itemProp="priceCurrency" content="PKR">₹</span>
                <span itemProp="price" content="149.99">249.99</span>
                <span className='ml-2'>PKR</span>
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
          </div>

          <div className="order-1 lg:order-2 max-w-[500px] flex justify-center mx-auto">
            <EmblaCarousel slides={SLIDES} options={OPTIONS} />
          </div>


          <div className="order-3 lg:max-w-[300px] w-full flex flex-col justify-between lg:pt-32">

            <EmblaButtons options={OPTIONS} />


            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className='text-xl'>Description</AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className='text-xl'>Ingredients</AccordionTrigger>
                <AccordionContent>
                  Yes. It comes with default styles that matches the other
                  components&apos; aesthetic.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className='text-xl'>Usage</AccordionTrigger>
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
