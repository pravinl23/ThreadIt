import Link from "next/link"
import { Wand2, Pencil, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { LoginButton, SignUpButton } from "@/components/auth-buttons"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="container flex h-20 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <Pencil className="h-6 w-6" />
              <span className="inline-block font-bold text-xl tracking-tight">ThreadIt</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <LoginButton />
              <SignUpButton />
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-24 md:py-32 lg:py-40">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl space-y-8 text-center">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Transform Your{" "}
                <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                  Clothing Designs
                </span>{" "}
                with AI
              </h1>
              <p className="mx-auto max-w-[700px] text-zinc-400 md:text-xl">
                Sketch, enhance, and transform your clothing designs with our powerful AI tools. Create
                professional-quality garment designs in minutes.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row justify-center">
                <SignUpButton className="w-full sm:w-auto" />
                <Link href="#features">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto bg-white text-black border-white hover:bg-zinc-200 hover:text-black"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-24 md:py-32 border-t border-zinc-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
                <p className="mx-auto max-w-[700px] text-zinc-400 md:text-xl">
                  Our intuitive workflow makes designing custom clothing simple and efficient
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-16 md:grid-cols-3 md:gap-16">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-zinc-800">
                  <Pencil className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold">Sketch</h3>
                <p className="text-center text-zinc-400">Draw your rough designs on front and back garment templates</p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-zinc-800">
                  <Wand2 className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold">Enhance</h3>
                <p className="text-center text-zinc-400">Use our AI Magic Wand to refine and perfect your sketches</p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-zinc-800">
                  <Save className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold">Export</h3>
                <p className="text-center text-zinc-400">
                  Automatically deploy your designs to your Shopify storefront
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-24 md:py-32 border-t border-zinc-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-8 text-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Transform Your Designs?
                </h2>
                <p className="mx-auto max-w-[700px] text-zinc-400 md:text-xl">
                  Join today and start creating professional clothing designs in minutes.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <SignUpButton className="w-full" />
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t border-zinc-800 py-8">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
          <p className="text-center text-sm text-zinc-500">© 2025 ThreadIt. All rights reserved.</p>
          <nav className="flex gap-6">
            <Link className="text-sm text-zinc-500 hover:text-white transition-colors" href="#">
              Terms
            </Link>
            <Link className="text-sm text-zinc-500 hover:text-white transition-colors" href="#">
              Privacy
            </Link>
            <Link className="text-sm text-zinc-500 hover:text-white transition-colors" href="#">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
