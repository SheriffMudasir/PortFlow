import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Anchor, ShieldCheck, Clock, TrendingDown, Globe, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="px-6 lg:px-8 h-16 flex items-center border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <Anchor className="h-5 w-5 text-primary" />
          </div>
          <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">PortFlow</span>
        </div>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
            Dashboard
          </Link>
          <Link href="/upload" className="text-sm font-medium hover:text-primary transition-colors">
            Upload
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="w-full py-16 md:py-24 lg:py-32 xl:py-40 bg-linear-to-b from-blue-50/50 via-white to-teal-50/30 dark:from-slate-950 dark:to-slate-900 relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 bg-grid-slate-200 mask-[linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700" style={{ backgroundSize: '40px 40px' }}></div>
          
          <div className="container px-4 md:px-6 relative">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium bg-blue-50 text-blue-700 border-blue-200 mb-4">
                <Zap className="w-4 h-4 mr-2" />
                AI-Powered Customs Clearance
              </div>
              
              <div className="space-y-4 max-w-4xl">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-slate-900 dark:text-white">
                  Accelerate Your{" "}
                  <span className="bg-linear-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                    Cargo Clearance
                  </span>
                </h1>
                <p className="mx-auto max-w-[700px] text-slate-600 md:text-xl lg:text-2xl dark:text-slate-400 leading-relaxed">
                  Cut clearance time by 80%. Eliminate demurrage fees. Experience frictionless logistics with PortFlow&apos;s intelligent clearing agent.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link href="/upload">
                  <Button size="lg" className="h-14 px-10 text-lg shadow-lg hover:shadow-xl transition-all">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" size="lg" className="h-14 px-10 text-lg">
                    View Dashboard
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-16 w-full max-w-3xl">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary">80%</div>
                  <div className="text-sm text-muted-foreground mt-1">Faster Processing</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-secondary">24/7</div>
                  <div className="text-sm text-muted-foreground mt-1">Availability</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-green-600">100%</div>
                  <div className="text-sm text-muted-foreground mt-1">Compliance</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 lg:py-32 bg-white dark:bg-slate-900">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
                Why Choose PortFlow?
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Transform your cargo clearance with intelligent automation and real-time insights
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-teal-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <div className="relative flex flex-col items-center space-y-4 text-center p-8 rounded-2xl border bg-card hover:shadow-lg transition-all">
                  <div className="p-4 bg-blue-100 rounded-2xl dark:bg-blue-900">
                    <Clock className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold">Lightning Fast</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Cut down processing time from days to hours with AI-powered document parsing and validation.
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-linear-to-r from-green-500 to-emerald-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <div className="relative flex flex-col items-center space-y-4 text-center p-8 rounded-2xl border bg-card hover:shadow-lg transition-all">
                  <div className="p-4 bg-green-100 rounded-2xl dark:bg-green-900">
                    <ShieldCheck className="h-10 w-10 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold">Secure & Compliant</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Enterprise-grade security with automated compliance checks ensuring your cargo is cleared safely.
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-linear-to-r from-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <div className="relative flex flex-col items-center space-y-4 text-center p-8 rounded-2xl border bg-card hover:shadow-lg transition-all">
                  <div className="p-4 bg-purple-100 rounded-2xl dark:bg-purple-900">
                    <Globe className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold">Real-Time Tracking</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Monitor every step with live updates, cost estimation, and actionable insights at your fingertips.
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-linear-to-r from-amber-500 to-orange-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <div className="relative flex flex-col items-center space-y-4 text-center p-8 rounded-2xl border bg-card hover:shadow-lg transition-all">
                  <div className="p-4 bg-amber-100 rounded-2xl dark:bg-amber-900">
                    <TrendingDown className="h-10 w-10 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-xl font-bold">Cost Savings</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Eliminate demurrage charges and reduce operational costs with efficient automated processing.
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-linear-to-r from-teal-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <div className="relative flex flex-col items-center space-y-4 text-center p-8 rounded-2xl border bg-card hover:shadow-lg transition-all">
                  <div className="p-4 bg-teal-100 rounded-2xl dark:bg-teal-900">
                    <Anchor className="h-10 w-10 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h3 className="text-xl font-bold">Port Integration</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Seamlessly integrated with major ports and customs systems for smooth operations.
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <div className="relative flex flex-col items-center space-y-4 text-center p-8 rounded-2xl border bg-card hover:shadow-lg transition-all">
                  <div className="p-4 bg-indigo-100 rounded-2xl dark:bg-indigo-900">
                    <Zap className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-bold">Smart Automation</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    AI agent handles customs, inspections, and payments automatically with minimal intervention.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 md:py-24 bg-linear-to-r from-primary to-secondary text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10 mask-[linear-gradient(0deg,transparent,rgba(255,255,255,0.5))]" style={{ backgroundSize: '40px 40px' }}></div>
          
          <div className="container px-4 md:px-6 relative">
            <div className="flex flex-col items-center text-center space-y-6">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Ready to Transform Your Logistics?
              </h2>
              <p className="max-w-2xl text-lg text-blue-50">
                Join forward-thinking businesses already saving time and money with PortFlow
              </p>
              <Link href="/upload">
                <Button size="lg" variant="secondary" className="h-14 px-10 text-lg mt-4 shadow-xl hover:shadow-2xl transition-all">
                  Start Clearance Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-slate-50 dark:bg-slate-950">
        <div className="container flex flex-col gap-4 py-10 px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 font-bold text-xl">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <Anchor className="h-5 w-5 text-primary" />
              </div>
              <span>PortFlow</span>
            </div>
            
            <nav className="flex gap-6">
              <Link className="text-sm hover:text-primary transition-colors" href="#">
                Terms of Service
              </Link>
              <Link className="text-sm hover:text-primary transition-colors" href="#">
                Privacy Policy
              </Link>
              <Link className="text-sm hover:text-primary transition-colors" href="#">
                Contact
              </Link>
            </nav>
          </div>
          
          <div className="text-center text-sm text-muted-foreground border-t pt-6">
            © 2025 PortFlow. All rights reserved. Powered by AI.
          </div>
        </div>
      </footer>
    </div>
  );
}
