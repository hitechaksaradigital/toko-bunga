export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type UserRole = 'customer' | 'admin'
export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export type Profile = {
  id: string
  full_name: string | null
  phone_number: string | null
  address: string | null
  role: UserRole
  created_at: string
}

export type Category = {
  id: string
  name: string
  slug: string
  created_at: string
}

export type Product = {
  id: string
  category_id: string | null
  name: string
  slug: string
  description: string | null
  price: number
  stock: number
  images: string[] | null
  is_available: boolean
  created_at: string
  category?: Category | null
}

export type Order = {
  id: string
  user_id: string | null
  status: OrderStatus
  total_price: number
  recipient_name: string
  recipient_phone: string
  delivery_address: string
  delivery_date: string
  greeting_card_message: string | null
  created_at: string
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string | null
  quantity: number
  price_at_purchase: number
  product?: Product | null
}

// Supabase generated-style Database type
export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '14.18'
  }
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Partial<Profile> & { id: string }
        Update: Partial<Profile>
        Relationships: any
      }
      categories: {
        Row: Category
        Insert: Partial<Category> & { name: string; slug: string }
        Update: Partial<Category>
        Relationships: any
      }
      products: {
        Row: Product
        Insert: Partial<Product> & { name: string; slug: string; price: number }
        Update: Partial<Product>
        Relationships: any
      }
      orders: {
        Row: Order
        Insert: Partial<Order> & {
          total_price: number
          recipient_name: string
          recipient_phone: string
          delivery_address: string
          delivery_date: string
        }
        Update: Partial<Order>
        Relationships: any
      }
      order_items: {
        Row: OrderItem
        Insert: Partial<OrderItem> & { order_id: string; quantity: number; price_at_purchase: number }
        Update: Partial<OrderItem>
        Relationships: any
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: {
      user_role: UserRole
      order_status: OrderStatus
    }
    CompositeTypes: { [_ in never]: never }
  }
}
