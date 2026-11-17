/**
 * SnapKart Core Application Utilities
 * Reusable modal, toast, drawer, and layout controllers
 */

const SnapKart = (function() {
  'use strict';

  // Initialize common UI triggers on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initModals();
    initDrawers();
    initMobileNav();
  });

  /* ==========================================================================
     Toast Notification System
     ========================================================================== */
  function showToast(message, type = 'info', duration = 3500) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Icon by type
    const icons = {
      success: '✓',
      warning: '⚠️',
      danger: '✕',
      info: 'ℹ'
    };
    const icon = icons[type] || 'ℹ';

    toast.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="font-weight:bold; color:var(--color-secondary);">${icon}</span>
        <span>${message}</span>
      </div>
      <button style="background:none; border:none; color:#CBD5E1; cursor:pointer; font-size:16px;" onclick="this.parentElement.remove()">✕</button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  /* ==========================================================================
     Modal System
     ========================================================================== */
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function initModals() {
    // Backdrop click to close
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          backdrop.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });

    // Close buttons
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-close-modal');
        closeModal(modalId);
      });
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop.active').forEach(modal => {
          modal.classList.remove('active');
        });
        document.body.style.overflow = '';
      }
    });
  }

  /* ==========================================================================
     Drawer System (Cart & Side Sheets)
     ========================================================================== */
  function openDrawer(drawerId) {
    const drawer = document.getElementById(drawerId);
    if (!drawer) return;
    drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer(drawerId) {
    const drawer = document.getElementById(drawerId);
    if (!drawer) return;
    drawer.classList.remove('active');
    document.body.style.overflow = '';
  }

  function initDrawers() {
    document.querySelectorAll('.drawer-backdrop').forEach(drawerBackdrop => {
      drawerBackdrop.addEventListener('click', (e) => {
        if (e.target === drawerBackdrop) {
          drawerBackdrop.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });

    document.querySelectorAll('[data-close-drawer]').forEach(btn => {
      btn.addEventListener('click', () => {
        const drawerId = btn.getAttribute('data-close-drawer');
        closeDrawer(drawerId);
      });
    });
  }

  /* ==========================================================================
     Mobile Navigation Toggle
     ========================================================================== */
  function initMobileNav() {
    const toggles = document.querySelectorAll('[data-toggle-sidebar]');
    toggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const sidebar = document.querySelector('.portal-sidebar');
        if (sidebar) {
          sidebar.classList.toggle('show');
        }
      });
    });
  }

  return {
    showToast,
    openModal,
    closeModal,
    openDrawer,
    closeDrawer
  };
})();

// Global helpers for convenience in inline HTML attributes
window.showToast = SnapKart.showToast;
window.openModal = SnapKart.openModal;
window.closeModal = SnapKart.closeModal;
window.openDrawer = SnapKart.openDrawer;
window.closeDrawer = SnapKart.closeDrawer;
