import { useState } from "react";

export function useOpen(key, defaultValue = true) {
  const [open, setOpen] = useState(() => {
    try {
      const v = localStorage.getItem("wf.open." + key);
      return v === null ? defaultValue : v === "true";
    } catch {
      return defaultValue;
    }
  });

  const toggle = () =>
    setOpen((v) => {
      const n = !v;
      try { localStorage.setItem("wf.open." + key, n); } catch {}
      return n;
    });

  return [open, toggle];
}
