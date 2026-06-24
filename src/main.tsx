import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { applyAccessibility } from "./lib/accessibility";

const runPreviewCacheReset = async () => {
  const host = window.location.hostname;
  const isPreviewHost =
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.endsWith(".lovableproject.com") ||
    host.endsWith(".lovableproject-dev.com") ||
    host.endsWith(".beta.lovable.dev") ||
    host.startsWith("id-preview--") ||
    host.startsWith("preview--");

  if (!isPreviewHost) return;

  const resetKey = "soul-echoes-preview-cache-reset-2026-06-16";
  if (localStorage.getItem(resetKey) === "done") return;

  try {
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.allSettled(registrations.map((registration) => registration.unregister()));
    }

    if ("caches" in window) {
      const cacheNames = await caches.keys();
      await Promise.allSettled(cacheNames.map((cacheName) => caches.delete(cacheName)));
    }

    sessionStorage.clear();
    localStorage.clear();
    localStorage.setItem(resetKey, "done");
  } catch (error) {
    console.warn("Preview cache reset skipped", error);
  }
};

void runPreviewCacheReset();
applyAccessibility();

createRoot(document.getElementById("root")!).render(<App />);
