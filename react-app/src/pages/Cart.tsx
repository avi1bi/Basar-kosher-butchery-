import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { STORE, productById } from "@/data/catalog";
import { lineDescription, lineTotal, useCart, type CartLine } from "@/lib/cart";
import { categoryLabel, money, productImage, unitLabel } from "@/lib/format";
import { load, save } from "@/lib/storage";
import ProductImage from "@/components/ProductImage";
import { usePageTitle } from "@/lib/usePageTitle";

type Fulfilment = "delivery" | "pickup";

interface Confirmation {
  orderNo: string;
  name: string;
  phone: string;
  mailto: string;
}

const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
};

function CartRow({ line }: { line: CartLine }) {
  const { setQty, remove } = useCart();
  const p = productById(line.id)!;
  const step = line.mode === "weight" ? p.order.weight!.step : 1;
  const min = line.mode === "weight" ? p.order.weight!.min : 1;
  return (
    <div className="cart-line">
      <Link className="cart-thumb" to={`/product/${p.id}`}>
        <ProductImage src={productImage(p.id)} alt={p.name} name={p.name} sub={categoryLabel(p)} />
      </Link>
      <div>
        <h3>
          <Link to={`/product/${p.id}`}>{p.name}</Link>
        </h3>
        <div className="cart-meta">
          {lineDescription(line).map((d) => (
            <div key={d}>{d}</div>
          ))}
          <div>
            {money(p.price)} / {unitLabel(p)}
          </div>
        </div>
      </div>
      <div className="cart-line-right">
        <span className="price">{money(lineTotal(line, p))}</span>
        <div className="qty qty--sm">
          <button type="button" aria-label="Decrease" onClick={() => setQty(line.key, Math.max(min, line.qty - step))}>−</button>
          <input value={line.mode === "weight" ? `${line.qty} lb` : line.qty} readOnly aria-label="Quantity" />
          <button type="button" aria-label="Increase" onClick={() => setQty(line.key, line.qty + step)}>+</button>
        </div>
        <button className="remove" type="button" onClick={() => remove(line.key)}>Remove</button>
      </div>
    </div>
  );
}

