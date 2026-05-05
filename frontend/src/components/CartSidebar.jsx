import React from 'react';

export default function CartSidebar({ cart, onRemove, onShare, onCheckout }) {
  const total = cart.items.reduce((sum, item) => sum + item.quantity * item.promoPrice, 0);
  const summary = cart.items.map(item => `${item.quantity}x ${item.name} (${item.size})`).join(', ');

  return (
    <aside className="xl:sticky xl:top-8 max-h-[calc(100vh-4rem)] overflow-hidden rounded-[2rem] border border-[#ddcfb8] bg-white/95 p-6 shadow-soft">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-[#8b6e5b]">Tu carrito</p>
        <h2 className="text-2xl font-semibold text-[#2b1b14]">Resumen de estilo</h2>
      </div>
      <div className="space-y-4 overflow-y-auto pr-1 pb-2" style={{ maxHeight: 'calc(100vh - 22rem)' }}>
        {cart.items.length === 0 ? (
          <p className="text-[#6d5649]">No hay productos seleccionados aún.</p>
        ) : (
          cart.items.map((item, index) => (
            <div key={`${item.productId}-${item.size}-${index}`} className="rounded-3xl border border-[#e8d3bf] bg-[#fff5ef] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-[#3b2b22]">{item.name}</p>
                  <p className="text-sm text-[#6d5649]">Talla: {item.size}</p>
                  <p className="text-sm text-[#6d5649]">Cantidad: {item.quantity}</p>
                </div>
                <button
                  onClick={() => onRemove(item.productId, item.size)}
                  className="text-sm text-[#b74f40] transition hover:text-[#a34034]"
                >
                  Eliminar
                </button>
              </div>
              <p className="mt-3 text-right text-xl font-semibold text-[#9b7a62]">${(item.quantity * item.promoPrice).toFixed(2)}</p>
            </div>
          ))
        )}
      </div>
      <div className="rounded-3xl bg-[#fff4ec] p-4">
        <p className="text-sm uppercase tracking-[0.2em] text-[#8b6e5b]">Total</p>
        <p className="mt-2 text-3xl font-semibold text-[#2b1b14]">${total.toFixed(2)}</p>
      </div>
      <div className="space-y-3">
        <button
          onClick={() => onShare(summary, total)}
          className="w-full rounded-3xl bg-[#f3e3d0] px-5 py-3 text-sm font-semibold text-[#3b2b22] transition hover:bg-[#e8d3bf]"
        >
          Compartir por WhatsApp
        </button>
        <button
          onClick={onCheckout}
          className="w-full rounded-3xl bg-[#d7b49e] px-5 py-3 text-sm font-semibold text-[#3b2b22] transition hover:bg-[#c99d88]"
        >
          Transferencia bancaria
        </button>
      </div>
    </aside>
  );
}
