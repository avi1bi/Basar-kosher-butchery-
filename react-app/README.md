# BASAR Kosher Butchery — React (Lovable-ready)

The BASAR online shop in Lovable's stack: **Vite + React + TypeScript + Tailwind CSS + React Router**.
It is a 1:1 port of the static site in the parent folder: same design, photos, logo, catalog and ordering logic.

## Run locally
```bash
npm install
npm run dev        # http://localhost:8080
npm run build      # production build in dist/
```

## Where things live
| What | File |
|---|---|
| Products, prices, options, store phone/email/hours | `src/data/catalog.ts` |
| Pages (Home, Shop, Product, Cart, Kashrut, About) | `src/pages/` |
| Header, footer, product card, image fallback | `src/components/` |
| Cart (saved in the browser), formatting, toast | `src/lib/` |
| Styles + brand tokens | `src/index.css`, `tailwind.config.ts` |
| Product photos | `public/images/products/<product-id>.jpg` |
| Logo, seal, favicon | `public/images/brand/` |

## Styling
The original design lives in `src/index.css` as named component classes (`.hero`, `.card`, `.pdp`…) inside Tailwind's
`@layer components`, so Tailwind utility classes added later still override them.
Brand colours and fonts are also Tailwind tokens: `bg-burgundy`, `text-gold`, `border-line`, `font-serif`, `font-hebrew`…

## Routes
`/` · `/shop?cat=beef|lamb|specialty|spices|wines` · `/product/:id` · `/cart` · `/kashrut` · `/about#delivery|faq|contact`

## Orders
No online payment. "Place order request" saves the order and opens an email to the store with the full order,
matching how the shop confirms final weights by phone.
