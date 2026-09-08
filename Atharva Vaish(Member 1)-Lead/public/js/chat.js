document.addEventListener('DOMContentLoaded', () => {
    // Basic Socket.io setup (mock or connect if running server)
    const socket = typeof io !== 'undefined' ? io() : {
        on: () => {}, emit: () => {}
    };

    const messagesArea = document.getElementById('messagesArea');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const typingIndicator = document.getElementById('typingIndicator');
    
    // Chat List Filtering
    const chatTabs = document.querySelectorAll('.chat-tab');
    const chatItems = document.querySelectorAll('.chat-item');
    const chatSearch = document.getElementById('chatSearch');

    chatTabs.forEach(tab => {
        tab.addEventListener('click', () => {
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

    // Chat Item Selection
    chatItems.forEach(item => {
        item.addEventListener('click', () => {
            chatItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // Update Header
            const title = item.querySelector('.chat-item-title').innerText;
            const avatarHtml = item.querySelector('.chat-item-avatar').innerHTML;
            
            document.getElementById('activeChatName').innerText = title;
            // Basic extraction ignoring badges
            const plainAvatar = avatarHtml.split('<')[0] || avatarHtml;
            document.getElementById('activeChatAvatar').innerText = plainAvatar;
            
            // In a real app, we'd fetch messages for this chat ID
            socket.emit('loadHistory', item.dataset.id);
        });
    });

    // Auto-resize textarea
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        if (this.value.length > 0) {
            socket.emit('typing');
        }
    });

    // Send Message
    const sendMessage = () => {
        const text = messageInput.value.trim();
        if (!text) return;

        // Optimistic render
        appendMessage(text, 'sent');
        
        // Play sound
        playSound('sent');

        socket.emit('chatMessage', { sender: 'You', text });

        messageInput.value = '';
        messageInput.style.height = 'auto';
        scrollToBottom();
    };

    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    function appendMessage(text, type, senderName = 'You', time = 'Just now') {
        const bubble = document.createElement('div');
        bubble.className = `msg-bubble msg-bubble-${type}`;
        
        let senderHtml = '';
        if (type === 'received') {
            senderHtml = `<div class="msg-sender">${senderName}</div>`;
        }

        bubble.innerHTML = `
            ${senderHtml}
            <div class="msg-text">${text}</div>
            <div class="msg-meta">
                <span>${time}</span>
                ${type === 'sent' ? '<i data-lucide="check" style="width:14px;height:14px;"></i>' : ''}
            </div>
        `;

        messagesArea.insertBefore(bubble, typingIndicator);
        lucide.createIcons();
        scrollToBottom();
    }

    function scrollToBottom() {
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }

    // Socket listeners
    socket.on('chatMessage', (msg) => {
        appendMessage(msg.text, 'received', msg.sender);
        playSound('received');
    });

    socket.on('typing', () => {
        typingIndicator.style.display = 'flex';
        scrollToBottom();
        setTimeout(() => {
            typingIndicator.style.display = 'none';
        }, 2000);
    });

    // Attachments (mock)
    document.getElementById('attachBtn').addEventListener('click', () => {
        alert('File picker would open here.');
    });

    // Voice record (mock)
    let isRecording = false;
    const voiceBtn = document.getElementById('voiceBtn');
    voiceBtn.addEventListener('click', () => {
        isRecording = !isRecording;
        if (isRecording) {
            voiceBtn.style.color = '#EF4444';
            messageInput.placeholder = 'Recording audio...';
        } else {
            voiceBtn.style.color = 'var(--text-secondary)';
            messageInput.placeholder = 'Type a message...';
            appendMessage('🎤 Voice message (0:05)', 'sent');
        }
    });

    function playSound(type) {
        // In real app, load Audio context
        console.log(`Playing ${type} sound`);
    }

    // Initialize Emoji Picker
    if (typeof EmojiPicker !== 'undefined') {
        const picker = new EmojiPicker('emojiPickerContainer', 'messageInput', 'emojiBtn', 'gifBtn');
    }

    scrollToBottom();
});
