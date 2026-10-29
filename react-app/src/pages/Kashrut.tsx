import { Link } from "react-router-dom";
import { usePageTitle } from "@/lib/usePageTitle";

const STAGES = [
  ["Shechita", "By God-fearing, expert shochtim"],
  ["Bedika", "Lungs fully smooth — Glatt Beit Yosef"],
  ["Nikkur", "Forequarter & hindquarter, Sephardic custom"],
  ["Kashering", "Soaked and salted according to halacha"],
  ["Packing", "Sealed and labeled under supervision"],
];

export default function Kashrut() {
  usePageTitle("Our Kashrut");
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <span className="eyebrow">Our kashrut</span>
          <h1>A standard without compromise</h1>
          <p>Glatt Beit Yosef · Sephardic nikkur achoraim · Under the supervision of Badatz Mekor Chaim</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap prose-grid">
          <aside className="side-card">
            <div className="hebrew">בד״ץ מקור חיים</div>
            <h3 style={{ marginTop: 10 }}>Badatz Mekor Chaim</h3>
            <p style={{ color: "#bfb3a4" }}>
              All of our meat is slaughtered, inspected, porged and kashered under the supervision of Badatz Mekor Chaim.
            </p>
            <ul className="side-list">
              {STAGES.map(([title, text]) => (
                <li key={title}>
                  <strong>{title}</strong>
                  {text}
                </li>
              ))}
            </ul>
          </aside>

          <div className="prose">
            <h2>Why kashrut comes first</h2>
            <p>
              At BASAR, kashrut is the foundation of everything we do. We serve families who will not compromise on the halachic
              standard of the meat they bring home — and neither will we. Every product in our shop is prepared according to the most
              stringent opinions, so that you can serve it at your table with complete peace of mind.
            </p>

            <h2>Glatt Beit Yosef</h2>
            <p>
              After shechita, the lungs of every animal are carefully examined (<em>bedika</em>). Many standards permit an animal
              whose lungs had certain adhesions (<em>sirchot</em>) that were removed. The ruling of <strong>Maran, the Beit Yosef</strong>{" "}
              — Rabbi Yosef Karo, author of the Shulchan Aruch — is far stricter: only an animal whose lungs are completely smooth, with
              no adhesions at all, is acceptable.
            </p>
            <p>
              This is <strong>Glatt Beit Yosef</strong> (<span className="hebrew">חלק בית יוסף</span>), the standard followed by
              Sephardic communities and by all who wish to be stringent. It is the only standard of meat we sell.
            </p>

            <div className="pull">“Only an animal whose lungs are entirely smooth — the ruling of the Beit Yosef — reaches our counter.”</div>

            <h2>Sephardic nikkur achoraim</h2>
            <p>
              The Torah forbids eating certain fats (<em>chelev</em>) and the sciatic nerve (<em>gid hanasheh</em>), most of which are
              found in the hindquarter of the animal. Removing them — <strong>nikkur</strong>, or porging — is painstaking work that
              demands deep halachic knowledge and great skill.
            </p>
            <p>
              Because it is so demanding, many kosher butchers outside of Israel simply do not sell the hindquarter at all. At BASAR,
              the hindquarter is porged by expert <strong>menakrim</strong> according to the custom of the Sephardic communities (
              <span className="hebrew">ניקור אחורי כמנהג הספרדים</span>). This is what allows us to offer cuts that are rarely
              available kosher:
            </p>
            <ul>
              <li>Filet mignon and whole beef tenderloin</li>
              <li>New York strip / striploin</li>
              <li>Picanha and rump steak</li>
              <li>Leg of lamb, lamb tenderloin and lamb sirloin</li>
            </ul>

            <h2>Under the supervision of Badatz Mekor Chaim</h2>
            <p>
              Every stage of the process — shechita, bedika, nikkur, soaking and salting, cutting and packing — is carried out under
              the supervision of <strong>Badatz Mekor Chaim</strong> (<span className="hebrew">בד״ץ מקור חיים</span>). Our meat
              arrives soaked and salted (kashered) according to halacha and is sealed and labeled under supervision.
            </p>
            <p>
              <strong>A note on liver:</strong> by halacha, liver cannot be kashered by salting and must be kashered by broiling over an
              open flame. Please ask us about liver that has already been kashered.
            </p>

            <h2>Questions about our kashrut?</h2>
            <p>
              We are always happy to speak with you or your rav about our standard.{" "}
              <Link className="link-arrow" to="/about#contact">
                Contact us
              </Link>
            </p>

            <p className="disclaimer" style={{ marginTop: 40, paddingBottom: 0 }}>
              All products subject to availability, applicable Glatt Beit Yosef certification, approved nikkur and kosher processing
              requirements, and applicable regulations.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
