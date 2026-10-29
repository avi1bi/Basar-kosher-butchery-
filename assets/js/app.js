/* BASAR Kosher Butchery — shared layout, cart and page logic */
(function () {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const money = n => "$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const fmtLb = n => (Math.round(n * 100) / 100).toString() + " lb";
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const byId = id => PRODUCTS.find(p => p.id === id);
  const catName = p => p.cat === "specialty" ? (p.sub === "lamb" ? "Lamb · Specialty" : "Beef · Specialty") : CATEGORIES.find(c => c.id === p.cat).name;
  const img = id => `assets/img/products/${id}.jpg`;
  const unitLabel = p => p.unit === "each" ? (p.unitLabel || "each") : "lb";

  /* ── Storage (falls back to memory when blocked) ── */
  const mem = {};
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return k in mem ? mem[k] : d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { mem[k] = v; } }
  };

  /* ── Images with an elegant fallback when a photo isn't in place yet ── */
  function placeholder(name, sub) {
    return `<div class="ph"><div class="ph-inner"><div class="ph-mark">BASAR</div><div class="ph-name">${esc(name)}</div><div class="ph-rule"></div><div class="ph-sub">${esc(sub || "Glatt Beit Yosef")}</div></div></div>`;
  }
  function photo(p, opts = {}) {
    return `<img src="${img(p.id)}" alt="${esc(p.name)}" loading="${opts.eager ? "eager" : "lazy"}" data-ph-name="${esc(p.name)}" data-ph-sub="${esc(catName(p))}">`;
  }
  document.addEventListener("error", e => {
    const t = e.target;
    if (t.tagName === "IMG" && t.dataset.phName !== undefined) t.outerHTML = placeholder(t.dataset.phName, t.dataset.phSub);
  }, true);

  /* ── Cart ── */
  const Cart = {
    items() { return store.get("basar.cart", []); },
    save(items) { store.set("basar.cart", items); updateCount(); },
    lineWeight(line) {
      const p = byId(line.id);
      if (!p) return 0;
      if (line.mode === "weight") return line.qty;
      return p.order.piece.lb ? line.qty * p.order.piece.lb : 0;
    },
    lineTotal(line) {
      const p = byId(line.id);
      if (!p) return 0;
      return p.unit === "each" ? line.qty * p.price : this.lineWeight(line) * p.price;
    },
    add(line) {
      const items = this.items();
      const key = line.id + "|" + line.mode + "|" + JSON.stringify(line.options) + "|" + (line.note || "");
      const existing = items.find(i => i.key === key);
      if (existing) existing.qty = Math.round((existing.qty + line.qty) * 100) / 100;
      else items.push({ ...line, key });
      this.save(items);
    },
    count() { return this.items().length; },
    subtotal() { return this.items().reduce((s, l) => s + this.lineTotal(l), 0); }
  };
  function updateCount() {
    $$(".cart-count").forEach(el => { const n = Cart.count(); el.textContent = n || ""; el.dataset.n = n; });
  }

  let toastTimer;
  function toast(html) {
    let t = $(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.innerHTML = html;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 3800);
  }

  /* ── Layout ── */
  const ICONS = {
    bag: '<svg viewBox="0 0 24 24"><path d="M5 8h14l-1.2 12.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    menu: '<svg viewBox="0 0 24 24"><path d="M3 7h18M3 12h18M3 17h18"/></svg>',
    phone: '<svg viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>'
  };

  function header(page) {
    const shopLinks = CATEGORIES.map(c => `<a href="shop.html?cat=${c.id}">${c.name}${c.soon ? '<span class="soon-pill">Soon</span>' : ""}</a>`).join("");
    const a = (href, label, key) => `<a href="${href}"${page === key ? ' class="active"' : ""}>${label}</a>`;
    return `
    <div class="announce">Glatt Beit Yosef<span>·</span>Sephardic Nikkur Achoraim<span class="opt">·</span><span class="opt" style="color:inherit;padding:0">Under the supervision of Badatz Mekor Chaim</span></div>
    <header class="site-header">
      <div class="wrap header-inner">
        <button class="icon-btn menu-toggle" aria-label="Open menu" aria-expanded="false">${ICONS.menu}</button>
        <nav class="nav" aria-label="Primary">
          <div class="nav-dd"><button aria-haspopup="true">Shop</button><div class="nav-dd-menu"><a href="shop.html">All products</a>${shopLinks}</div></div>
          ${a("kashrut.html", "Our Kashrut", "kashrut")}
          ${a("about.html", "About", "about")}
        </nav>
        <a class="logo" href="index.html" aria-label="BASAR Kosher Butchery — home">
          <span class="logo-mark">BASAR</span><span class="logo-sub">Kosher <b>·</b> Butchery</span>
        </a>
        <div class="header-tools">
          <a class="hide-sm tool-link" href="about.html#contact">Contact</a>
          <a class="icon-btn" href="cart.html" aria-label="Your order">${ICONS.bag}<span class="cart-count"></span></a>
        </div>
      </div>
      <nav class="mobile-nav" aria-label="Mobile">
        <a href="shop.html">Shop all</a>${shopLinks}
        <a href="kashrut.html">Our Kashrut</a><a href="about.html">About</a><a href="about.html#contact">Contact</a><a href="cart.html">Your order</a>
      </nav>
    </header>`;
  }

  function footer() {
    const hours = STORE.hours.map(([d, h]) => `<li><span style="color:#fff">${d}</span><br>${h}</li>`).join("");
    return `
    <footer class="site-footer">
      <div class="wrap">
        <div class="footer-grid">
          <div>
            <a class="logo" href="index.html"><span class="logo-mark">BASAR</span><span class="logo-sub">Kosher <b>·</b> Butchery</span></a>
            <p>Premium beef and lamb, Glatt Beit Yosef with Sephardic nikkur achoraim, under the supervision of Badatz Mekor Chaim. Cut by hand, to order.</p>
          </div>
          <div><h4>Shop</h4><ul>${CATEGORIES.map(c => `<li><a href="shop.html?cat=${c.id}">${c.name}${c.soon ? " — soon" : ""}</a></li>`).join("")}</ul></div>
          <div><h4>The Butchery</h4><ul><li><a href="kashrut.html">Our Kashrut</a></li><li><a href="about.html">Our Story</a></li><li><a href="about.html#delivery">Delivery &amp; Pickup</a></li><li><a href="about.html#faq">FAQ</a></li><li><a href="about.html#contact">Contact</a></li></ul></div>
          <div><h4>Visit &amp; Hours</h4><ul><li>${esc(STORE.address)}</li><li><a href="tel:${STORE.phone.replace(/[^\d+]/g, "")}">${esc(STORE.phone)}</a></li><li><a href="mailto:${STORE.email}">${esc(STORE.email)}</a></li>${hours}</ul></div>
        </div>
        <div class="footer-legal">
          <p>All products subject to availability, applicable Glatt Beit Yosef certification, approved nikkur and kosher processing requirements, and applicable regulations. Prices are per lb unless stated; final price is calculated by actual weight.</p>
          <p>© ${new Date().getFullYear()} BASAR Kosher Butchery</p>
        </div>
      </div>
    </footer>`;
  }

  function mountLayout() {
    const page = document.body.dataset.page;
    $("#site-header").outerHTML = header(page);
    $("#site-footer").outerHTML = footer();
    const toggle = $(".menu-toggle"), mnav = $(".mobile-nav");
    toggle.addEventListener("click", () => {
      const open = mnav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
    });
    updateCount();
  }

  /* ── Product card ── */
  function card(p) {
    const badge = p.hind ? '<span class="card-badge">Hindquarter · Nikkur</span>' : (p.featured ? '<span class="card-badge">Butcher\'s pick</span>' : "");
    return `
    <article class="card">
      <a class="card-media" href="product.html?id=${p.id}" aria-label="${esc(p.name)}">${badge}${photo(p)}</a>
      <div class="card-body">
        <div class="card-cat">${esc(catName(p))}</div>
        <h3><a href="product.html?id=${p.id}">${esc(p.name)}</a></h3>
        <div class="card-tag">${esc(p.tag)}</div>
        <div class="card-foot">
          <span class="price">${money(p.price)} <small>/ ${unitLabel(p)}</small></span>
          <a class="link-arrow" href="product.html?id=${p.id}">Order</a>
        </div>
      </div>
    </article>`;
  }

  /* ── Home ── */
  function initHome() {
    const featured = ["ribeye-steak", "filet-mignon-tenderloin", "picanha", "brisket-first-cut", "short-ribs-flanken", "lamb-rack", "lamb-rib-chops", "beef-cheeks"];
    $("#featured").innerHTML = featured.map(id => card(byId(id))).join("");
    $$("[data-count]").forEach(el => {
      const c = el.dataset.count;
      el.textContent = PRODUCTS.filter(p => p.cat === c).length;
    });
  }

  /* ── Shop ── */
  function initShop() {
    const params = new URLSearchParams(location.search);
    let active = params.get("cat") || "all";
    if (active !== "all" && !CATEGORIES.some(c => c.id === active)) active = "all";
    const tabsEl = $("#tabs"), listEl = $("#shop-list"), q = $("#search"), sort = $("#sort");
    q.value = params.get("q") || "";

    const tabs = [{ id: "all", name: "All" }, ...CATEGORIES];
    function drawTabs() {
      tabsEl.innerHTML = tabs.map(t => `<button class="tab${t.id === active ? " active" : ""}" data-cat="${t.id}">${t.name}${t.soon ? '<span class="soon-pill">Soon</span>' : ""}</button>`).join("");
    }
    function sorted(list) {
      const s = sort.value;
      const l = [...list];
      if (s === "price-asc") l.sort((a, b) => a.price - b.price);
      if (s === "price-desc") l.sort((a, b) => b.price - a.price);
      if (s === "name") l.sort((a, b) => a.name.localeCompare(b.name));
      return l;
    }
    function soonPanel(c) {
      const items = COMING_SOON[c.id].map(i => `<div><strong>${esc(i.name)}</strong><span>${esc(i.note)}</span></div>`).join("");
      const media = c.id === "spices" ? "assets/img/site/spices.jpg" : "assets/img/site/wines.jpg";
      return `
      <section class="shop-section" id="sec-${c.id}">
        <div class="soon-panel">
          <div class="soon-panel-media"><img src="${media}" alt="" data-ph-name="${esc(c.name)}" data-ph-sub="Coming soon"></div>
          <div class="soon-panel-copy">
            <span class="eyebrow">${esc(c.name)}</span>
            <div class="soon-big">Coming soon</div>
            <h2>${c.id === "spices" ? "House spice blends & meat rubs" : "Fine kosher wines"}</h2>
            <p>${esc(c.blurb)} Leave your email and we'll let you know the moment the collection opens.</p>
            <div class="soon-list">${items}</div>
            <form class="notify" data-list="${c.id}"><input class="input" type="email" required placeholder="Your email address" aria-label="Email"><button class="btn btn--light" type="submit">Notify me</button></form>
            <div class="notify-msg" aria-live="polite"></div>
          </div>
        </div>
      </section>`;
    }
    function section(c, list) {
      if (c.soon) return soonPanel(c);
      if (!list.length) return "";
      let body;
      if (c.id === "specialty") {
        const beef = list.filter(p => p.sub === "beef"), lamb = list.filter(p => p.sub === "lamb");
        body = (beef.length ? `<div class="subhead">Beef</div><div class="grid">${beef.map(card).join("")}</div>` : "") +
               (lamb.length ? `<div class="subhead" style="margin-top:46px">Lamb</div><div class="grid">${lamb.map(card).join("")}</div>` : "");
      } else body = `<div class="grid">${list.map(card).join("")}</div>`;
      return `
      <section class="shop-section" id="sec-${c.id}">
        <div class="shop-section-head"><h2>${esc(c.name)}</h2><p>${esc(c.blurb)} · ${list.length} item${list.length > 1 ? "s" : ""}</p></div>
        ${body}
      </section>`;
    }
    function draw() {
      const term = q.value.trim().toLowerCase();
      const match = p => !term || (p.name + " " + p.tag + " " + p.desc + " " + catName(p)).toLowerCase().includes(term);
      const cats = active === "all" ? CATEGORIES : CATEGORIES.filter(c => c.id === active);
      const html = cats.map(c => {
        if (c.soon) return term ? "" : section(c, []);
        return section(c, sorted(PRODUCTS.filter(p => p.cat === c.id && match(p))));
      }).join("");
      listEl.innerHTML = html || `<div class="empty"><h3>No cuts match “${esc(term)}”</h3><p>Try another search, or call us — we're happy to cut something special.</p></div>`;
      const cat = CATEGORIES.find(c => c.id === active);
      $("#shop-title").textContent = cat ? cat.name : "The Butcher's Counter";
      $("#shop-sub").textContent = cat ? cat.blurb : "Our full catalog of Glatt Beit Yosef beef, lamb and specialty cuts — order by weight or by the cut.";
      document.title = (cat ? cat.name : "Shop") + " — BASAR Kosher Butchery";
    }
    tabsEl.addEventListener("click", e => {
      const b = e.target.closest(".tab");
      if (!b) return;
      active = b.dataset.cat;
      const u = new URL(location); active === "all" ? u.searchParams.delete("cat") : u.searchParams.set("cat", active);
      history.replaceState(null, "", u);
      drawTabs(); draw();
    });
    q.addEventListener("input", draw);
    sort.addEventListener("change", draw);
    listEl.addEventListener("submit", e => {
      const f = e.target.closest(".notify");
      if (!f) return;
      e.preventDefault();
      const email = f.querySelector("input").value.trim();
      const list = store.get("basar.notify", []);
      list.push({ email, list: f.dataset.list, at: new Date().toISOString() });
      store.set("basar.notify", list);
      f.nextElementSibling.textContent = "Thank you — you're on the list.";
      f.reset();
    });
    drawTabs(); draw();
  }

  /* ── Product page ── */
  function initProduct() {
    const p = byId(new URLSearchParams(location.search).get("id"));
    const root = $("#pdp");
    if (!p) {
      root.innerHTML = `<div class="empty"><h2>We couldn't find that cut</h2><p><a class="link-arrow" href="shop.html">Back to the shop</a></p></div>`;
      return;
    }
    document.title = p.name + " — BASAR Kosher Butchery";
    const catHref = "shop.html?cat=" + p.cat;
    const modes = [];
    if (p.order.weight) modes.push("weight");
    if (p.order.piece) modes.push("piece");
    const st = { mode: modes[0], qty: 0, options: {}, note: "" };
    p.options.forEach(o => st.options[o.name] = o.choices[0]);
    const pieceLabel = p.order.piece ? p.order.piece.label : "";
    const plural = w => w.endsWith("s") ? w : w + (w.endsWith("h") ? "es" : "s");
    const defaultQty = m => m === "weight" ? p.order.weight.min : 1;
    st.qty = defaultQty(st.mode);

    const modeSwitch = modes.length > 1 ? `
      <div class="field">
        <div class="field-label">How would you like to order?</div>
        <div class="mode-switch" role="tablist">
          <button type="button" data-mode="weight" class="active">By weight<small>Choose total lb</small></button>
          <button type="button" data-mode="piece">By the ${esc(pieceLabel)}<small>~${p.order.piece.lb} lb each</small></button>
        </div>
      </div>` : "";

    const optionFields = p.options.map(o => `
      <div class="field">
        <div class="field-label">${esc(o.name)}</div>
        <div class="chips" data-opt="${esc(o.name)}">${o.choices.map((c, i) => `<button type="button" class="chip${i ? "" : " active"}" data-val="${esc(c)}">${esc(c)}</button>`).join("")}</div>
      </div>`).join("");

    const badges = ['<span class="badge badge--ox">Glatt Beit Yosef</span>', '<span class="badge">Badatz Mekor Chaim</span>'];
    if (p.hind) badges.push('<span class="badge badge--ox">Nikkur Achoraim</span>');
    badges.push('<span class="badge">Hand-cut to order</span>');

    root.innerHTML = `
      <div class="pdp-media">
        <div class="pdp-image">${photo(p, { eager: true })}</div>
        <div class="pdp-assurance">
          <div><strong>Glatt Beit Yosef</strong>Strictest Sephardic standard</div>
          <div><strong>Hand-cut</strong>To your exact order</div>
          <div><strong>Weighed fairly</strong>Pay actual weight only</div>
        </div>
      </div>
      <div class="pdp-info">
        <span class="eyebrow">${esc(catName(p))}</span>
        <h1>${esc(p.name)}</h1>
        <div class="pdp-tag">${esc(p.tag)}</div>
        <div class="pdp-badges">${badges.join("")}</div>
        <div class="pdp-price"><span class="price">${money(p.price)}</span><span class="price"><small>per ${unitLabel(p)}</small></span></div>
        <form id="order-form">
          ${modeSwitch}
          <div class="field">
            <div class="field-label"><span id="qty-label-main" style="color:inherit;letter-spacing:.2em;text-transform:uppercase;font-weight:500;font-size:.72rem">Quantity</span><span id="qty-hint"></span></div>
            <div class="qty"><button type="button" data-step="-1" aria-label="Decrease">−</button><input id="qty" inputmode="decimal" aria-label="Quantity"><button type="button" data-step="1" aria-label="Increase">+</button></div>
          </div>
          ${optionFields}
          <div class="field">
            <div class="field-label">Special instructions <span>Optional</span></div>
            <textarea class="input" id="note" rows="2" style="width:100%" placeholder="e.g. trim extra fat, cut into 4 equal pieces, pack in pairs"></textarea>
          </div>
          <div class="estimate">
            <div><div class="estimate-label">Estimated total</div><div class="estimate-weight" id="est-weight"></div></div>
            <div class="price" id="est-price"></div>
          </div>
          <button class="btn btn--ox btn--block" type="submit">Add to order</button>
          <div class="added-msg" aria-live="polite"></div>
          <p class="fineprint">${p.note ? esc(p.note) + " " : ""}Every order is cut and weighed by hand. You are charged for the actual weight — usually within 10% of the estimate.</p>
        </form>
        <div class="pdp-details">
          <details open><summary>About this cut</summary><div class="content"><p>${esc(p.desc)}</p></div></details>
          <details><summary>Best for</summary><div class="content"><div class="best-list">${p.best.map(b => `<span class="badge">${esc(b)}</span>`).join("")}</div></div></details>
          <details><summary>Kashrut</summary><div class="content"><p>Glatt Beit Yosef, slaughtered and processed under the supervision of Badatz Mekor Chaim. ${p.hind ? "This is a hindquarter cut, made kosher through meticulous Sephardic nikkur achoraim (removal of the forbidden fats and the sciatic nerve) by expert menakrim." : "Every piece is soaked and salted (kashered) according to halacha."} <a class="link-arrow" href="kashrut.html" style="font-size:.66rem">Our standard</a></p></div></details>
          <details><summary>Delivery &amp; pickup</summary><div class="content"><p>Local delivery and in-store pickup. Orders placed by 12 pm are cut for the next day. Free local delivery on orders over ${money(STORE.freeDeliveryFrom)}. <a class="link-arrow" href="about.html#delivery" style="font-size:.66rem">Details</a></p></div></details>
        </div>
      </div>`;

    const qtyEl = $("#qty");
    function stepOf() { return st.mode === "weight" ? p.order.weight.step : 1; }
    function minOf() { return st.mode === "weight" ? p.order.weight.min : 1; }
    function weight() { return st.mode === "weight" ? st.qty : (p.order.piece.lb || 0) * st.qty; }
    function render() {
      qtyEl.value = st.mode === "weight" ? st.qty + " lb" : st.qty;
      const hint = st.mode === "weight" ? `Minimum ${p.order.weight.min} lb` : (p.order.piece.lb ? `Approx. ${p.order.piece.lb} lb per ${pieceLabel}` : (p.unitLabel ? `Sold as ${p.unitLabel}` : "Sold individually"));
      $("#qty-hint").textContent = hint;
      $("#qty-label-main").textContent = st.mode === "weight" ? "Weight" : "Number of " + plural(pieceLabel);
      const total = p.unit === "each" ? st.qty * p.price : weight() * p.price;
      $("#est-price").textContent = money(total);
      $("#est-weight").textContent = p.unit === "each" ? `${st.qty} × ${p.unitLabel || pieceLabel}` : `≈ ${fmtLb(weight())}` + (st.mode === "piece" ? ` · ${st.qty} ${st.qty > 1 ? plural(pieceLabel) : pieceLabel}` : "");
      $$(".mode-switch button").forEach(b => b.classList.toggle("active", b.dataset.mode === st.mode));
    }
    root.addEventListener("click", e => {
      const mb = e.target.closest(".mode-switch button");
      if (mb) { st.mode = mb.dataset.mode; st.qty = defaultQty(st.mode); render(); return; }
      const sb = e.target.closest("[data-step]");
      if (sb) { st.qty = Math.max(minOf(), Math.round((st.qty + stepOf() * +sb.dataset.step) * 100) / 100); render(); return; }
      const chip = e.target.closest(".chip");
      if (chip) {
        const group = chip.parentElement;
        $$(".chip", group).forEach(c => c.classList.toggle("active", c === chip));
        st.options[group.dataset.opt] = chip.dataset.val;
      }
    });
    qtyEl.addEventListener("change", () => {
      const v = parseFloat(qtyEl.value);
      if (!isNaN(v)) {
        const s = stepOf();
        st.qty = Math.max(minOf(), Math.round(v / s) * s);
      }
      render();
    });
    $("#order-form").addEventListener("submit", e => {
      e.preventDefault();
      st.note = $("#note").value.trim();
      Cart.add({ id: p.id, mode: st.mode, qty: st.qty, options: { ...st.options }, note: st.note });
      $(".added-msg").textContent = "✓ Added to your order.";
      toast(`<span>${esc(p.name)} added to your order</span><a href="cart.html">View order</a>`);
    });
    render();

    const related = PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id && (p.cat !== "specialty" || x.sub === p.sub)).slice(0, 4);
    $("#related").innerHTML = related.map(card).join("");
    $("#crumb").innerHTML = `<a href="index.html">Home</a><span>/</span><a href="${catHref}">${esc(CATEGORIES.find(c => c.id === p.cat).name)}</a><span>/</span>${esc(p.name)}`;
  }

  /* ── Cart & checkout ── */
  function lineDesc(line) {
    const p = byId(line.id);
    const parts = [];
    if (line.mode === "weight") parts.push(`By weight: ${fmtLb(line.qty)}`);
    else parts.push(`${line.qty} × ${p.unitLabel || p.order.piece.label}` + (p.order.piece.lb ? ` (≈ ${fmtLb(Cart.lineWeight(line))})` : ""));
    Object.entries(line.options || {}).forEach(([k, v]) => parts.push(`${k}: ${v}`));
    if (line.note) parts.push(`Note: ${line.note}`);
    return parts;
  }

  function initCart() {
    const listEl = $("#cart-list"), sumEl = $("#summary"), form = $("#checkout");
    const minDate = new Date(); minDate.setDate(minDate.getDate() + 1);
    const dateEl = $("#date");
    dateEl.min = minDate.toISOString().slice(0, 10);
    dateEl.value = dateEl.min;

    function fulfillment() { return (form.querySelector("[name=fulfil]:checked") || {}).value || "delivery"; }
    function totals() {
      const sub = Cart.subtotal();
      const fee = fulfillment() === "delivery" && sub > 0 && sub < STORE.freeDeliveryFrom ? STORE.deliveryFee : 0;
      return { sub, fee, total: sub + fee };
    }
    function draw() {
      const items = Cart.items().filter(l => byId(l.id));
      if (!items.length) {
        $("#cart-wrap").innerHTML = `<div class="empty" style="padding:90px 0 120px"><h2>Your order is empty</h2><p>Visit the counter to choose your cuts.</p><p style="margin-top:26px"><a class="btn" href="shop.html">Shop the counter</a></p></div>`;
        return;
      }
      listEl.innerHTML = items.map(line => {
        const p = byId(line.id);
        const step = line.mode === "weight" ? p.order.weight.step : 1;
        return `
        <div class="cart-line" data-key="${esc(line.key)}">
          <a class="cart-thumb" href="product.html?id=${p.id}">${photo(p)}</a>
          <div>
            <h3><a href="product.html?id=${p.id}">${esc(p.name)}</a></h3>
            <div class="cart-meta">${lineDesc(line).map(d => `<div>${esc(d)}</div>`).join("")}<div>${money(p.price)} / ${unitLabel(p)}</div></div>
          </div>
          <div class="cart-line-right">
            <span class="price">${money(Cart.lineTotal(line))}</span>
            <div class="qty qty--sm"><button type="button" data-d="-1" aria-label="Decrease">−</button><input value="${line.mode === "weight" ? line.qty + " lb" : line.qty}" readonly aria-label="Quantity" data-step="${step}"><button type="button" data-d="1" aria-label="Increase">+</button></div>
            <button class="remove" type="button">Remove</button>
          </div>
        </div>`;
      }).join("");
      const t = totals();
      sumEl.innerHTML = `
        <div class="sum-row"><span>Estimated subtotal</span><span>${money(t.sub)}</span></div>
        <div class="sum-row"><span>${fulfillment() === "delivery" ? "Local delivery" : "Store pickup"}</span><span>${t.fee ? money(t.fee) : "Free"}</span></div>
        <div class="sum-row total"><span>Estimated total</span><span>${money(t.total)}</span></div>
        ${fulfillment() === "delivery" && t.sub < STORE.freeDeliveryFrom ? `<p class="fineprint">Add ${money(STORE.freeDeliveryFrom - t.sub)} more for free local delivery.</p>` : ""}`;
    }
    listEl.addEventListener("click", e => {
      const row = e.target.closest(".cart-line");
      if (!row) return;
      const items = Cart.items();
      const line = items.find(l => l.key === row.dataset.key);
      if (!line) return;
      const p = byId(line.id);
      if (e.target.closest(".remove")) {
        Cart.save(items.filter(l => l !== line));
      } else if (e.target.closest("[data-d]")) {
        const step = line.mode === "weight" ? p.order.weight.step : 1;
        const min = line.mode === "weight" ? p.order.weight.min : 1;
        line.qty = Math.max(min, Math.round((line.qty + step * +e.target.closest("[data-d]").dataset.d) * 100) / 100);
        Cart.save(items);
      } else return;
      draw();
    });
    form.addEventListener("change", e => {
      if (e.target.name === "fulfil") {
        $("#address-fields").style.display = fulfillment() === "delivery" ? "contents" : "none";
        $$("#address-fields input").forEach(i => i.required = fulfillment() === "delivery");
        draw();
      }
    });
    form.addEventListener("submit", e => {
      e.preventDefault();
      const items = Cart.items().filter(l => byId(l.id));
      if (!items.length) return;
      const data = Object.fromEntries(new FormData(form));
      const t = totals();
      const orderNo = "BSR-" + Date.now().toString(36).toUpperCase().slice(-6);
      const lines = items.map(l => `• ${byId(l.id).name} — ${lineDesc(l).join("; ")} — est. ${money(Cart.lineTotal(l))}`).join("\n");
      const body =
`New order ${orderNo}

${lines}

Estimated subtotal: ${money(t.sub)}
${data.fulfil === "delivery" ? "Delivery" : "Pickup"}: ${t.fee ? money(t.fee) : "Free"}
Estimated total: ${money(t.total)}

Name: ${data.name}
Phone: ${data.phone}
Email: ${data.email}
${data.fulfil === "delivery" ? `Delivery address: ${data.address}, ${data.city} ${data.zip}` : "Store pickup"}
Requested date: ${data.date} (${data.slot})
Notes: ${data.notes || "—"}`;
      const orders = store.get("basar.orders", []);
      orders.push({ orderNo, at: new Date().toISOString(), items, customer: data, totals: t });
      store.set("basar.orders", orders);
      Cart.save([]);
      $("#cart-wrap").innerHTML = `
        <div class="confirm">
          <div class="check">✓</div>
          <span class="eyebrow">Order ${orderNo}</span>
          <h1 style="font-size:3rem">Thank you, ${esc(data.name.split(" ")[0])}.</h1>
          <p class="lead">Your order request has been prepared. Our butchers will call you at <strong>${esc(data.phone)}</strong> to confirm cuts and timing. Payment is taken on confirmation, by actual weight.</p>
          <p style="margin:30px 0 10px"><a class="btn btn--ox" id="send-mail" href="mailto:${STORE.email}?subject=${encodeURIComponent("Order " + orderNo)}&body=${encodeURIComponent(body)}">Send order to the butchery</a></p>
          <p class="fineprint">This opens your email app with the full order filled in. If it doesn't open, email us at <strong style="user-select:all">${esc(STORE.email)}</strong> or call ${esc(STORE.phone)}.</p>
          <p style="margin-top:30px"><a class="link-arrow" href="shop.html">Continue shopping</a></p>
        </div>`;
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    draw();
  }

  /* ── Boot ── */
  document.addEventListener("DOMContentLoaded", () => {
    // static images that already failed before this script ran
    $$("img[data-ph-name]").forEach(i => { if (i.complete && !i.naturalWidth) i.outerHTML = placeholder(i.dataset.phName, i.dataset.phSub); });
    mountLayout();
    const page = document.body.dataset.page;
    if (page === "home") initHome();
    if (page === "shop") initShop();
    if (page === "product") initProduct();
    if (page === "cart") initCart();
  });
})();
