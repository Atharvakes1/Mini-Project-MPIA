// home.js - Frontend interactions for the Homepage

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    lucide.createIcons();

    // 2. Sound Effects Manager
    const clickSound = document.getElementById('sound-click');
    const whooshSound = document.getElementById('sound-whoosh');
    
    // Lower volume for subtlety
    if (clickSound) clickSound.volume = 0.2;
    if (whooshSound) whooshSound.volume = 0.1;

    const playClick = () => {
        if(clickSound) {
            clickSound.currentTime = 0;
            clickSound.play().catch(e => console.log('Audio play failed:', e));
        }
    };

    // Attach sound to buttons and links
    document.querySelectorAll('button, a').forEach(el => {
        el.addEventListener('click', () => playClick());
    });

    // 3. Ripple Effect for Buttons
    document.querySelectorAll('.ripple-effect').forEach(button => {
        button.addEventListener('click', function(e) {
            let x = e.clientX - e.target.getBoundingClientRect().left;
            let y = e.clientY - e.target.getBoundingClientRect().top;
            
            let ripples = document.createElement('span');
            ripples.style.left = x + 'px';
            ripples.style.top = y + 'px';
            ripples.style.position = 'absolute';
            ripples.style.background = 'rgba(0, 212, 255, 0.3)';
            ripples.style.transform = 'translate(-50%, -50%)';
            ripples.style.pointerEvents = 'none';
            ripples.style.borderRadius = '50%';
            ripples.style.animation = 'ripple 0.6s linear';
            
            // Add keyframes if not exists
            if(!document.getElementById('ripple-styles')) {
                const style = document.createElement('style');
                style.id = 'ripple-styles';
                style.innerHTML = `@keyframes ripple { 0% { width: 0; height: 0; opacity: 0.5; } 100% { width: 500px; height: 500px; opacity: 0; } }`;
                document.head.appendChild(style);
            }
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripples);
            
            setTimeout(() => {
                ripples.remove();
            }, 600);
        });
    });

    // 4. Mouse Follow Glow Effect
    const glow = document.querySelector('.mouse-glow');
    if(glow) {
        document.addEventListener('mousemove', (e) => {
            glow.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
        });
    }

    // 5. Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Play whoosh sound on major sections entering
                if(entry.target.classList.contains('section') && whooshSound) {
                    whooshSound.currentTime = 0;
                    whooshSound.play().catch(e => {});
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        // Setup initial state CSS via inject if needed, or rely on external CSS
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Add generic visible class css dynamically
    const visStyle = document.createElement('style');
    visStyle.innerHTML = `.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
    document.head.appendChild(visStyle);


    // 6. Marquee Duplication for seamless loop
    const marqueeContent = document.getElementById('marquee-content');
    if (marqueeContent) {
        const clone = marqueeContent.innerHTML;
        marqueeContent.innerHTML += clone + clone; // Tripled for safety on wide screens
    }

    // 7. Feature Button Switching
    const featureBtns = document.querySelectorAll('.feature-btn');
    const mockupContent = document.getElementById('mockup-content');
    
    const mockups = {
        feed: `
            <div class="bg-[#131A2B] p-3 rounded-xl border border-[#1A2340] animate-pop-in">
                <div class="flex items-center gap-2 mb-2">
                    <div class="w-8 h-8 rounded-full bg-blue-500/20"></div>
                    <div><div class="h-3 w-20 bg-[#1E2A45] rounded"></div></div>
                </div>
                <div class="h-16 bg-[#1A2340] rounded-lg w-full"></div>
            </div>
            <div class="bg-[#131A2B] p-3 rounded-xl border border-[#1A2340] animate-pop-in" style="animation-delay: 0.1s">
                <div class="flex items-center gap-2 mb-2">
                    <div class="w-8 h-8 rounded-full bg-cyan-500/20"></div>
                    <div><div class="h-3 w-24 bg-[#1E2A45] rounded"></div></div>
                </div>
                <div class="h-20 bg-[#1A2340] rounded-lg w-full"></div>
            </div>`,
        forums: `
            <div class="bg-[#131A2B] p-4 rounded-xl border border-[#1A2340] h-full flex flex-col gap-2">
                <div class="font-bold text-sm text-[#00D4FF]"># cs-doubt-clearing</div>
                <div class="bg-[#1A2340] p-2 rounded w-3/4 text-xs text-gray-400">Can someone explain pointers?</div>
                <div class="bg-[#00D4FF]/20 p-2 rounded w-3/4 self-end text-xs text-right text-gray-300">It stores memory address...</div>
            </div>`,
        chat: `
            <div class="flex flex-col gap-3 h-full">
                <div class="flex gap-2 items-center bg-[#131A2B] p-2 rounded-xl border border-[#1A2340]">
                    <div class="w-10 h-10 rounded-full bg-green-500/20"></div>
                    <div class="flex-1"><div class="h-3 w-16 bg-[#1E2A45] rounded mb-1"></div><div class="h-2 w-24 bg-[#1A2340] rounded"></div></div>
                </div>
                <div class="flex gap-2 items-center bg-[#131A2B] p-2 rounded-xl border border-[#1A2340]">
                    <div class="w-10 h-10 rounded-full bg-yellow-500/20"></div>
                    <div class="flex-1"><div class="h-3 w-20 bg-[#1E2A45] rounded mb-1"></div><div class="h-2 w-16 bg-[#1A2340] rounded"></div></div>
                </div>
            </div>`,
        events: `
            <div class="grid grid-cols-1 gap-2">
                <div class="h-24 bg-gradient-to-r from-[#00D4FF]/40 to-blue-500/40 rounded-xl flex items-end p-2 border border-[#00D4FF]/30">
                    <div class="font-bold text-[#E8ECF4] text-sm">Tech Fest 2024</div>
                </div>
                <div class="h-24 bg-gradient-to-r from-green-500/40 to-teal-500/40 rounded-xl flex items-end p-2 border border-green-500/30">
                    <div class="font-bold text-[#E8ECF4] text-sm">Alumni Meet</div>
                </div>
            </div>`,
        reels: `
            <div class="h-full bg-gray-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-[#1E2A45]">
                <i data-lucide="play" class="w-12 h-12 text-[#E8ECF4]/50"></i>
                <div class="absolute bottom-4 left-4 right-4">
                    <div class="h-3 w-20 bg-[#E8ECF4]/30 rounded mb-2"></div>
                    <div class="h-2 w-32 bg-[#E8ECF4]/20 rounded"></div>
                </div>
            </div>`,
        ai: `
            <div class="flex flex-col gap-3 h-full">
                <div class="bg-[#1A2340] p-3 rounded-xl rounded-tr-none self-end max-w-[80%] text-xs text-gray-300">When is the mid-term for OS?</div>
                <div class="bg-[#00D4FF]/20 p-3 rounded-xl rounded-tl-none self-start max-w-[80%] text-xs text-[#E8ECF4] border border-[#00D4FF]/30">According to the academic calendar, Operating Systems mid-term is on 15th October.</div>
            </div>`
    };

    featureBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            featureBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');
            
            // Update mockup content
            const feature = btn.getAttribute('data-feature');
            if(mockups[feature] && mockupContent) {
                mockupContent.style.opacity = 0;
                setTimeout(() => {
                    mockupContent.innerHTML = mockups[feature];
                    lucide.createIcons({ root: mockupContent });
                    mockupContent.style.opacity = 1;
                }, 200);
            }
        });
    });

    // 8. Testimonial Carousel
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideInterval;

    const showSlide = (index) => {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    };

    const nextSlide = () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    };

    if (slides.length > 0) {
        slideInterval = setInterval(nextSlide, 5000);

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(slideInterval);
                showSlide(index);
                slideInterval = setInterval(nextSlide, 5000);
            });
        });
    }

    // 9. FAQ Accordion
    const accordionTriggers = document.querySelectorAll('.accordion-trigger');
    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const content = trigger.nextElementSibling;
            const icon = trigger.querySelector('i, svg');
            
            // Close others
            accordionTriggers.forEach(t => {
                if (t !== trigger) {
                    t.nextElementSibling.classList.add('hidden');
                    const tIcon = t.querySelector('i, svg');
                    if(tIcon) tIcon.style.transform = 'rotate(0deg)';
                }
            });

            // Toggle current
            content.classList.toggle('hidden');
            if (icon) {
                if (content.classList.contains('hidden')) {
                    icon.style.transform = 'rotate(0deg)';
                } else {
                    icon.style.transform = 'rotate(180deg)';
                }
            }
        });
    });

    // 10. Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 11. Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            // Simple mobile menu logic (could be expanded)
            alert('Mobile menu toggled - implementation depends on specific UI layout');
        });
    }
});
