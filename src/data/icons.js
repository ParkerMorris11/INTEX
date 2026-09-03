/* ==========================================================================
   ICONS
   24x24 stroke icons, drawn to match the reference layout's outlined style.
   `currentColor` so the icon inherits BYU Royal from its container.
   ========================================================================== */

const ICONS = {
  code: '<path d="M8.5 8 4 12l4.5 4M15.5 8 20 12l-4.5 4"/>',

  systems:
    '<rect x="3" y="4.5" width="18" height="12" rx="1.5"/>' +
    '<path d="M8 20h8M12 16.5V20"/>' +
    '<path d="M7 13.5l2.5-3 2.5 2 3-4"/>',

  chart:
    '<path d="M4 20V4"/><path d="M4 20h16"/>' +
    '<rect x="7.5" y="12" width="2.6" height="5" rx="0.6"/>' +
    '<rect x="12" y="8.5" width="2.6" height="8.5" rx="0.6"/>' +
    '<rect x="16.5" y="5.5" width="2.6" height="11.5" rx="0.6"/>',

  lock:
    '<rect x="4.5" y="10.5" width="15" height="9.5" rx="2"/>' +
    '<path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>' +
    '<circle cx="12" cy="15" r="1.2"/>',

  globe:
    '<circle cx="12" cy="12" r="8.5"/>' +
    '<path d="M3.5 12h17"/>' +
    '<path d="M12 3.5c2.3 2.4 3.5 5.4 3.5 8.5s-1.2 6.1-3.5 8.5c-2.3-2.4-3.5-5.4-3.5-8.5S9.7 5.9 12 3.5Z"/>',

  user:
    '<circle cx="12" cy="12" r="8.5"/>' +
    '<circle cx="12" cy="10" r="2.8"/>' +
    '<path d="M6.6 18.5a5.8 5.8 0 0 1 10.8 0"/>',

  clipboard:
    '<rect x="5" y="4.5" width="14" height="16" rx="2"/>' +
    '<path d="M9 4.5V3.2A1.2 1.2 0 0 1 10.2 2h3.6A1.2 1.2 0 0 1 15 3.2v1.3"/>' +
    '<path d="M8.5 10.5l1.4 1.4 2.4-2.4M8.5 15.5l1.4 1.4 2.4-2.4"/>' +
    '<path d="M14.5 10.8h2M14.5 15.8h2"/>',

  docCheck:
    '<path d="M14 3H7.5A1.5 1.5 0 0 0 6 4.5v15A1.5 1.5 0 0 0 7.5 21H15"/>' +
    '<path d="M14 3l4 4v4"/><path d="M14 3v4h4"/>' +
    '<circle cx="17.5" cy="17" r="3.5"/>' +
    '<path d="M16.1 17l1 1 1.8-1.9"/>',

  layers:
    '<path d="M12 3.2 3.5 7.4 12 11.6l8.5-4.2Z"/>' +
    '<path d="M3.5 12 12 16.2 20.5 12"/>' +
    '<path d="M3.5 16.6 12 20.8l8.5-4.2"/>',

  people:
    '<circle cx="9" cy="9" r="3"/>' +
    '<path d="M3.5 19a5.5 5.5 0 0 1 11 0"/>' +
    '<path d="M16 6.6a3 3 0 0 1 0 5.8"/>' +
    '<path d="M17 14.2a5.5 5.5 0 0 1 3.5 4.8"/>',

  box:
    '<path d="M12 2.8 20.5 7v10L12 21.2 3.5 17V7Z"/>' +
    '<path d="M3.5 7 12 11.4 20.5 7"/><path d="M12 11.4v9.8"/>',

  cloud:
    '<path d="M7 18.5a4.2 4.2 0 0 1-.4-8.4 5.6 5.6 0 0 1 10.7-1.3A3.9 3.9 0 0 1 17.6 18.5Z"/>'
};

/** Render an icon as an inline <svg> string. */
function icon(name, size) {
  const d = ICONS[name] || ICONS.box;
  const s = size || 24;
  return (
    '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" ' +
    'stroke="currentColor" stroke-width="1.7" stroke-linecap="round" ' +
    'stroke-linejoin="round" aria-hidden="true" focusable="false">' + d + '</svg>'
  );
}
