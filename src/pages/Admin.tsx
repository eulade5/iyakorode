import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard, Package, Tag, LogOut, Plus, Edit2, Trash2,
  Search, Upload, X, Check, Eye, EyeOff, LogIn, AlertCircle,
  ChevronDown, BarChart3, Settings
} from "lucide-react";

/* ─── Auth ─────────────────────────────────────────────── */
function LoginScreen({ onLogin }: { onLogin: (u: any) => void }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) setError(error.message);
    else if (data.user) onLogin(data.user);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060606] relative overflow-hidden">
      <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(ellipse 60% 50% at 50% 40%,rgba(201,168,76,0.06) 0%,transparent 70%)" }} />
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="glass rounded-2xl p-10 border border-[rgba(201,168,76,0.15)] shadow-[0_32px_80px_rgba(0,0,0,0.7)]">
          <div className="text-center mb-10">
            <img src="/assets/logo-D3ITjQ6-.jpeg" alt="Logo" className="h-14 w-auto mx-auto rounded mb-5 object-contain" />
            <h1 className="font-serif text-3xl font-light text-[var(--cream)]">Admin Portal</h1>
            <p className="eyebrow text-[0.65rem] mt-2 opacity-50">Amazing Tools Company</p>
          </div>
          <form onSubmit={submit} className="flex flex-col gap-5">
            <div>
              <label className="text-[10px] tracking-widest uppercase text-[rgba(245,240,232,0.35)] block mb-2">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.15)] rounded-sm px-4 py-3 text-sm text-[var(--cream)] placeholder-[rgba(245,240,232,0.2)] focus:outline-none focus:border-[rgba(201,168,76,0.5)] transition-colors"
                placeholder="admin@amazingtools.rw" />
            </div>
            <div>
              <label className="text-[10px] tracking-widest uppercase text-[rgba(245,240,232,0.35)] block mb-2">Password</label>
              <div className="relative">
                <input type={show ? "text" : "password"} value={pass} onChange={e => setPass(e.target.value)} required
                  className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.15)] rounded-sm px-4 py-3 pr-12 text-sm text-[var(--cream)] placeholder-[rgba(245,240,232,0.2)] focus:outline-none focus:border-[rgba(201,168,76,0.5)] transition-colors"
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[rgba(245,240,232,0.3)] hover:text-[rgba(245,240,232,0.7)]">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && (
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/25 rounded-sm p-3">
                <AlertCircle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}
            <button type="submit" disabled={loading}
              className="btn-gold w-full py-4 rounded-md text-sm tracking-widest uppercase flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? <div className="w-4 h-4 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" /> : <><LogIn size={16} /> Sign In</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ─── Image Upload ─────────────────────────────────────── */
