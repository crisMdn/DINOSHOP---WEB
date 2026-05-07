import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductForm from './ProductForm.jsx';

const API_BASE = 'https://dinoshop-web-fp3q.onrender.com/api';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (saved) => {
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === saved.id ? saved : p));
    } else {
      setProducts(prev => [...prev, saved]);
    }
    setEditingProduct(null);
    fetchProducts();
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error al eliminar:', err);
    }
  };

  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div className="min-h-screen bg-white px-4 py-20 text-center">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link to="/admin" className="text-sm text-zinc-500 hover:text-black">
              ← Volver a pedidos
            </Link>
            <h1 className="mt-2 text-2xl font-semibold text-black">Gestión de Productos</h1>
          </div>
          <button
            onClick={() => { setEditingProduct(null); setShowForm(true); }}
            className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white"
          >
            + Nuevo Producto
          </button>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-black"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-black"
          >
            <option value="all">Todas las categorías</option>
            {categories.filter(c => c !== 'all').map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          {filteredProducts.length === 0 ? (
            <p className="text-zinc-500 text-center py-8">
              {products.length === 0 ? 'No hay productos. Crea el primero.' : 'No hay productos que coincidan con la búsqueda.'}
            </p>
          ) : (
            filteredProducts.map(product => (
              <div key={product.id} className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-4">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-zinc-400 text-xs">Sin imagen</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-black truncate">{product.name}</h3>
                  <p className="text-sm text-zinc-500 truncate">{product.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-zinc-100 px-2 py-1 text-zinc-600">{product.category}</span>
                    <span className="rounded-full bg-zinc-100 px-2 py-1 text-zinc-600">{product.color}</span>
                    <span className="rounded-full bg-zinc-100 px-2 py-1 text-zinc-600">Talla: {product.size}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm font-semibold text-black">${product.promoPrice?.toFixed(2)}</span>
                    {product.price > product.promoPrice && (
                      <span className="text-xs text-zinc-400 line-through">${product.price?.toFixed(2)}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { setEditingProduct(product); setShowForm(true); }}
                    className="rounded-full border border-zinc-200 px-3 py-2 text-xs font-semibold text-black"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(product.id)}
                    className="rounded-full border border-red-200 px-3 py-2 text-xs font-semibold text-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {showForm && (
          <ProductForm
            product={editingProduct}
            onClose={() => { setShowForm(false); setEditingProduct(null); }}
            onSave={handleSave}
          />
        )}

        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
            <div className="w-full max-w-sm rounded-[2rem] bg-white p-6 shadow-2xl">
              <h3 className="text-lg font-semibold text-black">Confirmar eliminación</h3>
              <p className="mt-2 text-sm text-zinc-600">¿Estás seguro de que quieres eliminar este producto?</p>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 rounded-full border border-zinc-200 px-4 py-2 text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 rounded-full bg-red-600 px-4 py-2 text-sm text-white"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}