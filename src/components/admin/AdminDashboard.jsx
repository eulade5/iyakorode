import { useState, useEffect, useRef } from 'react'
import { supabase, STORAGE_BUCKET } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import {
  LayoutDashboard, Package, Tag, LogOut, Plus, Edit2, Trash2,
  Search, Upload, X, Check, ChevronDown, AlertCircle, Eye
} from 'lucide-react'

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'categories', label: 'Categories', icon: Tag },
]

function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg glass rounded-xl border border-gold/20 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gold/10">
          <h2 className="font-display text-xl text-white">{title}</h2>
          <button onClick={onClose} className="p-2 text-white/40 hover:text-white"><X size={18} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

function ImageUpload({ currentUrl, onUpload }) {
  const fileRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentUrl)

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    // Upload to Supabase storage
    const ext = file.name.split('.').pop()
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { data, error } = await supabase.storage.from(STORAGE_BUCKET).upload(filename, file, { upsert: true })
    if (!error && data) {
      const { data: { publicUrl } } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filename)
      onUpload(publicUrl)
    }
    setUploading(false)
  }

  return (
    <div>
      <div
        onClick={() => fileRef.current?.click()}
        className="relative w-full h-40 rounded border-2 border-dashed border-white/20 hover:border-gold/50 transition-colors cursor-pointer overflow-hidden flex items-center justify-center"
      >
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center text-white/30">
            <Upload size={24} className="mx-auto mb-2" />
            <p className="font-body text-xs">Click to upload image</p>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <p className="font-body text-xs text-white/30 mt-2">JPG, PNG, WebP — max 5MB</p>
    </div>
  )
}

function OverviewTab({ stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map(s => (
        <div key={s.label} className="glass rounded-lg p-6 border border-gold/10">
          <p className="font-body text-xs text-white/40 tracking-widest uppercase mb-1">{s.label}</p>
          <p className="font-display text-4xl text-gold-gradient">{s.value}</p>
        </div>
      ))}
    </div>
  )
}

