import { supabase } from '@/lib/supabase'
import type { Order, OrderItem, OrderStatus } from '@/types/supabase'

export interface CreateOrderPayload {
  user_id: string | null
  total_price: number
  recipient_name: string
  recipient_phone: string
  delivery_address: string
  delivery_date: string
  greeting_card_message: string | null
  items: Array<{ product_id: string; quantity: number; price_at_purchase: number }>
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const { items, ...orderData } = payload
  const { data: order, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single()
  if (error) throw error
  const orderId = (order as Order).id
  const rows = items.map((i) => ({ ...i, order_id: orderId }))
  const { error: itemsError } = await supabase.from('order_items').insert(rows)
  if (itemsError) throw itemsError
  return order as Order
}

export async function fetchOrdersByUser(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Order[]
}

export async function fetchAllOrders(): Promise<Order[]> {
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Order[]
}

export async function fetchOrderById(id: string): Promise<Order | null> {
  const { data, error } = await supabase.from('orders').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data as Order | null
}

export async function fetchOrderItems(orderId: string): Promise<OrderItem[]> {
  const { data, error } = await supabase
    .from('order_items')
    .select('*, product:products(*)')
    .eq('order_id', orderId)
  if (error) throw error
  return (data ?? []) as OrderItem[]
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  const { data, error } = await supabase.from('orders').update({ status }).eq('id', id).select().single()
  if (error) throw error
  return data as Order
}
