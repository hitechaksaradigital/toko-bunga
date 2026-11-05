# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Existing: React 18+ (Vite), TypeScript, Tailwind CSS + shadcn/ui, Supabase (PostgreSQL, Auth, Storage), Zustand, TanStack Query, React Hook Form + Zod.

## Users

Primary users are individuals who want to send flowers as gifts to others (birthdays, anniversaries, condolences, congratulations). They need to choose arrangements, schedule delivery, and include a greeting card message.

## Product Purpose

An e-commerce flower shop that makes it easy to order fresh flower arrangements online and have them delivered on a chosen date with a personalized card message.

## Positioning

Fast and flexible delivery scheduling: customers can pick a delivery date and have orders delivered on time, with real-time stock verification to avoid overbooking.

## Operating Context

Customers browse catalog, filter by category, add to cart, checkout with recipient details and delivery date, and track orders. Admins manage products, stock, and order status. Payments are handled outside the app (status updated by admin).

## Capabilities and Constraints

- Catalog with categories, search, and product detail.
- Cart persisted in localStorage.
- Checkout with recipient info, delivery date, and greeting card message.
- Order history and tracking for customers.
- Admin product CRUD with image upload and compression.
- Admin order status management.
- Supabase RLS: public read products/categories, authenticated order creation, admin-only writes.
- Storage bucket `product-images` (public).
- No payment gateway integration yet (status managed manually).

## Brand Commitments

- Name: Toko Bunga.
- Visual identity can be refreshed; logo may be replaced with a more attractive one.
- Primary accent: rose/pink (current theme). Can be refined during redesign.

## Evidence on Hand

- Dummy data: 4 categories and 8 products with images in Supabase project `toko-bunga`.
- Admin account: admin@tokobunga.id (for preview).
- No real customer testimonials or brand assets beyond placeholders.

## Product Principles

1. Make gifting flowers effortless: clear product info, simple checkout, flexible delivery.
2. Keep the catalog fresh and visually appealing.
3. Ensure stock accuracy to avoid disappointing customers.
4. Maintain trust through clear order status and delivery details.
5. Admin tools should be straightforward for non-technical shop owners.

## Accessibility & Inclusion

- WCAG AA contrast for text and buttons.
- Responsive layout for mobile and desktop.
- Form validation with clear error messages.
