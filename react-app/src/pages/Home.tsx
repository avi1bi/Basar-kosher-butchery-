import { Link } from "react-router-dom";
import { PRODUCTS, productById } from "@/data/catalog";
import ProductCard from "@/components/ProductCard";
import ProductImage from "@/components/ProductImage";
import { ClockIcon, KnifeIcon, ShieldIcon, TruckIcon } from "@/components/Icons";
import { usePageTitle } from "@/lib/usePageTitle";

const FEATURED = [
  "ribeye-steak",
  "filet-mignon-tenderloin",
  "picanha",
  "brisket-first-cut",
  "short-ribs-flanken",
  "lamb-rack",
  "lamb-rib-chops",
  "beef-cheeks",
];

const count = (cat: string) => PRODUCTS.filter((p) => p.cat === cat).length;

const PILLARS = [
  { Icon: ShieldIcon, title: "Glatt Beit Yosef", text: "The strictest Sephardic standard of glatt." },
  { Icon: KnifeIcon, title: "Nikkur Achoraim", text: "Hindquarter cuts, porged by expert menakrim." },
  { Icon: ClockIcon, title: "Cut to Order", text: "Every steak and roast hand-cut for you." },
  { Icon: TruckIcon, title: "Delivery & Pickup", text: "Local delivery or collect from the shop." },
];

const STEPS = [
  {
    title: "Order by weight or by the cut",
    text: "Choose the total weight you need, or the number of steaks, chops or roasts — with your thickness, trim and preparation.",
  },
  {
    title: "Hand-cut & weighed",
    text: "Our butchers prepare your order fresh. You pay for the actual weight — we'll confirm your final total before charging.",
  },
  {
    title: "Delivered or ready for pickup",
    text: "Vacuum-sealed and labeled, delivered to your door or ready at the shop on the day you choose.",
  },
];

