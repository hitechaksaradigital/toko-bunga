import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchAllOrders, updateOrderStatus, fetchOrderItems } from '@/services/orders'
import { formatCurrency, formatDate } from '@/utils/format'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import type { Order, OrderStatus } from '@/types/supabase'
import { toast } from 'sonner'

const statuses: OrderStatus[] = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']

export default function AdminOrders() {
  const qc = useQueryClient()
  const { data: orders } = useQuery({ queryKey: ['adminOrders'], queryFn: fetchAllOrders })
  const [expanded, setExpanded] = useState<string | null>(null)
  const { data: items } = useQuery({
    queryKey: ['orderItems', expanded],
    queryFn: () => fetchOrderItems(expanded!),
    enabled: !!expanded,
  })

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => updateOrderStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['adminOrders'] })
      toast.success('Status diperbarui')
    },
    onError: (e) => toast.error((e as Error).message),
  })

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Manajemen Pesanan</h2>
      <div className="space-y-3">
        {(orders ?? []).map((o: Order) => (
          <Card key={o.id}>
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-base">#{o.id.slice(0, 8)}</CardTitle>
                <Badge>{o.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-2 text-sm md:grid-cols-2">
                <div><span className="font-medium">Penerima:</span> {o.recipient_name}</div>
                <div><span className="font-medium">Telepon:</span> {o.recipient_phone}</div>
                <div><span className="font-medium">Tanggal Kirim:</span> {formatDate(o.delivery_date)}</div>
                <div><span className="font-medium">Total:</span> {formatCurrency(o.total_price)}</div>
                <div className="md:col-span-2"><span className="font-medium">Alamat:</span> {o.delivery_address}</div>
                {o.greeting_card_message && (
                  <div className="md:col-span-2"><span className="font-medium">Pesan:</span> {o.greeting_card_message}</div>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Select
                  value={o.status}
                  onValueChange={(v: string) => mutation.mutate({ id: o.id, status: v as OrderStatus })}
                >
                  <SelectTrigger className="w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                >
                  {expanded === o.id ? 'Sembunyikan' : 'Lihat Item'}
                </Button>
              </div>
              {expanded === o.id && items && (
                <div className="rounded border p-3 text-sm">
                  {items.map((it) => (
                    <div key={it.id} className="flex justify-between">
                      <span>
                        {it.product?.name ?? 'Produk'} x{it.quantity}
                      </span>
                      <span>{formatCurrency(it.price_at_purchase * it.quantity)}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
