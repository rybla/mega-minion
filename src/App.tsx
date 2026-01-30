import { useEffect, useRef, useState } from "react";
import "./index.css";

interface Ad {
  label: string;
  description: string;
}

export function App() {
  const [productName] = useState(() => {
    return new URLSearchParams(window.location.search).get("product_name") ?? "";
  });
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!productName) return;
    setLoading(true);
    setError(null);
    fetch(`/api/assets/${encodeURIComponent(productName)}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(res.status === 404 ? "Product not found" : `Failed to load (${res.status})`);
        }
        const data = await res.json();
        setAds(Array.isArray(data) ? data : []);
        setCurrentIndex(0);
      })
      .catch((err) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  }, [productName]);

  useEffect(() => {
    const audio = audioRef.current;
    const ad = ads[currentIndex];
    if (!audio || !ad) return;
    audio.src = `/assets/${encodeURIComponent(ad.label)}.mp3`;
    audio.play().catch(() => {});
  }, [ads, currentIndex]);

  if (!productName) {
    return (
      <div className="ad-viewer ad-viewer--empty">
        <p>Add ?product_name=YourProduct to the URL</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="ad-viewer ad-viewer--empty">
        <p>Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ad-viewer ad-viewer--empty">
        <p>{error}</p>
      </div>
    );
  }

  if (ads.length === 0) {
    return (
      <div className="ad-viewer ad-viewer--empty">
        <p>No ads for this product.</p>
      </div>
    );
  }

  const ad = ads[currentIndex];
  if (!ad) return null;

  return (
    <div className="ad-viewer">
      <img
        key={currentIndex}
        className="ad-viewer__image"
        src={`/assets/${encodeURIComponent(ad.label)}.png`}
        alt={ad.description || ad.label}
      />
      <audio
        ref={audioRef}
        onEnded={() => setCurrentIndex((i) => (i + 1) % ads.length)}
        preload="auto"
      />
    </div>
  );
}

export default App;
