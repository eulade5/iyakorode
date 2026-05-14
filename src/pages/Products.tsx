import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X, ChevronDown, ShoppingBag, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/useCart";

interface Product {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  category: string;
  variants: { label: string; options: string[] } | null;
  active: boolean;
}

interface ProductWithSelection extends Product {
  selectedVariant?: string;
}

function ProductCard({ product }: { product: Product }) {
  const { addItem, isInCart, removeItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.options?.[0] ?? ""
  );
  const [imgErr, setImgErr] = useState(false);
  const [added, setAdded] = useState(false);

  const cartKey = `${product.id}-${selectedVariant}`;
  const inCart = isInCart(product.id, selectedVariant);

  const handleCart = () => {
    if (inCart) {
      removeItem(product.id, selectedVariant);
    } else {
      addItem({ ...product, selectedVariant });
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    }
  };

  return (
    <div className="luxury-card rounded-xl overflow-hidden flex flex-col group">
      {/* Image */}
      <div className="relative img-zoom aspect-[4/3] bg-[#111]">
        {product.image_url && !imgErr ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={() => setImgErr(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[rgba(201,168,76,0.15)]">
            <ShoppingBag size={36} strokeWidth={1} />
          </div>
        )}
        {/* Category label */}
        <div className="absolute top-3 left-3">
          <span className="glass text-[10px] font-sans tracking-widest uppercase text-[var(--gold)] px-3 py-1 rounded-sm">
            {product.category}
          </span>
        </div>
        {/* Variant count */}
        {product.variants?.options && (
          <div className="absolute top-3 right-3">
            <span className="glass text-[10px] text-[rgba(245,240,232,0.5)] px-2.5 py-1 rounded-sm">
              {product.variants.options.length} options
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <h3 className="font-serif text-lg text-[var(--cream)] leading-snug group-hover:text-[var(--gold)] transition-colors duration-300">
          {product.name}
        </h3>

        {/* Variant selector */}
        {product.variants?.options && product.variants.options.length > 0 && (
          <div>
            <p className="text-[10px] text-[rgba(245,240,232,0.35)] tracking-widest uppercase mb-2">
              {product.variants.label}
            </p>
            <div className="relative">
              <select
                value={selectedVariant}
                onChange={(e) => setSelectedVariant(e.target.value)}
                className="w-full bg-[#111] border border-[rgba(201,168,76,0.15)] rounded-sm pl-3 pr-8 py-2 text-xs text-[rgba(245,240,232,0.65)] appearance-none cursor-pointer focus:outline-none focus:border-[rgba(201,168,76,0.45)] transition-colors"
              >
                {product.variants.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={13}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[rgba(201,168,76,0.4)] pointer-events-none"
              />
            </div>
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-[rgba(201,168,76,0.08)] flex items-center justify-between">
          <span className="text-xs text-[var(--gold)] tracking-wider uppercase">
            Price on request
          </span>
          <button
            onClick={handleCart}
            className={`flex items-center gap-2 px-4 py-2 rounded-sm text-xs tracking-wider uppercase transition-all duration-350 ${
              inCart
                ? "border border-[rgba(201,168,76,0.5)] text-[var(--gold)] bg-[rgba(201,168,76,0.08)]"
                : "btn-gold"
            }`}
          >
            {inCart ? (
              <><Check size={13} /> Added</>
            ) : (
              <><ShoppingBag size={13} /> Add to Basket</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .order("category")
        .order("name");

      if (data) {
        setProducts(data as Product[]);
        const cats = Array.from(new Set(data.map((p) => p.category)));
        setCategories(cats);
      }
      setLoading(false);
    }
    load();
  }, []);

  // Reveal animations
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        const els = document.querySelectorAll(".reveal");
        const io = new IntersectionObserver(
          (entries) =>
            entries.forEach((e) => {
              if (e.isIntersecting) {
                e.target.classList.add("in-view");
                io.unobserve(e.target);
              }
            }),
          { threshold: 0.08 }
        );
        els.forEach((el) => io.observe(el));
        return () => io.disconnect();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading, activeCategory]);

  // Group products by category
  const filteredByCategory =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const filtered = filteredByCategory.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce<Record<string, Product[]>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  return (
    <main className="min-h-screen pt-20">
      {/* Header */}
      <section
        className="relative py-20 text-center overflow-hidden"
        style={{
          background: "linear-gradient(180deg,#0a0a0a 0%,#080808 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.06] bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/product-bathroom-CQ2nYyEL.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[rgba(201,168,76,0.4)] to-transparent" />

        <div className="relative max-w-4xl mx-auto px-6">
          <p className="eyebrow mb-4">Our Catalog</p>
          <h1 className="font-serif text-6xl md:text-7xl font-light text-[var(--cream)] mb-4">
            Premium Product <em>Collection</em>
          </h1>
          <p className="text-[rgba(245,240,232,0.4)] text-base max-w-lg mx-auto">
            Explore over {products.length} luxury fixtures and finishes. Add
            items to your basket and request a quote on WhatsApp.
          </p>
        </div>
      </section>

      {/* Sticky filter bar */}
      <div className="sticky top-16 z-30 glass border-b border-[rgba(201,168,76,0.1)] py-3.5">
        <div className="max-w-7xl mx-auto px-5 flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(201,168,76,0.45)]"
            />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.14)] rounded-sm pl-9 pr-10 py-2.5 text-sm text-[var(--cream)] placeholder-[rgba(245,240,232,0.25)] focus:outline-none focus:border-[rgba(201,168,76,0.5)] transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(245,240,232,0.3)] hover:text-[var(--cream)]"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category pills - scrollable */}
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 flex-1 scrollbar-hide">
            <SlidersHorizontal
              size={14}
              className="text-[rgba(201,168,76,0.4)] flex-shrink-0"
            />
            <button
              onClick={() => setActiveCategory("All")}
              className={`filter-tab flex-shrink-0 ${activeCategory === "All" ? "active" : ""}`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat === activeCategory ? "All" : cat)}
                className={`filter-tab flex-shrink-0 ${activeCategory === cat ? "active" : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products */}
      <section className="py-14 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-5">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-72 rounded-xl bg-[#111] animate-pulse"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-32">
              <p className="font-serif text-3xl text-[rgba(245,240,232,0.2)] mb-3">
                No products found
              </p>
              <p className="text-sm text-[rgba(245,240,232,0.2)]">
                Try adjusting your search or filter.
              </p>
              <button
                onClick={() => { setSearch(""); setActiveCategory("All"); }}
                className="mt-6 btn-outline px-6 py-2.5 rounded-sm text-xs tracking-widest uppercase"
              >
                Clear filters
              </button>
            </div>
          ) : (
            Object.entries(grouped).map(([category, catProducts]) => (
              <div key={category} className="mb-16">
                {/* Category heading */}
                <div className="flex items-center gap-5 mb-8">
                  <div>
                    <h2 className="font-serif text-3xl font-light text-[var(--cream)]">
                      {category}
                    </h2>
                    <span className="text-xs text-[rgba(245,240,232,0.3)] tracking-widest uppercase">
                      {catProducts.length}{" "}
                      {catProducts.length === 1 ? "product" : "products"}
                    </span>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-[rgba(201,168,76,0.25)] to-transparent" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {catProducts.map((p, i) => (
                    <div
                      key={p.id}
                      className="reveal"
                      style={{ transitionDelay: `${(i % 4) * 0.07}s` }}
                    >
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
