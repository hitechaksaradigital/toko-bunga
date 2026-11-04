# Toko Bunga (React + Vite + Supabase)

E-commerce toko bunga berbasis React (Vite) dan Supabase.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Buat file `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Jalankan schema di Supabase: `supabase/schema.sql`.
4. Buat bucket storage `product-images` (public) (sudah di schema).
5. Jalankan dev server:
   ```bash
   npm run dev
   ```

## Struktur

Mengikuti Feature-First Architecture (lihat `src/`).

## Scripts

- `npm run dev` — dev server
- `npm run build` — typecheck + build
- `npm run lint` — lint