function ImageUpload({ current, onUpload }: { current: string; onUpload: (url: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(current);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    setPreview(URL.createObjectURL(file));
    const ext = file.name.split(".").pop();
    const fname = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { data, error } = await supabase.storage.from("product-images").upload(fname, file, { upsert: true });
    if (!error && data) {
      const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(fname);
      onUpload(publicUrl);
    }
    setUploading(false);
  };

  return (
    <div>
      <div onClick={() => ref.current?.click()}
        className="relative h-36 w-full rounded-lg border-2 border-dashed border-[rgba(201,168,76,0.2)] hover:border-[rgba(201,168,76,0.5)] transition-colors cursor-pointer overflow-hidden flex items-center justify-center bg-[rgba(255,255,255,0.02)]">
        {preview ? (
          <img src={preview} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center text-[rgba(245,240,232,0.2)]">
            <Upload size={22} className="mx-auto mb-2" />
            <p className="text-xs">Click to upload</p>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <p className="text-[10px] text-[rgba(245,240,232,0.2)] mt-1.5">JPG, PNG or WebP — max 5 MB</p>
    </div>
  );
}

/* ─── Modal ────────────────────────────────────────────── */
function Modal({ open, onClose, title, children }: any) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto glass rounded-2xl border border-[rgba(201,168,76,0.18)] shadow-[0_24px_64px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between p-6 border-b border-[rgba(201,168,76,0.1)] sticky top-0 glass rounded-t-2xl">
          <h2 className="font-serif text-xl text-[var(--cream)]">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded text-[rgba(245,240,232,0.3)] hover:text-[var(--cream)] transition-colors"><X size={18} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

const IC = "w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.14)] rounded-sm px-4 py-2.5 text-sm text-[var(--cream)] placeholder-[rgba(245,240,232,0.2)] focus:outline-none focus:border-[rgba(201,168,76,0.5)] transition-colors";
const LC = "text-[10px] tracking-widest uppercase text-[rgba(245,240,232,0.35)] block mb-2";

/* ─── Dashboard ────────────────────────────────────────── */
export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState("overview");
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [toast, setToast] = useState("");

  // Product modal state
  const [pModal, setPModal] = useState(false);
  const [editP, setEditP] = useState<any>(null);
  const [pForm, setPForm] = useState({ name: "", description: "", category: "", image_url: "", active: true });

  // Category modal state
  const [cModal, setCModal] = useState(false);
  const [editC, setEditC] = useState<any>(null);
  const [cForm, setCForm] = useState({ name: "" });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null); setChecking(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const loadAll = async () => {
    setLoading(true);
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from("products").select("*").order("category").order("name"),
      supabase.from("categories").select("*").order("name"),
    ]);
    if (prods) setProducts(prods);
    if (cats) setCategories(cats);
    setLoading(false);
  };

  useEffect(() => { if (user) loadAll(); }, [user]);

  if (checking) return (
    <div className="min-h-screen flex items-center justify-center bg-[#060606]">
      <div className="w-8 h-8 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!user) return <LoginScreen onLogin={setUser} />;

  const signOut = async () => { await supabase.auth.signOut(); setUser(null); };

  // Products CRUD
  const openNewP = () => {
    setEditP(null);
    setPForm({ name: "", description: "", category: categories[0]?.name ?? "", image_url: "", active: true });
    setPModal(true);
  };
  const openEditP = (p: any) => {
    setEditP(p);
    setPForm({ name: p.name, description: p.description ?? "", category: p.category, image_url: p.image_url ?? "", active: p.active });
    setPModal(true);
  };
  const saveP = async () => {
    if (!pForm.name || !pForm.category) return;
    setSaving(true);
    const payload = { ...pForm };
    if (editP) {
      await supabase.from("products").update(payload).eq("id", editP.id);
      notify("Product updated ✓");
    } else {
      await supabase.from("products").insert([payload]);
      notify("Product created ✓");
    }
    setPModal(false); loadAll(); setSaving(false);
  };
  const deleteP = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    notify("Product deleted."); loadAll();
  };

  // Categories CRUD
  const openNewC = () => { setEditC(null); setCForm({ name: "" }); setCModal(true); };
  const openEditC = (c: any) => { setEditC(c); setCForm({ name: c.name }); setCModal(true); };
  const saveC = async () => {
    if (!cForm.name) return;
    setSaving(true);
    if (editC) {
      await supabase.from("categories").update(cForm).eq("id", editC.id);
      notify("Category updated ✓");
    } else {
      await supabase.from("categories").insert([cForm]);
      notify("Category created ✓");
    }
    setCModal(false); loadAll(); setSaving(false);
  };
  const deleteC = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    await supabase.from("categories").delete().eq("id", id);
    notify("Category deleted."); loadAll();
  };

  const filteredP = products.filter(p => {
    const s = p.name.toLowerCase().includes(search.toLowerCase());
    const c = filterCat ? p.category === filterCat : true;
    return s && c;
  });

  const TABS = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "categories", label: "Categories", icon: Tag },
  ];

  return (
    <div className="min-h-screen flex bg-[#060606]">
      {/* ── Sidebar ── */}
      <aside className="w-60 flex-shrink-0 hidden md:flex flex-col border-r border-[rgba(201,168,76,0.1)]"
        style={{ background: "linear-gradient(180deg,#0a0a0a 0%,#080808 100%)" }}>
        <div className="p-6 border-b border-[rgba(201,168,76,0.08)]">
          <img src="/assets/logo-D3ITjQ6-.jpeg" alt="Logo" className="h-10 rounded mb-3 object-contain" />
          <p className="font-serif text-base text-[var(--cream)]">Admin CMS</p>
          <p className="text-[10px] text-[rgba(245,240,232,0.25)] mt-0.5 truncate">{user.email}</p>
        </div>
        <nav className="flex-1 p-4">
          <ul className="flex flex-col gap-1">
            {TABS.map(t => (
              <li key={t.id}>
                <button onClick={() => setTab(t.id)}
                  className={`admin-nav-item w-full ${tab === t.id ? "active" : ""}`}>
                  <t.icon size={16} /> {t.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-[rgba(201,168,76,0.08)]">
          <button onClick={signOut}
            className="admin-nav-item w-full hover:text-red-400 hover:bg-red-400/5">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-auto">
        {/* Topbar */}
        <div className="sticky top-0 z-20 glass border-b border-[rgba(201,168,76,0.1)] px-6 py-4 flex items-center justify-between">
          {/* Mobile tabs */}
          <div className="flex md:hidden gap-1">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`p-2 rounded-md transition-colors ${tab === t.id ? "text-[var(--gold)]" : "text-[rgba(245,240,232,0.3)]"}`}>
                <t.icon size={18} />
              </button>
            ))}
          </div>
          <h1 className="hidden md:block font-serif text-2xl font-light text-[var(--cream)] capitalize">
            {TABS.find(t => t.id === tab)?.label}
          </h1>
          <div className="flex items-center gap-3">
            {toast && (
              <div className="flex items-center gap-2 bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.3)] rounded-sm px-3 py-2">
                <Check size={13} className="text-[var(--gold)]" />
                <span className="text-xs text-[var(--gold)]">{toast}</span>
              </div>
            )}
            <button onClick={signOut} className="md:hidden p-2 text-[rgba(245,240,232,0.3)] hover:text-red-400 transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* ── OVERVIEW ── */}
          {tab === "overview" && (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Total Products", val: products.length },
                  { label: "Active Products", val: products.filter(p => p.active).length },
                  { label: "Categories", val: categories.length },
                  { label: "Hidden", val: products.filter(p => !p.active).length },
                ].map(s => (
                  <div key={s.label} className="glass-gold rounded-xl p-6">
                    <p className="text-[10px] tracking-widest uppercase text-[rgba(245,240,232,0.35)] mb-2">{s.label}</p>
                    <p className="font-serif text-4xl text-gold-shimmer">{s.val}</p>
                  </div>
                ))}
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass rounded-xl border border-[rgba(201,168,76,0.1)] p-6">
                  <h3 className="font-serif text-lg text-[var(--cream)] mb-5">Recent Products</h3>
                  <ul className="divide-y divide-[rgba(201,168,76,0.07)]">
                    {products.slice(0, 6).map(p => (
                      <li key={p.id} className="flex items-center justify-between py-3">
                        <div>
                          <p className="text-sm text-[var(--cream)]">{p.name}</p>
                          <p className="text-xs text-[rgba(245,240,232,0.3)]">{p.category}</p>
                        </div>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full tracking-wide ${p.active ? "bg-green-500/10 text-green-400" : "bg-white/5 text-[rgba(245,240,232,0.3)]"}`}>
                          {p.active ? "Active" : "Hidden"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="glass rounded-xl border border-[rgba(201,168,76,0.1)] p-6">
                  <h3 className="font-serif text-lg text-[var(--cream)] mb-5">Categories</h3>
                  <ul className="divide-y divide-[rgba(201,168,76,0.07)]">
                    {categories.map(c => (
                      <li key={c.id} className="flex items-center justify-between py-3">
                        <p className="text-sm text-[var(--cream)]">{c.name}</p>
                        <span className="text-xs text-[rgba(245,240,232,0.3)]">{products.filter(p => p.category === c.name).length} products</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ── PRODUCTS ── */}
          {tab === "products" && (
            <div>
              <div className="flex flex-col md:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(201,168,76,0.4)]" />
                  <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search products..." className={`${IC} pl-9`} />
                </div>
                <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className={`${IC} md:w-48`}>
                  <option value="">All Categories</option>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
                <button onClick={openNewP} className="btn-gold flex items-center gap-2 px-6 py-2.5 rounded-md text-sm whitespace-nowrap">
                  <Plus size={16} /> Add Product
                </button>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1,2,3].map(i => <div key={i} className="h-48 bg-[#111] rounded-xl animate-pulse" />)}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredP.map(p => (
                    <div key={p.id} className="luxury-card rounded-xl overflow-hidden">
                      <div className="relative h-36 bg-[#111]">
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[rgba(201,168,76,0.12)]">
                            <Package size={28} strokeWidth={1} />
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${p.active ? "bg-green-500/20 text-green-400" : "bg-white/10 text-[rgba(245,240,232,0.3)]"}`}>
                            {p.active ? "Active" : "Hidden"}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm font-medium text-[var(--cream)] truncate mb-0.5">{p.name}</p>
                        <p className="text-xs text-[rgba(245,240,232,0.35)] mb-3">{p.category}</p>
                        <div className="flex gap-2">
                          <button onClick={() => openEditP(p)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-[rgba(201,168,76,0.25)] text-[var(--gold)] rounded-sm text-xs hover:bg-[rgba(201,168,76,0.08)] transition-colors">
                            <Edit2 size={11} /> Edit
                          </button>
                          <button onClick={() => deleteP(p.id)}
                            className="flex items-center justify-center gap-1.5 px-3 py-2 border border-red-500/25 text-red-400 rounded-sm text-xs hover:bg-red-500/8 transition-colors">
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredP.length === 0 && (
                    <div className="col-span-full text-center py-16 text-[rgba(245,240,232,0.2)]">
                      <Package size={40} className="mx-auto mb-4 opacity-30" strokeWidth={1} />
                      <p className="font-serif text-xl">No products found</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── CATEGORIES ── */}
          {tab === "categories" && (
            <div>
              <div className="flex justify-end mb-6">
                <button onClick={openNewC} className="btn-gold flex items-center gap-2 px-6 py-2.5 rounded-md text-sm">
                  <Plus size={16} /> Add Category
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map(c => (
                  <div key={c.id} className="glass-gold rounded-xl p-6 border border-[rgba(201,168,76,0.1)]">
                    <h3 className="font-serif text-xl text-[var(--cream)] mb-1">{c.name}</h3>
                    <p className="text-xs text-[var(--gold)] tracking-wider mb-4">
                      {products.filter(p => p.category === c.name).length} products
                    </p>
                    <div className="flex gap-2">
                      <button onClick={() => openEditC(c)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-[rgba(201,168,76,0.25)] text-[var(--gold)] rounded-sm text-xs hover:bg-[rgba(201,168,76,0.08)] transition-colors">
                        <Edit2 size={11} /> Edit
                      </button>
                      <button onClick={() => deleteC(c.id)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 border border-red-500/25 text-red-400 rounded-sm text-xs hover:bg-red-500/8 transition-colors">
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Product Modal ── */}
      <Modal open={pModal} onClose={() => setPModal(false)} title={editP ? "Edit Product" : "New Product"}>
        <div className="flex flex-col gap-4">
          <div><label className={LC}>Product Name *</label>
            <input className={IC} value={pForm.name} onChange={e => setPForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Rainfall Shower Head" /></div>
          <div><label className={LC}>Description</label>
            <textarea className={`${IC} resize-none h-20`} value={pForm.description} onChange={e => setPForm(f => ({ ...f, description: e.target.value }))} placeholder="Product description..." /></div>
          <div><label className={LC}>Category *</label>
            <select className={IC} value={pForm.category} onChange={e => setPForm(f => ({ ...f, category: e.target.value }))}>
              <option value="">Select category</option>
              {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select></div>
          <div><label className={LC}>Product Image</label>
            <ImageUpload current={pForm.image_url} onUpload={url => setPForm(f => ({ ...f, image_url: url }))} /></div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="active" checked={pForm.active} onChange={e => setPForm(f => ({ ...f, active: e.target.checked }))} className="accent-[var(--gold)] w-4 h-4" />
            <label htmlFor="active" className="text-sm text-[rgba(245,240,232,0.5)]">Visible on website</label>
          </div>
          <div className="flex gap-3 pt-4 border-t border-[rgba(201,168,76,0.1)]">
            <button onClick={() => setPModal(false)} className="flex-1 btn-outline py-3 rounded-md text-sm">Cancel</button>
            <button onClick={saveP} disabled={saving} className="flex-1 btn-gold py-3 rounded-md text-sm flex items-center justify-center gap-2 disabled:opacity-50">
              {saving ? <div className="w-4 h-4 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" /> : <Check size={15} />}
              {editP ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Category Modal ── */}
      <Modal open={cModal} onClose={() => setCModal(false)} title={editC ? "Edit Category" : "New Category"}>
        <div className="flex flex-col gap-4">
          <div><label className={LC}>Category Name *</label>
            <input className={IC} value={cForm.name} onChange={e => setCForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Bathroom Fixtures" /></div>
          <div className="flex gap-3 pt-4 border-t border-[rgba(201,168,76,0.1)]">
            <button onClick={() => setCModal(false)} className="flex-1 btn-outline py-3 rounded-md text-sm">Cancel</button>
            <button onClick={saveC} disabled={saving} className="flex-1 btn-gold py-3 rounded-md text-sm flex items-center justify-center gap-2 disabled:opacity-50">
              {saving ? <div className="w-4 h-4 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" /> : <Check size={15} />}
              {editC ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
