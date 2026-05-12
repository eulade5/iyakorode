import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ui/ProductCard'

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || '')

  useEffect(() => {
    async function loadCategories() {
      const { data } = await supabase.from('categories').select('*').order('name')
      if (data) setCategories(data)
    }
    loadCategories()
  }, [])

  useEffect(() => {
    async function loadProducts() {
      setLoading(true)
      let query = supabase
        .from('products')
        .select('*, categories(name)')
        .eq('active', true)
        .order('created_at', { ascending: false })

      if (activeCategory) {
        const cat = categories.find(c => c.name === activeCategory)
        if (cat) query = query.eq('category_id', cat.id)
      }
      if (search) {
        query = query.ilike('name', `%${search}%`)
      }

      const { data } = await query
      if (data) setProducts(data.map(p => ({ ...p, category_name: p.categories?.name })))
      setLoading(false)
    }
    loadProducts()
  }, [activeCategory, search, categories])

  useEffect(() => {
    // Scroll reveal
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [products])

  const clearFilter = () => {
    setActiveCategory('')
    setSearchParams({})
  }

  return (
    <main className="min-h-screen pt-24">
      {/* Header */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian-800 to-obsidian-900" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(230,184,0,0.06) 0%, transparent 70%)',
        }} />
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <p className="font-mono text-xs tracking-[0.4em] uppercase text-gold/70 mb-3">Browse</p>
          <h1 className="font-display text-6xl md:text-7xl text-white mb-4">Our <em>Products</em></h1>
          <p className="font-body text-white/40 max-w-xl mx-auto">Premium tools and finishing solutions, curated for excellence.</p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-30 glass-dark border-b border-gold/10 py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-sm pl-9 pr-4 py-2.5 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold/50 transition-colors"
            />
          </div>

          {/* Category pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <SlidersHorizontal size={16} className="text-gold/50 flex-shrink-0" />
            <button
              onClick={clearFilter}
              className={`flex-shrink-0 px-4 py-2 rounded-sm font-body text-xs tracking-widest uppercase transition-all ${
                !activeCategory ? 'bg-gold text-obsidian-900 font-semibold' : 'border border-white/20 text-white/50 hover:border-gold/40 hover:text-white'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name === activeCategory ? '' : cat.name)}
                className={`flex-shrink-0 px-4 py-2 rounded-sm font-body text-xs tracking-widest uppercase transition-all ${
                  activeCategory === cat.name
                    ? 'bg-gold text-obsidian-900 font-semibold'
                    : 'border border-white/20 text-white/50 hover:border-gold/40 hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Active filter chip */}
          {activeCategory && (
            <div className="flex items-center gap-2 mb-6">
              <span className="font-body text-xs text-white/40">Filtering by:</span>
              <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-body">
                {activeCategory}
                <button onClick={clearFilter}><X size={12} /></button>
              </span>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="h-72 rounded-lg bg-obsidian-600 animate-pulse" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <p className="font-body text-xs text-white/30 mb-6 tracking-widest uppercase">
                {products.length} product{products.length !== 1 ? 's' : ''} found
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(p => (
                  <div key={p.id} className="reveal">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-32">
              <div className="font-display text-5xl text-white/10 mb-4">∅</div>
              <p className="font-display text-2xl text-white/30 mb-2">No products found</p>
              <p className="font-body text-sm text-white/20">Try adjusting your search or filter.</p>
              {(search || activeCategory) && (
                <button onClick={clearFilter} className="mt-6 btn-outline-gold px-6 py-2.5 rounded-sm font-body text-xs tracking-widest uppercase">
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
