# Technical Specification & Guidelines: Website Toko Bunga

Dokumen ini berisi standar teknis, arsitektur sistem, skema database, dan aturan pengembangan untuk pembuatan aplikasi e-commerce toko bunga berbasis **React (Vite)** dan **Supabase**.

---

## 1. Tech Stack & Library Standards

*   **Frontend Framework:** React 18+ (Vite)
*   **Language:** TypeScript (Strict Mode Enabled)
*   **Styling:** Tailwind CSS + Shadcn UI / Radix UI
*   **Backend & Database:** Supabase (PostgreSQL, Auth, Storage, Edge Functions)
*   **State Management:**
    *   *Global UI/Client state:* Zustand (Cart, UI modals, user preference)
    *   *Server state / Caching:* TanStack Query v5 (@tanstack/react-query)
*   **Form & Validation:** React Hook Form + Zod
*   **Routing:** React Router v6+

---

## 2. Structure & Architecture Guidelines

Aplikasi harus menggunakan pola **Feature-First Architecture** untuk menjaga modularitas dan skala aplikasi.

```text
src/
├── assets/             # Statik asset (logo, dummy images)
├── components/         # Global reusable UI components (Button, Modal, Input)
│   └── ui/             # Atomic components (Shadcn UI)
├── context/            # React Context (jika ada provider spesifik)
├── features/           # Feature-based modules
│   ├── auth/           # Login, Register, Profile logic
│   ├── catalog/        # Product listing, detail, filtering
│   ├── cart/           # Shopping cart & checkout drawer
│   └── orders/         # Order tracking & history
├── hooks/              # Custom global hooks (useDebounce, useMediaQuery)
├── lib/                # Third-party configuration (supabase client, axios)
├── pages/              # Page level components (Route wrappers)
├── services/           # Supabase API abstraction calls
├── store/              # Zustand global stores
├── types/              # TypeScript global definitions & Supabase generated types
└── utils/              # Helper functions (currency formatter, date formatter)
```

---

## 3. Database Schema Design (Supabase PostgreSQL)

### 3.1. Tables Definition

#### `profiles`
Menyimpan data pengguna tambahan yang terhubung dengan `auth.users`.
*   `id` (uuid, Primary Key, References `auth.users.id` ON DELETE CASCADE)
*   `full_name` (text)
*   `phone_number` (text)
*   `address` (text)
*   `role` (text, Default: `'customer'`, Enum: `['customer', 'admin']`)
*   `created_at` (timestamp with time zone, Default: `now()`)

#### `categories`
*   `id` (uuid, Primary Key, Default: `gen_random_uuid()`)
*   `name` (text, Unique, Not Null) — *Contoh: Bunga Papan, Hand Bouquet, Flower Box*
*   `slug` (text, Unique, Not Null)
*   `created_at` (timestamp with time zone, Default: `now()`)

#### `products`
*   `id` (uuid, Primary Key, Default: `gen_random_uuid()`)
*   `category_id` (uuid, References `categories.id` ON DELETE SET NULL)
*   `name` (text, Not Null)
*   `slug` (text, Unique, Not Null)
*   `description` (text)
*   `price` (numeric/decimal, Not Null)
*   `stock` (integer, Not Null, Default: `0`)
*   `images` (text array/jsonb) — *URL gambar dari Supabase Storage*
*   `is_available` (boolean, Default: `true`)
*   `created_at` (timestamp with time zone, Default: `now()`)

#### `orders`
*   `id` (uuid, Primary Key, Default: `gen_random_uuid()`)
*   `user_id` (uuid, References `profiles.id` ON DELETE SET NULL)
*   `status` (text, Default: `'pending'`, Enum: `['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']`)
*   `total_price` (numeric, Not Null)
*   `recipient_name` (text, Not Null)
*   `recipient_phone` (text, Not Null)
*   `delivery_address` (text, Not Null)
*   `delivery_date` (date, Not Null) — *Penting untuk penjadwalan toko bunga*
*   `greeting_card_message` (text) — *Pesan kartu ucapan*
*   `created_at` (timestamp with time zone, Default: `now()`)

