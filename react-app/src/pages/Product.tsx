import { useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { CATEGORIES, PRODUCTS, STORE, productById, type Product as ProductT } from "@/data/catalog";
import { useCart, type OrderMode } from "@/lib/cart";
import { useToast } from "@/lib/toast";
import { categoryLabel, fmtLb, money, plural, productImage, round2, unitLabel } from "@/lib/format";
import ProductCard from "@/components/ProductCard";
import ProductImage from "@/components/ProductImage";
import { usePageTitle } from "@/lib/usePageTitle";

function OrderForm({ p }: { p: ProductT }) {
  const { add } = useCart();
  const toast = useToast();
  const modes: OrderMode[] = [];
  if (p.order.weight) modes.push("weight");
  if (p.order.piece) modes.push("piece");

  const defaultQty = (m: OrderMode) => (m === "weight" ? p.order.weight!.min : 1);
  const [mode, setMode] = useState<OrderMode>(modes[0]);
  const [qty, setQty] = useState(defaultQty(modes[0]));
  const [qtyText, setQtyText] = useState<string | null>(null);
  const [options, setOptions] = useState<Record<string, string>>(() => Object.fromEntries(p.options.map((o) => [o.name, o.choices[0]])));
  const [note, setNote] = useState("");
  const [added, setAdded] = useState(false);

  const piece = p.order.piece;
  const pieceLabel = piece?.label ?? "";
  const step = mode === "weight" ? p.order.weight!.step : 1;
  const min = mode === "weight" ? p.order.weight!.min : 1;
  const weight = mode === "weight" ? qty : (piece?.lb ?? 0) * qty;
  const total = p.unit === "each" ? qty * p.price : weight * p.price;

  const switchMode = (m: OrderMode) => {
    setMode(m);
    setQty(defaultQty(m));
    setQtyText(null);
  };
  const bump = (dir: number) => {
    setQty((q) => Math.max(min, round2(q + step * dir)));
    setQtyText(null);
  };
  const commitText = () => {
    const v = parseFloat(qtyText ?? "");
    if (!isNaN(v)) setQty(Math.max(min, Math.round(v / step) * step));
    setQtyText(null);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    add({ id: p.id, mode, qty, options: { ...options }, note: note.trim() });
    setAdded(true);
    toast({ message: `${p.name} added to your order`, link: { to: "/cart", label: "View order" } });
  };

  const hint =
    mode === "weight"
      ? `Minimum ${p.order.weight!.min} lb`
      : piece?.lb
        ? `Approx. ${piece.lb} lb per ${pieceLabel}`
        : p.unitLabel
          ? `Sold as ${p.unitLabel}`
          : "Sold individually";
  const estWeight =
    p.unit === "each"
      ? `${qty} × ${p.unitLabel || pieceLabel}`
      : `≈ ${fmtLb(weight)}` + (mode === "piece" ? ` · ${qty} ${qty > 1 ? plural(pieceLabel) : pieceLabel}` : "");

  return (
    <form onSubmit={submit}>
      {modes.length > 1 && (
        <div className="field">
          <div className="field-label">How would you like to order?</div>
          <div className="mode-switch" role="tablist">
            <button type="button" className={mode === "weight" ? "active" : ""} onClick={() => switchMode("weight")}>
              By weight<small>Choose total lb</small>
            </button>
            <button type="button" className={mode === "piece" ? "active" : ""} onClick={() => switchMode("piece")}>
              By the {pieceLabel}
              <small>~{piece!.lb} lb each</small>
            </button>
          </div>
        </div>
      )}
      <div className="field">
        <div className="field-label">
          <span style={{ color: "inherit", letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 500, fontSize: ".72rem" }}>
            {mode === "weight" ? "Weight" : "Number of " + plural(pieceLabel)}
          </span>
          <span>{hint}</span>
        </div>
        <div className="qty">
          <button type="button" aria-label="Decrease" onClick={() => bump(-1)}>−</button>
          <input
            id="qty"
            inputMode="decimal"
            aria-label="Quantity"
            value={qtyText ?? (mode === "weight" ? `${qty} lb` : String(qty))}
            onFocus={(e) => e.target.select()}
            onChange={(e) => setQtyText(e.target.value)}
            onBlur={commitText}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), commitText())}
          />
          <button type="button" aria-label="Increase" onClick={() => bump(1)}>+</button>
        </div>
      </div>
      {p.options.map((o) => (
        <div className="field" key={o.name}>
          <div className="field-label">{o.name}</div>
          <div className="chips">
            {o.choices.map((c) => (
              <button
                type="button"
                key={c}
                className={`chip${options[o.name] === c ? " active" : ""}`}
                onClick={() => setOptions((prev) => ({ ...prev, [o.name]: c }))}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className="field">
        <div className="field-label">
          Special instructions <span>Optional</span>
        </div>
        <textarea
          className="input"
          id="note"
          rows={2}
          style={{ width: "100%" }}
          placeholder="e.g. trim extra fat, cut into 4 equal pieces, pack in pairs"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
      <div className="estimate">
        <div>
          <div className="estimate-label">Estimated total</div>
          <div className="estimate-weight">{estWeight}</div>
        </div>
        <div className="price">{money(total)}</div>
      </div>
      <button className="btn btn--ox btn--block" type="submit">Add to order</button>
      <div className="added-msg" aria-live="polite">{added ? "✓ Added to your order." : ""}</div>
      <p className="fineprint">
        {p.note ? p.note + " " : ""}Every order is cut and weighed by hand. You are charged for the actual weight — usually within 10% of
        the estimate.
      </p>
    </form>
  );
}

export default function Product() {
  const { id } = useParams();
  const p = productById(id);

  usePageTitle(p ? p.name : "Product not found");

  if (!p) {
    return (
      <div className="wrap">
        <div className="empty">
          <h2>We couldn't find that cut</h2>
          <p>
            <Link className="link-arrow" to="/shop">Back to the shop</Link>
          </p>
        </div>
      </div>
    );
  }

  const catName = CATEGORIES.find((c) => c.id === p.cat)!.name;
  const related = PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id && (p.cat !== "specialty" || x.sub === p.sub)).slice(0, 4);

  return (
    <>
      <div className="wrap">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to={`/shop?cat=${p.cat}`}>{catName}</Link>
          <span>/</span>
          {p.name}
        </nav>
        <div className="pdp">
          <div className="pdp-media">
            <div className="pdp-image">
              <ProductImage key={p.id} src={productImage(p.id)} alt={p.name} name={p.name} sub={categoryLabel(p)} eager />
            </div>
            <div className="pdp-assurance">
              <div><strong>Glatt Beit Yosef</strong>Strictest Sephardic standard</div>
              <div><strong>Hand-cut</strong>To your exact order</div>
              <div><strong>Weighed fairly</strong>Pay actual weight only</div>
            </div>
          </div>
          <div className="pdp-info">
            <span className="eyebrow">{categoryLabel(p)}</span>
            <h1>{p.name}</h1>
            <div className="pdp-tag">{p.tag}</div>
            <div className="pdp-badges">
              <span className="badge badge--ox">Glatt Beit Yosef</span>
              <span className="badge">Badatz Mekor Chaim</span>
              {p.hind && <span className="badge badge--ox">Nikkur Achoraim</span>}
              <span className="badge">Hand-cut to order</span>
            </div>
            <div className="pdp-price">
              <span className="price">{money(p.price)}</span>
              <span className="price"><small>per {unitLabel(p)}</small></span>
            </div>
            <OrderForm key={p.id} p={p} />
            <div className="pdp-details">
              <details open>
                <summary>About this cut</summary>
                <div className="content"><p>{p.desc}</p></div>
              </details>
              <details>
                <summary>Best for</summary>
                <div className="content">
                  <div className="best-list">{p.best.map((b) => <span className="badge" key={b}>{b}</span>)}</div>
                </div>
              </details>
              <details>
                <summary>Kashrut</summary>
                <div className="content">
                  <p>
                    Glatt Beit Yosef, slaughtered and processed under the supervision of Badatz Mekor Chaim.{" "}
                    {p.hind
                      ? "This is a hindquarter cut, made kosher through meticulous Sephardic nikkur achoraim (removal of the forbidden fats and the sciatic nerve) by expert menakrim."
                      : "Every piece is soaked and salted (kashered) according to halacha."}{" "}
                    <Link className="link-arrow" to="/kashrut" style={{ fontSize: ".66rem" }}>Our standard</Link>
                  </p>
                </div>
              </details>
              <details>
                <summary>Delivery &amp; pickup</summary>
                <div className="content">
                  <p>
                    Local delivery and in-store pickup. Orders placed by 12 pm are cut for the next day. Free local delivery on orders
                    over {money(STORE.freeDeliveryFrom)}.{" "}
                    <Link className="link-arrow" to="/about#delivery" style={{ fontSize: ".66rem" }}>Details</Link>
                  </p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>

      <section className="section section--cream">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">From the same counter</span>
              <h2>You may also like</h2>
            </div>
            <Link className="link-arrow" to="/shop">Shop all cuts</Link>
          </div>
          <div className="grid">{related.map((r) => <ProductCard key={r.id} product={r} />)}</div>
        </div>
      </section>
    </>
  );
}
