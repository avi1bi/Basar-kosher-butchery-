# BASAR Kosher Butchery — online shop

A static, dependency-free website for BASAR Kosher Butchery: premium Glatt Beit Yosef beef and lamb with Sephardic nikkur achoraim, under the supervision of Badatz Mekor Chaim.

Open `index.html` in a browser, or host the folder on any static host (GitHub Pages, Netlify, etc.).

## Pages
| Page | What it does |
|---|---|
| `index.html` | Home — hero, categories, kashrut, signature cuts, how ordering works, coming soon |
| `shop.html` | Full catalog with category tabs, search and sort (`shop.html?cat=beef`) |
| `product.html?id=…` | Product page — order **by weight** or **by the cut**, thickness / trim / prep options, live price estimate |
| `cart.html` | Order summary + checkout (delivery or pickup, date & time) |
| `kashrut.html` | Our kashrut standard |
| `about.html` | Story, delivery & pickup, FAQ, contact |

Spices & Rubs and Kosher Wines are shown as **Coming soon** with an email "notify me" form.

## Editing
- **Products, prices, options:** `assets/js/catalog.js` (prices are placeholders, per lb in USD).
- **Phone, email, address, hours, delivery fee:** the `STORE` object at the bottom of `catalog.js`.
- **Photos:** `assets/img/products/<product-id>.jpg` (16:9 works best). Until a photo exists, the site shows a branded placeholder automatically.

## Product photography
All photos share one prompt template (`tools/image-prompts.json`) so they look like one shoot: raw cut on a dark slate board, walnut table, sea salt and rosemary, soft window light.
To generate the remaining photos: `OPENAI_API_KEY=… python3 tools/generate_images.py` (skips photos that already exist).

## Orders
There is no payment processing. "Place order request" saves the order and opens an email to the store with the full order, matching how the shop confirms final weights by phone. To take payments online, connect Shopify / Square / Stripe later.
