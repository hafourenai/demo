export const initials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return (parts[0]?.slice(0, 2) || 'AA').toUpperCase();
};

// Generate data URI untuk SVG avatar (browser-compatible, no Buffer)
export const generateAvatarDataUri = (name: string, color: string = 'A68B5B'): string => {
  const init = initials(name);
  const svg = `<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
    <circle cx="200" cy="200" r="200" fill="#${color}" />
    <circle cx="200" cy="140" r="50" fill="rgba(255,255,255,0.9)" />
    <ellipse cx="200" cy="280" rx="60" ry="70" fill="rgba(255,255,255,0.85)" />
    <text x="200" y="295" text-anchor="middle" font-size="120" font-weight="bold" fill="#${color}" font-family="system-ui, -apple-system, sans-serif" dy=".3em">${init}</text>
  </svg>`;
  // Encode menggunakan encodeURIComponent (works in both Node & browser)
  const encoded = encodeURIComponent(svg);
  return `data:image/svg+xml,${encoded}`;
};
