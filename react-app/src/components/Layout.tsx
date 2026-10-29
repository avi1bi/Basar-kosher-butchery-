import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { CATEGORIES, STORE } from "@/data/catalog";
import { useCart } from "@/lib/cart";
import { BagIcon, MenuIcon } from "./Icons";

function ScrollManager() {
  const { pathname, hash, search } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash, search]);
  return null;
}

function Header() {
  const { lines } = useCart();
  const [open, setOpen] = useState(false);
  const { pathname, search } = useLocation();
  useEffect(() => setOpen(false), [pathname, search]);

  const shopLinks = CATEGORIES.map((c) => (
    <Link key={c.id} to={`/shop?cat=${c.id}`}>
      {c.name}
      {c.soon && <span className="soon-pill">Soon</span>}
    </Link>
  ));
  const navClass = ({ isActive }: { isActive: boolean }) => (isActive ? "active" : undefined);

  return (
    <>
      <div className="announce">
        Glatt Beit Yosef<span>·</span>Sephardic Nikkur Achoraim<span className="opt">·</span>
        <span className="opt" style={{ color: "inherit", padding: 0 }}>
          Under the supervision of Badatz Mekor Chaim
        </span>
      </div>
      <header className="site-header">
        <div className="wrap header-inner">
          <button className="icon-btn menu-toggle" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <MenuIcon />
          </button>
          <nav className="nav" aria-label="Primary">
            <div className="nav-dd">
              <button aria-haspopup="true">Shop</button>
              <div className="nav-dd-menu">
                <Link to="/shop">All products</Link>
                {shopLinks}
              </div>
            </div>
            <NavLink to="/kashrut" className={navClass}>
              Our Kashrut
            </NavLink>
            <NavLink to="/about" className={navClass}>
              About
            </NavLink>
          </nav>
          <Link className="logo" to="/" aria-label="BASAR Kosher Butchery — home">
            <img src="/images/brand/basar-logo.png" alt="BASAR Kosher Butchery" width={900} height={273} />
          </Link>
          <div className="header-tools">
            <Link className="hide-sm tool-link" to="/about#contact">
              Contact
            </Link>
            <Link className="icon-btn" to="/cart" aria-label="Your order">
              <BagIcon />
              {lines.length > 0 && <span className="cart-count">{lines.length}</span>}
            </Link>
          </div>
        </div>
        <nav className={`mobile-nav${open ? " open" : ""}`} aria-label="Mobile">
          <Link to="/shop">Shop all</Link>
          {shopLinks}
          <Link to="/kashrut">Our Kashrut</Link>
          <Link to="/about">About</Link>
          <Link to="/about#contact">Contact</Link>
          <Link to="/cart">Your order</Link>
        </nav>
      </header>
    </>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Link className="logo" to="/" aria-label="BASAR Kosher Butchery — home">
              <img src="/images/brand/basar-logo-full.png" alt="BASAR Kosher Butchery — Premium Beef & Lamb" width={1400} height={527} />
            </Link>
            <p>
              Premium beef and lamb, Glatt Beit Yosef with Sephardic nikkur achoraim, under the supervision of Badatz Mekor Chaim. Cut
              by hand, to order.
            </p>
          </div>
          <div>
            <h4>Shop</h4>
            <ul>
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <Link to={`/shop?cat=${c.id}`}>
                    {c.name}
                    {c.soon ? " — soon" : ""}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>The Butchery</h4>
            <ul>
              <li><Link to="/kashrut">Our Kashrut</Link></li>
              <li><Link to="/about">Our Story</Link></li>
              <li><Link to="/about#delivery">Delivery &amp; Pickup</Link></li>
              <li><Link to="/about#faq">FAQ</Link></li>
              <li><Link to="/about#contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4>Visit &amp; Hours</h4>
            <ul>
              <li>{STORE.address}</li>
              <li><a href={`tel:${STORE.phone.replace(/[^\d+]/g, "")}`}>{STORE.phone}</a></li>
              <li><a href={`mailto:${STORE.email}`}>{STORE.email}</a></li>
              {STORE.hours.map(([d, h]) => (
                <li key={d}>
                  <span style={{ color: "#fff" }}>{d}</span>
                  <br />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-legal">
          <p>
            All products subject to availability, applicable Glatt Beit Yosef certification, approved nikkur and kosher processing
            requirements, and applicable regulations. Prices are per lb unless stated; final price is calculated by actual weight.
          </p>
          <p>© {new Date().getFullYear()} BASAR Kosher Butchery</p>
        </div>
      </div>
    </footer>
  );
}

export default function Layout() {
  return (
    <>
      <ScrollManager />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
