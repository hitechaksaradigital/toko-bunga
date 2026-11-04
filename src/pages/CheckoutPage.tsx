import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '@/store/cartStore'
import { useAuth } from '@/context/AuthContext'
import { createOrder } from '@/services/orders'
import { formatCurrency } from '@/utils/format'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const checkoutSchema = z.object({
  recipient_name: z.string().min(2, 'Nama penerima wajib diisi'),
  recipient_phone: z.string().min(10, 'Nomor telepon minimal 10 digit'),
  delivery_address: z.string().min(5, 'Alamat wajib diisi'),
  delivery_date: z.string().refine((val) => new Date(val) >= new Date(new Date().toDateString()), {
    message: 'Tanggal pengiriman tidak boleh di masa lalu',
  }),
  greeting_card_message: z.string().max(300, 'Maksimal 300 karakter').optional(),
})

type CheckoutForm = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items)
  const totalPrice = useCartStore((s) => s.totalPrice())
  const clear = useCartStore((s) => s.clear)
  const { user } = useAuth()
  const navigate = useNavigate()

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      recipient_name: '',
      recipient_phone: '',
      delivery_address: '',
      delivery_date: '',
      greeting_card_message: '',
    },
  })

  const mutation = useMutation({
    mutationFn: async (values: CheckoutForm) => {
      if (!user) throw new Error('Harus login')
      const order = await createOrder({
        user_id: user.id,
        total_price: totalPrice,
        recipient_name: values.recipient_name,
        recipient_phone: values.recipient_phone,
        delivery_address: values.delivery_address,
        delivery_date: values.delivery_date,
        greeting_card_message: values.greeting_card_message || null,
        items: items.map((i) => ({
          product_id: i.productId,
          quantity: i.quantity,
          price_at_purchase: i.price,
        })),
      })
      return order
    },
    onSuccess: (order) => {
      clear()
      navigate(`/orders/${order.id}`)
    },
  })

  if (items.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Keranjang kosong. <a href="/catalog" className="text-primary">Belanja dulu</a>.
      </div>
    )
  }

  const errors = form.formState.errors

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Data Pengiriman</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label>Nama Penerima</Label>
              <Input {...form.register('recipient_name')} />
              {errors.recipient_name && (
                <p className="text-sm text-destructive">{errors.recipient_name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Nomor Telepon Penerima</Label>
              <Input {...form.register('recipient_phone')} />
              {errors.recipient_phone && (
                <p className="text-sm text-destructive">{errors.recipient_phone.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Alamat Pengiriman</Label>
              <Textarea {...form.register('delivery_address')} />
              {errors.delivery_address && (
                <p className="text-sm text-destructive">{errors.delivery_address.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Tanggal Pengiriman</Label>
              <Input type="date" {...form.register('delivery_date')} />
              {errors.delivery_date && (
                <p className="text-sm text-destructive">{errors.delivery_date.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Pesan Kartu Ucapan (opsional)</Label>
              <Textarea maxLength={300} {...form.register('greeting_card_message')} />
              {errors.greeting_card_message && (
                <p className="text-sm text-destructive">{errors.greeting_card_message.message}</p>
              )}
            </div>
            {mutation.isError && (
              <p className="text-sm text-destructive">{(mutation.error as Error).message}</p>
            )}
            <Button type="submit" disabled={mutation.isPending} className="w-full">
              {mutation.isPending ? 'Memproses...' : 'Buat Pesanan'}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Ringkasan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {items.map((i) => (
            <div key={i.productId} className="flex justify-between text-sm">
              <span>
                {i.name} x{i.quantity}
              </span>
              <span>{formatCurrency(i.price * i.quantity)}</span>
            </div>
          ))}
          <div className="border-t pt-2 text-lg font-semibold">
            <div className="flex justify-between">
              <span>Total</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
