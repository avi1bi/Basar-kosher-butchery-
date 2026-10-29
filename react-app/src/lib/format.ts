import { CATEGORIES, type Product } from "@/data/catalog";

export const money = (n: number) => "$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
export const fmtLb = (n: number) => (Math.round(n * 100) / 100).toString() + " lb";
export const round2 = (n: number) => Math.round(n * 100) / 100;

export const productImage = (id: string) => `/images/products/${id}.jpg`;

export const unitLabel = (p: Product) => (p.unit === "each" ? p.unitLabel || "each" : "lb");

export const categoryLabel = (p: Product) =>
  p.cat === "specialty"
    ? p.sub === "lamb"
      ? "Lamb · Specialty"
      : "Beef · Specialty"
    : CATEGORIES.find((c) => c.id === p.cat)!.name;

export const plural = (w: string) => (w.endsWith("s") ? w : w + (w.endsWith("h") ? "es" : "s"));