export default function AdminDashboard() {
  const { user, signOut } = useAuth()
  const [tab, setTab] = useState('overview')
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [loading, setLoading] = useState(true)

  // Product modal
  const [prodModal, setProdModal] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [prodForm, setProdForm] = useState({ name: '', description: '', category_id: '', image_url: '', active: true })

  // Category modal
  const [catModal, setCatModal] = useState(false)
  const [editCategory, setEditCategory] = useState(null)
  const [catForm, setCatForm] = useState({ name: '', description: '' })

  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const loadAll = async () => {
    setLoading(true)
    const [{ data: cats }, { data: prods }] = await Promise.all([
      supabase.from('categories').select('*').order('name'),
      supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false })
    ])
    if (cats) setCategories(cats)
    if (prods) setProducts(prods.map(p => ({ ...p, category_name: p.categories?.name })))
    setLoading(false)
  }

  useEffect(() => { loadAll() }, [])

  const showMsg = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000) }

  // ── PRODUCTS ──
  const openNewProduct = () => {
    setEditProduct(null)
    setProdForm({ name: '', description: '', category_id: categories[0]?.id || '', image_url: '', active: true })
    setProdModal(true)
  }

  const openEditProduct = (p) => {
    setEditProduct(p)
    setProdForm({ name: p.name, description: p.description || '', category_id: p.category_id, image_url: p.image_url || '', active: p.active })
    setProdModal(true)
  }

  const saveProduct = async () => {
    if (!prodForm.name || !prodForm.category_id) return
    setSaving(true)
    if (editProduct) {
      const { error } = await supabase.from('products').update(prodForm).eq('id', editProduct.id)
      if (!error) { showMsg('Product updated!'); setProdModal(false); loadAll() }
    } else {
      const { error } = await supabase.from('products').insert([prodForm])
      if (!error) { showMsg('Product created!'); setProdModal(false); loadAll() }
    }
    setSaving(false)
  }

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    loadAll()
    showMsg('Product deleted.')
  }

  // ── CATEGORIES ──
  const openNewCategory = () => {
    setEditCategory(null)
    setCatForm({ name: '', description: '' })
    setCatModal(true)
  }

  const openEditCategory = (c) => {
    setEditCategory(c)
    setCatForm({ name: c.name, description: c.description || '' })
    setCatModal(true)
  }

  const saveCategory = async () => {
    if (!catForm.name) return
    setSaving(true)
    if (editCategory) {
      const { error } = await supabase.from('categories').update(catForm).eq('id', editCategory.id)
      if (!error) { showMsg('Category updated!'); setCatModal(false); loadAll() }
    } else {
      const { error } = await supabase.from('categories').insert([catForm])
      if (!error) { showMsg('Category created!'); setCatModal(false); loadAll() }
    }
    setSaving(false)
  }

  const deleteCategory = async (id) => {
    if (!confirm('Delete this category? Products in it will become uncategorised.')) return
    await supabase.from('categories').delete().eq('id', id)
    loadAll()
    showMsg('Category deleted.')
  }

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCat ? p.category_id === filterCat : true
    return matchSearch && matchCat
  })

  const stats = [
    { label: 'Total Products', value: products.length },
    { label: 'Categories', value: categories.length },
    { label: 'Active Products', value: products.filter(p => p.active).length },
    { label: 'Inactive', value: products.filter(p => !p.active).length },
  ]

  const InputClass = "w-full bg-white/5 border border-white/10 rounded-sm px-4 py-2.5 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold/60 transition-colors"
  const LabelClass = "font-body text-xs tracking-widest uppercase text-white/40 block mb-1.5"

  return (
    <div className="min-h-screen flex bg-obsidian-900">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 glass-dark border-r border-gold/10 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-gold/10">
          <img src="/logo.jpeg" alt="Logo" className="h-10 rounded mb-3" />
          <p className="font-display text-lg text-white">Admin CMS</p>
          <p className="font-body text-xs text-white/30 mt-0.5 truncate">{user?.email}</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="flex flex-col gap-1">
            {TABS.map(t => (
              <li key={t.id}>
                <button
                  onClick={() => setTab(t.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm font-body text-sm transition-all ${
                    tab === t.id ? 'bg-gold/10 text-gold border-l-2 border-gold' : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <t.icon size={16} /> {t.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gold/10">
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-sm font-body text-sm text-white/40 hover:text-red-400 hover:bg-red-400/5 transition-all"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="glass-dark border-b border-gold/10 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3 md:hidden">
            <img src="/logo.jpeg" alt="Logo" className="h-8 rounded" />
          </div>
          <h1 className="font-display text-2xl text-white capitalize hidden md:block">
            {TABS.find(t => t.id === tab)?.label}
          </h1>
          {/* Mobile tab switcher */}
          <div className="flex md:hidden gap-2">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`p-2 rounded-sm transition-colors ${tab === t.id ? 'text-gold' : 'text-white/40'}`}
              >
                <t.icon size={18} />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {msg && (
              <div className="flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-sm px-3 py-1.5">
                <Check size={14} className="text-gold" />
                <span className="font-body text-xs text-gold">{msg}</span>
              </div>
            )}
            <button onClick={signOut} className="flex items-center gap-2 text-white/40 hover:text-red-400 transition-colors md:hidden">
              <LogOut size={18} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* OVERVIEW */}
          {tab === 'overview' && (
            <div>
              <OverviewTab stats={stats} />
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass rounded-lg border border-gold/10 p-6">
                  <h3 className="font-display text-lg text-white mb-4">Recent Products</h3>
                  <ul className="flex flex-col gap-3">
                    {products.slice(0, 5).map(p => (
                      <li key={p.id} className="flex items-center justify-between py-2 border-b border-white/5">
                        <div>
                          <p className="font-body text-sm text-white">{p.name}</p>
                          <p className="font-body text-xs text-white/30">{p.category_name}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-body ${p.active ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-white/30'}`}>
                          {p.active ? 'Active' : 'Hidden'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="glass rounded-lg border border-gold/10 p-6">
                  <h3 className="font-display text-lg text-white mb-4">Categories</h3>
                  <ul className="flex flex-col gap-3">
                    {categories.map(c => (
                      <li key={c.id} className="flex items-center justify-between py-2 border-b border-white/5">
                        <p className="font-body text-sm text-white">{c.name}</p>
                        <span className="font-mono text-xs text-white/30">
                          {products.filter(p => p.category_id === c.id).length} products
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* PRODUCTS */}
          {tab === 'products' && (
            <div>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
                    className={`${InputClass} pl-9`} />
                </div>
                <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className={`${InputClass} md:w-48`}>
                  <option value="">All Categories</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <button onClick={openNewProduct} className="btn-gold flex items-center gap-2 px-6 py-2.5 rounded-sm font-body text-sm whitespace-nowrap">
                  <Plus size={16} /> Add Product
                </button>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1,2,3].map(i => <div key={i} className="h-32 bg-obsidian-600 rounded-lg animate-pulse" />)}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map(p => (
                    <div key={p.id} className="glass rounded-lg border border-gold/10 overflow-hidden">
                      <div className="relative h-36 bg-obsidian-600">
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/20 font-display text-2xl">No image</div>
                        )}
                        <div className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-body ${p.active ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/40'}`}>
                          {p.active ? 'Active' : 'Hidden'}
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="font-body font-medium text-white text-sm mb-0.5 truncate">{p.name}</p>
                        <p className="font-body text-xs text-white/40 mb-3">{p.category_name}</p>
                        <div className="flex gap-2">
                          <button onClick={() => openEditProduct(p)} className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-gold/30 text-gold rounded-sm font-body text-xs hover:bg-gold/10 transition-colors">
                            <Edit2 size={12} /> Edit
                          </button>
                          <button onClick={() => deleteProduct(p.id)} className="flex items-center justify-center gap-1.5 px-3 py-2 border border-red-500/30 text-red-400 rounded-sm font-body text-xs hover:bg-red-500/10 transition-colors">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredProducts.length === 0 && (
                    <div className="col-span-full text-center py-16 text-white/30">
                      <Package size={40} className="mx-auto mb-4 opacity-30" />
                      <p className="font-display text-xl">No products found</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* CATEGORIES */}
          {tab === 'categories' && (
            <div>
              <div className="flex justify-end mb-6">
                <button onClick={openNewCategory} className="btn-gold flex items-center gap-2 px-6 py-2.5 rounded-sm font-body text-sm">
                  <Plus size={16} /> Add Category
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map(c => (
                  <div key={c.id} className="glass rounded-lg border border-gold/10 p-6">
                    <h3 className="font-display text-xl text-white mb-1">{c.name}</h3>
                    {c.description && <p className="font-body text-xs text-white/40 mb-3 leading-relaxed">{c.description}</p>}
                    <p className="font-mono text-xs text-gold/60 mb-4">{products.filter(p => p.category_id === c.id).length} products</p>
                    <div className="flex gap-2">
                      <button onClick={() => openEditCategory(c)} className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-gold/30 text-gold rounded-sm font-body text-xs hover:bg-gold/10 transition-colors">
                        <Edit2 size={12} /> Edit
                      </button>
                      <button onClick={() => deleteCategory(c.id)} className="flex items-center justify-center gap-1.5 px-3 py-2 border border-red-500/30 text-red-400 rounded-sm font-body text-xs hover:bg-red-500/10 transition-colors">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Product Modal */}
      <Modal open={prodModal} onClose={() => setProdModal(false)} title={editProduct ? 'Edit Product' : 'New Product'}>
        <div className="flex flex-col gap-4">
          <div>
            <label className={LabelClass}>Product Name *</label>
            <input className={InputClass} value={prodForm.name} onChange={e => setProdForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Luxury Rain Shower" />
          </div>
          <div>
            <label className={LabelClass}>Description</label>
            <textarea className={`${InputClass} resize-none h-24`} value={prodForm.description} onChange={e => setProdForm(f => ({ ...f, description: e.target.value }))} placeholder="Product description..." />
          </div>
          <div>
            <label className={LabelClass}>Category *</label>
            <select className={InputClass} value={prodForm.category_id} onChange={e => setProdForm(f => ({ ...f, category_id: e.target.value }))}>
              <option value="">Select category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className={LabelClass}>Product Image</label>
            <ImageUpload currentUrl={prodForm.image_url} onUpload={url => setProdForm(f => ({ ...f, image_url: url }))} />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="active" checked={prodForm.active} onChange={e => setProdForm(f => ({ ...f, active: e.target.checked }))} className="accent-gold w-4 h-4" />
            <label htmlFor="active" className="font-body text-sm text-white/60">Active (visible on website)</label>
          </div>
          <div className="flex gap-3 mt-2 pt-4 border-t border-white/10">
            <button onClick={() => setProdModal(false)} className="flex-1 btn-outline-gold py-3 rounded-sm font-body text-sm">Cancel</button>
            <button onClick={saveProduct} disabled={saving} className="flex-1 btn-gold py-3 rounded-sm font-body text-sm flex items-center justify-center gap-2 disabled:opacity-50">
              {saving ? <div className="w-4 h-4 border-2 border-obsidian-900 border-t-transparent rounded-full animate-spin" /> : <Check size={16} />}
              {editProduct ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Category Modal */}
      <Modal open={catModal} onClose={() => setCatModal(false)} title={editCategory ? 'Edit Category' : 'New Category'}>
        <div className="flex flex-col gap-4">
          <div>
            <label className={LabelClass}>Category Name *</label>
            <input className={InputClass} value={catForm.name} onChange={e => setCatForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Bathroom Fixtures" />
          </div>
          <div>
            <label className={LabelClass}>Description</label>
            <textarea className={`${InputClass} resize-none h-20`} value={catForm.description} onChange={e => setCatForm(f => ({ ...f, description: e.target.value }))} placeholder="Category description..." />
          </div>
          <div className="flex gap-3 mt-2 pt-4 border-t border-white/10">
            <button onClick={() => setCatModal(false)} className="flex-1 btn-outline-gold py-3 rounded-sm font-body text-sm">Cancel</button>
            <button onClick={saveCategory} disabled={saving} className="flex-1 btn-gold py-3 rounded-sm font-body text-sm flex items-center justify-center gap-2 disabled:opacity-50">
              {saving ? <div className="w-4 h-4 border-2 border-obsidian-900 border-t-transparent rounded-full animate-spin" /> : <Check size={16} />}
              {editCategory ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
