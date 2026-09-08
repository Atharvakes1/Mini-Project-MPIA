// Initialize Lucide icons
lucide.createIcons();

// Sample Data
const eventsData = [
    { id: 1, title: 'TechFest 2026', date: '2026-10-15', time: '10:00 AM', club: 'Coding Club', description: 'The biggest technical festival of the year featuring hackathons, workshops, and guest lectures.', location: 'Main Auditorium', attendees: 120, isRsvpd: false, past: false },
    { id: 2, title: 'Annual Sports Day', date: '2026-11-05', time: '08:00 AM', club: 'Sports Club', description: 'Inter-department sports competition including cricket, football, basketball and athletics.', location: 'College Ground', attendees: 300, isRsvpd: true, past: false },
    { id: 3, title: 'Cultural Night Diwali', date: '2026-10-22', time: '06:00 PM', club: 'Cultural Committee', description: 'Celebrate Diwali with music, dance performances, and ethnic wear.', location: 'Open Air Theatre', attendees: 450, isRsvpd: false, past: false },
    { id: 4, title: 'Hackathon 3.0', date: '2026-09-15', time: '09:00 AM', club: 'CSE Department', description: '24-hour coding challenge to solve real-world problems.', location: 'Computer Labs', attendees: 85, isRsvpd: false, past: false },
    { id: 5, title: 'Photography Walk', date: '2026-09-12', time: '07:00 AM', club: 'Photography Club', description: 'Morning photowalk around the campus to capture nature and architecture.', location: 'Main Gate', attendees: 30, isRsvpd: true, past: false },
    { id: 6, title: 'Workshop: AI/ML Basics', date: '2026-09-20', time: '02:00 PM', club: 'AI Club', description: 'Hands-on workshop on machine learning fundamentals using Python.', location: 'Seminar Hall 2', attendees: 60, isRsvpd: false, past: false },
    { id: 7, title: 'Orientation 2025', date: '2025-08-10', time: '09:00 AM', club: 'Admin', description: 'Welcome event for freshers.', location: 'Main Auditorium', attendees: 500, isRsvpd: false, past: true }
];

const clubsData = [
    { id: 1, name: 'Coding Club', category: 'Technical', members: 350, description: 'Competitive programming and software dev.', isJoined: false, icon: 'C' },
    { id: 2, name: 'Robotics Club', category: 'Technical', members: 120, description: 'Building robots and automation systems.', isJoined: false, icon: 'R' },
    { id: 3, name: 'Photography Club', category: 'Cultural', members: 85, description: 'Capturing moments and learning photography.', isJoined: true, icon: 'P' },
    { id: 4, name: 'Dance Club (Nritya)', category: 'Cultural', members: 200, description: 'Western, classical and folk dance styles.', isJoined: false, icon: 'D' },
    { id: 5, name: 'Debate Society', category: 'Literary', members: 60, description: 'MUNs, parliamentary debates and elocution.', isJoined: false, icon: 'DS' },
    { id: 6, name: 'Sports Club', category: 'Sports', members: 400, description: 'Cricket, football, basketball, and more.', isJoined: true, icon: 'S' },
    { id: 7, name: 'Music Club (Sargam)', category: 'Cultural', members: 150, description: 'Singing, instruments and band jams.', isJoined: false, icon: 'M' },
    { id: 8, name: 'Drama Club (Rangmanch)', category: 'Cultural', members: 110, description: 'Theatre, nukkad natak, and acting.', isJoined: false, icon: 'RC' },
    { id: 9, name: 'AI/ML Club', category: 'Technical', members: 180, description: 'Exploring artificial intelligence and machine learning.', isJoined: false, icon: 'AI' },
    { id: 10, name: 'Literary Society', category: 'Literary', members: 95, description: 'Poetry, writing, and literature discussions.', isJoined: false, icon: 'LS' }
];

// Audio Context for sound effects
let audioCtx;
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

function playSound(type) {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    if (type === 'rsvp') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(1046.50, audioCtx.currentTime + 0.1); // C6
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'join') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.setValueAtTime(660, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.2);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
    }
}

// State
let currentTab = 'upcoming';
let currentSearch = '';
let currentDateFilter = 'all';
let currentClubCategory = 'all';

// Load from LocalStorage if available
function loadSavedData() {
    const savedRsvps = JSON.parse(localStorage.getItem('campusCloneRsvps') || '{}');
    eventsData.forEach(e => {
        if (savedRsvps[e.id] !== undefined) e.isRsvpd = savedRsvps[e.id];
    });

    const savedClubs = JSON.parse(localStorage.getItem('campusCloneClubs') || '{}');
    clubsData.forEach(c => {
        if (savedClubs[c.id] !== undefined) c.isJoined = savedClubs[c.id];
    });
}
function saveData() {
    const rsvps = {};
    eventsData.forEach(e => rsvps[e.id] = e.isRsvpd);
    localStorage.setItem('campusCloneRsvps', JSON.stringify(rsvps));

    const clubs = {};
    clubsData.forEach(c => clubs[c.id] = c.isJoined);
    localStorage.setItem('campusCloneClubs', JSON.stringify(clubs));
}

