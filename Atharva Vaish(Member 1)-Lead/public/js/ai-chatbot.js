document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // DOM Elements
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const voiceBtn = document.getElementById('voiceBtn');
    const typingContainer = document.getElementById('typingContainer');
    const newChatBtn = document.getElementById('newChatBtn');
    const chatHistory = document.getElementById('chatHistory');
    
    // State
    let conversation = [];
    let isWaitingForResponse = false;

    // Auto-resize textarea
    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight < 120 ? this.scrollHeight : 120) + 'px';
        sendBtn.disabled = this.value.trim() === '';
    });

    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!sendBtn.disabled && !isWaitingForResponse) {
                sendMessage();
            }
        }
    });

    sendBtn.addEventListener('click', () => {
        if (!isWaitingForResponse) sendMessage();
    });

    // Quick Actions & FAQ Chips
    document.querySelectorAll('.quick-action-btn, .faq-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            if (isWaitingForResponse) return;
            const prompt = btn.getAttribute('data-prompt');
            chatInput.value = prompt;
            sendBtn.disabled = false;
            sendMessage();
        });
    });

    // New Conversation
    newChatBtn.addEventListener('click', () => {
        if (conversation.length > 0) {
            saveToHistory();
        }
        // Clear chat area except welcome message
        const welcomeMsg = chatMessages.children[0];
        chatMessages.innerHTML = '';
        chatMessages.appendChild(welcomeMsg);
        chatMessages.appendChild(typingContainer);
        conversation = [];
    });

    function saveToHistory() {
        const title = conversation[0].content.substring(0, 30) + '...';
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `<i data-lucide="message-square"></i> <span>${title}</span>`;
        chatHistory.prepend(historyItem);
        lucide.createIcons();
    }

    // Sound effect
    const playRecvSound = () => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.2);
        } catch(e) {}
    };

    function parseMarkdown(text) {
        let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');
        html = html.replace(/\n- (.*)/g, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
        html = html.replace(/\n/g, '<br>');
        return html;
    }

    function appendMessage(role, content) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `msg-container ${role} anim-fade-in-up`;
        
        let avatarHTML = '';
        if (role === 'ai') {
            avatarHTML = `<div class="msg-avatar ai-avatar"><i data-lucide="sparkles"></i></div>`;
        } else {
            avatarHTML = `<div class="msg-avatar user-avatar"><i data-lucide="user"></i></div>`;
        }

        const bubbleClass = role === 'ai' ? 'msg-bubble-received' : 'msg-bubble-sent';
        const formattedContent = role === 'ai' ? parseMarkdown(content) : content;

        msgDiv.innerHTML = `
            ${role === 'ai' ? avatarHTML : ''}
            <div class="msg-bubble ${bubbleClass}">
                ${formattedContent}
            </div>
            ${role === 'user' ? avatarHTML : ''}
        `;

        chatMessages.insertBefore(msgDiv, typingContainer);
        lucide.createIcons();
        scrollToBottom();
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        // Reset input
        chatInput.value = '';
        chatInput.style.height = '40px';
        sendBtn.disabled = true;

        // Add user msg
        appendMessage('user', text);
        conversation.push({ role: 'user', content: text });

        // Show typing
        isWaitingForResponse = true;
        typingContainer.style.display = 'flex';
        scrollToBottom();

        // Simulate network delay / API call
        setTimeout(() => {
            typingContainer.style.display = 'none';
            isWaitingForResponse = false;
            
            const aiResponse = getFallbackResponse(text);
            appendMessage('ai', aiResponse);
            conversation.push({ role: 'ai', content: aiResponse });
            playRecvSound();
        }, 1500);
    }

    function getFallbackResponse(query) {
        query = query.toLowerCase();
        if (query.includes('event')) return 'Check the **Events page** for upcoming campus events!';
        if (query.includes('library')) return 'The Central Library is in Block A, Ground Floor. Open 9 AM - 8 PM.';
        if (query.includes('club') || query.includes('coding')) return 'Visit the **Events & Clubs page** to browse and join clubs like the Coding Club!';
        if (query.includes('wifi') || query.includes('password')) return 'Campus WiFi: `GLBAJAJ-STUDENT`, password available at IT Help Desk.';
        if (query.includes('canteen') || query.includes('food')) return 'Main Canteen: 8 AM - 6 PM. Night Canteen: 7 PM - 11 PM.';
        if (query.includes('exam') || query.includes('date') || query.includes('calendar')) return 'Mid-semester exams are usually in October. Please refer to the official academic calendar on the ERP portal.';
        if (query.includes('hostel')) return 'To apply for the hostel, please visit the Warden\'s office in Block B or check the official website forms section.';
        if (query.includes('hod') || query.includes('cse')) return 'The HOD of Computer Science and Engineering is Dr. XYZ. Office located in Block C.';
        
        return "I'm still learning! Try asking about events, clubs, library, or campus facilities.";
    }

    // Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.onstart = () => {
            voiceBtn.classList.add('active');
        };
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            chatInput.value = transcript;
            sendBtn.disabled = false;
        };
        
        recognition.onend = () => {
            voiceBtn.classList.remove('active');
        };
        
        voiceBtn.addEventListener('click', () => {
            recognition.start();
        });
    } else {
        voiceBtn.style.display = 'none';
    }
});
