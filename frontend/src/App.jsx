import { useEffect, useMemo, useRef, useState } from 'react';
import { Routes, Route, useSearchParams, Link, useNavigate } from 'react-router-dom';
import ProductCard from './components/ProductCard.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import Admin, { AdminLogin } from './components/Admin.jsx';

const API_BASE = 'https://dinoshop-web-fp3q.onrender.com/api';

function OrderCheck() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) {
      setError('ID de orden no proporcionado');
      setLoading(false);
      return;
    }
    fetch(`${API_BASE}/orders/${orderId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Orden no encontrada');
        return res.json();
      })
      .then(setOrder)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [orderId]);

  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PAID: 'bg-green-100 text-green-800',
    SHIPPED: 'bg-blue-100 text-blue-800',
    DELIVERED: 'bg-gray-100 text-gray-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white px-4 py-20 text-center">
        <div className="animate-pulse">Cargando orden...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white px-4 py-20">
        <div className="mx-auto max-w-md rounded-[2rem] border border-red-200 bg-red-50 p-8 text-center">
          <h1 className="text-2xl font-semibold text-red-600">Orden no encontrada</h1>
          <p className="mt-2 text-zinc-600">{error}</p>
          <Link to="/" className="mt-6 inline-block rounded-full bg-black px-6 py-3 text-sm font-semibold text-white">
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-20">
      <div className="mx-auto max-w-md rounded-[2rem] border border-zinc-200 bg-white p-8">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Estado de tu pedido</p>
          <h1 className="mt-2 text-3xl font-semibold text-black">{order.orderNumber}</h1>
          <span className={`mt-3 inline-block rounded-full px-4 py-1 text-sm font-medium ${statusColors[order.status]}`}>
            {order.status}
          </span>
        </div>

        <div className="mt-6 space-y-4 rounded-[1.5rem] border border-zinc-200 bg-zinc-50 p-6">
          <h2 className="font-semibold text-black">Detalles del pedido</h2>
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-zinc-600">{item.quantity}x {item.productName} ({item.size})</span>
              <span className="font-medium text-black">${item?.price?.toFixed(2) || '0.00'}</span>
            </div>
          ))}
          <div className="border-t border-zinc-200 pt-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${order?.total?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-zinc-500">
          <p>Fecha de creación: {new Date(order.createdAt).toLocaleDateString('es-MX')}</p>
        </div>

        <Link to="/" className="mt-6 block w-full rounded-full bg-black px-5 py-4 text-center text-sm font-semibold text-white transition hover:bg-zinc-900">
          Volver a la tienda
        </Link>
      </div>
    </div>
  );
}

function App() {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartPulse, setCartPulse] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [view, setView] = useState('home');
  const [clientForm, setClientForm] = useState({ name: '', phone: '', email: '' });
  const [deliveryForm, setDeliveryForm] = useState({ type: 'PICKUP', address: '' });
  const [paymentMethod, setPaymentMethod] = useState('transferencia');
  const [orderResult, setOrderResult] = useState(null);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const cartPulseTimer = useRef(null);
  const mainRef = useRef(null);

  const handleSkipToMain = () => { mainRef.current?.focus(); };

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newValue = !prev;
      localStorage.setItem('darkMode', String(newValue));
      return newValue;
    });
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setLoadingProducts(true);
    fetch(`${API_BASE}/products`)
      .then((res) => {
        if (!res.ok) throw new Error('Error del servidor');
        return res.json();
      })
      .then(setProducts)
      .catch((err) => {
        console.error('Error cargando productos:', err);
        setProductsError(err.message);
      })
      .finally(() => setLoadingProducts(false));
  }, []);

  const handleAddProduct = (product, selectedSize) => {
    const item = { productId: product.id, size: selectedSize || product.size, quantity: 1, name: product.name, promoPrice: product.promoPrice, image: product.image || product.imageUrl };
    setCart((prev) => {
      const exists = prev.find((entry) => entry.productId === product.id && entry.size === item.size);
      if (exists) return prev.map((entry) => entry.productId === product.id && entry.size === item.size ? { ...entry, quantity: entry.quantity + 1 } : entry);
      return [...prev, item];
    });
    setCartPulse(true);
    window.clearTimeout(cartPulseTimer.current);
    cartPulseTimer.current = window.setTimeout(() => setCartPulse(false), 300);
  };

  const handleUpdateQuantity = (productId, size, delta) => {
    setCart((prev) => {
      return prev.map((entry) => {
        if (entry.productId === productId && entry.size === size) {
          const newQty = entry.quantity + delta;
          if (newQty <= 0) return null;
          return { ...entry, quantity: newQty };
        }
        return entry;
      }).filter(Boolean);
    });
  };

  const handleRemove = (productId, size) => {
    setCart((prev) => prev.filter((item) => !(item.productId === productId && item.size === size)));
  };

  const handleShare = (summary, total) => {
    const message = encodeURIComponent(`Hola! Te comparto mi carrito:\n${summary}\nTotal: $${total.toFixed(2)}`);
    window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setCreatingOrder(true);
    try {
      const items = cart.map(item => ({ productId: item.productId, quantity: item.quantity, size: item.size }));
      const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: clientForm.name || 'Cliente',
          clientPhone: clientForm.phone || 'Sin teléfono',
          clientEmail: clientForm.email || 'Sin email',
          paymentMethod: paymentMethod,
          deliveryType: deliveryForm.type,
          deliveryAddress: deliveryForm.type === 'DELIVERY' ? deliveryForm.address : '',
          items,
        }),
      });
      const order = await response.json();
      setOrderResult(order);
      setShowTransferModal(true);
    } catch (err) {
      console.error('Error al crear orden:', err);
    } finally {
      setCreatingOrder(false);
    }
  };

  const featured = useMemo(() => products.slice(0, 4), [products]);

  return (
    <Routes>
      <Route path="/check" element={<OrderCheck />} />
      <Route path="/admin/login" element={<AdminLogin onLogin={() => {}} />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={
        <div className="min-h-screen bg-white dark:bg-black px-4 text-black dark:text-white md:px-8">
          <a href="#main-content" onClick={handleSkipToMain} className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-black focus:text-white focus:px-4 focus:py-2 focus:rounded-full">Saltar al contenido principal</a>
          <nav role="navigation" aria-label="Navegación principal" className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${scrolled ? 'bg-white/95 dark:bg-black/95 shadow-sm' : 'bg-transparent'}`}>
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
              <button onClick={() => setView('home')} className="text-sm font-semibold uppercase tracking-[0.35em] text-black dark:text-white transition hover:text-zinc-700">DinoShop</button>
              <div className="flex items-center gap-3 md:gap-4">
                <button onClick={toggleDarkMode} aria-label={darkMode ? 'Modo claro' : 'Modo oscuro'} className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white transition-transform duration-400 hover:scale-110">
                  {darkMode ? (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707.707M12 7a5 5 0 100 10 5 5 0 000-10z" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                    </svg>
                  )}
                </button>
                <button onClick={() => setDrawerOpen(true)} aria-label={`Abrir carrito, ${cart.length} productos`} className={`relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white transition-transform duration-400 ease-out hover:bg-zinc-100 dark:hover:bg-zinc-700 ${cartPulse ? 'scale-125' : 'scale-100'}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5"><path d="M6 6h15l-1.5 9h-12L6 6z" /><path d="M9 22a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" /></svg>
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                      {cart.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </nav>

          {view === 'home' ? (
            <header aria-label="Página de inicio" className="relative overflow-hidden bg-white dark:bg-black pt-16 pb-2 -mx-4 md:mx-0 md:pt-28 md:pb-8">
              <div className="relative flex flex-col md:flex-row min-h-[65vh] md:min-h-[80vh]">
                <div onClick={() => setView('mujer')} className="group cursor-pointer relative flex-1 overflow-hidden border-[0.5px] border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black h-[65vh] md:h-[80vh]">
                  <div className="absolute inset-0 overflow-hidden bg-white dark:bg-black"><img src="/the Oliver set.jfif" alt="Mujer" className="h-full w-full object-cover object-center transition duration-[1200ms] ease-out filter grayscale group-hover:grayscale-0 group-hover:scale-105" /></div>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-5xl md:text-5xl font-semibold tracking-tight sm:text-6xl text-white text-center" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>MUJER</h1>
                  </div>
                </div>
                <div onClick={() => setView('hombre')} className="group cursor-pointer relative flex-1 overflow-hidden border-[0.5px] border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black h-[65vh] md:h-[80vh]">
                  <div className="absolute inset-0 overflow-hidden bg-white dark:bg-black"><img src="/descarga.jfif" alt="Hombre" className="h-full w-full object-cover object-top transition duration-[1200ms] ease-out filter grayscale group-hover:grayscale-0 group-hover:scale-105" /></div>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-5xl md:text-5xl font-semibold tracking-tight sm:text-6xl text-white text-center" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>HOMBRE</h1>
                  </div>
                </div>
              </div>
            </header>
) : view === 'mujer' ? (
            <main id="main-content" role="main" aria-label="Colección de mujer" className="mx-auto max-w-7xl pt-16 md:pt-24 pb-8 px-3 md:px-8">
              <div className="space-y-6 md:space-y-8">
                <div className="flex flex-col gap-3 md:gap-4 rounded-2xl md:rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-5 md:p-8">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">Mujer</p>
                        <h2 className="mt-1 md:mt-2 text-2xl md:text-4xl font-semibold text-black dark:text-white">Colección de temporada</h2>
                        <p className="mt-2 md:mt-3 text-sm md:text-base leading-6 text-zinc-700 dark:text-zinc-300">Descubre nuestra selección.</p>
                      </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {loadingProducts ? (
                    <p className="col-span-full text-center text-zinc-500 py-8">Cargando productos...</p>
                  ) : productsError ? (
                    <p className="col-span-full text-center text-red-500 py-8">Error: {productsError}</p>
                  ) : products.length === 0 ? (
                    <p className="col-span-full text-center text-zinc-500 py-8">No hay productos disponibles</p>
                  ) : (
                    products.map((p) => (<ProductCard key={p.id} item={p} onAdd={handleAddProduct} />))
                  )}
                </div>
              </div>
            </main>
          ) : (
            <main id="main-content" role="main" aria-label="Sección de hombre" className="mx-auto max-w-7xl pt-24 py-10">
              <div className="space-y-8">
                <div className="flex flex-col gap-4 rounded-[2.5rem] border border-zinc-200 bg-black/5 p-8">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
<div>
                       <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">Hombre</p>
                       <h2 className="mt-2 text-4xl font-semibold text-black">Próximamente</h2>
                       <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-700">Próximamente: Nueva línea masculina.</p>
                     </div>
                   </div>
                </div>
              </div>
            </main>
          )}

          <CartDrawer isOpen={drawerOpen} cart={{ items: cart }} onClose={() => setDrawerOpen(false)} onRemove={handleRemove} onUpdateQuantity={handleUpdateQuantity} onCheckout={() => setShowConfirmModal(true)} onShare={handleShare} />

          {showConfirmModal && cart.length > 0 && (
            <div role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title" className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
              <div className="w-full max-w-md rounded-2xl md:rounded-[2rem] bg-white p-5 md:p-8 shadow-2xl">
                <div className="text-center">
                  <p className="text-sm uppercase tracking-[0.3em] text-black">Confirmar compra</p>
                  <h3 id="confirm-modal-title" className="mt-2 text-lg md:text-xl font-semibold text-black">¿Confirmar tu pedido?</h3>
                  <p className="mt-2 md:mt-3 text-zinc-600">Total: <span className="font-semibold text-black">${cart.reduce((sum, item) => sum + (item.promoPrice || 0) * item.quantity, 0).toFixed(2)}</span></p>
                </div>
                <div className="mt-5 md:mt-6 flex gap-3">
                  <button onClick={() => { setShowConfirmModal(false); setShowTransferModal(true); }} className="flex-1 rounded-full bg-black px-5 py-3 md:py-4 text-sm font-semibold text-white transition hover:bg-zinc-900 active:scale-95">Sí, continuar</button>
                  <button onClick={() => setShowConfirmModal(false)} className="flex-1 rounded-full border border-zinc-200 px-5 py-3 md:py-4 text-sm font-semibold text-black transition hover:bg-zinc-100 active:scale-95">Cancelar</button>
                </div>
              </div>
            </div>
          )}

          {showTransferModal && (
            <div role="dialog" aria-modal="true" aria-labelledby="transfer-modal-title" className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-3 md:p-4 overflow-y-auto">
              <div className="w-full max-w-2xl rounded-2xl md:rounded-[2rem] bg-white p-5 md:p-8 shadow-2xl my-4">
                {!orderResult ? (
                  <>
                    <div className="flex items-start justify-between gap-4">
                      <div><p className="text-sm uppercase tracking-[0.3em] text-black">Datos del cliente</p><h3 id="transfer-modal-title" className="mt-1 md:mt-2 text-xl md:text-2xl font-semibold text-black">Completa tus datos</h3></div>
                      <button onClick={() => { setShowTransferModal(false); setOrderResult(null); }} className="rounded-full border border-zinc-200 bg-white px-3 md:px-4 py-2 text-sm font-semibold text-black transition hover:bg-zinc-100">✕</button>
                    </div>
                    <div className="mt-5 md:mt-6 space-y-3 md:space-y-4">
                      <input type="text" placeholder="Tu nombre" value={clientForm.name} onChange={(e) => setClientForm(prev => ({ ...prev, name: e.target.value }))} className="w-full rounded-xl md:rounded-2xl border border-zinc-200 bg-white px-4 py-3 md:py-4 text-black placeholder-zinc-400 text-base touch-manipulation" />
                      <input type="tel" placeholder="Tu teléfono (WhatsApp)" value={clientForm.phone} onChange={(e) => setClientForm(prev => ({ ...prev, phone: e.target.value }))} className="w-full rounded-xl md:rounded-2xl border border-zinc-200 bg-white px-4 py-3 md:py-4 text-black placeholder-zinc-400 text-base touch-manipulation" />
                      <input type="email" placeholder="Tu correo electrónico" value={clientForm.email} onChange={(e) => setClientForm(prev => ({ ...prev, email: e.target.value }))} className="w-full rounded-xl md:rounded-2xl border border-zinc-200 bg-white px-4 py-3 md:py-4 text-black placeholder-zinc-400 text-base touch-manipulation" />
                      
                      <div className="space-y-2 md:space-y-3 pt-1 md:pt-2">
                        <p className="text-sm font-medium text-black">Forma de pago:</p>
                        <div className="flex gap-2">
                          <button onClick={() => setPaymentMethod('transferencia')} className={`flex-1 rounded-xl border px-3 md:px-4 py-3 text-sm touch-manipulation ${paymentMethod === 'transferencia' ? 'border-black bg-black text-white' : 'border-zinc-200 text-black'}`}>Transferencia</button>
                          <button onClick={() => setPaymentMethod('contraentrega')} className={`flex-1 rounded-xl border px-3 md:px-4 py-3 text-sm touch-manipulation ${paymentMethod === 'contraentrega' ? 'border-black bg-black text-white' : 'border-zinc-200 text-black'}`}>Contraentrega</button>
                        </div>
                      </div>
                      
                      <div className="space-y-2 md:space-y-3 pt-1 md:pt-2">
                        <p className="text-sm font-medium text-black">Tipo de entrega:</p>
                        <div className="flex gap-2">
                          <button onClick={() => setDeliveryForm(prev => ({ ...prev, type: 'PICKUP' }))} className={`flex-1 rounded-xl border px-2 md:px-4 py-3 text-xs md:text-sm touch-manipulation ${deliveryForm.type === 'PICKUP' ? 'border-black bg-black text-white' : 'border-zinc-200 text-black'}`}>Punto</button>
                          <button onClick={() => setDeliveryForm(prev => ({ ...prev, type: 'DELIVERY' }))} className={`flex-1 rounded-xl border px-2 md:px-4 py-3 text-xs md:text-sm touch-manipulation ${deliveryForm.type === 'DELIVERY' ? 'border-black bg-black text-white' : 'border-zinc-200 text-black'}`}>Domicilio</button>
                        </div>
                      </div>
                      
                      {deliveryForm.type === 'DELIVERY' && (
                        <input type="text" placeholder="Colonia / barrio" value={deliveryForm.address} onChange={(e) => setDeliveryForm(prev => ({ ...prev, address: e.target.value }))} className="w-full rounded-xl md:rounded-2xl border border-zinc-200 bg-white px-4 py-3 md:py-4 text-black placeholder-zinc-400 text-base touch-manipulation" />
                      )}
                      
                      <button onClick={handleCheckout} disabled={creatingOrder || !clientForm.name || (deliveryForm.type === 'DELIVERY' && !deliveryForm.address)} className="w-full rounded-full bg-black px-5 py-4 md:py-5 text-base font-semibold text-white transition hover:bg-zinc-900 disabled:opacity-50 touch-manipulation active:scale-95">{creatingOrder ? 'Creando orden...' : 'Continuar'}</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-4">
                      <div><p className="text-sm uppercase tracking-[0.3em] text-black">Orden creada</p><h3 id="transfer-modal-title" className="mt-1 md:mt-2 text-xl md:text-2xl font-semibold text-black">{orderResult.orderNumber}</h3></div>
                      <button onClick={() => { setShowTransferModal(false); setOrderResult(null); setClientForm({ name: '', phone: '', email: '' }); setCart([]); setPaymentMethod('transferencia'); setDeliveryForm({ type: 'PICKUP', address: '' }); }} className="rounded-full border border-zinc-200 bg-white px-3 md:px-4 py-2 text-sm font-semibold text-black transition hover:bg-zinc-100">✕</button>
                    </div>
                    
                    {paymentMethod === 'contraentrega' && (
                      <div className="mt-4 md:mt-6 rounded-xl md:rounded-[1.75rem] border border-yellow-200 bg-yellow-50 p-4 md:p-6">
                        <p className="text-base md:text-lg font-semibold text-yellow-800">Pagar al recibir</p>
                        <p className="mt-1 md:mt-2 text-sm text-yellow-700">El pago se realizará al momento de la entrega.</p>
                      </div>
                    )}
                    
                    {paymentMethod === 'transferencia' && (
                      <div className="mt-4 md:mt-6 space-y-3 md:space-y-5 rounded-xl md:rounded-[1.75rem] border border-zinc-200 bg-white p-4 md:p-6">
                        <div><p className="text-sm text-black">Realiza tu pago</p><p className="mt-1 md:mt-2 text-base md:text-lg font-semibold text-black">Banco Aura</p><p className="text-sm text-black">Número: <span className="font-semibold">1234 5678 9012 3456</span></p><p className="text-sm text-black">Total: <span className="font-semibold">${orderResult?.total?.toFixed(2) || '0.00'}</span></p></div>
                      </div>
                    )}
                    
                    {orderResult.deliveryType === 'PICKUP' && (
                      <div className="mt-4 rounded-xl md:rounded-[1.75rem] border border-zinc-200 bg-white p-4 md:p-6">
                        <p className="text-sm text-black">Punto de entrega:</p>
                        <p className="mt-1 md:mt-2 text-base md:text-lg font-semibold text-black">Parque Sonsonate</p>
                        <p className="text-xs md:text-sm text-zinc-600">Te notificaremos por WhatsApp</p>
                      </div>
                    )}
                    
                    {orderResult.deliveryType === 'DELIVERY' && (
                      <div className="mt-4 rounded-[1.75rem] border border-zinc-200 bg-white p-6">
                        <p className="text-sm text-black">Entrega a domicilio:</p>
                        <p className="mt-2 text-lg font-semibold text-black">{orderResult.deliveryAddress}</p>
                        <p className="text-sm text-zinc-600">El costo de envío se coordina al entregar.</p>
                      </div>
                    )}
                    
                    <button onClick={() => { const msg = encodeURIComponent(`Hola! Acabo de crear la orden ${orderResult.orderNumber} por $${orderResult?.total?.toFixed(2) || '0.00'}. ${orderResult.deliveryType === 'PICKUP' ? 'Recogeré en Parque Sonsonate' : 'Entrega en: ' + orderResult.deliveryAddress}. Mis datos: ${clientForm.name}, ${clientForm.phone}`); window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank'); }} className="mt-6 w-full rounded-full bg-green-600 px-5 py-4 text-sm font-semibold text-white transition hover:bg-green-700">Enviar por WhatsApp</button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      } />
    </Routes>
  );
}

export default App;