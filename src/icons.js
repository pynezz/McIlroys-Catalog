// Generate technical diagram-style SVG icons for components
export function generateIcon(id, name) {
  const initials = name
    .split(/[\s\-().]/)
    .filter(word => word.length > 0)
    .slice(0, 2)
    .map(word => word[0].toUpperCase())
    .join('');

  // Use component id to generate consistent colors
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = hash % 360;

  return `
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid-${id}" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M 8 0 L 0 0 0 8" fill="none" stroke="hsl(${hue}, 20%, 25%)" stroke-width="0.5" opacity="0.3"/>
        </pattern>
      </defs>
      <rect width="48" height="48" fill="url(#grid-${id})"/>
      <rect x="6" y="6" width="36" height="36" fill="none" stroke="hsl(${hue}, 40%, 50%)" stroke-width="1.5" stroke-dasharray="2,2"/>
      <circle cx="24" cy="24" r="14" fill="none" stroke="hsl(${hue}, 50%, 60%)" stroke-width="1.5"/>
      <text x="24" y="24"
            text-anchor="middle"
            dominant-baseline="central"
            fill="hsl(${hue}, 60%, 70%)"
            font-family="'IBM Plex Mono', monospace"
            font-size="14"
            font-weight="600"
            letter-spacing="-0.5">${initials}</text>
      <circle cx="24" cy="24" r="2" fill="hsl(${hue}, 50%, 60%)"/>
    </svg>
  `.trim();
}
