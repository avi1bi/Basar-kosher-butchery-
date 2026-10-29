import { useState } from "react";

interface Props {
  src: string;
  alt: string;
  /** Shown on the branded placeholder if the photo is missing */
  name: string;
  sub?: string;
  eager?: boolean;
  className?: string;
}

export function Placeholder({ name, sub = "Glatt Beit Yosef" }: { name: string; sub?: string }) {
  return (
    <div className="ph">
      <div className="ph-inner">
        <div className="ph-mark">BASAR</div>
        <div className="ph-name">{name}</div>
        <div className="ph-rule" />
        <div className="ph-sub">{sub}</div>
      </div>
    </div>
  );
}

/** Photo with an elegant branded fallback when the image file isn't there yet. */
export default function ProductImage({ src, alt, name, sub, eager, className }: Props) {
  const [failed, setFailed] = useState(false);
  if (failed) return <Placeholder name={name} sub={sub} />;
  return <img src={src} alt={alt} className={className} loading={eager ? "eager" : "lazy"} onError={() => setFailed(true)} />;
}