#### `order_items`
*   `id` (uuid, Primary Key, Default: `gen_random_uuid()`)
*   `order_id` (uuid, References `orders.id` ON DELETE CASCADE)
*   `product_id` (uuid, References `products.id` ON DELETE SET NULL)
*   `quantity` (integer, Not Null)
*   `price_at_purchase` (numeric, Not Null)

---

## 4. Row Level Security (RLS) Policies

Setiap tabel di Supabase **WAJIB** mengaktifkan Row Level Security (RLS).

### Aturan Keamanan:
1.  **Products & Categories:**
    *   `SELECT`: Public (Siapa saja bisa membaca).
    *   `INSERT`, `UPDATE`, `DELETE`: Hanya `admin` (Role `admin` diverifikasi lewat tabel `profiles` atau JWT app_metadata).
2.  **Profiles:**
    *   `SELECT`: User hanya bisa membaca profile miliknya sendiri, `admin` bisa membaca semua.
    *   `UPDATE`: User hanya bisa mengedit profile miliknya sendiri.
3.  **Orders & Order Items:**
    *   `SELECT`: User hanya bisa membaca pesanan miliknya (`auth.uid() = user_id`), `admin` bisa membaca semua pesanan.
    *   `INSERT`: User terautentikasi dapat membuat pesanan baru.

---

## 5. Storage Guidelines (Supabase Storage)

*   **Bucket Name:** `product-images` (Public Access: True)
*   **Path Convention:** `products/{product_slug}/{timestamp}_{filename}`
*   **Max File Size:** 2 MB per image.
*   **Allowed MIME Types:** `image/jpeg`, `image/png`, `image/webp`.
*   **Upload Handling:** Selalu kompresi gambar di sisi client (frontend) sebelum diunggah ke Supabase Storage menggunakan library seperti `browser-image-compression`.

---

## 6. Frontend Coding Standards & Best Practices

### 6.1. State Management Rules
*   Gunakan **Zustand** *hanya* untuk client state yang persisten seperti:
    *   `cartStore`: Menyimpan list item di keranjang belanja (disinkronkan dengan `localStorage`).
*   Gunakan **TanStack Query** untuk semua fetching, caching, dan updating data dari Supabase.
    *   Query Key Convention: `['products']`, `['product', slug]`, `['orders', userId]`.

### 6.2. Type Safety
*   Gunakan Supabase CLI untuk menggenerate type TypeScript secara otomatis dari database:
    ```bash
    npx supabase gen types typescript --project-id <your-project-id> > src/types/supabase.ts
    ```
*   Jangan pernah menggunakan `any`. Selalu definisikan tipe data untuk props, form inputs, dan response API.

### 6.3. Form Handling & Validation
*   Semua form (Login, Checkout, Tambah Produk) wajib divalidasi menggunakan **Zustand/React Hook Form + Zod**.
*   Contoh skema validasi checkout toko bunga:
    ```typescript
    const checkoutSchema = zod.object({
      recipient_name: zod.string().min(2, "Nama penerima wajib diisi"),
      recipient_phone: zod.string().min(10, "Nomor telepon minimal 10 digit"),
      delivery_date: zod.string().refine((val) => new Date(val) >= new Date(), {
        message: "Tanggal pengiriman tidak boleh di masa lalu",
      }),
      greeting_card_message: zod.string().max(300, "Maksimal 300 karakter"),
    });
    ```

---

## 7. Workflow Checkout & Flower-Specific Features

1.  **Penjadwalan Pengiriman (Delivery Date):**
    *   Input tanggal wajib menggunakan DatePicker yang membatasi tanggal minimal $H+0$ atau $H+1$ sesuai jam operasional toko.
2.  **Custom Card Message:**
    *   Checkout harus menyediakan field `greeting_card_message` opsional karena bisnis toko bunga bertumpu pada pengiriman hadiah.
3.  **Realtime Stock check:**
    *   Sebelum pembuatan record di `orders`, stok produk harus diverifikasi ulang melalui Supabase RPC (Remote Procedure Call) atau transaksi terisolasi untuk mencegah *overbooking* stok bunga segar.

---

## 8. Deployment & Environment Variables

### Environment Variables (`.env.local`)
```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Git & Code Review Rules
*   Branch Utamanya: `main` (Production) dan `develop` (Staging).
*   Setiap fitur baru dikembangkan pada branch `feature/nama-fitur`.
*   Commit message menggunakan format Conventional Commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`.