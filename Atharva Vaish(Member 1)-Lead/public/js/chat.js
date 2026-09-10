document.addEventListener('DOMContentLoaded', () => {
    // Maintain Socket.io connection alongside simulated mock interactions
    const socket = typeof io !== 'undefined' ? io() : {
        on: () => {}, emit: () => {}
    };

    const messagesArea = document.getElementById('messagesArea');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    
    // Create & Setup Typing Indicator
    let typingIndicator = document.getElementById('typingIndicator');
    if (!typingIndicator) {
        typingIndicator = document.createElement('div');
        typingIndicator.id = 'typingIndicator';
        messagesArea.appendChild(typingIndicator);
    }
    
    // Inject dynamic animations and custom CSS for chat features
    if (!document.getElementById('chatDynamicStyles')) {
        const style = document.createElement('style');
        style.id = 'chatDynamicStyles';
        style.innerHTML = `
            @keyframes blink {
                0% { opacity: 0.2; transform: translateY(0); }
                20% { opacity: 1; transform: translateY(-2px); }
                100% { opacity: 0.2; transform: translateY(0); }
            }
            .animate-slide-in {
                animation: slideIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            }
            @keyframes slideIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .react-emoji {
                cursor: pointer;
                padding: 2px 4px;
                transition: transform 0.2s;
            }
            .react-emoji:hover {
                transform: scale(1.3);
            }
            .msg-text a:hover {
                opacity: 0.8;
            }
        `;
        document.head.appendChild(style);
    }

    typingIndicator.style.display = 'none';
    typingIndicator.style.alignItems = 'flex-end';
    typingIndicator.style.marginBottom = '16px';
    typingIndicator.innerHTML = `
        <div class="msg-avatar" style="width: 32px; height: 32px; border-radius: 50%; background: #6B7A99; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px; flex-shrink: 0; margin-right: 8px;">CB</div>
        <div style="background: #1A2340; padding: 10px 14px; border-radius: 16px; border-bottom-left-radius: 4px; display: flex; gap: 4px; align-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div class="typing-dot" style="width: 6px; height: 6px; background: var(--text-secondary, #B5B5B5); border-radius: 50%; animation: blink 1.4s infinite both;"></div>
            <div class="typing-dot" style="width: 6px; height: 6px; background: var(--text-secondary, #B5B5B5); border-radius: 50%; animation: blink 1.4s infinite both; animation-delay: 0.2s;"></div>
            <div class="typing-dot" style="width: 6px; height: 6px; background: var(--text-secondary, #B5B5B5); border-radius: 50%; animation: blink 1.4s infinite both; animation-delay: 0.4s;"></div>
        </div>
    `;

    // Setup Character Count
    const charCount = document.createElement('div');
    charCount.style.fontSize = '0.7rem';
    charCount.style.color = '#6B7A99';
    charCount.style.position = 'absolute';
    charCount.style.bottom = '-18px';
    charCount.style.right = '0';
    charCount.style.display = 'none';
    
    const inputContainer = messageInput.parentElement;
    inputContainer.style.position = 'relative';
    inputContainer.appendChild(charCount);

    // Image Paste Preview Container Setup
    let pendingImage = null;
    const previewContainer = document.createElement('div');
    previewContainer.style.display = 'none';
    previewContainer.style.padding = '8px';
    previewContainer.style.background = '#1A2340';
    previewContainer.style.borderTop = '1px solid #2A3441';
    previewContainer.style.borderRadius = '8px 8px 0 0';
    previewContainer.style.position = 'relative';
    previewContainer.style.marginBottom = '8px';
    previewContainer.innerHTML = `
        <img id="pastePreviewImg" src="" style="max-height: 100px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
        <button id="cancelPasteBtn" style="position: absolute; top: 12px; left: 12px; background: rgba(0,0,0,0.7); color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 12px;">✕</button>
    `;
    inputContainer.parentElement.insertBefore(previewContainer, inputContainer);

    document.getElementById('cancelPasteBtn').addEventListener('click', () => {
        pendingImage = null;
        previewContainer.style.display = 'none';
        if (messageInput.value.trim().length === 0) {
            sendBtn.style.display = 'none';
        }
        messageInput.focus();
    });

    // Filtering & Selecting Chats
    const chatTabs = document.querySelectorAll('.chat-tab');
    const chatItems = document.querySelectorAll('.chat-item');
    const chatSearch = document.getElementById('chatSearch');
    
    sendBtn.style.display = 'none';
    sendBtn.style.transition = 'opacity 0.2s, transform 0.2s';

    // Mock User Data & Sample Rooms
    const bots = [
        { name: 'Campus Bot', color: '#00D4FF' },
        { name: 'Bhavya', color: '#FF5577' },
        { name: 'Ayush', color: '#00E080' },
        { name: 'Bhoomika', color: '#FFB020' }
    ];

    const sampleRooms = {
        'CSE-A Official': [
            { text: "Don't forget the OS assignment is due tomorrow! `submission.pdf`", type: 'received', sender: 'Bhoomika', color: '#FFB020', time: '09:00 AM' },
            { text: "Thanks for the reminder! Has anyone solved Q3?", type: 'received', sender: 'Ayush', color: '#00E080', time: '09:05 AM' }
        ],
        'Coding Club': [
            { text: "Next hackathon details are out. Check the pinned message.", type: 'received', sender: 'Campus Bot', color: '#00D4FF', time: '10:00 AM' },
            { text: "I'm looking for a team. Anyone doing Web3?", type: 'sent', time: '10:15 AM' },
            { text: "I am! Let's connect.", type: 'received', sender: 'Bhavya', color: '#FF5577', time: '10:20 AM' }
        ],
        'Campus Events': [
            { text: "Cultural Fest **Zephyr** registrations open now! 🎉 [Register here](https://glbitm.ac.in/zephyr)", type: 'received', sender: 'Campus Bot', color: '#00D4FF', time: 'Yesterday' }
        ],
        'Bhavya (Private)': [
            { text: "Hey! Are you coming to the library today?", type: 'received', sender: 'Bhavya', color: '#FF5577', time: '11:30 AM' }
        ],
        'AI Study Group': [
            { text: "Can someone share the notes for Neural Networks?", type: 'received', sender: 'Ayush', color: '#00E080', time: '08:45 AM' },
            { text: "Sure, I'll upload them to the drive in a bit.", type: 'received', sender: 'Bhoomika', color: '#FFB020', time: '08:50 AM' }
        ]
    };

    const botResponses = {
        greetings: ["Hello there! 👋", "Hey! How's it going?", "Hi! Need any help?", "Greetings! 🌟", "Hey! What's up?"],
        questions: ["That's a great question. You can check the campus portal for details.", "I think the admin office handles that.", "Usually, you'll get an email about it soon.", "Check the notice board near the library!", "Not 100% sure, maybe ask in the main group?"],
        default: ["Interesting point!", "I totally agree.", "Hmm, let me think about that.", "Got it.", "Haha, true 😂", "Let's discuss this later.", "Can you elaborate?", "Makes sense."]
    };

    let currentRoom = 'CSE-A Official';

    chatTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            playSound('click');
            chatTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const filter = tab.dataset.filter;

            chatItems.forEach(item => {
                if (filter === 'all' || item.dataset.type === filter) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    chatSearch.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        chatItems.forEach(item => {
            const title = item.querySelector('.chat-item-title').innerText.toLowerCase();
            if (title.includes(query)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });

    chatItems.forEach(item => {
        item.addEventListener('click', () => {
            playSound('click');
            chatItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const title = item.querySelector('.chat-item-title').innerText;
            const avatarHtml = item.querySelector('.chat-item-avatar').innerHTML;
            
            document.getElementById('activeChatName').innerText = title;
            const plainAvatar = avatarHtml.split('<')[0] || avatarHtml;
            document.getElementById('activeChatAvatar').innerText = plainAvatar;
            
            // Header Subtitle for 'X members • Y online'
            let subtitle = document.getElementById('activeChatSubtitle');
            if (!subtitle) {
                subtitle = document.createElement('div');
                subtitle.id = 'activeChatSubtitle';
                subtitle.style.fontSize = '0.8rem';
                subtitle.style.marginTop = '2px';
                subtitle.style.fontFamily = "'Space Grotesk', sans-serif";
                document.getElementById('activeChatName').parentElement.appendChild(subtitle);
            }
            
            const totalMembers = Math.floor(Math.random() * 100) + 20;
            const onlineMembers = Math.floor(Math.random() * 20) + 2;
            
            if (title.includes('(Private)') || title === 'Bhavya') {
                subtitle.innerHTML = `<span style="display:inline-block; width:8px; height:8px; background:#00E080; border-radius:50%; margin-right:4px; box-shadow: 0 0 5px #00E080;"></span><span style="color:#00E080">Online</span>`;
            } else {
                subtitle.innerHTML = `<span style="color: #6B7A99">${totalMembers} members</span> <span style="margin:0 4px;color:#2A3441">•</span> <span style="display:inline-block; width:8px; height:8px; background:#00E080; border-radius:50%; margin-right:4px; box-shadow: 0 0 5px #00E080;"></span><span style="color:#00E080">${onlineMembers} online</span>`;
            }

            switchRoom(title);
            socket.emit('loadHistory', item.dataset.id);
        });
    });

    function switchRoom(roomName) {
        currentRoom = roomName;
        
        // Clear message area (keep typing indicator)
        Array.from(messagesArea.children).forEach(child => {
            if (child !== typingIndicator) {
                child.remove();
            }
        });

        // Add System Join Message
        const sysMsg = document.createElement('div');
        sysMsg.style.textAlign = 'center';
        sysMsg.style.color = '#6B7A99';
        sysMsg.style.fontSize = '0.8rem';
        sysMsg.style.margin = '16px 0';
        sysMsg.style.fontFamily = "'Space Grotesk', sans-serif";
        sysMsg.innerHTML = `<span style="background: rgba(255,255,255,0.05); padding: 4px 12px; border-radius: 12px;">You joined <strong>${roomName}</strong></span>`;
        messagesArea.insertBefore(sysMsg, typingIndicator);

        const history = sampleRooms[roomName] || [
            { text: `Welcome to ${roomName}! Say hi to everyone.`, type: 'received', sender: 'Campus Bot', color: '#00D4FF', time: 'Just now' }
        ];

        history.forEach(msg => {
            appendMessage(msg.text, msg.type, msg.sender || 'You', msg.time, msg.color);
        });
    }

    // Initialize with first room if available
    if (chatItems.length > 0) {
        const firstTitle = chatItems[0].querySelector('.chat-item-title').innerText;
        switchRoom(firstTitle);
    }

    // Input handlers
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        
        if (this.value.trim().length > 0) {
            sendBtn.style.display = 'flex';
            sendBtn.style.opacity = '1';
            socket.emit('typing');
        } else if (!pendingImage) {
            sendBtn.style.display = 'none';
        }

        if (this.value.length > 200) {
            charCount.innerText = `${this.value.length}/500 chars`;
            charCount.style.display = 'block';
            charCount.style.color = this.value.length > 450 ? '#FF5577' : '#6B7A99';
        } else {
            charCount.style.display = 'none';
        }
    });

    // Image Paste Handling
    messageInput.addEventListener('paste', (e) => {
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        for (let index in items) {
            const item = items[index];
            if (item.kind === 'file' && item.type.startsWith('image/')) {
                const blob = item.getAsFile();
                const reader = new FileReader();
                reader.onload = function(event) {
                    pendingImage = event.target.result;
                    document.getElementById('pastePreviewImg').src = pendingImage;
                    previewContainer.style.display = 'block';
                    sendBtn.style.display = 'flex';
                    sendBtn.style.opacity = '1';
                };
                reader.readAsDataURL(blob);
                e.preventDefault();
            }
        }
    });

    const sendMessage = () => {
        const text = messageInput.value.trim();
        if (!text && !pendingImage) return;

        if (pendingImage) {
            appendMessage(pendingImage, 'sent', 'You', null, null, true);
            pendingImage = null;
            previewContainer.style.display = 'none';
        }

        if (text) {
            appendMessage(text, 'sent');
            socket.emit('chatMessage', { sender: 'You', text });
        }

        playSound('sent');
        
        messageInput.value = '';
        messageInput.style.height = 'auto';
        sendBtn.style.display = 'none';
        charCount.style.display = 'none';
        scrollToBottom();

        // Simulate active chat reply based on message sent
        simulateResponse(text || "Sent an image");
    };

    sendBtn.addEventListener('click', () => {
        playSound('click');
        sendMessage();
    });
    
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Formatting Markdown-like Syntax
    function parseMarkdown(text) {
        let parsed = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code style="background:rgba(0,0,0,0.3); padding:2px 4px; border-radius:4px; font-family:\'JetBrains Mono\', monospace; font-size:0.9em;">$1</code>')
            .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" style="color: var(--accent-primary, #00D4FF); text-decoration: underline;">$1</a>');
        return parsed;
    }

    function appendMessage(text, type, senderName = 'You', time = null, avatarColor = '#00D4FF', isImage = false) {
        if (!time) {
            const now = new Date();
            time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'flex-end';
        wrapper.style.marginBottom = '16px';
        wrapper.style.width = '100%';
        wrapper.className = 'animate-slide-in';

        const bubble = document.createElement('div');
        bubble.style.position = 'relative';
        bubble.style.padding = '10px 14px';
        bubble.style.borderRadius = '16px';
        bubble.style.maxWidth = '75%';
        bubble.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';

        let initials = senderName.substring(0, 2).toUpperCase();
        if (senderName === 'You') initials = 'ME';

        if (type === 'sent') {
            wrapper.style.justifyContent = 'flex-end';
            bubble.style.background = 'linear-gradient(135deg, #00D4FF, #0066FF)';
            bubble.style.color = '#fff';
            bubble.style.borderBottomRightRadius = '4px';
        } else {
            wrapper.style.justifyContent = 'flex-start';
            bubble.style.background = '#1A2340';
            bubble.style.color = 'var(--text-primary, #fff)';
            bubble.style.borderBottomLeftRadius = '4px';

            const avatarEl = document.createElement('div');
            avatarEl.className = 'msg-avatar';
            avatarEl.style.width = '32px';
            avatarEl.style.height = '32px';
            avatarEl.style.borderRadius = '50%';
            avatarEl.style.background = avatarColor;
            avatarEl.style.display = 'flex';
            avatarEl.style.alignItems = 'center';
            avatarEl.style.justifyContent = 'center';
            avatarEl.style.color = 'white';
            avatarEl.style.fontWeight = 'bold';
            avatarEl.style.fontSize = '12px';
            avatarEl.style.flexShrink = '0';
            avatarEl.style.marginRight = '8px';
            avatarEl.innerText = initials;
            wrapper.appendChild(avatarEl);
        }

        let senderHtml = type === 'received' 
            ? `<div class="msg-sender" style="color: ${avatarColor}; font-weight: 600; font-size: 0.8rem; margin-bottom: 4px; font-family: 'Space Grotesk', sans-serif;">${senderName}</div>` 
            : '';

        let contentHtml = isImage 
            ? `<img src="${text}" style="max-width: 100%; border-radius: 8px; margin-top: 4px;" />` 
            : parseMarkdown(text);

        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = `
            ${senderHtml}
            <div class="msg-text" style="word-wrap: break-word; line-height: 1.4;">${contentHtml}</div>
            <div class="msg-meta" style="font-size: 0.7rem; color: ${type === 'sent' ? 'rgba(255,255,255,0.8)' : '#6B7A99'}; text-align: right; margin-top: 6px; display: flex; align-items: center; justify-content: flex-end; gap: 4px; font-family: 'Space Grotesk', sans-serif;">
                <span>${time}</span>
                ${type === 'sent' ? '<i data-lucide="check-check" style="width:14px;height:14px;"></i>' : ''}
            </div>
            <div class="reactions-container" style="display: flex; gap: 4px; margin-top: 4px; flex-wrap: wrap;"></div>
        `;
        
        bubble.appendChild(contentDiv);

        // Hover Reactions Bar
        const reactionBar = document.createElement('div');
        reactionBar.className = 'reaction-bar';
        reactionBar.innerHTML = '👍 ❤️ 😂 🎉 😮'.split(' ').map(emoji => `<span class="react-emoji">${emoji}</span>`).join('');
        reactionBar.style.position = 'absolute';
        reactionBar.style.top = '-35px';
        reactionBar.style[type === 'sent' ? 'right' : 'left'] = '0';
        reactionBar.style.background = '#2A3441';
        reactionBar.style.padding = '6px 10px';
        reactionBar.style.borderRadius = '20px';
        reactionBar.style.display = 'none';
        reactionBar.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
        reactionBar.style.zIndex = '10';
        reactionBar.style.gap = '8px';
        reactionBar.style.border = '1px solid rgba(255,255,255,0.05)';

        bubble.appendChild(reactionBar);

        bubble.addEventListener('mouseenter', () => { reactionBar.style.display = 'flex'; });
        bubble.addEventListener('mouseleave', () => { reactionBar.style.display = 'none'; });

        const reactionsContainer = contentDiv.querySelector('.reactions-container');
        reactionBar.querySelectorAll('.react-emoji').forEach(el => {
            el.addEventListener('click', () => {
                playSound('click');
                const emoji = el.innerText;
                let existing = reactionsContainer.querySelector(`[data-emoji="${emoji}"]`);
                if (existing) {
                    let count = parseInt(existing.dataset.count) + 1;
                    existing.dataset.count = count;
                    existing.innerHTML = `${emoji} <span style="font-size:0.7rem; opacity:0.8">${count}</span>`;
                } else {
                    const badge = document.createElement('div');
                    badge.dataset.emoji = emoji;
                    badge.dataset.count = 1;
                    badge.style.background = 'rgba(255,255,255,0.1)';
                    badge.style.padding = '2px 6px';
                    badge.style.borderRadius = '10px';
                    badge.style.fontSize = '0.8rem';
                    badge.style.cursor = 'pointer';
                    badge.style.transition = 'transform 0.1s';
                    badge.innerHTML = `${emoji} <span style="font-size:0.7rem; opacity:0.8">1</span>`;
                    
                    badge.addEventListener('mouseover', () => badge.style.transform = 'scale(1.1)');
                    badge.addEventListener('mouseout', () => badge.style.transform = 'scale(1)');
                    
                    badge.addEventListener('click', () => {
                        let count = parseInt(badge.dataset.count) + 1;
                        badge.dataset.count = count;
                        badge.innerHTML = `${emoji} <span style="font-size:0.7rem; opacity:0.8">${count}</span>`;
                        playSound('click');
                    });
                    reactionsContainer.appendChild(badge);
                }
                reactionBar.style.display = 'none';
            });
        });

        wrapper.appendChild(bubble);
        messagesArea.insertBefore(wrapper, typingIndicator);
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
        scrollToBottom();
    }

    function scrollToBottom() {
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }

    // Simulated Bot Responses
    function simulateResponse(userText) {
        typingIndicator.style.display = 'flex';
        scrollToBottom();
        
        const delay = 1500 + Math.random() * 2000; // 1.5s to 3.5s delay
        
        setTimeout(() => {
            typingIndicator.style.display = 'none';
            
            const textLower = userText.toLowerCase();
            let replyText = "";
            let bot = bots[Math.floor(Math.random() * bots.length)];
            
            if (currentRoom.includes('Bhavya')) {
                bot = bots[1]; // Bhavya
            } else if (currentRoom.includes('Events')) {
                bot = bots[0]; // Campus Bot
            }

            if (textLower.match(/\b(hi|hello|hey|yo|sup)\b/)) {
                replyText = botResponses.greetings[Math.floor(Math.random() * botResponses.greetings.length)];
            } else if (textLower.includes('?')) {
                replyText = botResponses.questions[Math.floor(Math.random() * botResponses.questions.length)];
            } else if (textLower.includes('image') || userText === 'image') {
                replyText = "Wow, nice picture! 📸";
            } else {
                replyText = botResponses.default[Math.floor(Math.random() * botResponses.default.length)];
            }

            appendMessage(replyText, 'received', bot.name, null, bot.color);
            playSound('received');
        }, delay);
    }

    // Real Socket listeners (if backend is active)
    socket.on('chatMessage', (msg) => {
        appendMessage(msg.text, 'received', msg.sender, null, '#00D4FF');
        playSound('received');
    });

    socket.on('typing', () => {
        typingIndicator.style.display = 'flex';
        scrollToBottom();
        setTimeout(() => {
            typingIndicator.style.display = 'none';
        }, 2000);
    });

    // Sound Effects using Web Audio API
    let audioCtx = null;
    function playSound(type) {
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') audioCtx.resume();
            
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            const now = audioCtx.currentTime;
            
            if (type === 'sent') {
                // Short rising tone
                osc.type = 'sine';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.linearRampToValueAtTime(0.1, now + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
            } else if (type === 'received') {
                // Short descending tone
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(400, now + 0.15);
                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.linearRampToValueAtTime(0.1, now + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
            } else if (type === 'click') {
                // Subtle click
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(600, now);
                gainNode.gain.setValueAtTime(0.02, now);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
            }
        } catch (e) {
            console.log('Audio error:', e);
        }
    }

    // Attachments (mock)
    document.getElementById('attachBtn').addEventListener('click', () => {
        playSound('click');
        // A simple visual mock for file picker
        const m = document.createElement('div');
        m.style.position = 'fixed';
        m.style.top = '50%';
        m.style.left = '50%';
        m.style.transform = 'translate(-50%, -50%)';
        m.style.background = '#1A2340';
        m.style.padding = '24px';
        m.style.borderRadius = '16px';
        m.style.boxShadow = '0 10px 40px rgba(0,0,0,0.5)';
        m.style.zIndex = '1000';
        m.style.color = 'white';
        m.style.fontFamily = "'Space Grotesk', sans-serif";
        m.innerHTML = '<h3>Select File</h3><p style="color:#6B7A99">File picker dialog simulation.</p><button id="closeMockBtn" style="margin-top:12px; padding:8px 16px; background:#00D4FF; color:#090909; border:none; border-radius:8px; cursor:pointer;">Close</button>';
        document.body.appendChild(m);
        document.getElementById('closeMockBtn').addEventListener('click', () => {
            playSound('click');
            m.remove();
        });
    });

    // Voice record (mock)
    let isRecording = false;
    let recInterval;
    let recSecs = 0;
    const voiceBtn = document.getElementById('voiceBtn');
    
    voiceBtn.addEventListener('click', () => {
        playSound('click');
        isRecording = !isRecording;
        if (isRecording) {
            voiceBtn.style.color = '#FF5577';
            voiceBtn.style.animation = 'blink 1s infinite';
            messageInput.placeholder = 'Recording audio (0:00)...';
            messageInput.disabled = true;
            recSecs = 0;
            recInterval = setInterval(() => {
                recSecs++;
                messageInput.placeholder = `Recording audio (0:0${recSecs})...`;
                if (recSecs > 9) messageInput.placeholder = `Recording audio (0:${recSecs})...`;
            }, 1000);
        } else {
            clearInterval(recInterval);
            voiceBtn.style.color = 'var(--text-secondary)';
            voiceBtn.style.animation = 'none';
            messageInput.placeholder = 'Type a message...';
            messageInput.disabled = false;
            
            const formattedTime = recSecs > 9 ? `0:${recSecs}` : `0:0${recSecs}`;
            appendMessage(`🎤 Voice message (${formattedTime})`, 'sent');
            playSound('sent');
            simulateResponse("I can't listen to voice notes right now, type it out?");
        }
    });

    // Initialize Emoji Picker
    if (typeof EmojiPicker !== 'undefined') {
        const picker = new EmojiPicker('emojiPickerContainer', 'messageInput', 'emojiBtn', 'gifBtn');
    }

    // Add click sounds to general action buttons
    document.querySelectorAll('.btn-icon').forEach(btn => {
        if (btn.id !== 'sendBtn' && btn.id !== 'voiceBtn' && btn.id !== 'attachBtn') {
            btn.addEventListener('click', () => playSound('click'));
        }
    });

    scrollToBottom();
});
