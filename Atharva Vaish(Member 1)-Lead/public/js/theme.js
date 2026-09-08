// Theme Engine for Campus Clone

const themes = {
    dark: {
        '--bg-primary': '#090909',
        '--bg-secondary': '#111111',
        '--accent-primary': '#7C3AED',
        '--text-primary': '#ffffff',
        '--text-secondary': '#B5B5B5',
        '--text-muted': '#7D7D7D'
    },
    light: {
        '--bg-primary': '#f8f9fa',
        '--bg-secondary': '#ffffff',
        '--accent-primary': '#7C3AED',
        '--text-primary': '#1a1a1a',
        '--text-secondary': '#4a4a4a',
        '--text-muted': '#718096'
    },
    neon: {
        '--bg-primary': '#090909',
        '--bg-secondary': '#111111',
        '--accent-primary': '#10b981',
        '--text-primary': '#ffffff',
        '--text-secondary': '#B5B5B5',
        '--text-muted': '#7D7D7D'
    },
    gaming: {
        '--bg-primary': '#090909',
        '--bg-secondary': '#1a0505',
        '--accent-primary': '#ef4444',
        '--text-primary': '#ffffff',
        '--text-secondary': '#B5B5B5',
        '--text-muted': '#7D7D7D'
    }
};

function applyTheme(themeName) {
    const theme = themes[themeName] || themes.dark;
    const root = document.documentElement;
    
    // Add transition class for smooth switching
    document.body.classList.add('theme-transitioning');
    
    // Apply CSS variables
    Object.keys(theme).forEach(key => {
        root.style.setProperty(key, theme[key]);
    });
    
    // Update active UI card if on settings page
    const cards = document.querySelectorAll('.theme-card');
    if (cards.length > 0) {
        cards.forEach(card => card.classList.remove('active'));
        const activeCard = document.querySelector(`.theme-card[data-theme="${themeName}"]`);
        if(activeCard) activeCard.classList.add('active');
    }
    
    // Update data attribute on html tag
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

function setWallpaper(wallpaperId) {
    localStorage.setItem('campusWallpaper', wallpaperId);
    
    // Update active UI
    document.querySelectorAll('.wallpaper-item').forEach(item => item.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    playSound('click');
    if (typeof showToast !== 'undefined') showToast('Wallpaper updated', 'success');
}

function handleCustomWallpaper(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64 = e.target.result;
            localStorage.setItem('campusCustomWallpaper', base64);
            setWallpaper('custom');
        };
        reader.readAsDataURL(file);
    }
}

function toggleSounds() {
    const isEnabled = document.getElementById('sound-toggle').checked;
    localStorage.setItem('campusSounds', isEnabled);
}

function playSound(type) {
    if (localStorage.getItem('campusSounds') === 'false') return;
    
    // In a real implementation, we'd play actual audio files.
    // For now, this is a placeholder/mock.
    console.log(`[Sound Effect]: Playing ${type} sound`);
}

// Auto-apply theme on load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('campusTheme') || 'dark';
    applyTheme(savedTheme);
    
    // Add CSS for transition if not present
    if (!document.getElementById('theme-styles')) {
        const style = document.createElement('style');
        style.id = 'theme-styles';
        style.textContent = `
            .theme-transitioning, .theme-transitioning * {
                transition: background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease !important;
            }
        `;
        document.head.appendChild(style);
    }
});

// Export for module use if needed
window.applyTheme = applyTheme;
