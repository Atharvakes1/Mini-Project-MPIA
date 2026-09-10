// ═══════════════════════════════════════════════════════════════
// Campus Clone - MPIA | Shared Navigation Component
// Injects consistent navbar + mobile menu into every page
// ═══════════════════════════════════════════════════════════════

(function () {
  const currentPath = window.location.pathname;

  const navLinks = [
    { href: '/pages/home.html', label: 'Home', icon: 'home' },
    { href: '/pages/chat.html', label: 'Chat', icon: 'message-circle' },
    { href: '/pages/events.html', label: 'Events & Clubs', icon: 'calendar' },
    { href: '/pages/ai-assistant.html', label: 'AI Assistant', icon: 'bot' },
    { href: '/pages/reels.html', label: 'Reels', icon: 'film' },
    { href: '/pages/tasks.html', label: 'Tasks', icon: 'clipboard-list' },
    { href: '/pages/settings.html', label: 'Settings', icon: 'settings' },
  ];

  function isActive(href) {
    return currentPath === href || currentPath.endsWith(href);
  }

  function getUserName() {
    try {
      const raw = sessionStorage.getItem('campusUser');
      if (raw) {
        const u = JSON.parse(raw);
        return u.name || u.email?.split('@')[0] || 'User';
      }
    } catch (_) {}
    return 'Student';
  }

  function getInitials(name) {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  function buildNavbar() {
    const userName = getUserName();
    const initials = getInitials(userName);

    const nav = document.createElement('nav');
    nav.className = 'cc-navbar';
    nav.innerHTML = `
      <div class="cc-navbar-inner">
        <a href="/pages/home.html" class="cc-navbar-logo">
          <div class="cc-navbar-logo-icon">CC</div>
          <div class="cc-navbar-logo-text">
            <span class="cc-logo-title">Campus Clone</span>
            <span class="cc-logo-subtitle">GL BAJAJ • MPIA</span>
          </div>
        </a>

        <div class="cc-navbar-links" id="ccNavLinks">
          ${navLinks.slice(0, 5).map(link => `
            <a href="${link.href}" class="cc-nav-link ${isActive(link.href) ? 'active' : ''}">
              <i data-lucide="${link.icon}" style="width:15px;height:15px;"></i>
              <span>${link.label}</span>
            </a>
          `).join('')}
        </div>

        <div class="cc-navbar-actions">
          <a href="/pages/ai-assistant.html" class="cc-nav-icon-btn" title="AI Assistant">
            <i data-lucide="bot" style="width:18px;height:18px;"></i>
          </a>
          <a href="/pages/settings.html" class="cc-nav-icon-btn" title="Settings">
            <i data-lucide="settings" style="width:18px;height:18px;"></i>
          </a>
          <div class="cc-nav-avatar" title="${userName}">
            ${initials}
          </div>
          <button class="cc-nav-mobile-btn" id="ccMobileMenuBtn" aria-label="Menu">
            <i data-lucide="menu" style="width:22px;height:22px;"></i>
          </button>
        </div>
      </div>

      <!-- Mobile Drawer -->
      <div class="cc-mobile-drawer" id="ccMobileDrawer">
        <div class="cc-mobile-drawer-header">
          <div class="cc-nav-avatar cc-nav-avatar-lg">${initials}</div>
          <div>
            <div style="font-family:var(--font-display);font-weight:700;font-size:16px;color:var(--text-primary)">${userName}</div>
            <div style="font-family:var(--font-mono);font-size:11px;color:var(--text-muted);margin-top:2px">GL Bajaj Institute</div>
          </div>
        </div>
        <div class="cc-mobile-drawer-links">
          ${navLinks.map(link => `
            <a href="${link.href}" class="cc-mobile-link ${isActive(link.href) ? 'active' : ''}">
              <i data-lucide="${link.icon}" style="width:18px;height:18px;"></i>
              <span>${link.label}</span>
              ${isActive(link.href) ? '<div class="cc-mobile-active-dot"></div>' : ''}
            </a>
          `).join('')}
        </div>
        <div class="cc-mobile-drawer-footer">
          <button class="cc-mobile-logout" onclick="sessionStorage.clear();window.location.href='/pages/login.html'">
            <i data-lucide="log-out" style="width:16px;height:16px;"></i>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
      <div class="cc-mobile-overlay" id="ccMobileOverlay"></div>
    `;

    return nav;
  }

  function injectStyles() {
    if (document.getElementById('cc-navbar-styles')) return;
    const style = document.createElement('style');
    style.id = 'cc-navbar-styles';
    style.textContent = `
      .cc-navbar {
        position: sticky;
        top: 0;
        z-index: 1000;
        width: 100%;
        height: 64px;
        background: rgba(11, 15, 25, 0.92);
        backdrop-filter: blur(24px) saturate(1.4);
        -webkit-backdrop-filter: blur(24px) saturate(1.4);
        border-bottom: 1px solid rgba(255,255,255,0.04);
      }
      .cc-navbar-inner {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 24px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
      }
      .cc-navbar-logo {
        display: flex;
        align-items: center;
        gap: 12px;
        text-decoration: none;
        flex-shrink: 0;
      }
      .cc-navbar-logo-icon {
        width: 36px; height: 36px;
        border-radius: 10px;
        background: linear-gradient(135deg, #00D4FF, #0066FF);
        display: flex; align-items: center; justify-content: center;
        font-family: var(--font-display, 'Space Grotesk', sans-serif);
        font-weight: 800; font-size: 13px;
        color: #0B0F19;
        box-shadow: 0 0 20px rgba(0,212,255,0.25);
        transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
      }
      .cc-navbar-logo:hover .cc-navbar-logo-icon { transform: scale(1.1) rotate(-5deg); }
      .cc-logo-title {
        display: block;
        font-family: var(--font-display, 'Space Grotesk', sans-serif);
        font-size: 16px; font-weight: 700; letter-spacing: -0.02em;
        color: var(--text-primary, #E8ECF4);
      }
      .cc-logo-subtitle {
        display: block;
        font-family: var(--font-mono, 'JetBrains Mono', monospace);
        font-size: 9px; font-weight: 500; letter-spacing: 0.1em;
        color: var(--text-muted, #6B7A99);
        text-transform: uppercase;
      }
      .cc-navbar-links {
        display: flex; gap: 6px; align-items: center;
      }
      .cc-nav-link {
        display: flex; align-items: center; gap: 6px;
        padding: 8px 14px; border-radius: 10px;
        font-family: var(--font-body, 'Plus Jakarta Sans', sans-serif);
        font-size: 13px; font-weight: 600;
        color: var(--text-secondary, #9AA5B8);
        text-decoration: none;
        transition: all 0.2s ease;
        white-space: nowrap;
      }
      .cc-nav-link:hover {
        color: var(--text-primary, #E8ECF4);
        background: rgba(255,255,255,0.04);
      }
      .cc-nav-link.active {
        color: #00D4FF;
        background: rgba(0,212,255,0.08);
      }
      .cc-navbar-actions {
        display: flex; align-items: center; gap: 6px;
        flex-shrink: 0;
      }
      .cc-nav-icon-btn {
        width: 38px; height: 38px;
        border-radius: 10px;
        display: flex; align-items: center; justify-content: center;
        color: var(--text-muted, #6B7A99);
        text-decoration: none;
        transition: all 0.2s ease;
        border: 1px solid transparent;
      }
      .cc-nav-icon-btn:hover {
        color: #00D4FF;
        background: rgba(0,212,255,0.08);
        border-color: rgba(0,212,255,0.2);
      }
      .cc-nav-avatar {
        width: 34px; height: 34px;
        border-radius: 50%;
        background: linear-gradient(135deg, #00D4FF, #FF6B35);
        display: flex; align-items: center; justify-content: center;
        font-family: var(--font-display, 'Space Grotesk', sans-serif);
        font-weight: 700; font-size: 12px;
        color: #0B0F19;
        cursor: pointer;
        margin-left: 4px;
      }
      .cc-nav-avatar-lg { width: 48px; height: 48px; font-size: 16px; }
      .cc-nav-mobile-btn {
        display: none;
        width: 40px; height: 40px;
        border-radius: 10px;
        align-items: center; justify-content: center;
        color: var(--text-secondary, #9AA5B8);
        cursor: pointer;
        background: none; border: none;
      }

      /* Mobile Drawer */
      .cc-mobile-drawer {
        position: fixed;
        top: 0; right: -300px;
        width: 280px; height: 100vh;
        background: var(--bg-secondary, #131A2B);
        border-left: 1px solid rgba(255,255,255,0.06);
        z-index: 2000;
        display: flex; flex-direction: column;
        transition: right 0.35s cubic-bezier(0.16,1,0.3,1);
        box-shadow: -10px 0 40px rgba(0,0,0,0.5);
      }
      .cc-mobile-drawer.open { right: 0; }
      .cc-mobile-drawer-header {
        padding: 24px 20px;
        border-bottom: 1px solid rgba(255,255,255,0.06);
        display: flex; align-items: center; gap: 14px;
      }
      .cc-mobile-drawer-links {
        padding: 12px; flex: 1; overflow-y: auto;
      }
      .cc-mobile-link {
        display: flex; align-items: center; gap: 14px;
        padding: 14px 16px; border-radius: 12px;
        font-family: var(--font-body, 'Plus Jakarta Sans', sans-serif);
        font-size: 14px; font-weight: 600;
        color: var(--text-secondary, #9AA5B8);
        text-decoration: none;
        transition: all 0.2s ease;
        position: relative;
        margin-bottom: 2px;
      }
      .cc-mobile-link:hover, .cc-mobile-link.active {
        color: #00D4FF;
        background: rgba(0,212,255,0.08);
      }
      .cc-mobile-active-dot {
        width: 6px; height: 6px;
        border-radius: 50%;
        background: #00D4FF;
        margin-left: auto;
        box-shadow: 0 0 8px rgba(0,212,255,0.5);
      }
      .cc-mobile-drawer-footer {
        padding: 16px 20px;
        border-top: 1px solid rgba(255,255,255,0.06);
      }
      .cc-mobile-logout {
        display: flex; align-items: center; gap: 10px;
        padding: 12px 16px; border-radius: 10px;
        width: 100%;
        font-family: var(--font-body, 'Plus Jakarta Sans', sans-serif);
        font-size: 13px; font-weight: 600;
        color: #FF5577;
        cursor: pointer;
        background: rgba(255,85,119,0.06);
        border: 1px solid rgba(255,85,119,0.15);
        transition: all 0.2s ease;
      }
      .cc-mobile-logout:hover {
        background: rgba(255,85,119,0.12);
      }
      .cc-mobile-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.6);
        backdrop-filter: blur(4px);
        z-index: 1999;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
      }
      .cc-mobile-overlay.open {
        opacity: 1;
        pointer-events: all;
      }

      @media (max-width: 900px) {
        .cc-navbar-links { display: none; }
        .cc-nav-icon-btn { display: none; }
        .cc-nav-mobile-btn { display: flex; }
      }

      /* Push page content below navbar */
      body { padding-top: 0; }
    `;
    document.head.appendChild(style);
  }

  function init() {
    // Don't inject on login page or splash
    if (currentPath === '/' || currentPath === '/index.html' ||
        currentPath.includes('login.html')) return;

    injectStyles();

    // Remove any existing page-specific navbar
    const existingNav = document.querySelector('.navbar, nav.navbar, header.navbar, nav:first-child, .cc-navbar');
    if (existingNav && !existingNav.classList.contains('cc-navbar')) {
      existingNav.remove();
    }

    const navbar = buildNavbar();
    document.body.insertBefore(navbar, document.body.firstChild);

    // Mobile menu toggle
    const btn = document.getElementById('ccMobileMenuBtn');
    const drawer = document.getElementById('ccMobileDrawer');
    const overlay = document.getElementById('ccMobileOverlay');

    if (btn && drawer && overlay) {
      btn.addEventListener('click', () => {
        drawer.classList.toggle('open');
        overlay.classList.toggle('open');
      });
      overlay.addEventListener('click', () => {
        drawer.classList.remove('open');
        overlay.classList.remove('open');
      });
    }

    // Init Lucide icons for navbar
    if (typeof lucide !== 'undefined') {
      setTimeout(() => lucide.createIcons(), 50);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
