import React from 'react';

export default function CartDrawer({ isOpen, cart, onClose, onRemove, onUpdateQuantity, onCheckout, onShare }) {
  const total = cart.items.reduce((sum, item) => sum + item.quantity * item.promoPrice, 0);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <aside
        className={`fixed right-0 top-0 z-50 flex h-[100dvh] w-full max-w-md transform flex-col overflow-hidden bg-white dark:bg-black shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-4 md:px-6 py-4 md:py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Tu carrito</p>
            <h2 className="mt-1 md:mt-2 text-xl md:text-2xl font-semibold text-black dark:text-white">Shopping Cart</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 md:px-4 py-2 text-sm font-semibold text-black dark:text-white transition hover:bg-zinc-100 dark:hover:bg-zinc-700"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 space-y-3 md:space-y-4 overflow-y-auto px-4 md:px-6 py-4 md:py-6">
          {cart.items.length === 0 ? (
            <div className="rounded-2xl md:rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-4 md:p-6 text-zinc-600 dark:text-zinc-400">
              <p className="text-sm">Tu carrito está vacío.</p>
            </div>
          ) : (
            cart.items.map((item, index) => (
              <div key={`${item.productId}-${item.size}-${index}`} className="flex items-center gap-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-3 md:p-4">
                <img
                  src={item.image || `/${item.name.toLowerCase().replace(/ /g, '')}.jfif`}
                  alt={item.name}
                  className="h-14 w-14 md:h-16 md:w-16 rounded-2xl md:rounded-3xl object-cover"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80'; }}
                />
                <div className="flex-1">
                  <p className="font-semibold text-black dark:text-white text-sm md:text-base">{item.name}</p>
                  <p className="mt-0.5 text-xs md:text-sm text-zinc-600 dark:text-zinc-400">Talla: {item.size}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(item.productId, item.size, -1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-700 text-black dark:text-white transition hover:bg-zinc-100 dark:hover:bg-zinc-700"
                    >
                      -
                    </button>
                    <span className="w-6 md:w-8 text-center text-sm font-medium dark:text-white">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.productId, item.size, 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-700 text-black dark:text-white transition hover:bg-zinc-100 dark:hover:bg-zinc-700"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">${(item.quantity * item.promoPrice).toFixed(2)}</p>
                  <button
                    onClick={() => onRemove(item.productId, item.size)}
                    className="mt-1 md:mt-2 text-xs uppercase tracking-[0.22em] text-black dark:text-white transition hover:text-zinc-700 dark:hover:text-zinc-300"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-zinc-200 dark:border-zinc-800 px-4 md:px-6 py-4 md:py-6">
          <div className="mb-4 md:mb-5 flex items-center justify-between text-sm uppercase tracking-[0.3em] text-zinc-500">
            <span>Total</span>
            <span className="text-xl md:text-2xl font-semibold text-black dark:text-white">${total.toFixed(2)}</span>
          </div>
          <button
            onClick={onCheckout}
            className="w-full rounded-full bg-black dark:bg-white px-5 py-3 md:py-4 text-sm md:text-base font-semibold text-white dark:text-black transition hover:bg-zinc-900 dark:hover:bg-zinc-200 touch-manipulation active:scale-95"
          >
            Finalizar
          </button>
          <button
            onClick={() => onShare(cart.items.map(item => `${item.quantity}x ${item.name} (${item.size})`).join(', '), total)}
            className="mt-2 md:mt-3 w-full rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-5 py-3 md:py-4 text-sm md:text-base font-semibold text-black dark:text-white transition hover:bg-zinc-100 dark:hover:bg-zinc-800 touch-manipulation active:scale-95"
          >
            Compartir
          </button>
        </div>
      </aside>
    </>
  );
}