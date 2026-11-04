import { Link } from 'react-router-dom'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency } from '@/utils/format'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2 } from 'lucide-react'

export default function CartPage() {
  const items = useCartStore((s) => s.items)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const totalPrice = useCartStore((s) => s.totalPrice())
  const clear = useCartStore((s) => s.clear)

  if (items.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Keranjang kosong.</p>
        <Link to="/catalog" className="mt-4 inline-block text-primary">
          Lihat katalog
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="space-y-4 md:col-span-2">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 rounded-lg border p-4">
            <div className="h-16 w-16 overflow-hidden rounded bg-muted">
              {item.image && <img src={item.image} alt={item.name} className="h-full w-full object-cover" />}
            </div>
            <div className="flex-1">
              <div className="font-medium">{item.name}</div>
              <div className="text-sm text-primary">{formatCurrency(item.price)}</div>
            </div>
            <Input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
              className="w-20"
            />
            <div className="w-24 text-right font-medium">
              {formatCurrency(item.price * item.quantity)}
            </div>
            <Button variant="ghost" size="icon" onClick={() => removeItem(item.productId)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <div className="space-y-4 rounded-lg border p-4">
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
        <Link to="/checkout">
          <Button className="w-full">Checkout</Button>
        </Link>
        <Button variant="outline" className="w-full" onClick={clear}>
          Kosongkan
        </Button>
      </div>
    </div>
  )
}