export default function Home() {
  usePageTitle();
  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Kosher Butchery · Online Shop</span>
            <h1>
              The finest kosher meat, <em>cut by hand</em> for your table.
            </h1>
            <p className="lead">
              Premium beef and lamb prepared to the strictest standard — Glatt Beit Yosef with Sephardic nikkur achoraim, under the
              supervision of Badatz Mekor Chaim. Order online by weight or by the cut.
            </p>
            <div className="hero-ctas">
              <Link className="btn btn--ox" to="/shop">
                Shop the counter
              </Link>
              <Link className="btn btn--light" to="/kashrut">
                Our kashrut
              </Link>
            </div>
          </div>
          <div className="hero-media">
            <img src="/images/site/hero.jpg" alt="Ribeye, rack of lamb and picanha on a walnut butcher block" />
            <img className="hero-seal" src="/images/brand/basar-seal.png" alt="BASAR Kosher Butchery — Premium Beef & Lamb seal" width={900} height={900} />
          </div>
        </div>
      </section>

      <section className="pillars">
        <div className="wrap pillars-grid">
          {PILLARS.map(({ Icon, title, text }) => (
            <div className="pillar" key={title}>
              <Icon />
              <div>
                <h4>{title}</h4>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Shop by category</span>
              <h2>From the butcher's counter</h2>
            </div>
            <Link className="link-arrow" to="/shop">
              View the full catalog
            </Link>
          </div>
          <div className="cat-grid">
            <Link className="cat-tile wide" to="/shop?cat=beef">
              <ProductImage src="/images/products/ribeye-steak.jpg" alt="" name="Beef" />
              <div className="cat-tile-copy">
                <h3>Beef</h3>
                <p>{count("beef")} cuts — steaks, roasts, brisket, ribs &amp; more</p>
                <span className="link-arrow">Shop beef</span>
              </div>
            </Link>
            <Link className="cat-tile wide" to="/shop?cat=lamb">
              <ProductImage src="/images/products/lamb-rack.jpg" alt="" name="Lamb" />
              <div className="cat-tile-copy">
                <h3>Lamb</h3>
                <p>{count("lamb")} cuts — whole &amp; half lamb, racks, chops, legs</p>
                <span className="link-arrow">Shop lamb</span>
              </div>
            </Link>
            <Link className="cat-tile" to="/shop?cat=specialty">
              <ProductImage src="/images/products/beef-cheeks.jpg" alt="" name="Organ Meats" sub="& Specialty Cuts" />
              <div className="cat-tile-copy">
                <h3>Organ &amp; Specialty</h3>
                <p>{count("specialty")} traditional cuts</p>
                <span className="link-arrow">Explore</span>
              </div>
            </Link>
            <Link className="cat-tile" to="/shop?cat=spices">
              <ProductImage src="/images/site/spices.jpg" alt="" name="Spices" sub="& Rubs" />
              <span className="soon-pill">Coming soon</span>
              <div className="cat-tile-copy">
                <h3>Spices &amp; Rubs</h3>
                <p>House blends for meat</p>
                <span className="link-arrow">Preview</span>
              </div>
            </Link>
            <Link className="cat-tile" to="/shop?cat=wines">
              <ProductImage src="/images/site/wines.jpg" alt="" name="Kosher Wines" sub="Fine cellar" />
              <span className="soon-pill">Coming soon</span>
              <div className="cat-tile-copy">
                <h3>Kosher Wines</h3>
                <p>Fine wines for the table</p>
                <span className="link-arrow">Preview</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="wrap kashrut-band">
          <div>
            <span className="eyebrow">Our kashrut</span>
            <h2>Uncompromising, from the shechita to your table.</h2>
            <p style={{ color: "#bfb3a4", marginBottom: 30 }}>
              Kashrut is not a label we add at the end — it is how every animal is chosen, every cut is prepared, and every order is
              packed.
            </p>
            <div className="kashrut-points">
              <div className="kashrut-point">
                <span className="num">I</span>
                <div>
                  <h4>Glatt Beit Yosef</h4>
                  <p>
                    Only animals whose lungs are completely free of adhesions (<span className="hebrew">חלק</span>), according to the
                    ruling of the Beit Yosef — the strictest Sephardic standard.
                  </p>
                </div>
              </div>
              <div className="kashrut-point">
                <span className="num">II</span>
                <div>
                  <h4>Sephardic Nikkur Achoraim</h4>
                  <p>
                    The hindquarter is porged by expert menakrim — removing the chelev and gid hanasheh — according to Sephardic
                    custom, so we can offer filet, striploin, picanha and leg of lamb.
                  </p>
                </div>
              </div>
              <div className="kashrut-point">
                <span className="num">III</span>
                <div>
                  <h4>Badatz Mekor Chaim</h4>
                  <p>Every stage — shechita, bedika, nikkur, soaking and salting — under the supervision of Badatz Mekor Chaim.</p>
                </div>
              </div>
            </div>
            <p style={{ marginTop: 34 }}>
              <Link className="btn btn--light" to="/kashrut">
                Read our full standard
              </Link>
            </p>
          </div>
          <div>
            <div className="seal-big">
              <div>
                <div className="hebrew">בד״ץ מקור חיים</div>
                <small>Under the supervision of</small>
                <strong>Badatz Mekor Chaim</strong>
                <small>Glatt Beit Yosef · Nikkur Achoraim</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">The butcher's selection</span>
              <h2>Signature cuts</h2>
            </div>
            <Link className="link-arrow" to="/shop">
              Shop all cuts
            </Link>
          </div>
          <div className="grid">
            {FEATURED.map((id) => (
              <ProductCard key={id} product={productById(id)!} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--cream">
        <div className="wrap">
          <div className="center" style={{ marginBottom: 50 }}>
            <span className="eyebrow">How ordering works</span>
            <h2>Your cut, your way</h2>
            <p className="lead">Order exactly the way you would at our counter — we cut, weigh and pack every order by hand.</p>
          </div>
          <div className="steps">
            {STEPS.map((s, i) => (
              <div className="step" key={s.title}>
                <span className="num">{String(i + 1).padStart(2, "0")}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Coming soon</span>
              <h2>To complete the table</h2>
            </div>
          </div>
          <div className="soon-split">
            <Link className="soon-card" to="/shop?cat=spices">
              <ProductImage src="/images/site/spices.jpg" alt="" name="Spices & Rubs" sub="Coming soon" />
              <div className="soon-card-copy">
                <span className="eyebrow">Coming soon</span>
                <h3>Spices &amp; Rubs</h3>
                <p>House blends — baharat, shawarma, ras el hanout, hawaij and our steakhouse rub.</p>
                <span className="link-arrow">Get notified</span>
              </div>
            </Link>
            <Link className="soon-card" to="/shop?cat=wines">
              <ProductImage src="/images/site/wines.jpg" alt="" name="Kosher Wines" sub="Coming soon" />
              <div className="soon-card-copy">
                <span className="eyebrow">Coming soon</span>
                <h3>Fine Kosher Wines</h3>
                <p>A curated cellar of quality kosher wines, chosen to pour beside the cut.</p>
                <span className="link-arrow">Get notified</span>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
