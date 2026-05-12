import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, MapPin, Phone, Mail, ChevronDown } from 'lucide-react'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ui/ProductCard'

const CATEGORIES = [
  { name: 'Bathroom Fixtures', icon: '🚿', desc: 'Luxury taps, showers, and sanitary ware' },
  { name: 'Tiles', icon: '🟫', desc: 'Premium ceramic, porcelain & natural stone' },
  { name: 'Lighting', icon: '💡', desc: 'Architectural and decorative lighting' },
  { name: 'Kitchens', icon: '🍳', desc: 'Bespoke kitchen fittings & accessories' },
  { name: 'Mirrors', icon: '🪞', desc: 'Decorative and functional mirror solutions' },
  { name: 'Accessories', icon: '✨', desc: 'Premium hardware & finishing accessories' },
  { name: 'Industrial Finishes', icon: '🏗️', desc: 'Professional-grade coating solutions' },
]

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const heroRef = useRef(null)

  useEffect(() => {
    // Reveal on scroll
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [featuredProducts])

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('active', true)
        .limit(6)
      if (data) {
        setFeaturedProducts(data.map(p => ({ ...p, category_name: p.categories?.name })))
      }
      setLoading(false)
    }
    load()
  }, [])

  const scrollDown = () => {
    document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main>
      {/* ═══════════════ HERO ═══════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden noise">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian-900 via-obsidian-800 to-obsidian-900" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(230,184,0,0.08) 0%, transparent 70%)',
        }} />
        {/* Geometric lines */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-gold to-transparent" />
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-gold to-transparent" />
          <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Eyebrow */}
          <p className="font-mono text-xs tracking-[0.4em] uppercase text-gold/80 mb-6 animate-fade-in">
            Premium Tools & Finishing Solutions
          </p>

          {/* Main heading */}
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-white leading-[0.9] mb-6" style={{ animationDelay: '0.2s' }}>
            <span className="block animate-fade-up" style={{ animationDelay: '0.1s' }}>AMAZING</span>
            <span className="block text-gold-gradient animate-fade-up" style={{ animationDelay: '0.3s' }}>TOOLS</span>
            <span className="block text-2xl md:text-3xl font-light tracking-[0.5em] text-white/60 mt-2 animate-fade-up" style={{ animationDelay: '0.5s' }}>
              COMPANY
            </span>
          </h1>

          <p className="font-body text-base md:text-lg text-white/50 max-w-xl mx-auto leading-relaxed mb-10 animate-fade-up" style={{ animationDelay: '0.6s' }}>
            Where craftsmanship meets innovation. Premium bathroom fixtures, tiles, lighting, and finishing solutions for exceptional spaces.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.7s' }}>
            <Link to="/products" className="btn-gold px-10 py-4 rounded-sm font-body text-sm tracking-[0.2em] uppercase flex items-center gap-2">
              Explore Collection <ArrowRight size={16} />
            </Link>
            <a href="/#contact" className="btn-outline-gold px-10 py-4 rounded-sm font-body text-sm tracking-[0.2em] uppercase">
              Get in Touch
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={scrollDown}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 hover:text-gold transition-colors animate-float"
        >
          <span className="font-mono text-xs tracking-widest">SCROLL</span>
          <ChevronDown size={18} />
        </button>
      </section>

      {/* ═══════════════ STATS ═══════════════ */}
      <section className="py-16 border-y border-gold/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { num: '7+', label: 'Product Categories' },
              { num: '100+', label: 'Premium Products' },
              { num: '500+', label: 'Happy Clients' },
              { num: '5★', label: 'Service Rating' },
            ].map(stat => (
              <div key={stat.label} className="reveal text-center">
                <div className="font-display text-4xl text-gold-gradient mb-2">{stat.num}</div>
                <div className="font-body text-xs tracking-widest uppercase text-white/40">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CATEGORIES ═══════════════ */}
      <section id="categories" className="section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="reveal text-center mb-16">
            <p className="font-mono text-xs tracking-[0.4em] uppercase text-gold/70 mb-3">Our Collection</p>
            <h2 className="font-display text-5xl md:text-6xl text-white">Product <em>Categories</em></h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat, i) => (
              <Link
                key={cat.name}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="reveal group glass rounded-lg p-6 hover:border-gold/40 transition-all duration-400 hover:-translate-y-1"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="text-3xl mb-4">{cat.icon}</div>
                <h3 className="font-display text-lg text-white mb-2 group-hover:text-gold transition-colors">{cat.name}</h3>
                <p className="font-body text-xs text-white/40 leading-relaxed">{cat.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-gold/50 group-hover:text-gold transition-colors">
                  <span className="font-mono text-xs tracking-widest">VIEW</span>
                  <ArrowRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURED PRODUCTS ═══════════════ */}
      <section className="section bg-obsidian-700/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="reveal flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-4">
            <div>
              <p className="font-mono text-xs tracking-[0.4em] uppercase text-gold/70 mb-3">Handpicked</p>
              <h2 className="font-display text-5xl md:text-6xl text-white">Featured <em>Products</em></h2>
            </div>
            <Link to="/products" className="flex items-center gap-2 font-body text-sm text-gold hover:text-gold-light transition-colors">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="h-80 rounded-lg bg-obsidian-600 animate-pulse" />
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="font-display text-2xl text-white/30">Products loading soon...</p>
              <p className="font-body text-sm text-white/20 mt-2">Set up your Supabase database with the provided SQL schema.</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════ SHOWROOM ═══════════════ */}
      <section id="showroom" className="section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="reveal text-center mb-16">
            <p className="font-mono text-xs tracking-[0.4em] uppercase text-gold/70 mb-3">Experience Us</p>
            <h2 className="font-display text-5xl md:text-6xl text-white">Our <em>Showroom</em></h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="reveal">
              <h3 className="font-display text-3xl text-white mb-4">Visit Our Premium Showroom</h3>
              <p className="font-body text-white/50 leading-relaxed mb-6">
                Experience our full collection in person. Our showroom in Kigali showcases over 100 premium products — from luxury bathroom fixtures to designer lighting, all curated for the modern Rwandan home and commercial space.
              </p>
              <ul className="flex flex-col gap-3 mb-8">
                {['Hands-on product demonstrations', 'Expert design consultation', 'Custom quote preparation', 'Professional installation referrals'].map(item => (
                  <li key={item} className="flex items-center gap-3 font-body text-sm text-white/60">
                    <Star size={14} className="text-gold flex-shrink-0" fill="currentColor" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={`https://maps.app.goo.gl/RmZ6rdPzy98G4Dpi9`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold inline-flex items-center gap-2 px-8 py-3 rounded-sm font-body text-sm tracking-widest uppercase"
              >
                <MapPin size={16} /> Get Directions
              </a>
            </div>

            <div className="reveal">
              <div className="rounded-lg overflow-hidden border border-gold/20 shadow-2xl" style={{ height: '400px' }}>
                <iframe
                  src="https://maps.google.com/maps?q=-1.9441,30.0619&hl=en&z=15&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'invert(0.9) hue-rotate(180deg)' }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Amazing Tools Company Location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ ABOUT ═══════════════ */}
      <section id="about" className="section bg-obsidian-700/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="reveal order-2 md:order-1">
              <div className="relative">
                <div className="w-full aspect-square max-w-md mx-auto rounded-lg overflow-hidden border border-gold/20">
                  <img src="/logo.jpeg" alt="Amazing Tools Company" className="w-full h-full object-contain p-12 bg-obsidian-800" />
                </div>
                {/* Decorative element */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 border border-gold/20 rounded-lg -z-10" />
                <div className="absolute -top-6 -left-6 w-20 h-20 border border-gold/10 rounded-full -z-10" />
              </div>
            </div>

            <div className="reveal order-1 md:order-2">
              <p className="font-mono text-xs tracking-[0.4em] uppercase text-gold/70 mb-3">Our Story</p>
              <h2 className="font-display text-5xl md:text-6xl text-white mb-6">About <em>Us</em></h2>
              <p className="font-body text-white/50 leading-relaxed mb-4">
                Amazing Tools Company was founded with a single vision: to bring world-class quality tools and finishing products to Rwanda's growing construction and interior design market.
              </p>
              <p className="font-body text-white/50 leading-relaxed mb-8">
                We partner with premium international brands to deliver bathroom fixtures, tiles, lighting, kitchen solutions, and industrial finishes that meet the highest standards of quality and elegance.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                {[['Quality', 'Only premium-grade products pass our selection'], ['Expertise', 'Professional advice from our specialist team'], ['Service', 'End-to-end support from selection to installation'], ['Value', 'Competitive pricing without compromise']].map(([title, desc]) => (
                  <div key={title}>
                    <h4 className="font-display text-gold text-lg mb-1">{title}</h4>
                    <p className="font-body text-xs text-white/40 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ CONTACT ═══════════════ */}
      <section id="contact" className="section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="reveal text-center mb-16">
            <p className="font-mono text-xs tracking-[0.4em] uppercase text-gold/70 mb-3">Reach Us</p>
            <h2 className="font-display text-5xl md:text-6xl text-white">Get in <em>Touch</em></h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: <MapPin size={24} />, title: 'Visit Us', lines: ['Amazing Tools Company', 'Kigali, Rwanda'] },
              { icon: <Phone size={24} />, title: 'Call Us', lines: ['+250 700 000 000', 'Mon–Sat 8am–6pm'] },
              { icon: <Mail size={24} />, title: 'Email Us', lines: ['info@amazingtools.rw', 'We reply within 24h'] },
            ].map(card => (
              <div key={card.title} className="reveal glass rounded-lg p-8 text-center hover:border-gold/40 transition-all">
                <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-4 text-gold">
                  {card.icon}
                </div>
                <h3 className="font-display text-lg text-white mb-3">{card.title}</h3>
                {card.lines.map((l, i) => (
                  <p key={i} className={`font-body text-sm ${i === 0 ? 'text-white/70' : 'text-white/30'}`}>{l}</p>
                ))}
              </div>
            ))}
          </div>

          {/* WhatsApp CTA */}
          <div className="reveal mt-16 text-center">
            <div className="glass rounded-2xl p-12 max-w-2xl mx-auto border-gold/20">
              <div className="font-display text-4xl text-white mb-4">Ready to Transform Your Space?</div>
              <p className="font-body text-white/50 mb-8">Chat with us on WhatsApp for a personalised product recommendation and quote.</p>
              <a
                href={`https://wa.me/250700000000?text=${encodeURIComponent('Hello Amazing Tools Company! I would like to enquire about your products.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-10 py-4 rounded-sm font-body text-sm tracking-widest uppercase text-white"
                style={{ background: 'linear-gradient(135deg, #25d366, #128c7e)' }}
              >
                <svg viewBox="0 0 24 24" fill="white" width="20" height="20">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
