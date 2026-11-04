import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from '@/services/products'
import { fetchCategories } from '@/services/categories'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
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
      <HeroBanner />

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


const BANNER_IMAGES = [
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&w=1600&q=80',
]

function HeroBanner() {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % BANNER_IMAGES.length), 4000)
    return () => clearInterval(t)
  }, [])
  return (
    <section className="relative overflow-hidden rounded-2xl">
      <div className="relative h-64 md:h-96">
        {BANNER_IMAGES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt="Banner toko bunga"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-12 text-white">
          <h1 className="text-3xl font-bold md:text-5xl">Kirim Bunga, Sampaikan Rasa</h1>
          <p className="mt-3 max-w-2xl text-white/90">
            Rangkaian bunga segar untuk setiap momen spesial. Pesan online, kami antar tepat waktu.
          </p>
          <Link to="/catalog" className="mt-6 inline-block w-fit">
            <button className="rounded-lg bg-primary px-6 py-3 text-primary-foreground">
              Lihat Katalog
            </button>
          </Link>
        </div>
      </div>
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
        {BANNER_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/50'}`}
            aria-label={`Banner ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
