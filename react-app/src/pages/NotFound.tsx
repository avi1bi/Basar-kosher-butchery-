import { Link } from "react-router-dom";
import { usePageTitle } from "@/lib/usePageTitle";

export default function NotFound() {
  usePageTitle("Page not found");
  return (
    <div className="wrap">
      <div className="empty" style={{ padding: "100px 0 120px" }}>
        <span className="eyebrow">404</span>
        <h1 style={{ fontSize: "3rem" }}>This page isn't on the counter</h1>
        <p>The page you were looking for doesn't exist.</p>
        <p style={{ marginTop: 26 }}>
          <Link className="btn" to="/">Back to the butchery</Link>
        </p>
      </div>
    </div>
  );
}
