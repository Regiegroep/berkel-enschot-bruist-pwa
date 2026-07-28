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
  toilet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="7" cy="4" r="2"></circle><circle cx="17" cy="4" r="2"></circle><path d="M4 9h6l-1 5v6H5v-6L4 9ZM14 9h6l-1 5v6h-4v-6l-1-5Z"></path></svg>',
  music: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 18V6l10-2v12"></path><circle cx="6" cy="18" r="3"></circle><circle cx="16" cy="16" r="3"></circle></svg>',
  palette: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 3a9 9 0 1 0 0 18c1.2 0 2-.8 2-1.8 0-.7-.3-1.2-.3-1.7 0-.8.6-1.5 1.6-1.5H17a4 4 0 0 0 0-8h-5Z"></path><circle cx="7.5" cy="10" r="1"></circle><circle cx="10" cy="7.5" r="1"></circle><circle cx="14" cy="7.5" r="1"></circle></svg>',
  film: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M8 5v14M16 5v14M3 9h5M16 9h5M3 15h5M16 15h5"></path></svg>',
  theater: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 4h7v7c0 4-3 7-7 7V4Z"></path><path d="M13 4h7v14c-4 0-7-3-7-7V4Z"></path><path d="M6.5 8h2M15.5 8h2"></path><path d="M6 13c.8.8 1.7 1.2 2.5 1.2S10.2 13.8 11 13"></path><path d="M15 14c.8-.8 1.7-1.2 2.5-1.2S19.2 13.2 20 14"></path></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 5a3 3 0 0 1 3-3h5v18H7a3 3 0 0 0-3 3V5Z"></path><path d="M20 5a3 3 0 0 0-3-3h-5v18h5a3 3 0 0 1 3 3V5Z"></path></svg>',
  coffee: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 8h11v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8Z"></path><path d="M16 10h2a2 2 0 1 1 0 4h-2"></path><path d="M8 3v3M12 3v3"></path></svg>',
  food: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3"></path><path d="M7 11v10"></path><path d="M16 3v18"></path><path d="M16 3c3 2 4 5 4 8h-4"></path></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="9" cy="8" r="3"></circle><circle cx="17" cy="9" r="2"></circle><path d="M3 20a6 6 0 0 1 12 0"></path><path d="M14 15a5 5 0 0 1 7 5"></path></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"></circle><path d="M12 10v6"></path><path d="M12 7h.01"></path></svg>',
  mapPin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 21s6-5.5 6-11a6 6 0 1 0-12 0c0 5.5 6 11 6 11Z"></path><circle cx="12" cy="10" r="2"></circle></svg>',
  parking: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="3" width="16" height="18" rx="2"></rect><path d="M9 17V7h4a3 3 0 0 1 0 6H9"></path></svg>',
  toilet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="8" cy="5" r="2"></circle><circle cx="16" cy="5" r="2"></circle><path d="M5 21v-7l-2-4h4l1 3 1-3h4l-2 4v7"></path><path d="M14 10h4l2 5h-3v6h-2v-6h-3l2-5Z"></path></svg>',
  firstAid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="6" width="18" height="15" rx="2"></rect><path d="M9 6V4h6v2"></path><path d="M12 10v7M8.5 13.5h7"></path></svg>',
  photo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="5" width="18" height="14" rx="2"></rect><circle cx="9" cy="10" r="2"></circle><path d="m21 15-4-4-6 6-3-3-5 5"></path></svg>',
  expo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="4" width="16" height="14" rx="2"></rect><path d="M8 18v3M16 18v3M6 21h12"></path><circle cx="9" cy="9" r="1.5"></circle><path d="m12 15 2.5-3 3.5 3"></path></svg>',
  microphone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="9" y="3" width="6" height="11" rx="3"></rect><path d="M5 10a7 7 0 0 0 14 0"></path><path d="M12 17v4M8 21h8"></path></svg>',
};

function icon(name) {
  const key = String(name || "").trim();
  return icons[key] || icons.compass || "";
}

function renderInlineIcons() {
  document.querySelectorAll("[data-icon]").forEach((element) => {
    element.innerHTML = icon(element.dataset.icon);
  });
}

window.icon = icon;