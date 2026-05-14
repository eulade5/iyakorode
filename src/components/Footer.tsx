import { Link } from "react-router-dom";
import { MapPin, Phone, Clock, Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#060606] border-t border-[rgba(201,168,76,0.12)]">
      {/* Top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(201,168,76,0.5)] to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <img
                src="/assets/logo-D3ITjQ6-.jpeg"
                alt="Amazing Tools Company"
                className="h-12 w-auto rounded object-contain"
              />
              <div>
                <p className="font-serif text-sm font-light tracking-[0.22em] text-[var(--cream)]">
                  AMAZING TOOLS
                </p>
                <p className="font-serif text-[0.6rem] tracking-[0.4em] text-[var(--gold)]">
                  COMPANY
                </p>
              </div>
            </div>
            <p className="font-sans text-sm text-[rgba(245,240,232,0.42)] leading-relaxed max-w-sm mb-6">
              Premium home finishes and fixtures for those who demand
              excellence. Serving homeowners, architects and builders across
              Kigali, Rwanda.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Instagram, label: "Instagram" },
                { icon: Twitter, label: "Twitter" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-[rgba(201,168,76,0.2)] flex items-center justify-center text-[rgba(245,240,232,0.4)] hover:text-[var(--gold)] hover:border-[rgba(201,168,76,0.5)] transition-all duration-300"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="eyebrow mb-6">Navigation</h4>
            <ul className="flex flex-col gap-3">
              {[
                ["Home", "/#home"],
                ["Products", "/products"],
                ["Showroom", "/#showroom"],
                ["About", "/#about"],
                ["Contact", "/#contact"],
              ].map(([label, href]) => (
                <li key={label}>
                  {href.startsWith("/products") ? (
                    <Link
                      to={href}
                      className="text-sm text-[rgba(245,240,232,0.42)] hover:text-[var(--gold)] transition-colors duration-300 tracking-wide"
                    >
                      {label}
                    </Link>
                  ) : (
                    <a
                      href={href}
                      className="text-sm text-[rgba(245,240,232,0.42)] hover:text-[var(--gold)] transition-colors duration-300 tracking-wide"
                    >
                      {label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="eyebrow mb-6">Contact Us</h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MapPin
                  size={15}
                  className="text-[var(--gold)] mt-0.5 flex-shrink-0"
                />
                <span className="text-sm text-[rgba(245,240,232,0.42)] leading-relaxed">
                  Kigali, Rwanda
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone
                  size={15}
                  className="text-[var(--gold)] mt-0.5 flex-shrink-0"
                />
                <a
                  href="tel:+250784909020"
                  className="text-sm text-[rgba(245,240,232,0.42)] hover:text-[var(--gold)] transition-colors"
                >
                  +250 784 909 020
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock
                  size={15}
                  className="text-[var(--gold)] mt-0.5 flex-shrink-0"
                />
                <div className="text-sm text-[rgba(245,240,232,0.42)] leading-relaxed">
                  <p>Mon – Sat: 8:00 AM – 7:30 PM</p>
                  <p>Sunday: By appointment</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-[rgba(201,168,76,0.08)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[rgba(245,240,232,0.22)] tracking-wider">
            © {new Date().getFullYear()} Amazing Tools Company. All rights reserved.
          </p>
          <p className="text-xs text-[rgba(245,240,232,0.18)] tracking-wider">
            Premium Home Finishes &amp; Fixtures — Kigali, Rwanda
          </p>
        </div>
      </div>
    </footer>
  );
}
