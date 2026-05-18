/**
 * REVIEW (Workshop 8 feedback): a richer share sheet modelled on
 * Instagram / TikTok / Facebook social shares.
 *
 * Behaviour:
 *   - If the device supports the Web Share API we still try the OS
 *     share first (call sites can opt out via `useNativeFirst: false`).
 *   - Otherwise — and this is now the default path in the prototype —
 *     we mount our own share sheet with:
 *       · An editable, pre-written message preview at the top.
 *       · A row of platform destinations (Messages, WhatsApp,
 *         Messenger, Instagram, TikTok, Facebook, X, Mail, Copy link).
 *       · The user can tweak the text before sending.
 *   - Picking a destination "hands off" via `window.open(deeplink)`
 *     where possible so the demo really opens the platform's compose
 *     view; otherwise we toast.
 */

const PROTO_DESTINATIONS = [
  { id: 'sms',       label: 'Messages',  color: '#34C759', icon: smsIcon(),       deeplink: (msg) => `sms:&body=${encodeURIComponent(msg)}` },
  { id: 'whatsapp',  label: 'WhatsApp',  color: '#25D366', icon: whatsappIcon(),  deeplink: (msg) => `https://wa.me/?text=${encodeURIComponent(msg)}` },
  { id: 'messenger', label: 'Messenger', color: '#0084FF', icon: messengerIcon(), deeplink: () => 'https://www.messenger.com' },
  { id: 'instagram', label: 'Instagram', color: '#E1306C', icon: instagramIcon(), deeplink: () => 'https://www.instagram.com/direct/inbox/' },
  { id: 'tiktok',    label: 'TikTok',    color: '#000000', icon: tiktokIcon(),    deeplink: () => 'https://www.tiktok.com/foryou' },
  { id: 'facebook',  label: 'Facebook',  color: '#1877F2', icon: facebookIcon(),  deeplink: (msg, url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(msg)}` },
  { id: 'x',         label: 'X',         color: '#000000', icon: xIcon(),         deeplink: (msg, url) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}&url=${encodeURIComponent(url)}` },
  { id: 'mail',      label: 'Mail',      color: '#0A84FF', icon: mailIcon(),      deeplink: (msg) => `mailto:?subject=Join%20me%20on%20SosialT&body=${encodeURIComponent(msg)}` },
  { id: 'copy',      label: 'Copy link', color: '#8A8A8E', icon: copyIcon() },
];

function smsIcon() {
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"><path d="M4 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2h-7l-5 4v-4a2 2 0 01-2-2V5z"/></svg>`;
}
function whatsappIcon() {
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path fill="#fff" fill-rule="evenodd" clip-rule="evenodd" d="M12.04 2a9.89 9.89 0 00-8.62 14.98l-.57 2.08 2.13-.56A9.88 9.88 0 1012.04 2zm5.38 14.12c-.24.67-1.18 1.24-1.94 1.41-.5.11-.58.1-1.7-.43-.78-.33-1.59-.57-2.25-.77-1.05-.31-1.87-.46-2.64.89-.38.65-.76 1.39-.76 1.39s-.24.49.18 1.18c.39.65 1.06 1.26 1.13 1.34.24.37 1.17 1.82 2.82 2.55 1.93.84 2.71.91 3.66.79 1.07-.13 3.27-1.33 3.74-2.62.47-1.3.47-2.4.33-2.63-.14-.23-.56-.37-1.16-.65z"/></svg>`;
}
function messengerIcon() {
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8.5z"/></svg>`;
}
function instagramIcon() {
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="#fff" stroke="none"/></svg>`;
}
function tiktokIcon() {
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 011.78.58V8.36a6.23 6.23 0 00-1.77-.26 6.25 6.25 0 00-5.33 9.48 6.28 6.28 0 0010.67-4.43V7.05a8.16 8.16 0 004.77 1.52V4.69a4.84 4.84 0 01-1-.08z"/></svg>`;
}
function facebookIcon() {
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.4c0-.9.25-1.5 1.5-1.5H17V4.1c-.26-.04-1.15-.11-2.2-.11-2.17 0-3.65 1.32-3.65 3.75v2.1H9v3.2h2.15V22h2.35z"/></svg>`;
}
function xIcon() {
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M18.244 2H21.5l-7.45 8.51L22.75 22h-6.79l-5.31-6.96L4.5 22H1.244l7.98-9.12L1.25 2h6.97l4.8 6.34L18.244 2zm-1.187 18h1.87L7.04 4H5.04l12.02 16z"/></svg>`;
}
function mailIcon() {
  return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>`;
}
function copyIcon() {
  return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>`;
}

/**
 * Async — returns the destination id if the share completed, or null on cancel.
 *
 * REVIEW (Workshop 8): we now default to our own platform-pick sheet
 * because reviewers wanted to demo IG / TikTok / etc. specifically.
 * Pass `{ useNativeFirst: true }` to fall back to the OS share sheet.
 */
