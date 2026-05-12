import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Eye, EyeOff, LogIn } from 'lucide-react'

export default function AdminLogin() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await signIn(email, password)
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-obsidian-900 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(230,184,0,0.05) 0%, transparent 70%)',
      }} />
      <div className="absolute inset-0 opacity-5">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute w-px bg-gold/30" style={{
            left: `${(i + 1) * 5}%`, height: '100%',
            background: 'linear-gradient(to bottom, transparent, rgba(230,184,0,0.3), transparent)'
          }} />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="glass rounded-2xl p-10 border border-gold/20 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-10">
            <img src="/logo.jpeg" alt="Amazing Tools" className="h-16 w-auto mx-auto rounded mb-4" />
            <h1 className="font-display text-3xl text-white">Admin Portal</h1>
            <p className="font-body text-xs text-white/30 tracking-widest uppercase mt-2">Amazing Tools Company</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="font-body text-xs tracking-widest uppercase text-white/40 block mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 font-body text-sm text-white focus:outline-none focus:border-gold/60 transition-colors"
                placeholder="admin@amazingtools.rw"
              />
            </div>

            <div>
              <label className="font-body text-xs tracking-widest uppercase text-white/40 block mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 pr-12 font-body text-sm text-white focus:outline-none focus:border-gold/60 transition-colors"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-sm px-4 py-3">
                <p className="font-body text-xs text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-4 rounded-sm font-body text-sm tracking-widest uppercase flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-obsidian-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <><LogIn size={16} /> Sign In</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
