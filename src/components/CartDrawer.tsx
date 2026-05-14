import { X, Trash2, ShoppingBag, MessageCircle, Package } from "lucide-react";
import { useCart } from "@/hooks/useCart";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, clearCart, itemCount } = useCart();

  const handleQuote = () => {
    const list = items
      .map((item, i) => `${i + 1}. ${item.name}${item.selectedVariant ? ` (${item.selectedVariant})` : ""}`)
      .join("\n");
    const msg = encodeURIComponent(
      `Hello Amazing Tools Company! 👋\n\nI would like to request a quote for the following items:\n\n${list}\n\nPlease send me pricing and availability. Thank you!`
    );
    window.open(`https://wa.me/250784909020?text=${msg}`, "_blank");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm transition-all duration-400 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[420px] z-[70] flex flex-col transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          background: "linear-gradient(165deg,#111 0%,#0c0c0c 100%)",
          borderLeft: "1px solid rgba(201,168,76,0.15)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-6 border-b border-[rgba(201,168,76,0.12)]">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} className="text-[var(--gold)]" />
            <span className="font-serif text-xl text-[var(--cream)]">Your Basket</span>
            {itemCount > 0 && (
              <span className="w-6 h-6 rounded-full bg-[var(--gold)] text-[#0a0a0a] text-xs font-bold flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full border border-transparent hover:border-[rgba(201,168,76,0.25)] text-[rgba(245,240,232,0.4)] hover:text-[var(--cream)] transition-all duration-300"
          >
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-7 py-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 text-center">
              <div className="w-20 h-20 rounded-full border border-[rgba(201,168,76,0.15)] flex items-center justify-center">
                <Package size={32} className="text-[rgba(201,168,76,0.3)]" strokeWidth={1} />
              </div>
              <div>
                <p className="font-serif text-2xl text-[rgba(245,240,232,0.35)] mb-2">
                  Your basket is empty
                </p>
                <p className="text-sm text-[rgba(245,240,232,0.22)] leading-relaxed max-w-[220px]">
                  Add products to request a quote.
                </p>
              </div>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {items.map((item) => (
                <li
                  key={`${item.id}-${item.selectedVariant}`}
                  className="flex gap-4 p-4 rounded-lg border border-[rgba(201,168,76,0.1)] bg-[rgba(255,255,255,0.02)] transition-colors hover:border-[rgba(201,168,76,0.22)]"
                >
                  {/* Thumb */}
                  <div className="w-16 h-16 rounded-md overflow-hidden bg-[#1a1a1a] flex-shrink-0">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag size={18} className="text-[rgba(201,168,76,0.3)]" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--cream)] truncate">
                      {item.name}
                    </p>
                    {item.selectedVariant && (
                      <p className="text-xs text-[rgba(245,240,232,0.38)] mt-0.5 truncate">
                        {item.selectedVariant}
                      </p>
                    )}
                    <p className="text-xs text-[var(--gold)] mt-1.5 tracking-wider">
                      Price on request
                    </p>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id, item.selectedVariant)}
                    className="flex-shrink-0 p-1.5 rounded text-[rgba(245,240,232,0.25)] hover:text-red-400 transition-colors"
                    aria-label="Remove"
                  >
                    <Trash2 size={15} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-7 py-6 border-t border-[rgba(201,168,76,0.12)] flex flex-col gap-3">
            <button
              onClick={handleQuote}
              className="btn-gold w-full py-4 rounded-md text-sm tracking-widest uppercase flex items-center justify-center gap-2"
            >
              <MessageCircle size={17} />
              Request Quote on WhatsApp
            </button>
            <button
              onClick={clearCart}
              className="w-full py-2.5 text-[rgba(245,240,232,0.3)] hover:text-[rgba(245,240,232,0.65)] text-xs tracking-widest uppercase transition-colors"
            >
              Clear basket
            </button>
          </div>
        )}
      </div>
    </>
  );
}