// Rendering Events
function renderEvents() {
    const grid = document.getElementById('events-grid');
    grid.innerHTML = '';
    
    const now = new Date();
    
    const filteredEvents = eventsData.filter(e => {
        // Tab filter
        if (currentTab === 'upcoming' && e.past) return false;
        if (currentTab === 'past' && !e.past) return false;
        if (currentTab === 'rsvps' && !e.isRsvpd) return false;
        
        // Search filter
        if (currentSearch && !e.title.toLowerCase().includes(currentSearch) && !e.club.toLowerCase().includes(currentSearch)) {
            return false;
        }
        
        // Date filter
        const eventDate = new Date(e.date);
        if (currentDateFilter === 'today') {
            if (eventDate.toDateString() !== now.toDateString()) return false;
        } else if (currentDateFilter === 'week') {
            const diff = (eventDate - now) / (1000 * 60 * 60 * 24);
            if (diff < 0 || diff > 7) return false;
        } else if (currentDateFilter === 'month') {
            if (eventDate.getMonth() !== now.getMonth() || eventDate.getFullYear() !== now.getFullYear()) return false;
        }
        
        return true;
    });

    if (filteredEvents.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center text-secondary py-8">No events found matching your criteria.</div>';
        return;
    }

    filteredEvents.forEach(e => {
        const dateObj = new Date(e.date);
        const month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();
        const day = dateObj.getDate().toString().padStart(2, '0');
        
        const card = document.createElement('div');
        card.className = 'card hover-glow transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col';
        card.innerHTML = `
            <div class="h-32 bg-gradient-to-r from-purple-800 to-indigo-900 relative cursor-pointer" onclick="openEventDetail(${e.id})">
                <div class="absolute top-2 right-2 bg-black/60 rounded p-1 text-center min-w-[50px] backdrop-blur-sm">
                    <div class="text-[10px] text-accent-primary font-bold">${month}</div>
                    <div class="text-lg font-bold">${day}</div>
                </div>
            </div>
            <div class="p-4 flex flex-col flex-1">
                <h3 class="font-bold text-lg mb-1 truncate cursor-pointer hover:text-accent-primary transition-colors" onclick="openEventDetail(${e.id})">${e.title}</h3>
                <div class="mb-2"><span class="badge badge-accent inline-block">${e.club}</span></div>
                <p class="text-secondary text-sm mb-4 line-clamp-2 flex-1">${e.description}</p>
                
                <div class="flex items-center gap-4 text-xs text-secondary mb-4">
                    <div class="flex items-center gap-1"><i data-lucide="clock" class="w-3 h-3"></i> ${e.time}</div>
                    <div class="flex items-center gap-1 truncate"><i data-lucide="map-pin" class="w-3 h-3"></i> ${e.location}</div>
                </div>
                
                <div class="flex items-center justify-between mt-auto">
                    <div class="flex -space-x-2">
                        <img class="w-6 h-6 rounded-full border border-bg-primary" src="https://ui-avatars.com/api/?name=A&background=random" alt="User">
                        <img class="w-6 h-6 rounded-full border border-bg-primary" src="https://ui-avatars.com/api/?name=B&background=random" alt="User">
                        <div class="w-6 h-6 rounded-full border border-bg-primary bg-bg-secondary flex items-center justify-center text-[10px]">+${e.attendees}</div>
                    </div>
                    <div class="flex gap-2">
                        <button class="btn btn-icon btn-sm btn-outline" onclick="shareEvent(${e.id})"><i data-lucide="share-2" class="w-4 h-4"></i></button>
                        <button class="btn btn-sm ${e.isRsvpd ? 'btn-outline' : 'btn-primary'} ripple-effect" onclick="toggleRsvp(${e.id})">
                            ${e.isRsvpd ? 'RSVP\'d' : 'RSVP'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
    lucide.createIcons();
}

// Rendering Clubs
function renderClubs() {
    const grid = document.getElementById('clubs-grid');
    grid.innerHTML = '';
    
    const filteredClubs = clubsData.filter(c => {
        if (currentClubCategory !== 'all' && c.category !== currentClubCategory) return false;
        if (currentSearch && !c.name.toLowerCase().includes(currentSearch)) return false;
        return true;
    });

    if (filteredClubs.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center text-secondary py-8">No clubs found.</div>';
        return;
    }

    filteredClubs.forEach(c => {
        const card = document.createElement('div');
        card.className = 'card card-glass p-5 flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:shadow-accent-primary/20 hover:-translate-y-1';
        
        // Random bg color for icon based on id
        const hue = (c.id * 37) % 360;
        
        card.innerHTML = `
            <div class="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-3 shadow-lg" style="background-color: hsl(${hue}, 70%, 30%);">
                ${c.icon}
            </div>
            <h3 class="font-bold text-lg mb-1">${c.name}</h3>
            <span class="badge bg-bg-secondary text-xs mb-3 border border-gray-700">${c.category}</span>
            <p class="text-secondary text-sm mb-4 line-clamp-2 h-10">${c.description}</p>
            <div class="text-xs text-secondary mb-4 flex items-center gap-1">
                <i data-lucide="users" class="w-3 h-3"></i> ${c.members} Members
            </div>
            
            <div class="w-full flex gap-2 mt-auto">
                <button class="btn btn-sm flex-1 ${c.isJoined ? 'btn-outline' : 'btn-primary'} ripple-effect" onclick="toggleClubJoin(${c.id})">
                    ${c.isJoined ? 'Leave' : 'Join'}
                </button>
                <button class="btn btn-sm btn-outline flex-1" onclick="document.getElementById('event-search').value='${c.name}'; document.getElementById('event-search').dispatchEvent(new Event('input'));">
                    Events
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
    lucide.createIcons();
}

// Actions
window.toggleRsvp = function(id) {
    const event = eventsData.find(e => e.id === id);
    if (event) {
        event.isRsvpd = !event.isRsvpd;
        event.attendees += event.isRsvpd ? 1 : -1;
        saveData();
        renderEvents();
        
        // Update modal if open
        const modalBtn = document.getElementById('detail-rsvp-btn');
        if (modalBtn && !document.getElementById('event-detail-modal').classList.contains('hidden')) {
             modalBtn.textContent = event.isRsvpd ? "Cancel RSVP" : "RSVP Now";
             modalBtn.className = event.isRsvpd ? "btn btn-outline flex-1" : "btn btn-primary flex-1";
             document.getElementById('detail-attendees').textContent = `${event.attendees} Attendees`;
        }
        
        if (event.isRsvpd) playSound('rsvp');
    }
}

window.toggleClubJoin = function(id) {
    const club = clubsData.find(c => c.id === id);
    if (club) {
        club.isJoined = !club.isJoined;
        club.members += club.isJoined ? 1 : -1;
        saveData();
        renderClubs();
        if (club.isJoined) playSound('join');
    }
}

window.shareEvent = function(id) {
    alert('Share link copied to clipboard!');
}

window.openEventDetail = function(id) {
    const event = eventsData.find(e => e.id === id);
    if (!event) return;
    
    document.getElementById('detail-title').textContent = event.title;
    document.getElementById('detail-club').textContent = event.club;
    document.getElementById('detail-desc').textContent = event.description;
    document.getElementById('detail-location').textContent = event.location;
    document.getElementById('detail-time').textContent = event.time;
    document.getElementById('detail-attendees').textContent = `${event.attendees} Attendees`;
    
    const dateObj = new Date(event.date);
    document.getElementById('detail-month').textContent = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();
    document.getElementById('detail-day').textContent = dateObj.getDate().toString().padStart(2, '0');
    
    const rsvpBtn = document.getElementById('detail-rsvp-btn');
    rsvpBtn.textContent = event.isRsvpd ? "Cancel RSVP" : "RSVP Now";
    rsvpBtn.className = event.isRsvpd ? "btn btn-outline flex-1" : "btn btn-primary flex-1";
    rsvpBtn.onclick = () => toggleRsvp(id);
    
    document.getElementById('event-detail-modal').classList.remove('hidden');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadSavedData();
    renderEvents();
    renderClubs();

    // Search
    document.getElementById('event-search').addEventListener('input', (e) => {
        currentSearch = e.target.value.toLowerCase();
        renderEvents();
        renderClubs();
    });

    // Event Tabs
    document.querySelectorAll('#event-tabs .tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('#event-tabs .tab-btn').forEach(b => {
                b.classList.remove('active', 'border-accent-primary', 'text-primary');
                b.classList.add('border-transparent', 'text-secondary');
            });
            e.target.classList.remove('border-transparent', 'text-secondary');
            e.target.classList.add('active', 'border-accent-primary', 'text-primary');
            currentTab = e.target.dataset.tab;
            renderEvents();
        });
    });

    // Date Filters
    document.querySelectorAll('#event-date-filters .filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('#event-date-filters .filter-btn').forEach(b => {
                b.classList.remove('btn-primary', 'active');
                b.classList.add('btn-outline');
            });
            e.target.classList.remove('btn-outline');
            e.target.classList.add('btn-primary', 'active');
            currentDateFilter = e.target.dataset.filter;
            renderEvents();
        });
    });

    // Club Category Filters
    document.querySelectorAll('#club-category-filters .filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('#club-category-filters .filter-btn').forEach(b => {
                b.classList.remove('btn-primary', 'active');
                b.classList.add('btn-outline');
            });
            e.target.classList.remove('btn-outline');
            e.target.classList.add('btn-primary', 'active');
            currentClubCategory = e.target.dataset.category;
            renderClubs();
        });
    });

    // Modals
    document.getElementById('btn-create-event').addEventListener('click', () => {
        document.getElementById('create-event-modal').classList.remove('hidden');
    });

    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal-overlay').classList.add('hidden');
        });
    });

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.classList.add('hidden');
        });
    });

    document.getElementById('create-event-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Event created successfully! (Mock)');
        document.getElementById('create-event-modal').classList.add('hidden');
        e.target.reset();
    });

    // Scroll Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
});
