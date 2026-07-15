// Lightweight toast notifications — no external dependency required.
// Call signature matches what App.jsx already expects:
//   showSuccess(title, message)
//   showError(title, message)
//   showInfo(title, message)

const TOAST_CONTAINER_ID = 'swal-toast-container';
const TOAST_DURATION_MS = 4000;

const COLORS = {
  success: { bg: '#e6f4ea', border: '#34a853', text: '#1e4620' },
  error: { bg: '#fdecea', border: '#c0392b', text: '#5c1f18' },
  info: { bg: '#e8f0fe', border: '#1a73e8', text: '#1a2b4c' },
};

function getContainer() {
  let container = document.getElementById(TOAST_CONTAINER_ID);
  if (!container) {
    container = document.createElement('div');
    container.id = TOAST_CONTAINER_ID;
    container.style.position = 'fixed';
    container.style.top = '1rem';
    container.style.right = '1rem';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '0.5rem';
    container.style.maxWidth = '320px';
    document.body.appendChild(container);
  }
  return container;
}

function showToast(type, title, message) {
  const container = getContainer();
  const colors = COLORS[type] || COLORS.info;

  const toast = document.createElement('div');
  toast.style.background = colors.bg;
  toast.style.border = `1px solid ${colors.border}`;
  toast.style.color = colors.text;
  toast.style.borderRadius = '8px';
  toast.style.padding = '0.75rem 1rem';
  toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  toast.style.fontFamily = 'inherit';
  toast.style.fontSize = '0.9rem';
  toast.style.opacity = '0';
  toast.style.transform = 'translateY(-8px)';
  toast.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
  toast.style.cursor = 'pointer';

  const titleEl = document.createElement('div');
  titleEl.style.fontWeight = '700';
  titleEl.style.marginBottom = message ? '0.25rem' : '0';
  titleEl.textContent = title || '';

  toast.appendChild(titleEl);

  if (message) {
    const messageEl = document.createElement('div');
    messageEl.style.fontSize = '0.85rem';
    messageEl.textContent = message;
    toast.appendChild(messageEl);
  }

  const dismiss = () => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-8px)';
    setTimeout(() => toast.remove(), 200);
  };

  toast.addEventListener('click', dismiss);
  container.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(dismiss, TOAST_DURATION_MS);
}

export function showSuccess(title, message) {
  showToast('success', title, message);
}

export function showError(title, message) {
  showToast('error', title, message);
}

export function showInfo(title, message) {
  showToast('info', title, message);
}

// showAppAlert — a modal confirmation dialog (not a toast).
// Mimics the subset of SweetAlert2's Swal.fire() API this app relies on:
// icon, title, text, showCancelButton, confirmButtonText, cancelButtonText,
// reverseButtons. Resolves to { isConfirmed: boolean }.
const ALERT_ICON_COLORS = {
  warning: '#e6a23c',
  error: '#c0392b',
  success: '#34a853',
  info: '#1a73e8',
  question: '#6b7086',
};

const ALERT_ICON_GLYPHS = {
  warning: '!',
  error: '✕',
  success: '✓',
  info: 'i',
  question: '?',
};

export function showAppAlert({
  icon = 'info',
  title = '',
  text = '',
  showCancelButton = false,
  confirmButtonText = 'OK',
  cancelButtonText = 'Cancel',
  reverseButtons = false,
} = {}) {
  return new Promise((resolve) => {
    const backdrop = document.createElement('div');
    backdrop.style.position = 'fixed';
    backdrop.style.inset = '0';
    backdrop.style.background = 'rgba(0,0,0,0.5)';
    backdrop.style.display = 'flex';
    backdrop.style.alignItems = 'center';
    backdrop.style.justifyContent = 'center';
    backdrop.style.zIndex = '10000';

    const dialog = document.createElement('div');
    dialog.style.background = '#fff';
    dialog.style.borderRadius = '12px';
    dialog.style.padding = '1.75rem';
    dialog.style.maxWidth = '380px';
    dialog.style.width = '90%';
    dialog.style.textAlign = 'center';
    dialog.style.fontFamily = 'inherit';
    dialog.style.boxShadow = '0 12px 32px rgba(0,0,0,0.25)';

    const iconColor = ALERT_ICON_COLORS[icon] || ALERT_ICON_COLORS.info;
    const iconGlyph = ALERT_ICON_GLYPHS[icon] || ALERT_ICON_GLYPHS.info;

    const iconEl = document.createElement('div');
    iconEl.textContent = iconGlyph;
    iconEl.style.width = '48px';
    iconEl.style.height = '48px';
    iconEl.style.borderRadius = '50%';
    iconEl.style.border = `3px solid ${iconColor}`;
    iconEl.style.color = iconColor;
    iconEl.style.fontSize = '1.4rem';
    iconEl.style.fontWeight = '700';
    iconEl.style.display = 'flex';
    iconEl.style.alignItems = 'center';
    iconEl.style.justifyContent = 'center';
    iconEl.style.margin = '0 auto 1rem';

    const titleEl = document.createElement('h3');
    titleEl.textContent = title;
    titleEl.style.margin = '0 0 0.5rem';
    titleEl.style.fontSize = '1.15rem';
    titleEl.style.color = '#1e2338';

    const textEl = document.createElement('p');
    textEl.textContent = text;
    textEl.style.margin = '0 0 1.5rem';
    textEl.style.fontSize = '0.9rem';
    textEl.style.color = '#4b5063';

    const buttonRow = document.createElement('div');
    buttonRow.style.display = 'flex';
    buttonRow.style.gap = '0.6rem';
    buttonRow.style.justifyContent = 'center';

    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = confirmButtonText;
    confirmBtn.style.background = iconColor;
    confirmBtn.style.color = '#fff';
    confirmBtn.style.border = 'none';
    confirmBtn.style.borderRadius = '8px';
    confirmBtn.style.padding = '0.6rem 1.2rem';
    confirmBtn.style.fontWeight = '600';
    confirmBtn.style.cursor = 'pointer';

    const cleanup = (isConfirmed) => {
      document.body.removeChild(backdrop);
      resolve({ isConfirmed });
    };

    confirmBtn.addEventListener('click', () => cleanup(true));

    buttonRow.appendChild(confirmBtn);

    if (showCancelButton) {
      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = cancelButtonText;
      cancelBtn.style.background = '#f2f2f5';
      cancelBtn.style.color = '#1e2338';
      cancelBtn.style.border = 'none';
      cancelBtn.style.borderRadius = '8px';
      cancelBtn.style.padding = '0.6rem 1.2rem';
      cancelBtn.style.fontWeight = '600';
      cancelBtn.style.cursor = 'pointer';
      cancelBtn.addEventListener('click', () => cleanup(false));

      if (reverseButtons) {
        buttonRow.insertBefore(cancelBtn, confirmBtn);
      } else {
        buttonRow.appendChild(cancelBtn);
      }
    }

    backdrop.addEventListener('click', (event) => {
      if (event.target === backdrop) cleanup(false);
    });

    dialog.appendChild(iconEl);
    dialog.appendChild(titleEl);
    dialog.appendChild(textEl);
    dialog.appendChild(buttonRow);
    backdrop.appendChild(dialog);
    document.body.appendChild(backdrop);
  });
}