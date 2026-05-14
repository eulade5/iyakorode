import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Star, MapPin, Phone, Clock, ChevronDown,
  Shield, Sparkles, Wrench, HeadphonesIcon
} from "lucide-react";

/* ─── Reveal-on-scroll hook ──────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ─── Data ───────────────────────────────────────────── */
const HERO_CATEGORIES = [
  {
    name: "Tiles & Marbles",
    desc: "Porcelain, ceramic, polished and marble — sized for every space.",
    img: "/assets/tiles-marble-Bx2_CHSc.jpg",
  },
  {
    name: "Bathroom",
    desc: "Showers, jacuzzis, basins, WCs and complete bath sets.",
    img: "/assets/product-bathroom-CQ2nYyEL.jpg",
  },
  {
    name: "Kitchen",
    desc: "Designer sinks, faucets and premium kitchen finishes.",
    img: "/assets/product-kitchen-CNRBV9aM.jpg",
  },
  {
    name: "Industrial",
    desc: "GI pipes, valves, fittings, water meters and manhole covers.",
    img: "/assets/product-plumbing-DgcNtubu.jpg",
  },
];

const COLLECTION_ITEMS = [
  { name: "Bathroom Fixtures", img: "/assets/product-bathroom-CQ2nYyEL.jpg", desc: "Designer sinks, basins, mirrors, and premium bathroom accessories for refined spaces." },
  { name: "Luxury Lighting", img: "/assets/product-lighting-BCvnpsch.jpg", desc: "Chandeliers, ceiling lights, and wall fixtures that transform every room." },
  { name: "Plumbing Solutions", img: "/assets/product-plumbing-DgcNtubu.jpg", desc: "High-quality pumps, fittings, and connectors engineered for lasting performance." },
  { name: "Kitchen Fixtures", img: "/assets/product-kitchen-CNRBV9aM.jpg", desc: "Premium kitchen sinks, faucets, and accessories for the modern culinary space." },
  { name: "Shower Enclosures", img: "/assets/product-shower-D9o4G_NW.jpg", desc: "Elegant glass shower cabins and enclosures for a spa-like bathroom experience." },
  { name: "Designer Sinks", img: "/assets/product-sinks-BtTLkIcx.jpg", desc: "Handcrafted stone and artisan sinks with unique textures and natural beauty." },
  { name: "Bathroom Vanities", img: "/assets/product-vanity-CDiF6Z9j.jpg", desc: "Modern vanity units with integrated storage and sleek mirror combinations." },
  { name: "Shower Cabins", img: "/assets/product-showercabin-DmIgZ4Jc.jpg", desc: "Full-featured shower cabins with built-in jets and premium glass paneling." },
  { name: "Plumbing Accessories", img: "/assets/product-accessories-CS_si6wW.jpg", desc: "Valves, connectors, and fittings in a wide range of sizes and specifications." },
  { name: "Showroom Collection", img: "/assets/product-showroom-CboioQhN.jpg", desc: "Browse our full showroom featuring curated displays of premium home finishes." },
];

const TESTIMONIALS = [
  {
    quote: "The quality of the bathroom fixtures and lighting we sourced from Amazing Tools is on par with anything I've specified in Europe. Outstanding service.",
    name: "Jean-Paul Mugisha",
    role: "Architect, Kigali",
  },
  {
    quote: "Their team helped us choose every finish for our new home. The showroom experience felt like walking into a luxury brand boutique.",
    name: "Aline Uwase",
    role: "Homeowner, Nyarutarama",
  },
  {
    quote: "We've equipped three apartment projects through them. Reliable supply, premium products, and pricing that respects the client's budget.",
    name: "David Habimana",
    role: "Project Developer",
  },
];

const WHY_US = [
  { icon: Shield, title: "High-Quality & Durable", desc: "Every product meets the highest standards of craftsmanship and longevity." },
  { icon: Sparkles, title: "Wide Variety of Designs", desc: "From classic elegance to bold contemporary — find your perfect match." },
  { icon: Wrench, title: "Competitive Pricing", desc: "Premium quality doesn't have to be unaffordable. Great value, always." },
  { icon: HeadphonesIcon, title: "Trusted by Professionals", desc: "Builders, architects, and homeowners choose us for reliability." },
];

