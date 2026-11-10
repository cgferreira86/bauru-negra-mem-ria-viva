import { useEffect, useRef } from "react";
import L from "leaflet";
import territorios from "@/data/territorios.json";

type T = (typeof territorios)[number];

export default function TerritorialMap({ items, focusId, onSelect }: { items: T[]; focusId: string | null; onSelect: (id: string) => void }) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const layer = useRef<L.LayerGroup | null>(null);
  const markers = useRef<Record<string, L.Marker>>({});

  useEffect(() => {
    if (!el.current || map.current) return;
    map.current = L.map(el.current, { scrollWheelZoom: false }).setView([-22.3145, -49.0587], 14);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
      maxZoom: 19,
    }).addTo(map.current);
    layer.current = L.layerGroup().addTo(map.current);
    return () => { map.current?.remove(); map.current = null; };
  }, []);

  useEffect(() => {
    if (!layer.current) return;
    layer.current.clearLayers();
    markers.current = {};
    const icon = L.divIcon({ className: "", html: '<div class="bn-pin"></div>', iconSize: [22, 22], iconAnchor: [11, 22] });
    items.forEach((t) => {
      if (!t.coords) return;
      const m = L.marker(t.coords as [number, number], { icon })
        .bindPopup(`<strong>${t.nome}</strong><br/><small>${t.endereco}</small>`)
        .on("click", () => onSelect(t.id));
      m.addTo(layer.current!);
      markers.current[t.id] = m;
    });
  }, [items, onSelect]);

  useEffect(() => {
    const m = focusId ? markers.current[focusId] : null;
    if (m && map.current) { map.current.flyTo(m.getLatLng(), 16); m.openPopup(); }
  }, [focusId, items]);

  return <div ref={el} className="bn-map h-full w-full" />;
}
