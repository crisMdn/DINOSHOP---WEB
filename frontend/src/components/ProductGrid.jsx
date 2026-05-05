import ProductCard from './ProductCard.jsx';

export default function ProductGrid({ products, onAdd }) {
  const walletProducts = products.filter((product) => product.category.toLowerCase() === 'cartera');

  return (
    <section className="space-y-8 rounded-[2.5rem] border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">Colección Verano</p>
        <h2 className="text-4xl font-semibold text-black">Ropa femenina con un estilo minimalista y editorial</h2>
        <p className="max-w-2xl text-sm leading-7 text-zinc-600">
          Descubre prendas seleccionadas con una estética editorial, pensadas para looks ligeros, naturales y elegantes.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {walletProducts.map((product) => (
          <ProductCard key={product.id} product={product} onAdd={onAdd} />
        ))}
      </div>
    </section>
  );
}
