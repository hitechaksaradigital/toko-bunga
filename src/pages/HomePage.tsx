import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from '@/services/products'
import { fetchCategories } from '@/services/categories'
import { Link } from 'react-router-dom'
import { ProductCard } from '@/components/ProductCard'
import { Skeleton } from '@/components/ui/skeleton'

export default function HomePage() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products', { availableOnly: true }],
    queryFn: () => fetchProducts({ availableOnly: true }),
  })
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  })

  const featured = (products ?? []).slice(0, 8)

  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-gradient-to-r from-primary/10 to-pink-100 p-8 md:p-12">
        <h1 className="text-3xl font-bold md:text-5xl">Kirim Bunga, Sampaikan Rasa</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Rangkaian bunga segar untuk setiap momen spesial. Pesan online, kami antar tepat waktu.
        </p>
        <Link to="/catalog">
          <button className="mt-6 rounded-lg bg-primary px-6 py-3 text-primary-foreground">
            Lihat Katalog
          </button>
        </Link>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Kategori</h2>
        <div className="flex flex-wrap gap-2">
          {(categories ?? []).map((c) => (
            <Link
              key={c.id}
              to={`/catalog?category=${c.id}`}
              className="rounded-full border px-4 py-2 text-sm hover:bg-accent"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Produk Unggulan</h2>
          <Link to="/catalog" className="text-sm text-primary">Lihat semua</Link>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
