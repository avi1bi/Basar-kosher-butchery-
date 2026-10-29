import { useMemo, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { CATEGORIES, COMING_SOON, PRODUCTS, type Category, type Product } from "@/data/catalog";
import { categoryLabel } from "@/lib/format";
import { load, save } from "@/lib/storage";
import ProductCard from "@/components/ProductCard";
import ProductImage from "@/components/ProductImage";
import { usePageTitle } from "@/lib/usePageTitle";

type Sort = "default" | "name" | "price-asc" | "price-desc";

function sortProducts(list: Product[], sort: Sort) {
  const l = [...list];
  if (sort === "price-asc") l.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") l.sort((a, b) => b.price - a.price);
  if (sort === "name") l.sort((a, b) => a.name.localeCompare(b.name));
  return l;
}

function ComingSoonPanel({ category }: { category: Category }) {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const id = category.id as "spices" | "wines";

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const list = load<{ email: string; list: string; at: string }[]>("basar.notify", []);
    save("basar.notify", [...list, { email, list: id, at: new Date().toISOString() }]);
    setMsg("Thank you — you're on the list.");
    setEmail("");
  };

  return (
    <section className="shop-section" id={`sec-${id}`}>
      <div className="soon-panel">
        <div className="soon-panel-media">
          <ProductImage src={`/images/site/${id}.jpg`} alt="" name={category.name} sub="Coming soon" />
        </div>
        <div className="soon-panel-copy">
          <span className="eyebrow">{category.name}</span>
          <div className="soon-big">Coming soon</div>
          <h2>{id === "spices" ? "House spice blends & meat rubs" : "Fine kosher wines"}</h2>
          <p>{category.blurb} Leave your email and we'll let you know the moment the collection opens.</p>
          <div className="soon-list">
            {COMING_SOON[id].map((i) => (
              <div key={i.name}>
                <strong>{i.name}</strong>
                <span>{i.note}</span>
              </div>
            ))}
          </div>
          <form className="notify" onSubmit={submit}>
            <input
              id={`notify-${id}`}
              className="input"
              type="email"
              required
              placeholder="Your email address"
              aria-label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="btn btn--light" type="submit">
              Notify me
            </button>
          </form>
          <div className="notify-msg" aria-live="polite">
            {msg}
          </div>
        </div>
      </div>
    </section>
  );
}

function CategorySection({ category, products }: { category: Category; products: Product[] }) {
  if (!products.length) return null;
  const beef = products.filter((p) => p.sub === "beef");
  const lamb = products.filter((p) => p.sub === "lamb");
  return (
    <section className="shop-section" id={`sec-${category.id}`}>
      <div className="shop-section-head">
        <h2>{category.name}</h2>
        <p>
          {category.blurb} · {products.length} item{products.length > 1 ? "s" : ""}
        </p>
      </div>
      {category.id === "specialty" ? (
        <>
          {beef.length > 0 && (
            <>
              <div className="subhead">Beef</div>
              <div className="grid">{beef.map((p) => <ProductCard key={p.id} product={p} />)}</div>
            </>
          )}
          {lamb.length > 0 && (
            <>
              <div className="subhead" style={{ marginTop: 46 }}>Lamb</div>
              <div className="grid">{lamb.map((p) => <ProductCard key={p.id} product={p} />)}</div>
            </>
          )}
        </>
      ) : (
        <div className="grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      )}
    </section>
  );
}

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const catParam = params.get("cat");
  const active = CATEGORIES.some((c) => c.id === catParam) ? catParam! : "all";
  const [query, setQuery] = useState(params.get("q") || "");
  const [sort, setSort] = useState<Sort>("default");

  const activeCat = CATEGORIES.find((c) => c.id === active);
  usePageTitle(activeCat ? activeCat.name : "Shop");

  const term = query.trim().toLowerCase();
  const sections = useMemo(() => {
    const matches = (p: Product) => !term || `${p.name} ${p.tag} ${p.desc} ${categoryLabel(p)}`.toLowerCase().includes(term);
    const cats = active === "all" ? CATEGORIES : CATEGORIES.filter((c) => c.id === active);
    return cats
      .filter((c) => !(c.soon && term))
      .map((c) => ({ category: c, products: c.soon ? [] : sortProducts(PRODUCTS.filter((p) => p.cat === c.id && matches(p)), sort) }))
      .filter((s) => s.category.soon || s.products.length);
  }, [active, term, sort]);

  const tabs = [{ id: "all", name: "All", soon: false }, ...CATEGORIES];
  const selectTab = (id: string) => {
    const next = new URLSearchParams(params);
    if (id === "all") next.delete("cat");
    else next.set("cat", id);
    setParams(next, { replace: true });
  };

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <span className="eyebrow">Online shop</span>
          <h1>{activeCat ? activeCat.name : "The Butcher's Counter"}</h1>
          <p>
            {activeCat
              ? activeCat.blurb
              : "Our full catalog of Glatt Beit Yosef beef, lamb and specialty cuts — order by weight or by the cut."}
          </p>
        </div>
      </section>

      <div className="shop-bar">
        <div className="wrap shop-bar-inner" style={{ paddingLeft: 24, paddingRight: 24 }}>
          <div className="tabs" role="tablist" aria-label="Categories">
            {tabs.map((t) => (
              <button key={t.id} className={`tab${t.id === active ? " active" : ""}`} onClick={() => selectTab(t.id)}>
                {t.name}
                {t.soon && <span className="soon-pill">Soon</span>}
              </button>
            ))}
          </div>
          <div className="shop-controls">
            <label className="sr-only" htmlFor="search">Search cuts</label>
            <input className="input" id="search" type="search" placeholder="Search cuts…" value={query} onChange={(e) => setQuery(e.target.value)} />
            <label className="sr-only" htmlFor="sort">Sort</label>
            <select className="select" id="sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              <option value="default">Butcher's order</option>
              <option value="name">Name A–Z</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="wrap">
        {sections.length ? (
          sections.map(({ category, products }) =>
            category.soon ? (
              <ComingSoonPanel key={category.id} category={category} />
            ) : (
              <CategorySection key={category.id} category={category} products={products} />
            ),
          )
        ) : (
          <div className="empty">
            <h3>No cuts match “{query.trim()}”</h3>
            <p>Try another search, or call us — we're happy to cut something special.</p>
          </div>
        )}
        <p className="disclaimer">
          All products subject to availability, applicable Glatt Beit Yosef certification, approved nikkur and kosher processing
          requirements, and applicable regulations. Prices are per lb unless stated otherwise; your final price is calculated by the
          actual weight of your order.
        </p>
      </div>
    </>
  );
}
