import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8080/api';

const initialForm = {
  name: '',
  description: '',
  category: '',
  color: '',
  size: '',
  measurements: '',
  price: '',
  promoPrice: '',
  imageUrl: '',
  stock: ''
};

const categories = ['Cartera', 'Blusas', 'Vestidos', 'Pantalones', 'Accesorios', 'Otros'];

export default function ProductForm({ product, onClose, onSave }) {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setForm({
        ...product,
        price: product.price?.toString() || '',
        promoPrice: product.promoPrice?.toString() || '',
        stock: product.stock?.toString() || ''
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const payload = {
      ...form,
      price: parseFloat(form.price) || 0,
      promoPrice: parseFloat(form.promoPrice) || 0,
      stock: parseInt(form.stock) || 0
    };

    try {
      const url = product 
        ? `${API_BASE}/products/${product.id}`
        : `${API_BASE}/products`;
      
      const method = product ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Error al guardar');

      const saved = await res.json();
      onSave(saved);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-black">
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-black text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Nombre *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-black"
              placeholder="Nombre del producto"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Descripción *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={2}
              className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-black"
              placeholder="Descripción del producto"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">Categoría *</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-black"
              >
                <option value="">Seleccionar</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Stock</label>
              <input
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-black"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">Color *</label>
              <input
                name="color"
                value={form.color}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-black"
                placeholder="Negro"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Talla *</label>
              <input
                name="size"
                value={form.size}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-black"
                placeholder="S/M/L"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Medidas *</label>
            <input
              name="measurements"
              value={form.measurements}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-black"
              placeholder="28x18x10 cm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">Precio *</label>
              <input
                name="price"
                type="number"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-black"
                placeholder="16.99"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Precio Promo *</label>
              <input
                name="promoPrice"
                type="number"
                step="0.01"
                value={form.promoPrice}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-black"
                placeholder="10.99"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">URL de Imagen</label>
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-black"
              placeholder="https://i.ibb.co/..."
            />
            {form.imageUrl && (
              <div className="mt-2">
                <img 
                  src={form.imageUrl} 
                  alt="Preview" 
                  className="h-24 w-24 object-cover rounded-lg border border-zinc-200"
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
            )}
            <p className="mt-1 text-xs text-zinc-500">
              Sube la imagen a imgbb.com y pega aquí el enlace
            </p>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-zinc-200 px-4 py-3 text-sm font-semibold text-black"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-full bg-black px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}