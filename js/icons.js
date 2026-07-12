const icons = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 11.5 12 4l9 7.5"></path><path d="M5.5 10.5V20h13v-9.5"></path><path d="M9.5 20v-6h5v6"></path></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="5" width="16" height="15" rx="2"></rect><path d="M8 3v4M16 3v4M4 10h16"></path></svg>',
  compass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"></circle><path d="m15.5 8.5-2.2 5-4.8 2 2.2-5 4.8-2Z"></path></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"></path></svg>',
  map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m9 18-6 3V6l6-3 6 3 6-3v15l-6 3-6-3Z"></path><path d="M9 3v15M15 6v15"></path></svg>',
  tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 13 13 20 4 11V4h7l9 9Z"></path><circle cx="8.5" cy="8.5" r="1.5"></circle></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z"></path><circle cx="12" cy="10" r="2.5"></circle></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"></circle><path d="M12 11v6M12 7h.01"></path></svg>',
  route: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="6" cy="18" r="2"></circle><circle cx="18" cy="6" r="2"></circle><path d="M8 18h3a3 3 0 0 0 3-3V9a3 3 0 0 1 3-3"></path></svg>',
  bike: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="5.5" cy="17" r="3.5"></circle><circle cx="18.5" cy="17" r="3.5"></circle><path d="m5.5 17 4-7h4l5 7M9.5 10l4 7M8 7h3"></path></svg>',
  car: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m5 11 2-5h10l2 5"></path><rect x="3" y="10" width="18" height="8" rx="2"></rect><path d="M6 18v2M18 18v2M7 14h.01M17 14h.01"></path></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20.8 5.7a5.5 5.5 0 0 0-7.8 0L12 6.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.5a5.5 5.5 0 0 0 0-7.8Z"></path><path d="M12 9v6M9 12h6"></path></svg>',
  toilet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="7" cy="4" r="2"></circle><circle cx="17" cy="4" r="2"></circle><path d="M4 9h6l-1 5v6H5v-6L4 9ZM14 9h6l-1 5v6h-4v-6l-1-5Z"></path></svg>'
};

function icon(name) {
  return icons[name] || "";
}

function renderInlineIcons() {
  document.querySelectorAll("[data-icon]").forEach((element) => {
    element.innerHTML = icon(element.dataset.icon);
  });
}