/* ─── Component ──────────────────────────────────────── */
export default function Home() {
  useReveal();

  return (
    <main className="overflow-x-hidden">
      {/* ══════════ HERO ══════════ */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/assets/hero-showroom-Djf6O2CV.jpg')" }}
        />
        {/* Multi-layer overlay for cinematic depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(8,8,8,0.75)] via-[rgba(8,8,8,0.55)] to-[rgba(8,8,8,0.9)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(8,8,8,0.5)] via-transparent to-[rgba(8,8,8,0.3)]" />
        {/* Gold vignette bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[rgba(201,168,76,0.04)] to-transparent" />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <p className="eyebrow mb-5 animate-[fadeIn_1s_ease_both]">
            Premium Home Finishes
          </p>

          <h1 className="font-serif font-light leading-[0.92] mb-6 animate-[fadeUp_0.9s_ease_both]"
            style={{ fontSize: "clamp(3rem,9vw,7rem)" }}>
            Luxury Home{" "}
            <em className="not-italic text-gold-shimmer block">
              Fixtures, Reimagined
            </em>
          </h1>

          <p className="text-base md:text-lg text-[rgba(245,240,232,0.55)] max-w-xl mx-auto leading-relaxed mb-10 animate-[fadeUp_1s_0.2s_ease_both] opacity-0 [animation-fill-mode:forwards]">
            Tiles, bathrooms, kitchens, lighting and industrial finishes —
            curated for homeowners, builders and architects who refuse to
            compromise.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-[fadeUp_1s_0.35s_ease_both] opacity-0 [animation-fill-mode:forwards]">
            <Link
              to="/products"
              className="btn-gold flex items-center gap-2 px-10 py-4 rounded-md text-sm tracking-widest uppercase"
            >
              Explore Products <ArrowRight size={15} />
            </Link>
            <a
              href="https://wa.me/250784909020"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline flex items-center gap-2 px-10 py-4 rounded-md text-sm tracking-widest uppercase"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Trust bar */}
        <div className="absolute bottom-0 left-0 right-0 glass border-t border-[rgba(201,168,76,0.1)]">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-2">
              <p className="text-xs text-[rgba(245,240,232,0.3)] tracking-widest uppercase hidden md:block">
                Trusted by homeowners, builders, and professionals
              </p>
              {["Premium Quality", "Modern Designs", "Reliable Products", "Expert Support"].map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-xs text-[rgba(245,240,232,0.45)]">
                  <Star size={10} className="text-[var(--gold)]" fill="currentColor" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <button
          onClick={() => document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" })}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-[rgba(245,240,232,0.28)] hover:text-[var(--gold)] transition-colors animate-bounce"
        >
          <ChevronDown size={20} />
        </button>
      </section>

      {/* ══════════ BROWSE BY CATEGORY ══════════ */}
      <section id="categories" className="py-20 bg-[#070707]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="reveal text-center mb-14">
            <p className="eyebrow mb-3">Browse By</p>
            <h2 className="font-serif text-5xl md:text-6xl font-light text-[var(--cream)]">
              Shop by <em>Category</em>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {HERO_CATEGORIES.map((cat, i) => (
              <Link
                key={cat.name}
                to="/products"
                className={`cat-card reveal reveal-delay-${i + 1} group block h-60 md:h-72`}
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="cat-card-content absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-serif text-xl font-light text-[var(--cream)] mb-1 group-hover:text-[var(--gold)] transition-colors duration-300">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[rgba(245,240,232,0.5)] leading-relaxed line-clamp-2 mb-3">
                    {cat.desc}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs text-[var(--gold)] tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Explore <ArrowRight size={11} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ COLLECTION GRID ══════════ */}
      <section
        className="py-24 relative"
        style={{
          background: "linear-gradient(180deg,#070707 0%,#0a0a0a 50%,#070707 100%)",
        }}
      >
        {/* Subtle gold glow top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[rgba(201,168,76,0.35)] to-transparent" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="reveal text-center mb-16">
            <p className="eyebrow mb-3">Our Collections</p>
            <h2 className="font-serif text-5xl md:text-6xl font-light text-[var(--cream)]">
              Premium Product <em>Categories</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {COLLECTION_ITEMS.map((item, i) => (
              <Link
                key={item.name}
                to="/products"
                className="reveal luxury-card group rounded-xl overflow-hidden block"
                style={{ transitionDelay: `${(i % 3) * 0.08}s` }}
              >
                {/* Image */}
                <div className="img-zoom h-56">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                {/* Text */}
                <div className="p-6">
                  <h3 className="font-serif text-xl text-[var(--cream)] mb-2 group-hover:text-[var(--gold)] transition-colors duration-300">
                    {item.name}
                  </h3>
                  <p className="text-sm text-[rgba(245,240,232,0.4)] leading-relaxed line-clamp-2">
                    {item.desc}
                  </p>
                  <span className="inline-flex items-center gap-1.5 mt-4 text-xs text-[var(--gold)] tracking-widest uppercase opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-350">
                    View products <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12 reveal">
            <Link
              to="/products"
              className="btn-gold inline-flex items-center gap-2 px-10 py-4 rounded-md text-sm tracking-widest uppercase"
            >
              View Full Catalog <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════ WHY CHOOSE US ══════════ */}
      <section
        className="py-24 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg,#080808 0%,#0d0d0d 100%)",
        }}
      >
        {/* Decorative orb */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="reveal text-center mb-16">
            <p className="eyebrow mb-3">The Difference</p>
            <h2 className="font-serif text-5xl md:text-6xl font-light text-[var(--cream)]">
              Why Choose <em>Amazing Tools</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_US.map((item, i) => (
              <div
                key={item.title}
                className="reveal glass-gold rounded-xl p-7 text-center group hover:-translate-y-1.5 transition-transform duration-350"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-full border border-[rgba(201,168,76,0.25)] flex items-center justify-center mx-auto mb-5 text-[var(--gold)] group-hover:bg-[rgba(201,168,76,0.08)] transition-colors duration-300">
                  <item.icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-lg text-[var(--cream)] mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-[rgba(245,240,232,0.42)] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ TESTIMONIALS ══════════ */}
      <section className="py-24 bg-[#060606]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="reveal text-center mb-16">
            <p className="eyebrow mb-3">Client Voices</p>
            <h2 className="font-serif text-5xl md:text-6xl font-light text-[var(--cream)]">
              What Our <em>Clients Say</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className={`testi-card p-8 reveal reveal-delay-${i + 1}`}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, s) => (
                    <Star
                      key={s}
                      size={13}
                      className="text-[var(--gold)]"
                      fill="currentColor"
                    />
                  ))}
                </div>
                {/* Quote mark */}
                <div className="font-serif text-5xl text-[rgba(201,168,76,0.2)] leading-none mb-3">
                  "
                </div>
                <p className="text-sm text-[rgba(245,240,232,0.55)] leading-relaxed italic mb-6">
                  {t.quote}
                </p>
                <div className="border-t border-[rgba(201,168,76,0.1)] pt-4">
                  <p className="font-serif text-base text-[var(--cream)]">{t.name}</p>
                  <p className="text-xs text-[var(--gold)] tracking-wider mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ SHOWROOM / MAP ══════════ */}
      <section id="showroom" className="py-24 bg-[#080808] relative overflow-hidden">
        {/* Faint architectural bg */}
        <div
          className="absolute inset-0 opacity-[0.04] bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/product-showroom-CboioQhN.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-transparent to-[#080808]" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="reveal text-center mb-16">
            <p className="eyebrow mb-3">Our Location</p>
            <h2 className="font-serif text-5xl md:text-6xl font-light text-[var(--cream)]">
              Visit Our <em>Showroom</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Info */}
            <div className="reveal flex flex-col gap-6">
              <p className="text-[rgba(245,240,232,0.5)] leading-relaxed text-base">
                Step into our elegantly designed showroom in Kigali and
                experience the full collection in person.
              </p>

              <div className="flex flex-col gap-5">
                {[
                  {
                    icon: MapPin,
                    label: "Address",
                    lines: ["Kigali, Rwanda"],
                    href: "https://maps.google.com/?q=-1.923108,30.069483",
                    linkText: "Get Directions →",
                  },
                  {
                    icon: Clock,
                    label: "Opening Hours",
                    lines: ["Mon – Sat: 8:00 AM – 7:30 PM", "Sunday: By appointment"],
                  },
                  {
                    icon: Phone,
                    label: "Call or WhatsApp",
                    lines: ["+250 784 909 020"],
                    href: "tel:+250784909020",
                  },
                ].map(({ icon: Icon, label, lines, href, linkText }) => (
                  <div key={label} className="flex gap-4 items-start p-5 glass-gold rounded-lg">
                    <div className="w-10 h-10 rounded-full border border-[rgba(201,168,76,0.25)] flex items-center justify-center text-[var(--gold)] flex-shrink-0">
                      <Icon size={16} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="eyebrow text-[0.65rem] mb-1.5">{label}</p>
                      {lines.map((l) => (
                        <p key={l} className="text-sm text-[rgba(245,240,232,0.6)]">{l}</p>
                      ))}
                      {href && linkText && (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors mt-1.5 block"
                        >
                          {linkText}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="reveal">
              <div
                className="rounded-xl overflow-hidden border border-[rgba(201,168,76,0.2)] shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
                style={{ height: "420px" }}
              >
                <iframe
                  title="Amazing Tools Company Location"
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d1994.4!2d30.069483!3d-1.923108!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMcKwNTUnMjMuMiJTIDMwwrAwNCcxMC4xIkU!5e0!3m2!1sen!2srw!4v1700000000000!5m2!1sen!2srw"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "invert(0.88) hue-rotate(175deg) saturate(0.9)" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ ABOUT ══════════ */}
      <section id="about" className="py-24 bg-[#060606]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Image side */}
            <div className="reveal order-2 md:order-1">
              <div className="relative">
                <div className="rounded-xl overflow-hidden border border-[rgba(201,168,76,0.15)] shadow-[0_24px_64px_rgba(0,0,0,0.6)] img-zoom">
                  <img
                    src="/assets/product-showroom-CboioQhN.jpg"
                    alt="Amazing Tools Company Showroom"
                    className="w-full h-80 md:h-[480px] object-cover"
                  />
                </div>
                {/* Decorative frame */}
                <div className="absolute -bottom-5 -right-5 w-32 h-32 rounded-lg border border-[rgba(201,168,76,0.12)] -z-10" />
                <div className="absolute -top-5 -left-5 w-20 h-20 rounded-full border border-[rgba(201,168,76,0.08)] -z-10" />
                {/* Floating stat */}
                <div className="absolute -bottom-4 left-6 glass rounded-xl px-6 py-4 border border-[rgba(201,168,76,0.2)]">
                  <p className="stat-num text-gold-shimmer">59+</p>
                  <p className="eyebrow text-[0.6rem]">Premium Products</p>
                </div>
              </div>
            </div>

            {/* Text side */}
            <div className="reveal order-1 md:order-2">
              <p className="eyebrow mb-4">Our Story</p>
              <h2 className="font-serif text-5xl md:text-6xl font-light text-[var(--cream)] mb-6 leading-tight">
                About <em>Amazing Tools</em> Company
              </h2>
              <p className="text-[rgba(245,240,232,0.5)] leading-relaxed mb-4">
                Amazing Tools Company is a premier destination for luxury home
                finishes and fixtures in Kigali, Rwanda. We believe every space
                deserves to be extraordinary — from the faucet you touch each
                morning to the chandelier that sets the mood for every evening.
              </p>
              <p className="text-[rgba(245,240,232,0.5)] leading-relaxed mb-8">
                Our curated collection features the finest bathroom fixtures,
                designer lighting, precision plumbing solutions, and elegant
                electrical finishes sourced from trusted manufacturers
                worldwide. We serve homeowners, interior designers, architects,
                and builders who refuse to compromise on quality.
              </p>

              <div className="grid grid-cols-2 gap-5 mb-8">
                {[
                  ["59+", "Premium Products"],
                  ["14+", "Categories"],
                  ["500+", "Happy Clients"],
                  ["5★", "Service Rating"],
                ].map(([num, label]) => (
                  <div key={label} className="glass-gold rounded-lg p-5">
                    <p className="font-serif text-3xl text-gold-shimmer mb-1">{num}</p>
                    <p className="text-xs text-[rgba(245,240,232,0.38)] tracking-wider uppercase">{label}</p>
                  </div>
                ))}
              </div>

              <a
                href="/#contact"
                className="btn-gold inline-flex items-center gap-2 px-8 py-3.5 rounded-md text-sm tracking-widest uppercase"
              >
                Get In Touch <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ CONTACT ══════════ */}
      <section id="contact" className="py-24 bg-[#080808] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.035] bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/product-lighting-BCvnpsch.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-transparent to-[#080808]" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="reveal text-center mb-14">
            <p className="eyebrow mb-3">Get In Touch</p>
            <h2 className="font-serif text-5xl md:text-6xl font-light text-[var(--cream)]">
              Contact <em>Us</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-14">
            {[
              {
                icon: Phone,
                label: "Phone / WhatsApp",
                value: "+250 784 909 020",
                sub: null,
                href: "tel:+250784909020",
              },
              {
                icon: MapPin,
                label: "Location",
                value: "Kigali, Rwanda",
                sub: "View on Google Maps →",
                href: "https://maps.google.com/?q=-1.923108,30.069483",
              },
              {
                icon: Clock,
                label: "Working Hours",
                value: "Mon – Sat: 8:00 AM – 7:30 PM",
                sub: "Sunday: By appointment",
                href: null,
              },
            ].map((card) => (
              <div
                key={card.label}
                className="reveal glass-gold rounded-xl p-8 text-center hover:-translate-y-1 transition-transform duration-350"
              >
                <div className="w-12 h-12 rounded-full border border-[rgba(201,168,76,0.25)] flex items-center justify-center mx-auto mb-5 text-[var(--gold)]">
                  <card.icon size={20} strokeWidth={1.5} />
                </div>
                <p className="eyebrow text-[0.65rem] mb-3">{card.label}</p>
                {card.href ? (
                  <a
                    href={card.href}
                    target={card.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="font-serif text-lg text-[var(--cream)] hover:text-[var(--gold)] transition-colors"
                  >
                    {card.value}
                  </a>
                ) : (
                  <p className="font-serif text-lg text-[var(--cream)]">{card.value}</p>
                )}
                {card.sub && (
                  <p className="text-xs text-[rgba(245,240,232,0.35)] mt-2">{card.sub}</p>
                )}
              </div>
            ))}
          </div>

          {/* CTA block */}
          <div className="reveal max-w-2xl mx-auto text-center">
            <div className="glass rounded-2xl p-12 border border-[rgba(201,168,76,0.15)]">
              <h3 className="font-serif text-4xl font-light text-[var(--cream)] mb-4">
                Ready to Transform Your Space?
              </h3>
              <p className="text-[rgba(245,240,232,0.45)] mb-8 leading-relaxed">
                Visit our showroom in Kigali or chat with us on WhatsApp to
                discover the perfect finishes for your home or project.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="https://maps.google.com/?q=-1.923108,30.069483"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline flex items-center justify-center gap-2 px-8 py-3.5 rounded-md text-sm tracking-widest uppercase"
                >
                  <MapPin size={15} /> Visit Our Showroom
                </a>
                <a
                  href="https://wa.me/250784909020"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-md text-sm tracking-widest uppercase text-white font-semibold transition-all duration-300 hover:shadow-[0_8px_30px_rgba(37,211,102,0.35)] hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg,#25d366,#128c7e)" }}
                >
                  <svg viewBox="0 0 24 24" fill="white" width="16" height="16">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