export default function Cart() {
  const { lines, subtotal, clear } = useCart();
  const [fulfil, setFulfil] = useState<Fulfilment>("delivery");
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", city: "", zip: "", date: tomorrow(), slot: "Morning (9–12)", notes: "" });
  const [confirmed, setConfirmed] = useState<Confirmation | null>(null);

  usePageTitle("Your Order");

  const fee = fulfil === "delivery" && subtotal > 0 && subtotal < STORE.freeDeliveryFrom ? STORE.deliveryFee : 0;
  const total = subtotal + fee;
  const set = (k: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!lines.length) return;
    const orderNo = "BSR-" + Date.now().toString(36).toUpperCase().slice(-6);
    const items = lines.map((l) => `• ${productById(l.id)!.name} — ${lineDescription(l).join("; ")} — est. ${money(lineTotal(l))}`).join("\n");
    const body = `New order ${orderNo}

${items}

Estimated subtotal: ${money(subtotal)}
${fulfil === "delivery" ? "Delivery" : "Pickup"}: ${fee ? money(fee) : "Free"}
Estimated total: ${money(total)}

Name: ${form.name}
Phone: ${form.phone}
Email: ${form.email}
${fulfil === "delivery" ? `Delivery address: ${form.address}, ${form.city} ${form.zip}` : "Store pickup"}
Requested date: ${form.date} (${form.slot})
Notes: ${form.notes || "—"}`;
    const orders = load<unknown[]>("basar.orders", []);
    save("basar.orders", [...orders, { orderNo, at: new Date().toISOString(), items: lines, customer: { ...form, fulfil }, totals: { subtotal, fee, total } }]);
    clear();
    setConfirmed({
      orderNo,
      name: form.name,
      phone: form.phone,
      mailto: `mailto:${STORE.email}?subject=${encodeURIComponent("Order " + orderNo)}&body=${encodeURIComponent(body)}`,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (confirmed) {
    return (
      <div className="wrap">
        <div className="confirm">
          <img className="seal" src="/images/brand/basar-seal.png" alt="BASAR Kosher Butchery seal" />
          <span className="eyebrow">Order {confirmed.orderNo}</span>
          <h1 style={{ fontSize: "3rem" }}>Thank you, {confirmed.name.split(" ")[0]}.</h1>
          <p className="lead">
            Your order request has been prepared. Our butchers will call you at <strong>{confirmed.phone}</strong> to confirm cuts and
            timing. Payment is taken on confirmation, by actual weight.
          </p>
          <p style={{ margin: "30px 0 10px" }}>
            <a className="btn btn--ox" href={confirmed.mailto}>Send order to the butchery</a>
          </p>
          <p className="fineprint">
            This opens your email app with the full order filled in. If it doesn't open, email us at{" "}
            <strong style={{ userSelect: "all" }}>{STORE.email}</strong> or call {STORE.phone}.
          </p>
          <p style={{ marginTop: 30 }}>
            <Link className="link-arrow" to="/shop">Continue shopping</Link>
          </p>
        </div>
      </div>
    );
  }

  if (!lines.length) {
    return (
      <div className="wrap">
        <div className="empty" style={{ padding: "90px 0 120px" }}>
          <h2>Your order is empty</h2>
          <p>Visit the counter to choose your cuts.</p>
          <p style={{ marginTop: 26 }}>
            <Link className="btn" to="/shop">Shop the counter</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>Your order
      </nav>
      <h1 style={{ fontSize: "clamp(2.4rem,4vw,3.4rem)" }}>Your order</h1>
      <div className="cart-layout">
        <div>
          <div>
            {lines.map((l) => (
              <CartRow key={l.key} line={l} />
            ))}
          </div>
          <p className="fineprint" style={{ marginTop: 20 }}>
            Prices shown are estimates. Each item is cut and weighed by hand and you are charged for the actual weight. All products
            subject to availability, applicable Glatt Beit Yosef certification, approved nikkur and kosher processing requirements, and
            applicable regulations.
          </p>
          <p style={{ marginTop: 20 }}>
            <Link className="link-arrow" to="/shop">Continue shopping</Link>
          </p>
        </div>

        <form className="summary" onSubmit={submit}>
          <h2>Checkout</h2>
          <div className="sum-row"><span>Estimated subtotal</span><span>{money(subtotal)}</span></div>
          <div className="sum-row"><span>{fulfil === "delivery" ? "Local delivery" : "Store pickup"}</span><span>{fee ? money(fee) : "Free"}</span></div>
          <div className="sum-row total"><span>Estimated total</span><span>{money(total)}</span></div>
          {fulfil === "delivery" && subtotal < STORE.freeDeliveryFrom && (
            <p className="fineprint">Add {money(STORE.freeDeliveryFrom - subtotal)} more for free local delivery.</p>
          )}

          <div className="field" style={{ marginTop: 24 }}>
            <div className="field-label">Fulfillment</div>
            <div className="radio-cards">
              <label className="radio-card">
                <input type="radio" name="fulfil" value="delivery" checked={fulfil === "delivery"} onChange={() => setFulfil("delivery")} />
                <strong>Local delivery</strong>
                <small>Free over {money(STORE.freeDeliveryFrom).replace(".00", "")}</small>
              </label>
              <label className="radio-card">
                <input type="radio" name="fulfil" value="pickup" checked={fulfil === "pickup"} onChange={() => setFulfil("pickup")} />
                <strong>Store pickup</strong>
                <small>Always free</small>
              </label>
            </div>
          </div>

          <div className="form-grid">
            <div className="full"><label htmlFor="name">Full name</label><input className="input" id="name" required autoComplete="name" value={form.name} onChange={set("name")} /></div>
            <div><label htmlFor="phone">Phone</label><input className="input" id="phone" type="tel" required autoComplete="tel" value={form.phone} onChange={set("phone")} /></div>
            <div><label htmlFor="email">Email</label><input className="input" id="email" type="email" required autoComplete="email" value={form.email} onChange={set("email")} /></div>
            {fulfil === "delivery" && (
              <>
                <div className="full"><label htmlFor="address">Street address</label><input className="input" id="address" required autoComplete="street-address" value={form.address} onChange={set("address")} /></div>
                <div><label htmlFor="city">City</label><input className="input" id="city" required autoComplete="address-level2" value={form.city} onChange={set("city")} /></div>
                <div><label htmlFor="zip">ZIP</label><input className="input" id="zip" required autoComplete="postal-code" value={form.zip} onChange={set("zip")} /></div>
              </>
            )}
            <div><label htmlFor="date">Date</label><input className="input" id="date" type="date" required min={tomorrow()} value={form.date} onChange={set("date")} /></div>
            <div>
              <label htmlFor="slot">Time</label>
              <select className="select" id="slot" value={form.slot} onChange={set("slot")}>
                <option>Morning (9–12)</option>
                <option>Afternoon (12–4)</option>
                <option>Evening (4–7)</option>
              </select>
            </div>
            <div className="full"><label htmlFor="notes">Order notes</label><textarea className="input" id="notes" rows={3} placeholder="Anything our butchers should know" value={form.notes} onChange={set("notes")} /></div>
          </div>
          <button className="btn btn--ox btn--block" type="submit" style={{ marginTop: 20 }}>Place order request</button>
          <p className="fineprint">
            No payment is taken online. We'll call to confirm your cuts and final weight, then take payment by card over the phone or on
            delivery/pickup.
          </p>
        </form>
      </div>
    </div>
  );
}
