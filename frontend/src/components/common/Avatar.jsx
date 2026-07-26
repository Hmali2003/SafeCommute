// Deterministic color-coded initials avatar. Same employee always gets the
// same color, giving a lightweight "who's who" identity system across the
// manager table and detail view without needing profile photos.
const PALETTE = [
  'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-pink-100 text-pink-700',
  'bg-cyan-100 text-cyan-700',
];

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getColorClass(name = '') {
  const sum = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return PALETTE[sum % PALETTE.length];
}

export default function Avatar({ name, size = 'md' }) {
  const sizeClass = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';
  return (
    <div className={`shrink-0 rounded-full flex items-center justify-center font-semibold ${sizeClass} ${getColorClass(name)}`}>
      {getInitials(name)}
    </div>
  );
}