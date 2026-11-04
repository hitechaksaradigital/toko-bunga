import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchOrderById, fetchOrderItems } from '@/services/orders'
import { formatCurrency, formatDate } from '@/utils/format'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

export default function OrderDetailPage() {
  const { id } = useParams()
  const { data: order, isLoading: loadingOrder } = useQuery({
    queryKey: ['order', id],
    queryFn: () => fetchOrderById(id!),
    enabled: !!id,
  })
  const { data: items, isLoading: loadingItems } = useQuery({
    queryKey: ['orderItems', id],
    queryFn: () => fetchOrderItems(id!),
    enabled: !!id,
  })

  if (loadingOrder || loadingItems) return <Skeleton className="h-64 w-full" />
  if (!order) return <div className="py-12 text-center">Pesanan tidak ditemukan.</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pesanan #{order.id.slice(0, 8)}</h1>
        <Badge>{order.status}</Badge>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2 rounded-lg border p-4">
          <div><span className="font-medium">Penerima:</span> {order.recipient_name}</div>
          <div><span className="font-medium">Telepon:</span> {order.recipient_phone}</div>
          <div><span className="font-medium">Alamat:</span> {order.delivery_address}</div>
          <div><span className="font-medium">Tanggal Kirim:</span> {formatDate(order.delivery_date)}</div>
          {order.greeting_card_message && (
            <div><span className="font-medium">Pesan Kartu:</span> {order.greeting_card_message}</div>
          )}
          <div><span className="font-medium">Dibuat:</span> {formatDate(order.created_at)}</div>
        </div>
        <div className="space-y-2 rounded-lg border p-4">
          <h2 className="font-semibold">Item</h2>
          {(items ?? []).map((it) => (
            <div key={it.id} className="flex justify-between text-sm">
              <span>
                {it.product?.name ?? 'Produk'} x{it.quantity}
              </span>
              <span>{formatCurrency(it.price_at_purchase * it.quantity)}</span>
            </div>
          ))}
          <div className="border-t pt-2 font-semibold">
            <div className="flex justify-between">
              <span>Total</span>
              <span>{formatCurrency(order.total_price)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
