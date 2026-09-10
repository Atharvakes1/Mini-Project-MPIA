// ═══════════════════════════════════════════════════════════════
// Campus Clone - MPIA | Theme Engine v2
// Midnight Navy + Cyan identity with 4 theme variants
// ═══════════════════════════════════════════════════════════════

const themes = {
    dark: {
        '--bg-primary': '#0B0F19',
        '--bg-secondary': '#131A2B',
        '--bg-tertiary': '#1A2340',
        '--bg-elevated': '#1E2A45',
        '--accent-primary': '#00D4FF',
        '--accent-secondary': '#0099CC',
        '--accent-warm': '#FF6B35',
        '--accent-gold': '#FFD700',
        '--text-primary': '#E8ECF4',
        '--text-secondary': '#9AA5B8',
        '--text-muted': '#6B7A99'
    },
    light: {
        '--bg-primary': '#F0F2F8',
        '--bg-secondary': '#FFFFFF',
        '--bg-tertiary': '#E4E8F0',
        '--bg-elevated': '#FFFFFF',
        '--accent-primary': '#0099CC',
        '--accent-secondary': '#007AA3',
        '--accent-warm': '#E05A2B',
        '--accent-gold': '#D4A800',
        '--text-primary': '#0B0F19',
        '--text-secondary': '#4A5568',
        '--text-muted': '#8896AB'
    },
    neon: {
        '--bg-primary': '#0B0F19',
        '--bg-secondary': '#0D1520',
        '--bg-tertiary': '#122030',
        '--bg-elevated': '#162838',
        '--accent-primary': '#00FF88',
        '--accent-secondary': '#00CC6A',
        '--accent-warm': '#FFD700',
        '--accent-gold': '#FFAA00',
        '--text-primary': '#E8ECF4',
        '--text-secondary': '#9AA5B8',
        '--text-muted': '#6B7A99'
    },
    gaming: {
        '--bg-primary': '#0F0A14',
        '--bg-secondary': '#1A1020',
        '--bg-tertiary': '#251530',
        '--bg-elevated': '#2F1A3A',
        '--accent-primary': '#FF2D55',
        '--accent-secondary': '#CC0033',
        '--accent-warm': '#FF9500',
        '--accent-gold': '#FFD700',
        '--text-primary': '#F0E8F8',
        '--text-secondary': '#A89AB8',
        '--text-muted': '#7A6B99'
    }
};

function applyTheme(themeName) {
    const theme = themes[themeName] || themes.dark;
    const root = document.documentElement;

    document.body.classList.add('theme-transitioning');

    Object.keys(theme).forEach(key => {
        root.style.setProperty(key, theme[key]);
    });

    // Update active card on settings page
    const cards = document.querySelectorAll('.theme-card');
    if (cards.length > 0) {
        cards.forEach(card => card.classList.remove('active'));
        const activeCard = document.querySelector(`.theme-card[data-theme="${themeName}"]`);
        if (activeCard) activeCard.classList.add('active');
    }

    document.documentElement.setAttribute('data-theme', themeName);

    setTimeout(() => {
        document.body.classList.remove('theme-transitioning');
    }, 500);
}

function setTheme(themeName) {
    localStorage.setItem('campusTheme', themeName);
    applyTheme(themeName);
    playSound('click');
}

function setWallpaper(wallpaperId, element) {
    localStorage.setItem('campusWallpaper', wallpaperId);
    document.querySelectorAll('.wallpaper-item').forEach(item => item.classList.remove('active'));
    if (element) element.classList.add('active');
    playSound('click');
}

function handleCustomWallpaper(inputEvent) {
    const file = inputEvent.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            localStorage.setItem('campusCustomWallpaper', e.target.result);
            setWallpaper('custom', null);
        };
        reader.readAsDataURL(file);
    }
}

function toggleSounds() {
    const toggle = document.getElementById('sound-toggle');
    if (toggle) localStorage.setItem('campusSounds', toggle.checked);
}

function playSound(type) {
    if (localStorage.getItem('campusSounds') === 'false') return;
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        if (type === 'click') {
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
        } else if (type === 'sent') {
            osc.frequency.setValueAtTime(600, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.12);
        } else if (type === 'received') {
            osc.frequency.setValueAtTime(500, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.15);
        } else {
            osc.frequency.setValueAtTime(660, ctx.currentTime);
        }
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
    } catch (_) { /* silent fail */ }
}

// Auto-apply on load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('campusTheme') || 'dark';
    applyTheme(savedTheme);

    if (!document.getElementById('theme-transition-style')) {
        const style = document.createElement('style');
        style.id = 'theme-transition-style';
        style.textContent = `.theme-transitioning,.theme-transitioning *{transition:background-color .45s ease,color .45s ease,border-color .45s ease,box-shadow .45s ease!important}`;
        document.head.appendChild(style);
    }
});

window.applyTheme = applyTheme;
window.setTheme = setTheme;
window.setWallpaper = setWallpaper;
window.handleCustomWallpaper = handleCustomWallpaper;
window.playSound = playSound;
