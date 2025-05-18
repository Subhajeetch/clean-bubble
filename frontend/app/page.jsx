

export default function App() {
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
      <div className="flex flex-col lg:flex-row">

        <div className="order-2 lg:order-1 flex max-w-[300px] w-full flex flex-col">
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

        </div>
        <div className="order-1 lg:order-2 max-w-[500px] flex justify-center mx-auto bg-blue-500">
          <img src="/clean-bubble-png-front.png" className="w-full mr-3"></img>
        </div>


        <div className="order-3 max-w-[300px] w-full  bg-amber-700">heyyyyyyyyyyyyy</div>
      </div>
      {/* main div end */}
    </main>
  );
}
