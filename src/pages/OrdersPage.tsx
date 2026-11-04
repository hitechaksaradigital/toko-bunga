import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { fetchOrdersByUser } from '@/services/orders'
import { formatCurrency, formatDate } from '@/utils/format'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

export default function OrdersPage() {
  const { user } = useAuth()
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: () => fetchOrdersByUser(user!.id),
    enabled: !!user,
  })

  if (isLoading) return <Skeleton className="h-64 w-full" />

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Riwayat Pesanan</h1>
      {(orders ?? []).length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">Belum ada pesanan.</div>
      ) : (
        <div className="space-y-3">
          {(orders ?? []).map((o) => (
            <Link
              key={o.id}
              to={`/orders/${o.id}`}
              className="block rounded-lg border p-4 hover:bg-accent"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Pesanan #{o.id.slice(0, 8)}</div>
                  <div className="text-sm text-muted-foreground">{formatDate(o.created_at)}</div>
                </div>
                <div className="text-right">
                  <Badge>{o.status}</Badge>
                  <div className="mt-1 font-semibold">{formatCurrency(o.total_price)}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
