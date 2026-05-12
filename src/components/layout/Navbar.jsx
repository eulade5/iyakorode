import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useCart } from '../../hooks/useCart'
import CartDrawer from './CartDrawer'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const { count } = useCart()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [location])

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Products', to: '/products' },
    { label: 'Showroom', to: '/#showroom' },
    { label: 'About', to: '/#about' },
    { label: 'Contact', to: '/#contact' },
  ]

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass-dark shadow-2xl py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.jpeg" alt="Amazing Tools Company" className="h-10 w-auto rounded" />
            <span className="hidden sm:block font-display text-lg font-light tracking-widest text-white">
              AMAZING <span className="text-gold">TOOLS</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map(l => (
              <li key={l.label}>
                <a
                  href={l.to.startsWith('/#') ? l.to : undefined}
                  onClick={l.to.startsWith('/#') ? undefined : undefined}
                  className="font-body text-sm tracking-widest uppercase text-white/70 hover:text-gold transition-colors duration-300"
                >
                  {l.to.startsWith('/#') ? (
                    <a href={l.to}>{l.label}</a>
                  ) : (
                    <Link to={l.to}>{l.label}</Link>
                  )}
                </a>
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-white/80 hover:text-gold transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag size={22} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold text-obsidian-900 text-xs font-bold flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>

            <Link to="/admin" className="hidden md:block btn-outline-gold text-xs tracking-widest uppercase px-4 py-2 rounded-sm font-body">
              Admin
            </Link>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 text-white" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden glass-dark border-t border-gold/10 px-6 py-6">
            <ul className="flex flex-col gap-5">
              {navLinks.map(l => (
                <li key={l.label}>
                  {l.to.startsWith('/#') ? (
                    <a href={l.to} className="block font-body text-sm tracking-widest uppercase text-white/80 hover:text-gold transition-colors">
                      {l.label}
                    </a>
                  ) : (
                    <Link to={l.to} className="block font-body text-sm tracking-widest uppercase text-white/80 hover:text-gold transition-colors">
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
              <li>
                <Link to="/admin" className="block font-body text-sm tracking-widest uppercase text-gold">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
