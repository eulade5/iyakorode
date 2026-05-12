import { ShoppingBag, Check, Eye } from 'lucide-react'
import { useCart } from '../../hooks/useCart'
import { useState } from 'react'

export default function ProductCard({ product }) {
  const { addItem, removeItem, isInCart } = useCart()
  const [imgError, setImgError] = useState(false)
  const inCart = isInCart(product.id)

  const handleCart = () => {
    if (inCart) removeItem(product.id)
    else addItem(product)
  }

  return (
    <div className="product-card rounded-lg overflow-hidden flex flex-col group">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3] bg-obsidian-600">
        {product.image_url && !imgError ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-gold/20 font-display text-5xl">A</div>
          </div>
        )}
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="glass text-xs font-body tracking-widest uppercase text-gold px-3 py-1 rounded-sm">
            {product.category_name}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <h3 className="font-display text-lg text-white leading-tight">{product.name}</h3>
        {product.description && (
          <p className="font-body text-sm text-white/50 leading-relaxed line-clamp-2">{product.description}</p>
        )}
        <div className="mt-auto pt-3 border-t border-gold/10 flex items-center justify-between">
          <span className="font-body text-xs tracking-widest uppercase text-gold">Price on Request</span>
          <button
            onClick={handleCart}
            className={`flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-body tracking-wider uppercase transition-all duration-300 ${
              inCart
                ? 'bg-gold/20 text-gold border border-gold/40'
                : 'btn-gold'
            }`}
          >
            {inCart ? <><Check size={14} /> Added</> : <><ShoppingBag size={14} /> Add</>}
          </button>
        </div>
      </div>
    </div>
  )
}
