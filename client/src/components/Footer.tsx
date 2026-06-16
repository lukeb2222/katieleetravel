import { Link } from "wouter";

const LOGO_URL = "/manus-storage/katie-lee-logo_49bcf825.png";

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white/80 py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <img
              src={LOGO_URL}
              alt="Katie Lee Travel Co."
              className="h-12 mb-4 invert brightness-200"
            />
            <p className="text-sm leading-relaxed text-white/60">
              A boutique global travel agency creating custom luxury vacations worldwide.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-label text-white/40 mb-4">Navigate</h4>
            <nav className="flex flex-col gap-3">
              <Link href="/about" className="text-sm hover:text-white transition-colors">About</Link>
              <Link href="/reviews" className="text-sm hover:text-white transition-colors">Reviews</Link>
              <Link href="/contact" className="text-sm hover:text-white transition-colors">Contact</Link>
              <a
                href="https://www.virtuoso.com/advisor/katiemohammed"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-white transition-colors"
              >
                Book a Hotel
              </a>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-label text-white/40 mb-4">Say Hello</h4>
            <p className="text-sm mb-2">Katie.Lee@SmartFlyer.com</p>
            <p className="text-sm text-white/60 mb-6">San Francisco Bay Area</p>
            <p className="text-label text-white/40 mb-3">Affiliations</p>
            <p className="text-sm">Virtuoso &amp; SmartFlyer</p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Katie Lee Travel Co. All rights reserved.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-xs text-white/40 hover:text-white transition-colors text-label"
          >
            Back to Top
          </button>
        </div>
      </div>
    </footer>
  );
}
