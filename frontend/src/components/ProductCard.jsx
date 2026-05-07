import React, { useMemo, useState } from 'react';

const imageMap = {
  Cartera: [
    'https://images.unsplash.com/photo-1520962919502-0c015403e71f?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1555529771-5e37f49cd0c8?auto=format&fit=crop&w=900&q=80',
  ],
  Camisas: [
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1495121605193-b116b5b9c5b2?auto=format&fit=crop&w=900&q=80',
  ],
  default: [
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
  ],
};

export default function ProductCard({ product, item, onAdd }) {
  const productData = item || product;

  const sizeOptions = useMemo(() => {
    if (!productData.size) return ['Única'];
    return productData.size.includes('/')
      ? productData.size.split('/').map((size) => size.trim())
      : [productData.size];
  }, [productData.size]);

  const [selectedSize, setSelectedSize] = useState(sizeOptions[0] || 'Única');

  const imageSources = useMemo(() => {
    if (productData.images && productData.images.length) return productData.images;
    if (productData.image) return [productData.image];
    if (productData.imageUrl) return [productData.imageUrl];
    return imageMap[productData.category] || imageMap.default;
  }, [productData.category, productData.image, productData.imageUrl, productData.images]);

  return (
    <div className="group relative overflow-hidden rounded-2xl md:rounded-[2rem] bg-white border border-zinc-200 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="space-y-3 md:space-y-4 p-3 md:p-6">
        <div className="rounded-2xl md:rounded-[2rem] bg-white p-2 md:p-4 shadow-sm">
          <div className="flex snap-x gap-2 md:gap-3 overflow-x-auto pb-2">
            {imageSources.map((src, index) => (
              <div key={index} className="snap-start min-w-[140px] md:min-w-[180px] shrink-0 overflow-hidden rounded-xl md:rounded-[1.75rem] border border-zinc-200 bg-white">
                <img src={src} alt={`${productData.name} ${index + 1}`} className="h-28 md:h-40 w-full object-cover transition" />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl md:rounded-[2rem] bg-white p-3 md:p-6">
          <div className="flex flex-col justify-between text-left">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">{productData.category}</p>
              <h3 className="mt-2 md:mt-4 text-lg md:text-2xl font-semibold text-black">{productData.name}</h3>
            </div>
            <div className="mt-3 md:mt-6 grid gap-1 md:gap-2 text-xs md:text-sm text-zinc-600">
              <p className="line-clamp-2">{productData.description}</p>
              <p><strong>Color:</strong> {productData.color}</p>
              <p><strong>Medidas:</strong> {productData.measurements}</p>
            </div>
          </div>
        </div>
        <div className="grid gap-3 md:gap-4 rounded-2xl md:rounded-[2rem] bg-white p-3 md:p-4 text-xs md:text-sm text-zinc-600 shadow-sm">
          <label className="font-semibold text-black text-sm">Talla</label>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="rounded-2xl md:rounded-3xl border border-zinc-200 bg-white px-3 md:px-4 py-2 md:py-3 text-black outline-none focus:border-black touch-manipulation"
          >
            {sizeOptions.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <p className="text-xs text-zinc-500 hidden md:block">Selecciona la talla antes de añadir el producto.</p>
        </div>
      </div>
      <div className="space-y-3 md:space-y-4 p-3 md:p-6">
        <div className="flex items-center justify-between gap-3 md:gap-4">
          <div>
            <p className="text-xs md:text-sm text-zinc-500">Precio</p>
            <div className="flex items-baseline gap-2 md:gap-4">
              <span className="text-xs md:text-zinc-500 line-through">${productData.price.toFixed(2)}</span>
              <span className="text-lg md:text-2xl font-semibold text-black">${productData.promoPrice.toFixed(2)}</span>
            </div>
          </div>
          <div className="rounded-full bg-zinc-100 px-2 md:px-4 py-1 md:py-2 text-[10px] md:text-xs uppercase tracking-[0.25em] text-zinc-700">PROMO</div>
        </div>
        <button
          onClick={() => onAdd(productData, selectedSize)}
          className="w-full rounded-2xl md:rounded-3xl bg-black px-4 md:px-5 py-3 md:py-4 text-sm md:text-base font-semibold text-white shadow-sm transition hover:bg-zinc-900 touch-manipulation active:scale-95"
        >
          Añadir
        </button>
      </div>
    </div>
  );
}
