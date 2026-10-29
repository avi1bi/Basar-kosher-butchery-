import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { productById, type Product } from "@/data/catalog";
import { load, save } from "@/lib/storage";
import { round2 } from "@/lib/format";

export type OrderMode = "weight" | "piece";

export interface CartLine {
  key: string;
  id: string;
  mode: OrderMode;
  qty: number;
  options: Record<string, string>;
  note: string;
}

export const lineWeight = (line: CartLine, p: Product | undefined = productById(line.id)) => {
  if (!p) return 0;
  if (line.mode === "weight") return line.qty;
  return p.order.piece?.lb ? line.qty * p.order.piece.lb : 0;
};

export const lineTotal = (line: CartLine, p: Product | undefined = productById(line.id)) => {
  if (!p) return 0;
  return p.unit === "each" ? line.qty * p.price : lineWeight(line, p) * p.price;
};

/** Human-readable description of a line, used in the cart and the order email. */
export const lineDescription = (line: CartLine) => {
  const p = productById(line.id)!;
  const parts: string[] = [];
  if (line.mode === "weight") parts.push(`By weight: ${round2(line.qty)} lb`);
  else
    parts.push(
      `${line.qty} × ${p.unitLabel || p.order.piece!.label}` +
        (p.order.piece?.lb ? ` (≈ ${round2(lineWeight(line, p))} lb)` : ""),
    );
  Object.entries(line.options).forEach(([k, v]) => parts.push(`${k}: ${v}`));
  if (line.note) parts.push(`Note: ${line.note}`);
  return parts;
};

interface CartContextValue {
  lines: CartLine[];
  add: (line: Omit<CartLine, "key">) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "basar.cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => load<CartLine[]>(STORAGE_KEY, []).filter((l) => productById(l.id)));

  useEffect(() => save(STORAGE_KEY, lines), [lines]);

  const add = useCallback((line: Omit<CartLine, "key">) => {
    const key = `${line.id}|${line.mode}|${JSON.stringify(line.options)}|${line.note}`;
    setLines((prev) => {
      const existing = prev.find((l) => l.key === key);
      if (existing) return prev.map((l) => (l.key === key ? { ...l, qty: round2(l.qty + line.qty) } : l));
      return [...prev, { ...line, key }];
    });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) => prev.map((l) => (l.key === key ? { ...l, qty: round2(qty) } : l)));
  }, []);

  const remove = useCallback((key: string) => setLines((prev) => prev.filter((l) => l.key !== key)), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(
    () => ({ lines, add, setQty, remove, clear, subtotal: lines.reduce((s, l) => s + lineTotal(l), 0) }),
    [lines, add, setQty, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
