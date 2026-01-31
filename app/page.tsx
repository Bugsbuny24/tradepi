"use client";

import Link from "next/link";

const modes = [
  {
    title: "TRADE MODE",
    subtitle: "Global B2B Showroom",
    color:
      "from-blue-500/20 to-blue-700/20 border-blue-400/40 hover:shadow-[0_0_40px_rgba(59,130,246,0.5)]",
    items: ["Find Suppliers", "Create RFQ", "Bulk Trading"],
    href: "/trade",
  },
  {
    title: "MARKET MODE",
    subtitle: "Global Marketplace",
    color:
      "from-green-500/20 to-green-700/20 border-green-400/40 hover:shadow-[0_0_40px_rgba(34,197,94,0.5)]",
    items: ["Buy & Sell", "Retail Trade", "Quick Deals"],
    href: "/market",
  },
  {
    title: "SERVICES MODE",
    subtitle: "Freelance & Digital Work",
    color:
      "from-purple-500/20 to-purple-700/20 border-purple-400/40 hover:shadow-[0_0_40px_rgba(168,85,247,0.5)]",
    items: ["Hire Experts", "Offer Services", "Remote Work"],
    href: "/services",
  },
  {
    title: "DIGITAL ASSETS",
    subtitle: "Code • Themes • Templates",
    color:
      "from-orange-500/20 to-orange-700/20 border-orange-400/40 hover:shadow-[0_0_40px_rgba(249,115,22,0.5)]",
    items: ["Plugins", "UI Kits", "Source Code"],
    href: "/digital",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen text-white bg-[#070B14] bg-[radial-gradient(circle_at_20%_20%,#0f1b3d,transparent_40%)]">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-12 py-6 border-b border-white/10">
        <div className="text-xl font-semibold tracking-widest">
          TradePiGlobal
        </div>

        <div className="flex gap-10 text-sm text-white/70">
          <Link href="#">Explore</Link>
          <Link href="#">How it Works</Link>
          <Link href="#">Trust & Safety</Link>
        </div>

        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-5 py-2 rounded-lg border border-white/20 text-white/80 hover:bg-white/10"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500"
          >
            Join
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="text-center mt-20">
        <h1 className="text-5xl font-bold tracking-widest mb-6">
          GLOBAL TRADE CONSOLE
        </h1>

        <p className="text-white/60 max-w-xl mx-auto">
          Choose your trading environment and connect globally with buyers,
          suppliers and service providers.
        </p>

        <div className="flex justify-center gap-6 mt-6 text-xs text-white/50">
          <span>✔ Non-custodial</span>
          <span>✔ Direct Buyer–Seller</span>
          <span>✔ B2B Focused</span>
        </div>
      </section>

      {/* MODE GRID */}
      <section className="grid grid-cols-2 gap-10 px-32 mt-20">
        {modes.map((mode, i) => (
          <Link key={i} href={mode.href}>
            <div
              className={`p-10 rounded-2xl bg-gradient-to-br ${mode.color}
              backdrop-blur-xl border shadow-2xl
              transition duration-300 hover:scale-[1.03] cursor-pointer`}
            >
              <h2 className="text-2xl font-semibold tracking-wide">
                {mode.title}
              </h2>

              <p className="text-white/60 mt-2">{mode.subtitle}</p>

              <ul className="mt-6 space-y-2 text-sm text-white/70">
                {mode.items.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>

              <div className="mt-8 inline-block px-6 py-3 bg-white/10 rounded-lg hover:bg-white/20">
                Enter Mode
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* TRUST BAR */}
      <section className="mt-24 border-t border-white/10 py-10 text-center text-white/50 text-sm">
        Direct trade • No escrow • Transparent connections • Global access
      </section>

      {/* FOOTER */}
      <footer className="text-center text-xs text-white/40 pb-10">
        TradePiGlobal is a non-intermediary B2B showroom platform.
      </footer>
    </main>
  );
}
