/* ============================================================
   ALANKRITA — collection.js
   Product grid, filters, modal, shortlist (localStorage)
   ============================================================ */

/* ── PRODUCT DATA ─────────────────────────────────────────── */
const products = [
  { id: 1,  name: "Crimson Kanchipuram",  type: "Kanjeevaram",    price: 45000,  color: "Deep Red",       fabric: "Pure Mulberry Silk",  desc: "A timeless Kanchipuram with traditional temple border and rich zari work." },
  { id: 2,  name: "Pearl Tissue",          type: "Tissue Silk",    price: 28000,  color: "Ivory Pearl",    fabric: "Tissue Silk",          desc: "Luminous tissue silk with a gossamer drape perfect for evening soirées." },
  { id: 3,  name: "Midnight Banarasi",     type: "Banarasi Katan", price: 62000,  color: "Midnight Blue",  fabric: "Katan Silk",           desc: "Opulent Banarasi with intricate kadhwa motifs woven in pure gold zari." },
  { id: 4,  name: "Sage Soft Silk",        type: "Soft Silk",      price: 18000,  color: "Sage Green",     fabric: "Soft Silk",            desc: "Lightweight soft silk ideal for daily elegance and comfort." },
  { id: 5,  name: "Patan Patola",          type: "Patola",         price: 95000,  color: "Saffron & Indigo", fabric: "Pure Silk Patola",  desc: "Handwoven double ikat Patola from Patan — a collector's heirloom." },
  { id: 6,  name: "Ivory Upada",           type: "Upada",          price: 35000,  color: "Ivory White",    fabric: "Upada Silk",           desc: "Flowing Upada silk with delicate jamdani weave in silver thread." },
  { id: 7,  name: "Rose Kora",             type: "Kora Silk",      price: 22000,  color: "Dusty Rose",     fabric: "Kora Silk",            desc: "Crisp Kora silk with a textured surface and minimalist floral border." },
  { id: 8,  name: "Ebony Raw Silk",        type: "Raw Silk",       price: 16000,  color: "Ebony",          fabric: "Raw Silk",             desc: "Textured raw silk in deep ebony — effortlessly modern." },
  { id: 9,  name: "Copper Kanjeevaram",    type: "Kanjeevaram",    price: 52000,  color: "Copper Gold",    fabric: "Pure Mulberry Silk",  desc: "Regal copper-toned Kanchipuram with a wide contrast border." },
  { id: 10, name: "Blush Tissue",          type: "Tissue Silk",    price: 31000,  color: "Blush Pink",     fabric: "Tissue Silk",          desc: "Soft blush tissue with a subtle shimmer — perfect for celebrations." },
  { id: 11, name: "Teal Banarasi",         type: "Banarasi Katan", price: 58000,  color: "Teal",           fabric: "Katan Silk",           desc: "Teal Banarasi with intricate buti work across the body." },
  { id: 12, name: "Terracotta Patola",     type: "Patola",         price: 88000,  color: "Terracotta",     fabric: "Pure Silk Patola",    desc: "A vibrant double ikat Patola in warm terracotta tones." }
];

/* Gradient palettes per type for placeholder images */
const typeGradients = {
  "Kanjeevaram":    ["linear-gradient(160deg,#8B1A1A,#C0392B,#6E1A1A)", "linear-gradient(160deg,#7a3805,#C47624,#5a2a03)"],
  "Tissue Silk":    ["linear-gradient(160deg,#F5EFE0,#C9A96E,#E8D5B0)", "linear-gradient(160deg,#fce4c8,#e8b98a,#f5d6af)"],
  "Banarasi Katan": ["linear-gradient(160deg,#1A1A2E,#0F3460,#16213E)", "linear-gradient(160deg,#006060,#0a8080,#005555)"],
  "Soft Silk":      ["linear-gradient(160deg,#2D5016,#4A7C28,#3D6B1F)", "linear-gradient(160deg,#1a4a5c,#2a7a8c,#1a3a4c)"],
  "Patola":         ["linear-gradient(160deg,#4a1060,#8B2FC9,#2a0640)", "linear-gradient(160deg,#7a1a1a,#c03030,#5a0a0a)"],
  "Upada":          ["linear-gradient(160deg,#F0EDE5,#D4C8B0,#E8E2D8)", "linear-gradient(160deg,#e8e0d0,#c0b090,#d8d0c0)"],
  "Kora Silk":      ["linear-gradient(160deg,#8B4a5a,#C47090,#7a3a4a)", "linear-gradient(160deg,#9a8070,#c0a890,#8a7060)"],
  "Raw Silk":       ["linear-gradient(160deg,#1a1a1a,#3a3a3a,#2a2a2a)", "linear-gradient(160deg,#2a1a10,#5a3a20,#3a2a10)"],
};

