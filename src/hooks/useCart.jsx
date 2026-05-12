import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('atc_cart') || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('atc_cart', JSON.stringify(items))
  }, [items])

  const addItem = (product) => {
    setItems(prev => {
      if (prev.find(i => i.id === product.id)) return prev
      return [...prev, product]
    })
  }

  const removeItem = (id) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const clearCart = () => setItems([])

  const isInCart = (id) => items.some(i => i.id === id)

  const requestQuote = () => {
    const number = import.meta.env.VITE_WHATSAPP_NUMBER || '250700000000'
    const productList = items.map((p, i) => `${i + 1}. ${p.name} (${p.category_name || p.category_id})`).join('\n')
    const msg = `Hello Amazing Tools Company! 👋\n\nI would like to request a quote for the following products:\n\n${productList}\n\nPlease provide pricing and availability. Thank you!`
    const url = `https://wa.me/${number}?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank')
  }

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, isInCart, requestQuote, count: items.length }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
