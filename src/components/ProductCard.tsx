import { Link } from 'react-router-dom'
import { formatCurrency } from '@/utils/format'
import type { Product } from '@/types/supabase'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cartStore'
import { ShoppingCart } from 'lucide-react'

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem)
  const img = product.images?.[0] ?? null

  return (
    <Card className="overflow-hidden">
      <Link to={`/products/${product.slug}`}>
        <div className="aspect-square w-full overflow-hidden bg-muted">
          {img ? (
            <img src={img} alt={product.name} className="h-full w-full object-cover transition hover:scale-105" />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">No image</div>
          )}
        </div>
      </Link>
      <CardHeader className="p-3">
        <Link to={`/products/${product.slug}`} className="font-medium hover:text-primary">
          {product.name}
        </Link>
        <div className="text-sm text-muted-foreground">{product.category?.name}</div>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="font-semibold text-primary">{formatCurrency(product.price)}</div>
        {!product.is_available && <Badge variant="secondary" className="mt-1">Habis</Badge>}
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <Button
          size="sm"
          className="w-full"
          disabled={!product.is_available || product.stock <= 0}
          onClick={() =>
            addItem({
              productId: product.id,
              name: product.name,
              price: product.price,
              image: img,
              slug: product.slug,
            })
          }
        >
          <ShoppingCart className="mr-2 h-4 w-4" /> Tambah
        </Button>
      </CardFooter>
    </Card>
  )
}