function getGradient(type, seed = 0) {
  const arr = typeGradients[type] || ["linear-gradient(160deg,#C9A96E,#E8D5B0,#C9A96E)"];
  return arr[seed % arr.length];
}

/* ── SHORTLIST (localStorage) ──────────────────────────────── */
const SHORTLIST_KEY = 'alankrita_shortlist';

function getShortlist() {
  try { return JSON.parse(localStorage.getItem(SHORTLIST_KEY)) || []; }
  catch { return []; }
}

function saveShortlist(ids) {
  localStorage.setItem(SHORTLIST_KEY, JSON.stringify(ids));
}

function toggleShortlist(id) {
  let list = getShortlist();
  if (list.includes(id)) {
    list = list.filter(x => x !== id);
  } else {
    list.push(id);
  }
  saveShortlist(list);
  return list;
}

function isShortlisted(id) {
  return getShortlist().includes(id);
}

/* ── RENDER PRODUCTS ──────────────────────────────────────── */
function renderProducts(items) {
  const grid = document.getElementById('productGrid');
  const count = document.getElementById('productsCount');
  if (!grid) return;

  count && (count.textContent = `${items.length} piece${items.length !== 1 ? 's' : ''}`);
  grid.innerHTML = '';

  if (items.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px 0;color:var(--text-secondary);font-family:var(--font-heading);font-size:22px;font-style:italic;">No sarees match your filters.</div>`;
    return;
  }

  items.forEach((p, idx) => {
    const shortlisted = isShortlisted(p.id);
    const gradient = getGradient(p.type, idx % 2);
    const card = document.createElement('div');
    card.className = 'product-card reveal';
    card.style.transitionDelay = `${(idx % 6) * 0.07}s`;
    card.innerHTML = `
      <div class="product-card-image-wrap">
        <div class="product-card-image" style="background:${gradient};"></div>
        <button class="product-heart ${shortlisted ? 'active' : ''}" data-id="${p.id}" aria-label="Shortlist ${p.name}">
          <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
      </div>
      <div class="product-card-badge">${p.type}</div>
      <div class="product-card-name">${p.name}</div>
      <div class="product-card-price">₹ ${p.price.toLocaleString('en-IN')}</div>
    `;

    // Heart toggle
    card.querySelector('.product-heart').addEventListener('click', (e) => {
      e.stopPropagation();
      const btn = e.currentTarget;
      const newList = toggleShortlist(p.id);
      btn.classList.toggle('active', newList.includes(p.id));
      updateShortlistUI();
    });

    // Open modal
    card.addEventListener('click', () => openModal(p, gradient));
    grid.appendChild(card);
  });

  // Re-run scroll reveal for newly added cards
  setupReveal();
}

/* ── MODAL ────────────────────────────────────────────────── */
let currentModalProduct = null;

