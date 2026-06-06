import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import api, { fileUrl } from "@/lib/api";
import { X } from "lucide-react";

export default function AdPopup() {
  const [ad,   setAd]   = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("bb_ad_shown") === "1") return;
    (async () => {
      try {
        const { data } = await api.get("/ads/featured");
        if (data) { setAd(data); setOpen(true); sessionStorage.setItem("bb_ad_shown", "1"); }
      } catch {}
    })();
  }, []);

  if (!ad) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent data-testid="ad-popup" className="max-w-lg bg-[#141417] border border-[#27272A] p-0 overflow-hidden">
        <button onClick={() => setOpen(false)} data-testid="ad-popup-close" className="absolute top-3 right-3 z-10 text-white/70 hover:text-white bg-black/40 p-1 rounded-full">
          <X className="w-5 h-5" />
        </button>
        {ad.image_url ? (
          <img src={fileUrl(ad.image_url)} alt={ad.title} className="w-full h-56 object-cover" />
        ) : (
          <div className="w-full h-56 bg-gradient-to-br from-[#2a1f1a] to-[#0A0A0B] flex items-center justify-center">
            <span className="font-serif text-4xl text-[#E27D60]">Featured</span>
          </div>
        )}
        <div className="p-6">
          <div className="text-xs tracking-[0.25em] text-[#E27D60] uppercase mb-2">Sponsored · Author Ad</div>
          <h3 className="font-serif text-3xl mb-1">{ad.title}</h3>
          <p className="text-sm text-[#A1A1AA] mb-1">by {ad.author}</p>
          <p className="text-sm leading-relaxed text-[#d4d4d8] mt-3">{ad.description}</p>
          {ad.link_url && (
            <a href={ad.link_url} target="_blank" rel="noreferrer" data-testid="ad-popup-link" className="btn-primary inline-block mt-5 text-sm">
              Learn more →
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
