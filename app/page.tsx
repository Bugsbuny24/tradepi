export default function Home() {
  return (
    <div className="space-y-10">

      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">
          TradePiGlobal
        </h1>

        <p>Global B2B • B2C • C2C • Services</p>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <a href="/listings" className="p-6 border rounded">
          B2B Marketplace
        </a>

        <a href="/rfq" className="p-6 border rounded">
          RFQ System
        </a>

        <a href="/services" className="p-6 border rounded">
          Freelance Services
        </a>

        <a href="/pod" className="p-6 border rounded">
          Print on Demand
        </a>

      </div>

    </div>
  )
}