function openModal(product, gradient) {
  currentModalProduct = product;
  const overlay = document.getElementById('modalOverlay');
  if (!overlay) return;

  const thumbGrads = [gradient, getGradient(product.type, 1), getGradient(product.type, 0)];

  overlay.querySelector('.modal-type').textContent = product.type;
  overlay.querySelector('.modal-name').textContent = product.name;
  overlay.querySelector('.modal-price').textContent = `₹ ${product.price.toLocaleString('en-IN')}`;
  overlay.querySelector('.modal-desc').textContent = product.desc;

  const meta = overlay.querySelector('.modal-meta');
  meta.innerHTML = `
    <div class="modal-meta-item"><span class="modal-meta-label">Fabric</span><span>${product.fabric}</span></div>
    <div class="modal-meta-item"><span class="modal-meta-label">Colour</span><span>${product.color}</span></div>
    <div class="modal-meta-item"><span class="modal-meta-label">Type</span><span>${product.type}</span></div>
  `;

  // Main image
  overlay.querySelector('.modal-main-image').style.background = gradient;

  // Thumbs
  const thumbs = overlay.querySelectorAll('.modal-thumb');
  thumbs.forEach((t, i) => {
    t.style.background = thumbGrads[i] || gradient;
  });

  // Shortlist button state
  const shortlistBtn = overlay.querySelector('#modalShortlistBtn');
  shortlistBtn.textContent = isShortlisted(product.id) ? '✓ In Shortlist' : 'Add to Shortlist';
  shortlistBtn.classList.toggle('btn-gold', isShortlisted(product.id));
  shortlistBtn.classList.toggle('btn-outline-gold', !isShortlisted(product.id));

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
  currentModalProduct = null;
}

/* ── SHORTLIST UI UPDATE ───────────────────────────────────── */
function updateShortlistUI() {
  const list = getShortlist();
  const count = list.length;

  // Top bar count
  const countSpan = document.getElementById('shortlistCountDisplay');
  if (countSpan) countSpan.textContent = `SHORTLIST (${count})`;

  // FAB count
  const fabCount = document.getElementById('fabCount');
  if (fabCount) fabCount.textContent = count;

  // Render drawer items
  renderShortlistDrawer(list);
}

function renderShortlistDrawer(ids) {
  const container = document.getElementById('shortlistItems');
  if (!container) return;

  if (ids.length === 0) {
    container.innerHTML = `<div class="shortlist-empty">Your shortlist is empty.<br>Heart a saree to save it here.</div>`;
    return;
  }

  const items = products.filter(p => ids.includes(p.id));
  container.innerHTML = items.map(p => `
    <div class="shortlist-item">
      <div class="shortlist-item-img img-placeholder" style="background:${getGradient(p.type, 0)};"></div>
      <div>
        <div class="shortlist-item-name">${p.name}</div>
        <div class="shortlist-item-price">₹ ${p.price.toLocaleString('en-IN')}</div>
      </div>
      <button class="shortlist-item-remove" data-id="${p.id}" aria-label="Remove">×</button>
    </div>
  `).join('');

  container.querySelectorAll('.shortlist-item-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      toggleShortlist(id);
      // also update heart icon in grid
      const heart = document.querySelector(`.product-heart[data-id="${id}"]`);
      heart?.classList.remove('active');
      updateShortlistUI();
    });
  });
}

/* ── FILTERS ──────────────────────────────────────────────── */
let activeTypes = [];
let priceMax = 200000;

function applyFilters() {
  let filtered = [...products];

  if (activeTypes.length > 0) {
    filtered = filtered.filter(p => activeTypes.includes(p.type));
  }

  filtered = filtered.filter(p => p.price <= priceMax);

  renderProducts(filtered);
}

/* ── SCROLL REVEAL HELPER ──────────────────────────────────── */
function setupReveal() {
  const revealEls = document.querySelectorAll('.reveal:not(.visible)');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  revealEls.forEach(el => observer.observe(el));
}

