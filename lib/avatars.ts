export const initials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return (parts[0]?.slice(0, 2) || 'AA').toUpperCase();
};

// Generate simple avatar: CSS background color + white initials
// Menggunakan CSS background, lebih reliable daripada SVG data URI
export const generateAvatarUrl = (name: string, color: string = '#A68B5B'): string => {
  const init = initials(name);
  // Canvas-based avatar (simple fallback: buat URL dengan CSS styling di component)
  return `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect fill='${encodeURIComponent(color)}' width='100' height='100'/><text x='50' y='60' font-size='40' font-weight='bold' fill='white' text-anchor='middle' font-family='system-ui'>${init}</text></svg>`;
};
