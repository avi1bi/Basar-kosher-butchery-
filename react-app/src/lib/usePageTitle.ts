import { useEffect } from "react";

const SITE = "BASAR Kosher Butchery";

/** Sets the browser tab title; pass no title for the home page. */
export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE}` : `${SITE} — Glatt Beit Yosef Beef & Lamb`;
  }, [title]);
}