/* ── INIT ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  // Initial render
  renderProducts(products);

  /* Filter sidebar toggle */
  const filterToggle = document.getElementById('filterToggle');
  const filterSidebar = document.getElementById('filterSidebar');
  filterToggle?.addEventListener('click', () => {
    filterSidebar?.classList.toggle('open');
  });

  /* Price range slider */
  const priceSlider = document.getElementById('priceRange');
  const priceDisplay = document.getElementById('priceDisplay');
  priceSlider?.addEventListener('input', () => {
    priceMax = parseInt(priceSlider.value);
    const formatted = priceMax.toLocaleString('en-IN');
    if (priceDisplay) priceDisplay.textContent = `₹ 5,000 — ₹ ${formatted}`;
  });

  /* Checkbox filters */
  document.querySelectorAll('.type-checkbox').forEach(cb => {
    cb.addEventListener('change', () => {
      activeTypes = [...document.querySelectorAll('.type-checkbox:checked')].map(c => c.value);
    });
  });

  /* Apply filters button */
  document.getElementById('applyFilters')?.addEventListener('click', applyFilters);

  /* Clear all filters */
  document.getElementById('clearFilters')?.addEventListener('click', () => {
    activeTypes = [];
    priceMax = 200000;
    document.querySelectorAll('.type-checkbox').forEach(cb => cb.checked = false);
    if (priceSlider) { priceSlider.value = 200000; }
    if (priceDisplay) priceDisplay.textContent = '₹ 5,000 — ₹ 2,00,000';
    renderProducts(products);
  });

  /* Modal close */
  document.getElementById('modalClose')?.addEventListener('click', closeModal);
  document.getElementById('modalOverlay')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeShortlistDrawer();
    }
  });

  /* Modal — shortlist button */
  document.getElementById('modalShortlistBtn')?.addEventListener('click', () => {
    if (!currentModalProduct) return;
    const newList = toggleShortlist(currentModalProduct.id);
    const btn = document.getElementById('modalShortlistBtn');
    const isIn = newList.includes(currentModalProduct.id);
    btn.textContent = isIn ? '✓ In Shortlist' : 'Add to Shortlist';
    btn.classList.toggle('btn-gold', isIn);
    btn.classList.toggle('btn-outline-gold', !isIn);
    // update heart in grid
    const heart = document.querySelector(`.product-heart[data-id="${currentModalProduct.id}"]`);
    heart?.classList.toggle('active', isIn);
    updateShortlistUI();
  });

  /* Modal — WhatsApp enquire */
  document.getElementById('modalWhatsappBtn')?.addEventListener('click', () => {
    if (!currentModalProduct) return;
    const msg = encodeURIComponent(`Hi Alankrita, I'm interested in the "${currentModalProduct.name}" (${currentModalProduct.type}) priced at ₹${currentModalProduct.price.toLocaleString('en-IN')}. Could you share more details?`);
    window.open(`https://wa.me/918412845177?text=${msg}`, '_blank');
  });

  /* Shortlist FAB & drawer */
  const fab = document.getElementById('shortlistFab');
  const drawer = document.getElementById('shortlistDrawer');
  const drawerOverlay = document.getElementById('shortlistOverlay');

  fab?.addEventListener('click', openShortlistDrawer);
  drawerOverlay?.addEventListener('click', closeShortlistDrawer);
  document.getElementById('shortlistDrawerClose')?.addEventListener('click', closeShortlistDrawer);

  /* Shortlist count button in top bar */
  document.getElementById('shortlistCountBtn')?.addEventListener('click', openShortlistDrawer);

  /* Bulk WhatsApp from drawer */
  document.getElementById('bulkWhatsappBtn')?.addEventListener('click', () => {
    const ids = getShortlist();
    if (ids.length === 0) return;
    const names = products.filter(p => ids.includes(p.id)).map(p => `${p.name} (₹${p.price.toLocaleString('en-IN')})`).join(', ');
    const msg = encodeURIComponent(`Hi Alankrita, I'd like to enquire about these sarees: ${names}. Please share more details.`);
    window.open(`https://wa.me/918412845177?text=${msg}`, '_blank');
  });

  // Initial UI sync
  updateShortlistUI();
});

function openShortlistDrawer() {
  document.getElementById('shortlistDrawer')?.classList.add('open');
  document.getElementById('shortlistOverlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeShortlistDrawer() {
  document.getElementById('shortlistDrawer')?.classList.remove('open');
  document.getElementById('shortlistOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
}
