import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { STORE } from "@/data/catalog";
import { usePageTitle } from "@/lib/usePageTitle";

const FAQ: { q: string; a: ReactNode }[] = [
  {
    q: "What is the difference between ordering by weight and by the cut?",
    a: "Order by weight when you know how much meat you need (for example 3 lb of brisket). Order by the cut when you want a number of pieces (for example 4 ribeye steaks at 1¼\"). Either way, we show you an estimated weight and price.",
  },
  {
    q: "Why is the final price different from the estimate?",
    a: "Every piece is cut by hand, so weights vary slightly. You only pay for the actual weight of your order — usually within 10% of the estimate. We confirm the final total before charging.",
  },
  {
    q: "How do I pay?",
    a: "No payment is taken online. After you place your order request, we call to confirm your cuts and final weight and take payment by card over the phone, or on delivery or pickup.",
  },
  {
    q: "Why can you offer filet mignon and other hindquarter cuts?",
    a: (
      <>
        Because our hindquarters are porged (nikkur achoraim) by expert menakrim according to Sephardic custom, under the supervision
        of Badatz Mekor Chaim.{" "}
        <Link className="link-arrow" to="/kashrut">
          Learn more
        </Link>
      </>
    ),
  },
  {
    q: "Can I request a custom cut?",
    a: "Absolutely. Use the special instructions box on any product, or call us. We can cut, trim, tie, butterfly, grind or portion to your needs.",
  },
  {
    q: "When will spices and wines be available?",
    a: "Our house spice blends and a curated selection of fine kosher wines are coming soon. Leave your email in the shop to be notified.",
  },
];

const DELIVERY = [
  ["12pm", "Next-day cutting", "Orders placed by 12 pm are cut and packed for the next business day. Whole and half lambs need 3–5 days."],
  ["$250", "Free local delivery", "Free local delivery on orders over $250; a flat $15 fee below that. Orders are packed cold and vacuum-sealed."],
  ["Fri", "Before Shabbat", "Friday orders are ready early. Please order Shabbat and Yom Tov needs ahead — especially before the chagim."],
];

export default function About() {
  usePageTitle("About");
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <span className="eyebrow">About the butchery</span>
          <h1>The craft of the butcher</h1>
          <p>Traditional skill, the strictest kashrut, and an obsession with quality.</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap prose-grid">
          <div>
            <span className="eyebrow">Our story</span>
            <h2 style={{ fontSize: "2.6rem" }}>
              <span className="hebrew" style={{ color: "var(--oxblood)" }}>
                בָּשָׂר
              </span>{" "}
              — simply, meat. Done properly.
            </h2>
            <img className="story-seal" src="/images/brand/basar-seal.png" alt="BASAR Kosher Butchery seal" width={900} height={900} loading="lazy" />
          </div>
          <div className="prose">
            <p>
              BASAR was founded on a simple idea: families who keep a strict standard of kashrut deserve meat of the very highest
              quality — and the full range of cuts that a great butcher shop offers.
            </p>
            <p>
              We work only with Glatt Beit Yosef beef and lamb, porged according to Sephardic custom and supervised by Badatz Mekor
              Chaim. Our butchers break down whole primals in-house, so every steak, roast and chop is cut by hand to your order — at
              the thickness, trim and weight you choose.
            </p>
            <p>
              From a weeknight ground beef to a whole lamb for a simcha, from Shabbat brisket to a perfectly marbled ribeye, we treat
              every order with the same care.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--cream" id="delivery">
        <div className="wrap">
          <div className="center" style={{ marginBottom: 50 }}>
            <span className="eyebrow">Delivery &amp; pickup</span>
            <h2>Fresh to your door</h2>
          </div>
          <div className="steps">
            {DELIVERY.map(([num, title, text]) => (
              <div className="step" key={title}>
                <span className="num">{num}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="faq">
        <div className="wrap prose-grid">
          <div>
            <span className="eyebrow">FAQ</span>
            <h2 style={{ fontSize: "2.6rem" }}>Questions, answered</h2>
            <p className="lead">Can't find what you need? Call the shop — we love talking meat.</p>
          </div>
          <div className="faq">
            {FAQ.map((f, i) => (
              <details key={f.q} open={i === 0}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--cream" id="contact">
        <div className="wrap">
          <div className="center" style={{ marginBottom: 50 }}>
            <span className="eyebrow">Contact</span>
            <h2>Visit or call the shop</h2>
          </div>
          <div className="contact-grid">
            <div className="contact-card">
              <h3>Call or email</h3>
              <p>
                <a href={`tel:${STORE.phone.replace(/[^\d+]/g, "")}`}>{STORE.phone}</a>
              </p>
              <p>
                <a href={`mailto:${STORE.email}`}>{STORE.email}</a>
              </p>
            </div>
            <div className="contact-card">
              <h3>Visit</h3>
              <p>{STORE.address}</p>
            </div>
            <div className="contact-card">
              <h3>Hours</h3>
              {STORE.hours.map(([d, h]) => (
                <div className="hours-row" key={d}>
                  <span>{d}</span>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
