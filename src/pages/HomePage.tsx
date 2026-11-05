import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchProducts } from '@/services/products'
import { fetchCategories } from '@/services/categories'
import { ProductCard } from '@/components/ProductCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Flower2, Truck, Heart, Sparkles, Star } from 'lucide-react'

const BANNER_IMAGES = [
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&w=1600&q=80',
]

const GALLERY = [
  'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1455659817273-f96807779a8a?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1487070183336-b863922373d4?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1494972308805-463bc619d34e?auto=format&fit=crop&w=600&q=80',
]

function HeroBanner() {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % BANNER_IMAGES.length), 4500)
    return () => clearInterval(t)
  }, [])
  return (
    <section className="relative overflow-hidden rounded-2xl">
      <div className="relative h-72 md:h-[28rem]">
        {BANNER_IMAGES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt="Banner toko bunga"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 text-white">
          <span className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Bunga segar setiap hari
          </span>
          <h1 className="text-3xl font-bold md:text-5xl">Kirim Bunga, Sampaikan Rasa</h1>
          <p className="mt-3 max-w-xl text-white/90">
            Rangkaian bunga segar untuk setiap momen spesial. Pesan online, kami antar tepat waktu.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/catalog">
              <Button size="lg" className="bg-primary text-primary-foreground">
                Lihat Katalog
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20">
                Hubungi Kami
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {BANNER_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2.5 w-2.5 rounded-full transition ${i === index ? 'bg-white scale-110' : 'bg-white/50'}`}
            aria-label={`Banner ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

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
    <div className="space-y-14">
      <HeroBanner />

      {/* Categories */}
      <section>
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold md:text-3xl">Kategori Bunga</h2>
            <p className="text-sm text-muted-foreground">Pilih rangkaian sesuai momen spesial Anda.</p>
          </div>
          <Link to="/catalog" className="text-sm text-primary hover:underline">
            Lihat semua
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {(categories ?? []).map((c, i) => (
            <Link
              key={c.id}
              to={`/catalog?category=${c.id}`}
              className="group relative overflow-hidden rounded-xl border bg-card"
            >
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={GALLERY[i % GALLERY.length]}
                  alt={c.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
                <Flower2 className="h-4 w-4" />
                <span className="font-medium">{c.name}</span>
              </div>
            </Link>
          ))}
          {(!categories || categories.length === 0) &&
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] w-full rounded-xl" />
            ))}
        </div>
      </section>

      {/* Features */}
      <section className="grid gap-4 rounded-2xl border bg-card p-6 md:grid-cols-3">
        {[
          { icon: Flower2, title: 'Bunga Segar', desc: 'Dipetik dan dirangkai setiap hari untuk kesegaran maksimal.' },
          { icon: Truck, title: 'Pengiriman Tepat Waktu', desc: 'Antar ke seluruh kota dengan jadwal yang Anda tentukan.' },
          { icon: Heart, title: 'Kartu Ucapan', desc: 'Sertakan pesan personal untuk orang tersayang.' },
        ].map((f) => (
          <div key={f.title} className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <f.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="font-medium">{f.title}</div>
              <div className="text-sm text-muted-foreground">{f.desc}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Featured products */}
      <section>
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold md:text-3xl">Produk Unggulan</h2>
            <p className="text-sm text-muted-foreground">Pilihan terbaik untuk momen spesial Anda.</p>
          </div>
          <Link to="/catalog" className="text-sm text-primary hover:underline">
            Lihat semua
          </Link>
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

      {/* Gallery */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold md:text-3xl">Inspirasi Rangkaian</h2>
          <p className="text-sm text-muted-foreground">Kumpulan karya terbaik toko kami.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {GALLERY.map((src, i) => (
            <div
              key={src}
              className={`overflow-hidden rounded-xl ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
            >
              <img
                src={src}
                alt="Inspirasi bunga"
                className="h-full w-full object-cover transition duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="rounded-2xl bg-primary/5 p-8">
        <h2 className="mb-6 text-2xl font-semibold md:text-3xl">Kata Pelanggan</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { name: 'Rina', text: 'Bunganya segar dan cantik, pengiriman tepat waktu!' },
            { name: 'Andi', text: 'Kartu ucapan sangat membantu. Penerima sangat senang.' },
            { name: 'Sari', text: 'Pelayanan ramah, akan pesan lagi untuk acara kantor.' },
          ].map((t) => (
            <div key={t.name} className="rounded-xl bg-card p-5 shadow-sm">
              <div className="mb-2 flex text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">“{t.text}”</p>
              <div className="mt-3 font-medium">{t.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl bg-gradient-to-r from-primary to-pink-500 p-8 text-center text-white md:p-12">
        <h2 className="text-2xl font-bold md:text-3xl">Siap Kirim Bunga Hari Ini?</h2>
        <p className="mt-2 text-white/90">Pilih rangkaian favorit dan jadwalkan pengiriman Anda.</p>
        <Link to="/catalog" className="mt-6 inline-block">
          <Button size="lg" variant="secondary">
            Mulai Belanja
          </Button>
        </Link>
      </section>
    </div>
  )
}
