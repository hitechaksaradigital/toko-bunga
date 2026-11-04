import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchProductBySlug } from '@/services/products'
import { formatCurrency } from '@/utils/format'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ShoppingCart, Minus, Plus } from 'lucide-react'
import { useState } from 'react'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => fetchProductBySlug(slug!),
    enabled: !!slug,
  })
  const addItem = useCartStore((s) => s.addItem)
  const [qty, setQty] = useState(1)

  if (isLoading) return <Skeleton className="h-96 w-full" />
  if (!product) return <div className="py-12 text-center">Produk tidak ditemukan.</div>

  const img = product.images?.[0] ?? null

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="aspect-square overflow-hidden rounded-xl bg-muted">
        {img ? (
          <img src={img} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">No image</div>
        )}
      </div>
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">{product.category?.name}</div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <div className="text-2xl font-semibold text-primary">{formatCurrency(product.price)}</div>
        <p className="text-muted-foreground">{product.description}</p>
        <div className="text-sm">Stok: {product.stock}</div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => setQty((q) => Math.max(1, q - 1))}>
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center font-medium">{qty}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button
          className="w-full md:w-auto"
          disabled={!product.is_available || product.stock <= 0}
          onClick={() =>
            addItem({
              productId: product.id,
              name: product.name,
              price: product.price,
              image: img,
              slug: product.slug,
              quantity: qty,
            })
          }
        >
          <ShoppingCart className="mr-2 h-4 w-4" /> Tambah ke Keranjang
        </Button>
      </div>
    </div>
  )
}
