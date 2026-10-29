import { Link } from "react-router-dom";
import type { Product } from "@/data/catalog";
import { categoryLabel, money, productImage, unitLabel } from "@/lib/format";
import ProductImage from "./ProductImage";

export default function ProductCard({ product: p }: { product: Product }) {
  const href = `/product/${p.id}`;
  return (
    <article className="card">
      <Link className="card-media" to={href} aria-label={p.name}>
        {p.hind ? (
          <span className="card-badge">Hindquarter · Nikkur</span>
        ) : p.featured ? (
          <span className="card-badge">Butcher's pick</span>
        ) : null}
        <ProductImage src={productImage(p.id)} alt={p.name} name={p.name} sub={categoryLabel(p)} />
      </Link>
      <div className="card-body">
        <div className="card-cat">{categoryLabel(p)}</div>
        <h3>
          <Link to={href}>{p.name}</Link>
        </h3>
        <div className="card-tag">{p.tag}</div>
        <div className="card-foot">
          <span className="price">
            {money(p.price)} <small>/ {unitLabel(p)}</small>
          </span>
          <Link className="link-arrow" to={href}>
            Order
          </Link>
        </div>
      </div>
    </article>
  );
}
