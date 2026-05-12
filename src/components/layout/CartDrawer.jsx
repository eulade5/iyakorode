import { X, Trash2, MessageCircle, ShoppingBag } from 'lucide-react'
import { useCart } from '../../hooks/useCart'

export default function CartDrawer({ open, onClose }) {
  const { items, removeItem, clearCart, requestQuote, count } = useCart()

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md z-[70] glass-dark flex flex-col transition-transform duration-500 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gold/20">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} className="text-gold" />
            <span className="font-display text-xl text-white">Your Basket</span>
            {count > 0 && <span className="text-xs bg-gold text-obsidian-900 font-bold px-2 py-0.5 rounded-full">{count}</span>}
          </div>
          <button onClick={onClose} className="p-2 text-white/60 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-white/40">
              <ShoppingBag size={48} strokeWidth={1} />
              <p className="font-display text-xl">Your basket is empty</p>
              <p className="font-body text-sm text-center">Browse our premium collection and add items to request a quote.</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map(item => (
                <li key={item.id} className="flex gap-4 p-4 rounded border border-gold/10 bg-white/[0.02]">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover rounded flex-shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded bg-obsidian-600 flex-shrink-0 flex items-center justify-center">
                      <ShoppingBag size={20} className="text-gold/40" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-medium text-white text-sm truncate">{item.name}</p>
                    <p className="font-body text-xs text-white/50 mt-0.5">{item.category_name}</p>
                    <p className="font-body text-xs text-gold mt-1">Price on request</p>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="p-1.5 text-white/40 hover:text-red-400 transition-colors flex-shrink-0">
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-gold/20 flex flex-col gap-3">
            <button
              onClick={requestQuote}
              className="btn-gold w-full py-4 rounded-sm font-body text-sm tracking-widest uppercase flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} />
              Request Quote on WhatsApp
            </button>
            <button
              onClick={clearCart}
              className="w-full py-3 text-white/50 hover:text-white font-body text-xs tracking-widest uppercase transition-colors"
            >
              Clear Basket
            </button>
          </div>
        )}
      </div>
    </>
  )
}
