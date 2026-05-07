import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AdminProducts from './AdminProducts.jsx';

const API_BASE = 'http://localhost:8080/api';

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        onLogin(true);
        navigate('/admin');
      } else {
        setError(data.message || 'Contraseña incorrecta');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-20">
      <div className="mx-auto max-w-sm rounded-[2rem] border border-zinc-200 bg-white p-8">
        <h1 className="text-2xl font-semibold text-black">Admin</h1>
        <p className="mt-2 text-zinc-600">Ingresa tus credenciales</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Usuario"
            className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-black"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-black"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-full bg-black px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <Link to="/" className="mt-4 block text-center text-sm text-zinc-500">Volver a la tienda</Link>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('thisMonth');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const navigate = useNavigate();
  const [showDateModal, setShowDateModal] = useState(null);
  const [nextDate, setNextDate] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchOrders();
  }, [dateFilter, paymentFilter]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchOrders();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const confirmDelivery = async (orderId) => {
    try {
      await fetch(`${API_BASE}/orders/${orderId}/confirm-delivery`, {
        method: 'PATCH',
      });
      fetchOrders();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const updateNextDeliveryDate = async (orderId) => {
    if (!nextDate) return;
    try {
      await fetch(`${API_BASE}/orders/${orderId}/next-delivery`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nextDeliveryDate: new Date(nextDate).toISOString() }),
      });
      setShowDateModal(null);
      setNextDate('');
      fetchOrders();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const getFilteredOrders = () => {
    let filtered = orders;
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(o => o.paymentStatus === paymentFilter);
    }

    const now = new Date();
    let startDate = null;
    let endDate = null;

    if (dateFilter === 'today') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (dateFilter === 'thisWeek') {
      const dayOfWeek = now.getDay();
      const start = new Date(now);
      start.setDate(now.getDate() - dayOfWeek);
      startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    } else if (dateFilter === 'thisMonth') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (dateFilter === 'thisYear') {
      startDate = new Date(now.getFullYear(), 0, 1);
    } else if (dateFilter === 'custom') {
      if (customStartDate) startDate = new Date(customStartDate);
      if (customEndDate) endDate = new Date(customEndDate);
    }

    if (startDate) {
      filtered = filtered.filter(o => new Date(o.createdAt) >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter(o => new Date(o.createdAt) <= endDate);
    }

    return filtered;
  };

  const filteredOrders = getFilteredOrders();

  const paymentStatusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PAID: 'bg-green-100 text-green-800',
    CONTRADELIVERY: 'bg-orange-100 text-orange-800',
  };

  const deliveryTypeLabels = {
    PICKUP: 'Punto de encuentro',
    DELIVERY: 'Domicilio',
  };

  if (loading) {
    return <div className="min-h-screen bg-white px-4 py-20 text-center">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between border-b border-zinc-200 pb-4">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('orders')}
              className={`text-sm font-medium ${activeTab === 'orders' ? 'text-black' : 'text-zinc-400'}`}
            >
              Pedidos
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`text-sm font-medium ${activeTab === 'products' ? 'text-black' : 'text-zinc-400'}`}
            >
              Productos
            </button>
          </div>
          <button onClick={logout} className="text-sm text-zinc-500">Salir</button>
        </div>

        {activeTab === 'orders' && (
          <>
          <h1 className="text-2xl font-semibold text-black">Admin - Pedidos</h1>

        <div className="mt-4 text-sm font-medium text-black">Filtrar por fecha:</div>
        <div className="mt-2 flex flex-wrap gap-2 overflow-x-auto pb-2">
          {[
            { value: 'today', label: 'Hoy' },
            { value: 'thisWeek', label: 'Esta semana' },
            { value: 'thisMonth', label: 'Este mes' },
            { value: 'thisYear', label: 'Este año' },
            { value: 'all', label: 'Todos' },
            { value: 'custom', label: 'Personalizado' },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setDateFilter(f.value)}
              className={`rounded-full px-4 py-2 text-xs ${dateFilter === f.value ? 'bg-black text-white' : 'bg-zinc-100 text-black'}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {dateFilter === 'custom' && (
          <div className="mt-2 flex gap-2">
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs text-gray-800"
              placeholder="Desde"
            />
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs text-gray-800"
              placeholder="Hasta"
            />
          </div>
        )}

        <div className="mt-4 text-sm font-medium text-black">Estado de pago:</div>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
          {['all', 'PENDING', 'PAID', 'CONTRADELIVERY'].map((s) => (
            <button
              key={s}
              onClick={() => setPaymentFilter(s)}
              className={`rounded-full px-4 py-2 text-xs ${paymentFilter === s ? 'bg-black text-white' : 'bg-zinc-100 text-black'}`}
            >
              {s === 'all' ? 'Todos' : s === 'PENDING' ? 'Transferencia' : s === 'PAID' ? 'Pagado' : s === 'CONTRADELIVERY' ? 'Contraentrega' : s}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {filteredOrders.length === 0 ? (
            <p className="text-zinc-500">No hay pedidos</p>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-zinc-200 bg-white p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-black">{order.orderNumber}</h3>
                    <p className="text-sm text-zinc-500">{order.clientName} - {order.clientPhone}</p>
                    <p className="text-sm text-zinc-500">{order.clientEmail}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${paymentStatusColors[order.paymentStatus]}`}>
                      {order.paymentStatus === 'PENDING' ? 'Transferencia' : order.paymentStatus === 'PAID' ? 'Pagado' : order.paymentStatus === 'CONTRADELIVERY' ? 'Contraentrega' : 'Cobrado'}
                    </span>
                    <p className="mt-2 text-lg font-semibold text-black">${order.total?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2 text-sm">
                  <span className="text-zinc-600">
                    Entrega: <span className="font-medium text-black">{deliveryTypeLabels[order.deliveryType]}</span>
                  </span>
                  {order.deliveryType === 'DELIVERY' && order.deliveryAddress && (
                    <span className="text-zinc-600">
                      Dirección: <span className="font-medium text-black">{order.deliveryAddress}</span>
                    </span>
                  )}
                </div>

                <div className="mt-4 border-t border-zinc-100 pt-4">
                  <p className="text-sm font-medium text-black">Productos:</p>
                  <div className="mt-2 space-y-1">
                    {order.items?.map((item, i) => (
                      <p key={i} className="text-sm text-zinc-600">
                        {item.quantity}x {item.productName} ({item.size}) - ${item.price?.toFixed(2) || '0.00'}
                      </p>
                    ))}
                  </div>
                </div>

                {order.nextDeliveryDate && (
                  <div className="mt-3 rounded-lg bg-yellow-50 px-3 py-2 text-sm">
                    <span className="font-medium text-yellow-800">Próxima entrega: </span>
                    <span className="text-yellow-700">{new Date(order.nextDeliveryDate).toLocaleDateString('es-MX')}</span>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {(order.paymentStatus === 'CONTRADELIVERY' || order.paymentStatus === 'PENDING') && (
                    <button
                      onClick={() => confirmDelivery(order.id)}
                      className="rounded-full bg-green-600 px-4 py-2 text-xs font-semibold text-white"
                    >
                      Confirmar pago
                    </button>
                  )}
                  {(order.paymentStatus === 'CONTRADELIVERY' || order.paymentStatus === 'PENDING') && (
                    <button
                      onClick={() => setShowDateModal(order.id)}
                      className="rounded-full border border-yellow-200 px-4 py-2 text-xs font-semibold text-yellow-700"
                    >
                      Reprogramar
                    </button>
                  )}
                  {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                    <button
                      onClick={() => updateStatus(order.id, 'CANCELLED')}
                      className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-600"
                    >
                      Cancelar
                    </button>
                  )}
                  <Link
                    to={`/check?id=${order.id}`}
                    target="_blank"
                    className="rounded-full border border-zinc-200 px-4 py-2 text-xs font-semibold text-black"
                  >
                    Ver pública
                  </Link>
                </div>

                <p className="mt-4 text-xs text-zinc-400">
                  Creado: {new Date(order.createdAt).toLocaleString('es-MX')}
                </p>
              </div>
            ))
          )}
        </div>

        {showDateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
            <div className="w-full max-w-sm rounded-[2rem] bg-white p-8 shadow-2xl">
              <h3 className="text-lg font-semibold text-black">Reprogramar entrega</h3>
              <p className="mt-2 text-sm text-zinc-600">Selecciona la nueva fecha:</p>
              <input
                type="date"
                value={nextDate}
                onChange={(e) => setNextDate(e.target.value)}
                className="mt-4 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-gray-800"
              />
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => { setShowDateModal(null); setNextDate(''); }}
                  className="flex-1 rounded-full border border-zinc-200 px-4 py-2 text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => updateNextDeliveryDate(showDateModal)}
                  className="flex-1 rounded-full bg-black px-4 py-2 text-sm text-white"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}

        </>
        )}

        {activeTab === 'products' && <AdminProducts />}

        <div className="mt-8 text-center">
          <Link to="/" className="text-sm text-zinc-500">← Volver a la tienda</Link>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  return <AdminDashboard />;
}

export { AdminLogin };