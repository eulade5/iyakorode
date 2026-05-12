import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-obsidian-800 border-t border-gold/10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <img src="/logo.jpeg" alt="Amazing Tools Company" className="h-14 w-auto rounded mb-5" />
            <p className="font-body text-sm text-white/50 leading-relaxed max-w-xs">
              Premium tools and finishing products for discerning homeowners, architects, and interior designers across Rwanda.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg text-gold mb-6 gold-line">Navigation</h4>
            <ul className="flex flex-col gap-3">
              {[['Home', '/'], ['Products', '/products'], ['About', '/#about'], ['Contact', '/#contact'], ['Admin', '/admin']].map(([label, to]) => (
                <li key={label}>
                  {to.startsWith('/#') ? (
                    <a href={to} className="font-body text-sm text-white/50 hover:text-gold transition-colors tracking-wide">{label}</a>
                  ) : (
                    <Link to={to} className="font-body text-sm text-white/50 hover:text-gold transition-colors tracking-wide">{label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg text-gold mb-6 gold-line">Contact Us</h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-gold mt-0.5 flex-shrink-0" />
                <span className="font-body text-sm text-white/50">Kigali, Rwanda</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-gold mt-0.5 flex-shrink-0" />
                <span className="font-body text-sm text-white/50">+250 700 000 000</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-gold mt-0.5 flex-shrink-0" />
                <span className="font-body text-sm text-white/50">info@amazingtools.rw</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gold/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-white/30 tracking-wider">
            © {new Date().getFullYear()} Amazing Tools Company. All rights reserved.
          </p>
          <p className="font-body text-xs text-white/20 tracking-wider">
            Premium Tools & Finishing Solutions
          </p>
        </div>
      </div>
    </footer>
  )
}
