import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, X, Phone } from "lucide-react";
import { useCart } from "@/hooks/useCart";

interface NavbarProps {
  onCartOpen: () => void;
}

export default function Navbar({ onCartOpen }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount } = useCart();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: "Home", href: "/#home" },
    { label: "Products", href: "/products" },
    { label: "Showroom", href: "/#showroom" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass shadow-[0_4px_32px_rgba(0,0,0,0.6)] py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/assets/logo-D3ITjQ6-.jpeg"
              alt="Amazing Tools Company"
              className="h-9 w-auto rounded object-contain transition-opacity duration-300 group-hover:opacity-85"
            />
            <div className="hidden sm:block">
              <span className="font-serif text-base font-light tracking-[0.22em] text-[var(--cream)] leading-none block">
                AMAZING TOOLS
              </span>
              <span className="font-serif text-[0.6rem] tracking-[0.45em] text-[var(--gold)] leading-none block mt-0.5">
                COMPANY
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-7">
            {navLinks.map((l) =>
              l.href.startsWith("/products") ? (
                <li key={l.label}>
                  <Link to={l.href} className="nav-link">
                    {l.label}
                  </Link>
                </li>
              ) : (
                <li key={l.label}>
                  <a href={l.href} className="nav-link">
                    {l.label}
                  </a>
                </li>
              )
            )}
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* WhatsApp pill */}
            <a
              href="https://wa.me/250784909020"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(201,168,76,0.35)] text-[var(--gold)] text-xs tracking-widest uppercase transition-all duration-300 hover:bg-[var(--gold)] hover:text-[#0a0a0a] hover:border-[var(--gold)]"
            >
              <Phone size={12} />
              Contact Us
            </a>

            {/* Cart button */}
            <button
              onClick={onCartOpen}
              aria-label="Open basket"
              className="relative p-2.5 rounded-full border border-[rgba(201,168,76,0.2)] text-[rgba(245,240,232,0.7)] hover:text-[var(--gold)] hover:border-[var(--gold)] transition-all duration-300"
            >
              <ShoppingBag size={19} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--gold)] text-[#0a0a0a] text-[10px] font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-[var(--cream-dim)] hover:text-[var(--gold)] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ${
            mobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="glass border-t border-[rgba(201,168,76,0.1)] px-6 py-6">
            <ul className="flex flex-col gap-5">
              {navLinks.map((l) => (
                <li key={l.label}>
                  {l.href.startsWith("/products") ? (
                    <Link
                      to={l.href}
                      className="block nav-link text-sm py-1"
                    >
                      {l.label}
                    </Link>
                  ) : (
                    <a
                      href={l.href}
                      className="block nav-link text-sm py-1"
                    >
                      {l.label}
                    </a>
                  )}
                </li>
              ))}
              <li>
                <a
                  href="https://wa.me/250784909020"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[var(--gold)] tracking-widest uppercase"
                >
                  <Phone size={14} /> +250 784 909 020
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
