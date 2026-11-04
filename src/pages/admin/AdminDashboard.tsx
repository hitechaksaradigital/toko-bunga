import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from '@/services/products'
import { fetchAllOrders } from '@/services/orders'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminDashboard() {
  const { data: products } = useQuery({ queryKey: ['products'], queryFn: () => fetchProducts({}) })
  const { data: orders } = useQuery({ queryKey: ['adminOrders'], queryFn: fetchAllOrders })

  const totalRevenue = (orders ?? []).reduce((s, o) => s + Number(o.total_price), 0)

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Total Produk</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold">{(products ?? []).length}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Pesanan</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold">{(orders ?? []).length}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Pendapatan</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold">
          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalRevenue)}
        </CardContent>
      </Card>
    </div>
  )
}
