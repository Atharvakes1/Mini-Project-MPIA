document.addEventListener('DOMContentLoaded', () => {
    
    const sampleReels = [
        {
            id: 'reel_1',
            creator: '@campus_official',
            name: 'Campus Official',
            desc: 'Welcome back to campus! 🏫 Check out the newly renovated Block A and the extended library hours.',
            tags: '#CampusLife #GLBajaj #BackToCollege',
            music: 'Original Audio - campus_official',
            likes: 1245,
            comments: 89,
            gradient: 'linear-gradient(45deg, #FF6B35, #FFB020)'
        },
        {
            id: 'reel_2',
            creator: '@coding_club',
            name: 'Coding Club',
            desc: 'Hackathon 2026 highlights! 🎉 Amazing energy and brilliant projects this year. Congrats to the winning team! 🏆',
            tags: '#Hackathon #Coding #TechFest #Dev',
            music: 'Trending Tech Beat - DJ Code',
            likes: 856,
            comments: 42,
            gradient: 'linear-gradient(45deg, #00D4FF, #003366)'
        },
        {
            id: 'reel_3',
            creator: '@nritya_club',
            name: 'Nritya Dance Society',
            desc: 'Practice session for the upcoming cultural fest. 💃 Dropping some new moves!',
            tags: '#Dance #CulturalFest #Practice #Groove',
            music: 'Viral Dance Mix 2026',
            likes: 2104,
            comments: 156,
            gradient: 'linear-gradient(45deg, #00E080, #0066FF)'
        },
        {
            id: 'reel_4',
            creator: '@cse_dept',
            name: 'CSE Department',
            desc: 'Late night lab vibes. 🔬 Debugging until the sun comes up. Who can relate? ☕',
            tags: '#CSE #Engineering #Lab #Debugging #Coffee',
            music: 'Lofi Study Beats',
            likes: 543,
            comments: 112,
            gradient: 'linear-gradient(45deg, #1A2340, #131A2B)'
        },
        {
            id: 'reel_5',
            creator: '@sports_club',
            name: 'Sports Club',
            desc: 'Finals match highlights! ⚽ What a goal in the last minute! Pure adrenaline.',
            tags: '#SportsDay #Football #Finals #Victory',
            music: 'Stadium Anthem - Sports Mix',
            likes: 3421,
            comments: 201,
            gradient: 'linear-gradient(45deg, #FFD700, #FF5577)'
        }
    ];

    const reelsContainer = document.getElementById('reelsContainer');
    let savedState = JSON.parse(localStorage.getItem('reelsState')) || {};

    // Render Reels
    function renderReels() {
        sampleReels.forEach(reel => {
            const isLiked = savedState[reel.id]?.liked || false;
            const isBookmarked = savedState[reel.id]?.bookmarked || false;
            const likeCount = isLiked ? reel.likes + 1 : reel.likes;

            const reelEl = document.createElement('div');
            reelEl.className = 'reel-item';
            reelEl.setAttribute('data-id', reel.id);

            reelEl.innerHTML = `
                <div class="progress-bar-container">
                    <div class="progress-bar"></div>
                </div>
                
                <div class="reel-video-placeholder" style="background: ${reel.gradient};"></div>
                
                <div class="reel-overlay"></div>
                
                <i data-lucide="heart" class="floating-heart"></i>

                <div class="reel-info">
                    <div class="reel-creator">
                        <div class="creator-avatar">${reel.name.charAt(0)}</div>
                        <div class="creator-name">${reel.creator}</div>
                        <button class="follow-btn">Follow</button>
                    </div>
                    <div class="reel-desc">${reel.desc}</div>
                    <div class="reel-tags">${reel.tags}</div>
                    <div class="reel-music">
                        <i data-lucide="music" class="music-icon" style="width: 14px; height: 14px;"></i>
                        <marquee scrollamount="3" width="100px">${reel.music}</marquee>
                    </div>
                </div>

                <div class="reel-actions">
                    <button class="reel-action-btn btn-like ${isLiked ? 'liked' : ''}" data-id="${reel.id}">
                        <i data-lucide="heart" style="fill: ${isLiked ? '#FF6B35' : 'none'}; color: ${isLiked ? '#FF6B35' : '#E8ECF4'}"></i>
                        <span class="action-count like-count">${formatNumber(likeCount)}</span>
                    </button>
                    <button class="reel-action-btn btn-comment">
                        <i data-lucide="message-circle"></i>
                        <span class="action-count">${formatNumber(reel.comments)}</span>
                    </button>
                    <button class="reel-action-btn btn-share">
                        <i data-lucide="send"></i>
                        <span class="action-count">Share</span>
                    </button>
                    <button class="reel-action-btn btn-bookmark ${isBookmarked ? 'bookmarked' : ''}" data-id="${reel.id}">
                        <i data-lucide="bookmark" style="fill: ${isBookmarked ? '#FFD700' : 'none'}; color: ${isBookmarked ? '#FFD700' : '#E8ECF4'}"></i>
                    </button>
                </div>
            `;
            reelsContainer.appendChild(reelEl);
        });
        
        lucide.createIcons();
        attachEventListeners();
    }

    function formatNumber(num) {
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num;
    }

    // Play Sound Effect
    const playPopSound = () => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.1);
        } catch(e) {}
    };

    // Intersection Observer for autoplay
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('playing');
                // Force animation restart
                const bar = entry.target.querySelector('.progress-bar');
                if (bar) {
                    bar.style.animation = 'none';
                    bar.offsetHeight; /* trigger reflow */
                    bar.style.animation = null; 
                }
            } else {
                entry.target.classList.remove('playing');
            }
        });
    }, { threshold: 0.6 });

    function attachEventListeners() {
        document.querySelectorAll('.reel-item').forEach(el => observer.observe(el));

        // Like buttons
        document.querySelectorAll('.btn-like').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleLike(btn.getAttribute('data-id'), btn);
            });
        });

        // Double tap
        let lastTap = 0;
        document.querySelectorAll('.reel-video-placeholder').forEach(el => {
            el.addEventListener('click', (e) => {
                const currentTime = new Date().getTime();
                const tapLength = currentTime - lastTap;
                if (tapLength < 500 && tapLength > 0) {
                    // Double tap
                    const reelEl = el.closest('.reel-item');
                    const id = reelEl.getAttribute('data-id');
                    const likeBtn = reelEl.querySelector('.btn-like');
                    
                    // Show heart animation
                    const floatingHeart = reelEl.querySelector('.floating-heart');
                    floatingHeart.classList.remove('animate');
                    void floatingHeart.offsetWidth; // reflow
                    floatingHeart.classList.add('animate');
                    
                    if (!likeBtn.classList.contains('liked')) {
                        toggleLike(id, likeBtn);
                    }
                }
                lastTap = currentTime;
            });
        });

        // Share
        document.querySelectorAll('.btn-share').forEach(btn => {
            btn.addEventListener('click', showToast);
        });

        // Bookmark
        document.querySelectorAll('.btn-bookmark').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleBookmark(btn.getAttribute('data-id'), btn);
            });
        });
    }

    function toggleLike(id, btnEl) {
        if (!savedState[id]) savedState[id] = {};
        const isLiked = !savedState[id].liked;
        savedState[id].liked = isLiked;
        localStorage.setItem('reelsState', JSON.stringify(savedState));
        
        btnEl.classList.toggle('liked', isLiked);
        
        const icon = btnEl.querySelector('i, svg');
        if (icon) {
            icon.style.fill = isLiked ? '#FF6B35' : 'none';
            icon.style.color = isLiked ? '#FF6B35' : '#E8ECF4';
        }
        
        const baseLikes = sampleReels.find(r => r.id === id).likes;
        btnEl.querySelector('.like-count').innerText = formatNumber(isLiked ? baseLikes + 1 : baseLikes);
        
        if(isLiked) playPopSound();
    }

    function toggleBookmark(id, btnEl) {
        if (!savedState[id]) savedState[id] = {};
        const isBookmarked = !savedState[id].bookmarked;
        savedState[id].bookmarked = isBookmarked;
        localStorage.setItem('reelsState', JSON.stringify(savedState));
        
        btnEl.classList.toggle('bookmarked', isBookmarked);
        const icon = btnEl.querySelector('i, svg');
        if (icon) {
            icon.style.fill = isBookmarked ? '#FFD700' : 'none';
            icon.style.color = isBookmarked ? '#FFD700' : '#E8ECF4';
        }
    }

    function showToast() {
        const toast = document.getElementById('toast');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    }

    // Modal logic
    const fab = document.getElementById('uploadFab');
    const modal = document.getElementById('uploadModal');
    const closeBtn = document.getElementById('closeModalBtn');

    fab.addEventListener('click', () => modal.classList.add('active'));
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
            reelsContainer.scrollBy({ top: -window.innerHeight, behavior: 'smooth' });
        } else if (e.key === 'ArrowDown') {
            reelsContainer.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
        }
    });

    renderReels();
});
