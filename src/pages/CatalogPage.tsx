import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { fetchProducts } from '@/services/products'
import { fetchCategories } from '@/services/categories'
import { ProductCard } from '@/components/ProductCard'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useDebounce } from '@/hooks/useDebounce'
import { useState } from 'react'

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get('category') ?? ''
  const [search, setSearch] = useState(searchParams.get('q') ?? '')
  const debouncedSearch = useDebounce(search, 400)

  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories })
  const { data: products, isLoading } = useQuery({
    queryKey: ['products', { category: categoryParam, search: debouncedSearch }],
    queryFn: () =>
      fetchProducts({
        categoryId: categoryParam || undefined,
        search: debouncedSearch || undefined,
        availableOnly: false,
      }),
  })

  const updateCategory = (val: string) => {
    const next = new URLSearchParams(searchParams)
    if (val === 'all') next.delete('category')
    else next.set('category', val)
    setSearchParams(next)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Katalog Bunga</h1>
      <div className="flex flex-col gap-3 md:flex-row">
        <Input
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:max-w-xs"
        />
        <Select value={categoryParam || 'all'} onValueChange={updateCategory}>
          <SelectTrigger className="md:w-56">
            <SelectValue placeholder="Semua kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua kategori</SelectItem>
            {(categories ?? []).map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      ) : (products ?? []).length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">Produk tidak ditemukan.</div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {(products ?? []).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