export async function nativeShareInvite({ title, text, url, onShared, useNativeFirst = false } = {}) {
  const payload = {
    title: title || 'Join me on SosialT',
    text: text || 'Join me on SosialT. Small-group plans without the chaos.',
    url: url || 'https://sosialt.app/invite/anders',
  };

  if (useNativeFirst && canUseWebShare()) {
    try {
      await navigator.share(payload);
      onShared && onShared('native');
      return 'native';
    } catch (_err) {
      return null;
    }
  }

  return new Promise((resolve) => {
    mountProtoShareSheet({
      payload,
      onPick: (id) => {
        onShared && onShared(id);
        resolve(id);
      },
      onCancel: () => resolve(null),
    });
  });
}

function canUseWebShare() {
  if (typeof navigator === 'undefined') return false;
  if (typeof navigator.share !== 'function') return false;
  return true;
}

function mountProtoShareSheet({ payload, onPick, onCancel }) {
  document.querySelectorAll('.proto-share, .proto-share-bd').forEach((n) => n.remove());

  const frame = document.querySelector('.device-frame') || document.body;

  const bd = document.createElement('div');
  bd.className = 'proto-share-bd';

  const sheet = document.createElement('section');
  sheet.className = 'proto-share proto-share--v2';
  sheet.setAttribute('role', 'dialog');
  sheet.setAttribute('aria-label', 'Share invite');

  // Build the "message body" that's pre-written but editable. We append
  // the URL on its own line so users see exactly what their friends get.
  const initialMessage = `${payload.text}\n${payload.url}`;

  sheet.innerHTML = `
    <span class="proto-share__handle" aria-hidden="true"></span>
    <header class="proto-share__head proto-share__head--v2">
      <span class="proto-share__kicker">Share invite</span>
      <h3 class="proto-share__title">Send to friends</h3>
      <p class="proto-share__hint">Edit the message if you want, then pick where to send it.</p>
    </header>

    <label class="proto-share__compose" aria-label="Edit your invite message">
      <textarea class="proto-share__compose-input" id="proto-share-msg" rows="3">${escapeHtml(initialMessage)}</textarea>
      <span class="proto-share__compose-meta"><span id="proto-share-count">${initialMessage.length}</span> chars · tap to edit</span>
    </label>

    <p class="proto-share__row-label">Send to</p>
    <div class="proto-share__row proto-share__row--v2">
      ${PROTO_DESTINATIONS.map((d) => `
        <button type="button" class="proto-share__dest" data-id="${d.id}">
          <span class="proto-share__dest-icon" style="background:${d.color}">${d.icon}</span>
          <span class="proto-share__dest-label">${d.label}</span>
        </button>
      `).join('')}
    </div>

    <p class="proto-share__legal">Prototype: hand-off opens the platform with your message pre-filled where supported.</p>
    <button type="button" class="proto-share__cancel" id="proto-share-cancel">Cancel</button>
  `;

  frame.appendChild(bd);
  frame.appendChild(sheet);

  const messageInput = sheet.querySelector('#proto-share-msg');
  const counter = sheet.querySelector('#proto-share-count');
  messageInput.addEventListener('input', () => {
    counter.textContent = String(messageInput.value.length);
  });

  function close() {
    sheet.classList.add('proto-share--leaving');
    bd.classList.add('proto-share-bd--leaving');
    setTimeout(() => { sheet.remove(); bd.remove(); }, 220);
  }

  function pick(id) {
    const dest = PROTO_DESTINATIONS.find((d) => d.id === id);
    const message = messageInput.value || initialMessage;

    if (id === 'copy') {
      try { navigator.clipboard.writeText(message); } catch { /* ignore */ }
    } else if (dest && typeof dest.deeplink === 'function') {
      try {
        const url = dest.deeplink(message, payload.url);
        // window.open may be blocked in the prototype frame; that's fine —
        // we still treat the share as completed for the demo and toast.
        window.open(url, '_blank', 'noopener,noreferrer');
      } catch { /* swallow */ }
    }

    close();
    onPick && onPick(id);
  }

  sheet.querySelectorAll('.proto-share__dest').forEach((b) => {
    b.addEventListener('click', () => pick(b.dataset.id));
  });
  sheet.querySelector('#proto-share-cancel').addEventListener('click', () => {
    close();
    onCancel && onCancel();
  });
  bd.addEventListener('click', () => {
    close();
    onCancel && onCancel();
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/** Friendly destination label for confirmation toasts. */
export function destinationLabel(id) {
  const found = PROTO_DESTINATIONS.find((d) => d.id === id);
  if (id === 'native') return 'your share sheet';
  if (id === 'copy') return 'clipboard';
  return found ? found.label : 'your contacts';
}

export function listShareDestinations() {
  return PROTO_DESTINATIONS.map((d) => ({ id: d.id, label: d.label }));
}
