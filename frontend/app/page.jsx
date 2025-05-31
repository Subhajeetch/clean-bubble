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


// custom icons
import { HandWashOne } from '@/components/icons';


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
            className="w-16 h-16 mt-22"
          />
        </div>

      </div>

      {/* main div */}
      <EmblaProvider>
        <div className="flex flex-col lg:flex-row gap-4">

          <div className="order-2 lg:order-1 lg:max-w-[300px] w-full flex flex-col md:flex-row lg:flex-col justify-between gap-6 lg:pt-32">
            <h1 className="text-6xl font-bold relative h-[260px] mt-8">

              <span className='absolute -top-4 -left-4'>

                <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                  width="300px" height="100px" viewBox="0 0 1020.000000 312.000000"
                  preserveAspectRatio="xMidYMid meet"
                >

                  <g transform="translate(0.000000,312.000000) scale(0.100000,-0.100000)"
                    fill="#20a183" stroke="none">
                    <path d="M4620 2973 c-1189 -43 -2285 -270 -3345 -692 -145 -58 -497 -212
-505 -220 -3 -3 -45 -30 -95 -60 -144 -86 -253 -169 -351 -266 -143 -142 -199
-255 -193 -393 5 -98 38 -169 121 -258 246 -262 885 -455 2019 -608 295 -40
301 -39 -296 -61 -225 -8 -477 -18 -559 -21 l-149 -6 7 -67 c3 -36 6 -90 6
-119 l0 -54 158 6 c86 4 380 16 652 27 639 25 1506 65 1830 84 321 19 452 19
770 0 818 -47 2105 -89 3458 -111 l392 -7 0 121 0 120 -397 6 c-219 4 -684 13
-1033 21 -349 8 -657 15 -685 16 -27 0 -45 2 -40 4 6 3 168 20 360 40 1689
171 2716 388 3124 659 84 56 160 136 197 207 25 47 29 65 29 139 0 75 -4 93
-33 154 -115 245 -606 519 -1412 790 -328 110 -981 265 -1515 360 -841 150
-1744 218 -2515 189z m785 -243 c829 -32 1646 -148 2535 -360 413 -98 632
-165 970 -293 618 -234 973 -465 946 -612 -16 -83 -215 -204 -495 -300 -735
-252 -2295 -459 -4611 -611 l-415 -28 -265 17 c-727 47 -1528 131 -2086 217
-892 138 -1452 322 -1586 522 -88 130 44 290 450 544 63 39 365 172 597 262
1243 483 2560 696 3960 642z"/>
                  </g>
                </svg>
              </span>


              <span className='flex flex-col absolute gap-4'>
                <span>Foaming</span>
                <span className='flex items-center gap-2'>
                  <span className='mt-2'>
                    Hand
                  </span>
                  <span>
                    <img src="/paw.gif" alt="cute hand gif" className='h-16' />
                  </span>
                </span>
                <span>Sanitizer</span>
              </span>
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
                <AccordionTrigger className='text-xl'><h2>Description</h2></AccordionTrigger>
                <AccordionContent>
                  Experience superior hygiene with our Clean Bubble - Foaming Hand Sanitizer, engineered for rich lather and minimal water use. It effectively removes dirt and kills 99.9% of germs without rinsing. Enriched with lavender essential oil, it leaves hands clean, fresh, and lightly scented—without dryness.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className='text-xl'><h2>Ingredients</h2></AccordionTrigger>
                <AccordionContent>
                  Yes. It comes with default styles that matches the other
                  components&apos; aesthetic.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className='text-xl'><h2>Usage</h2></AccordionTrigger>
                <AccordionContent>
                  Dispense a small amount of foam onto dry hands. Rub thoroughly across all areas of the hands until completely dry. No rinsing or water required. Use as needed to maintain effective hand hygiene.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </EmblaProvider>
      {/* main div end */}
      <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-14'>
        <div className='bg-muted rounded-md p-4 flex flex-col gap-6'>

          <div className=''>
            <h3 className='text-[17px] font-semibold text-[#31b498]'>It's Portable</h3>
            <p className='text-foreground text-2xl font-bold mt-2 min-h-[100px]'>
              Take it anywhere, stay clean on the go!
            </p>
          </div>

          <div className=''>
            <img src="/clean-bubble-portable1.png" alt="Portable hand senitizer of clean bubble" className='w-full h-full rounded-lg object-cover' />
          </div>

        </div>


        <div className='bg-muted rounded-md p-4 flex flex-col gap-6'>

          <div className=''>
            <h3 className='text-[17px] font-semibold text-[#ffc400]'>No Water Needed</h3>
            <p className='text-foreground text-2xl font-bold mt-2 min-h-[100px]'>
              Use it anywhere, anytime, with ease!
            </p>
          </div>

          <div className=''>
            <img src="/clean-bubble-no-water.png" alt="Portable hand senitizer of clean bubble" className='w-full h-full rounded-lg object-cover' />
          </div>

        </div>


        <div className='bg-muted rounded-md p-4 flex flex-col gap-6'>

          <div className=''>
            <h3 className='text-[17px] font-semibold text-[#ec8eff]'>No Sticky Residue</h3>
            <p className='text-foreground text-2xl font-bold mt-2 min-h-[100px]'>
              Quick-absorbing foam leaves hands soft, clean.
            </p>
          </div>

          <div className=''>
            <img src="/clean-bubble-no-sticky-hand.jpg" alt="Portable hand senitizer of clean bubble" className='w-full h-full rounded-lg object-cover' />
          </div>

        </div>


        <div className='bg-muted rounded-md p-4 flex flex-col gap-6'>

          <div className=''>
            <h3 className='text-[17px] font-semibold text-[#71afff]'>Kills 99.99% Germs</h3>
            <p className='text-foreground text-2xl font-bold mt-2 min-h-[100px]'>
              Makes your hands safe and clean in seconds!
            </p>
          </div>

          <div className=''>
            <img src="/no-germs-clean-bubble.png" alt="Portable hand senitizer of clean bubble" className='w-full h-full rounded-lg object-cover' />
          </div>

        </div>
      </section>

      <div className='w-full h-40'>

      </div>
    </main >
  );
}
