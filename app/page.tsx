import Link from "next/link";
import { ArrowRight, Zap, BarChart3, Globe } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo/Badge */}
          <div className="mb-8">
            <div className="inline-block bg-yellow-500/10 border border-yellow-500/30 rounded-full px-6 py-2">
              <span className="text-yellow-500 text-xs font-black uppercase tracking-wider">
                Pi Network Native
              </span>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-black italic text-white mb-6 uppercase leading-tight">
            SnapLogic
            <span className="block text-yellow-500">Engine v1.0</span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
            The World's First Pi-Native Data Visualization Terminal
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link
              href="/dashboard"
              className="group bg-white text-black px-8 py-4 rounded-2xl font-black text-sm uppercase hover:bg-yellow-500 transition-all flex items-center justify-center gap-2"
            >
              Launch Dashboard
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="/auth"
              className="bg-transparent border-2 border-white/20 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase hover:border-yellow-500/50 transition-all"
            >
              Sign In
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-3xl hover:border-yellow-500/30 transition-all">
              <div className="bg-yellow-500/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
                <BarChart3 className="text-yellow-500" size={24} />
              </div>
              <h3 className="text-white font-black uppercase text-sm mb-2">
                SnapScript v0
              </h3>
              <p className="text-gray-500 text-xs">
                Reactive computation engine for real-time data visualization
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-3xl hover:border-yellow-500/30 transition-all">
              <div className="bg-yellow-500/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
                <Zap className="text-yellow-500" size={24} />
              </div>
              <h3 className="text-white font-black uppercase text-sm mb-2">
                Pi-Native Billing
              </h3>
              <p className="text-gray-500 text-xs">
                Blockchain-based automatic subscription & quota management
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-3xl hover:border-yellow-500/30 transition-all">
              <div className="bg-yellow-500/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
                <Globe className="text-yellow-500" size={24} />
              </div>
              <h3 className="text-white font-black uppercase text-sm mb-2">
                Universal Embed
              </h3>
              <p className="text-gray-500 text-xs">
                One-line integration for any web environment
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/5 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-[9px] text-gray-700 font-bold uppercase tracking-wider">
              © 2026 SnapLogic Global Operations • Built for the Pi Network Ecosystem
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
