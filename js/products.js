export const ICONS = {
  coat: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M38 14l12 8 12-8"/><path d="M50 22v10"/><path d="M32 20L18 30l6 14 6-6v40h40V38l6 6 6-14-14-10"/><path d="M40 22l-8 20 4 46"/><path d="M60 22l8 20-4 46"/><path d="M50 32v52"/></svg>`,
  knit: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M36 20h28l4 10-8 6v46H40V36l-8-6z"/><path d="M36 20L20 28l6 16 10-8"/><path d="M64 20l16 8-6 16-10-8"/><path d="M40 24c4 4 16 4 20 0"/><path d="M40 40h20M40 50h20M40 60h20M40 70h20"/></svg>`,
  jacket: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M38 16l12 8 12-8"/><path d="M30 22L16 32l6 14 8-8v34h40V38l8 8 6-14-14-10"/><path d="M50 24v10M50 34v42"/><path d="M42 24l-6 18 3 34"/><path d="M58 24l6 18-3 34"/><path d="M40 50h20"/></svg>`,
  trench: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M36 12l14 9 14-9"/><path d="M28 20L14 30l6 14 8-8v46h44V36l8 8 6-14-14-10"/><path d="M50 21v10"/><path d="M40 21l-6 22 4 40"/><path d="M60 21l6 22-4 40"/><path d="M30 62h40"/><circle cx="50" cy="62" r="2.2" fill="currentColor" stroke="none"/></svg>`,
  bag: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M32 38c0-12 8-20 18-20s18 8 18 20"/><rect x="18" y="38" width="64" height="46" rx="6"/><path d="M18 54h64"/></svg>`,
  boot: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M40 16v34l-4 8H24a8 8 0 0 0-8 8v6h64c0-10-6-16-16-20l-10-4V16z"/><path d="M40 30h14"/><path d="M40 40h14"/><path d="M40 50h10"/></svg>`,
  dress: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="50" cy="18" r="8"/><path d="M42 24l-10 10 6 8 6-6v6l-16 42h44L56 42v-6l6 6 6-8-10-10"/><path d="M40 60h20"/></svg>`,
};

export function iconSvg(type) {
  return ICONS[type] || ICONS.coat;
}

export const CATEGORIES = ['All', 'Outerwear', 'Knitwear', 'Denim', 'Footwear', 'Bags', 'Dresses'];
export const COLORS = ['#211c15', '#b1804a', '#e9dfca', '#8f4a29'];
export const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

export const PRODUCTS = [
  {
    id: 'p1', name: 'Camel Tailoring Coat', cat: 'Outerwear', price: 129,
    icon: 'coat', tone: 'camel', dark: false, match: 96, tryOn: true,
    image: 'assets/camel_coat.png',
    garmentDes: 'Camel wool-blend tailoring coat with structured shoulders',
    vtonCategory: 'upper_body',
    desc: 'An architecturally cut wool-blend coat in soft camel. Structured shoulders taper into a fluid, floor-skimming line — the kind of coat that quietly runs the room.',
  },
  {
    id: 'p2', name: 'Quiet Luxury Knit', cat: 'Knitwear', price: 89,
    icon: 'knit', tone: 'ivory', dark: false, match: 92,
    desc: 'A featherweight merino knit in undyed ivory. Ribbed cuffs, a dropped shoulder and a boat neckline built for effortless layering.',
  },
  {
    id: 'p3', name: 'Leather Statement Jacket', cat: 'Outerwear', price: 159,
    icon: 'jacket', tone: 'charcoal', dark: true, match: 89, tryOn: true,
    image: 'assets/leather_statement_jacket.png',
    garmentDes: 'Black lambskin leather jacket with asymmetric zip',
    vtonCategory: 'upper_body',
    desc: 'Buttery lambskin leather in deep charcoal. An asymmetric zip and cropped hem give this piece its edge.',
  },
  {
    id: 'p4', name: 'Structured Denim Trench', cat: 'Denim', price: 139,
    icon: 'trench', tone: 'denim', dark: false, match: 87, tryOn: true,
    image: 'assets/denim_jacket.png',
    garmentDes: 'Indigo denim trench coat with belted waist',
    vtonCategory: 'upper_body',
    desc: 'Rigid Japanese denim tailored into a trench silhouette, with a belted waist and an oversized collar.',
  },
  {
    id: 'p5', name: 'Minimal Tote', cat: 'Bags', price: 210,
    icon: 'bag', tone: 'camel', dark: false, match: 94,
    desc: 'Vegetable-tanned leather tote with a single top handle and an interior zip pocket. Ages beautifully.',
  },
  {
    id: 'p6', name: 'Ankle Riding Boot', cat: 'Footwear', price: 175,
    icon: 'boot', tone: 'charcoal', dark: true, match: 91,
    desc: 'Hand-burnished leather ankle boot with a stacked block heel and a hidden side zip.',
  },
  {
    id: 'p7', name: 'Wrap Midi Dress', cat: 'Dresses', price: 118,
    icon: 'dress', tone: 'rust', dark: true, match: 85,
    desc: 'A bias-cut wrap dress in rust crepe. Self-tie waist, side slit, and a neckline that falls just so.',
  },
  {
    id: 'p8', name: 'Oversized Wool Blazer', cat: 'Outerwear', price: 145,
    icon: 'coat', tone: 'ivory', dark: false, match: 90,
    desc: 'Relaxed-fit blazer in brushed wool. Single button, natural shoulder, and room enough to layer a knit beneath.',
  },
];

export const TRENDING_IDS = ['p1', 'p3', 'p5', 'p6'];

export function byId(id) {
  return PRODUCTS.find((p) => p.id === id);
}

export function toneClass(p) {
  return 'tone-' + p.tone;
}

export function iconClass(p) {
  return p.dark ? 'icon-dark' : 'icon-light';
}

export function money(n) {
  return '$' + n.toFixed(0);
}

export function productMediaHtml(p, className = '') {
  if (p.image) {
    return `<img class="product-photo ${className}" src="${p.image}" alt="${p.name}" loading="lazy">`;
  }
  return `<div class="${iconClass(p)}">${iconSvg(p.icon)}</div>`;
}
