import { Button } from "@/components/ui/button"
import { BarChart3 } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-gray-900" />
            <span className="text-lg font-semibold text-gray-900">Talent Hub</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="text-gray-700 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-gray-900 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-gray-900 transition-colors">
              Contact
            </Link>
            <Link href="/auth">
              <Button className="bg-green-500 hover:bg-green-600 text-white px-6 transition-colors">
                Sign Up
              </Button>
            </Link>
            <Link href="/auth" className="text-gray-700 hover:text-gray-900 transition-colors">
              Login
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative">
          <div className="h-[28rem] bg-cover bg-center rounded-2xl mx-4 sm:mx-6 mt-10 flex items-center justify-center relative overflow-hidden shadow-lg"
            style={{
              backgroundImage: `url('/hero.avif?height=400&width=800')`,
            }}>
            <div className="absolute inset-0 bg-black opacity-60 z-0 rounded-2xl"></div>

            <div className="text-center text-white px-4 sm:px-8 z-10">
              <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 leading-tight">
                Find Your Next Great Hire or Dream Job
              </h1>
              <p className="text-md sm:text-xl mb-8 max-w-2xl mx-auto font-light">
                Connect with top talent managers and candidates in the industry.
                Whether you're looking to build your team or advance your career, we've got you covered.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/talent-manager">
                  <Button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 text-base sm:text-lg transition">
                    I'm a Talent Manager
                  </Button>
                </Link>
                <Link href="/candidate-portal">
                  <Button variant="outline"
                    className="bg-white text-gray-900 border-white hover:bg-gray-100 px-6 py-3 text-base sm:text-lg transition"
                  >
                    I'm a Candidate
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center text-sm text-gray-600 space-y-4 sm:space-y-0">
            <div className="flex space-x-6">
              <Link href="/privacy" className="hover:text-gray-900 transition">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-gray-900 transition">
                Terms of Service
              </Link>
              <Link href="/contact" className="hover:text-gray-900 transition">
                Contact Us
              </Link>
            </div>
            <div className="text-center sm:text-right text-gray-500">
              © {new Date().getFullYear()} Talent Hub. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}