/**
 * CALQIO Toast Notification System
 * Lightweight, non-intrusive micro-feedback notifications.
 */

import { getIcon } from './icons.js';

let container = null;

function ensureContainer() {
  if (!container) {
    container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
  }
  return container;
}

export const Toast = {
  show(message, type = 'info', duration = 3000) {
    const parent = ensureContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconName = 'info';
    if (type === 'success') iconName = 'check';
    if (type === 'error') iconName = 'x';

    toast.innerHTML = `
      <div style="color: ${type === 'success' ? 'var(--accent-success)' : type === 'error' ? 'var(--accent-danger)' : 'var(--accent-primary)'}; display:flex; align-items:center;">
        ${getIcon(iconName, 'toast-icon')}
      </div>
      <div class="toast-content">${message}</div>
    `;

    parent.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 200);
    }, duration);
  },

  success(message, duration) {
    this.show(message, 'success', duration);
  },

  info(message, duration) {
    this.show(message, 'info', duration);
  },

  error(message, duration) {
    this.show(message, 'error', duration);
  }
};
