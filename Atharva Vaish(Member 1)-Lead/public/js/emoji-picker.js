class EmojiPicker {
    constructor(containerId, inputId, emojiTriggerId, gifTriggerId) {
        this.container = document.getElementById(containerId);
        this.input = document.getElementById(inputId);
        this.emojiTrigger = document.getElementById(emojiTriggerId);
        this.gifTrigger = document.getElementById(gifTriggerId);
        
        this.isOpen = false;
        
        this.emojis = {
            'Smileys': ['😀','😃','😄','😁','😆','😅','😂','🤣','🥲','☺️','😊','😇','🙂','🙃','😉','😌','😍','🥰','😘','😗','😙','😚','😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🥸','🤩','🥳','😏','😒','😞','😔','😟','😕','🙁','☹️','😣','😖','😫','😩','🥺','😢','😭','😤','😠','😡','🤬','🤯','😳','🥵','🥶','😱','😨','😰','😥','😓','🤗','🤔','🤭','🤫','🤥','😶','😐','😑','😬','🙄','😯','😦','😧','😮','😲','🥱','😴','🤤','😪','😵','🤐','🥴','🤢','🤮','🤧','😷','🤒','🤕','🤑','🤠','😈','👿','👹','👺','🤡','💩','👻','💀','☠️','👽','👾','🤖','🎃','😺','😸','😹','😻','😼','😽','🙀','😿','😾'],
            'Animals': ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐻‍❄️','🐨','🐯','🦁','🐮','🐷','🐽','🐸','🐵','🙈','🙉','🙊','🐒','🐔','🐧','🐦','🐤','🐣','🐥','🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦄','🐝','🪱','🐛','🦋','🐌','🐞','🐜','🪰','🪲','🪳','🦟','🦗','🕷','🕸','🦂','🐢','🐍','🦎','🦖','🦕','🐙','🦑','🦐','🦞','🦀','🐡','🐠','🐟','🐬','🐳','🐋','🦈','🦭','🐊','🐅','🐆','🦓','🦍','🦧','🦣','🐘','🦛','🦏','🐪','🐫','🦒','🦘','🦬','🐃','🐂','🐄','🐎','🐖','🐏','🐑','🦙','🐐','🦌','🐕','🐩','🦮','🐕‍🦺','🐈','🐈‍⬛','🪶','🐓','🦃','🦤','🦚','🦜','🦢','🦩','🕊','🐇','🦝','🦨','🦡','🦫','🦦','🦥','🐁','🐀','🐿','🦔'],
            'Food': ['🍏','🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍈','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🍆','🥑','🥦','🥬','🥒','🌶','🫑','🌽','🥕','🫒','🧄','🧅','🥔','🍠','🥐','🥯','🍞','🥖','🥨','🧀','🥚','🍳','🧈','🥞','🧇','🥓','🥩','🍗','🍖','🌭','🍔','🍟','🍕','🫓','🥪','🥙','🧆','🌮','🌯','🫔','🥗','🥘','🫕','🥫','🍝','🍜','🍲','🍛','🍣','🍱','🥟','🦪','🍤','🍙','🍚','🍘','🍥','🥠','🥮','🍢','🍡','🍧','🍨','🍦','🥧','🧁','🍰','🎂','🍮','🍭','🍬','🍫','🍿','🍩','🍪','🌰','🥜','🍯','🥛','🍼','🫖','☕️','🍵','🧃','🥤','🧋','🍶','🍺','🍻','🥂','🍷','🥃','🍸','🍹','🧉','🍾','🧊','🥄','🍴','🍽','🥣','🥡','🥢','🧂'],
            'Objects': ['⌚️','📱','📲','💻','⌨️','🖥','🖨','🖱','🖲','🕹','🗜','💽','💾','💿','📀','📼','📷','📸','📹','🎥','📽','🎞','📞','☎️','📟','📠','📺','📻','🎙','🎚','🎛','🧭','⏱','⏲','⏰','🕰','⌛️','⏳','📡','🔋','🔌','💡','🔦','🕯','🪔','🧯','🛢','💸','💵','💴','💶','💷','🪙','💰','💳','💎','⚖️','🪜','🧰','🪛','🔧','🔨','⚒','🛠','⛏','🪚','🔩','⚙️','🪤','🧱','⛓','🧲','🔫','💣','🧨','🪓','🔪','🗡','⚔️','🛡','🚬','⚰️','🪦','⚱️','🏺','🔮','📿','🧿','💈','⚗️','🔭','🔬','🕳','🩹','🩺','💊','💉','🩸','🧬','🦠','🧫','🧪','🌡','🧹','🪠','🧺','🧻','🚽','🚰','🚿','🛁','🛀','🧼','🪥','🪒','🧽','🪣','🧴','🛎','🔑','🗝','🚪','🪑','🛋','🛏','🛌','🧸','🪆','🖼','🪞','🪟','🛍','🛒','🎁','🎈','🎏','🎀','🪄','🪅','🎊','🎉']
        };

        this.init();
    }

    init() {
        this.render();
        this.attachEvents();
    }

    render() {
        this.container.style.position = 'absolute';
        this.container.style.bottom = '80px';
        this.container.style.right = '20px';
        this.container.style.width = '320px';
        this.container.style.height = '400px';
        this.container.style.backgroundColor = 'var(--bg-secondary, #111111)';
        this.container.style.border = '1px solid rgba(255,255,255,0.1)';
        this.container.style.borderRadius = '12px';
        this.container.style.display = 'none';
        this.container.style.flexDirection = 'column';
        this.container.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
        this.container.style.zIndex = '1000';
        this.container.style.overflow = 'hidden';

        let emojiHtml = `
            <div style="display: flex; border-bottom: 1px solid rgba(255,255,255,0.1); padding: 10px;">
                <input type="text" placeholder="Search emojis..." style="width: 100%; padding: 8px; background: rgba(255,255,255,0.05); border: none; border-radius: 4px; color: white;">
            </div>
            <div style="display: flex; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <div style="flex:1; text-align:center; padding: 10px; cursor: pointer; border-bottom: 2px solid var(--accent-primary);">Emoji</div>
                <div style="flex:1; text-align:center; padding: 10px; cursor: pointer; color: var(--text-muted);">GIFs</div>
            </div>
            <div style="flex: 1; overflow-y: auto; padding: 10px;" id="emojiList">
        `;

        for (const [category, list] of Object.entries(this.emojis)) {
            emojiHtml += `<div style="font-size: 0.8rem; color: var(--text-muted); margin: 10px 0 5px 0;">${category}</div>`;
            emojiHtml += `<div style="display: grid; grid-template-columns: repeat(8, 1fr); gap: 5px;">`;
            list.forEach(emoji => {
                emojiHtml += `<div class="emoji-item" style="cursor: pointer; text-align: center; font-size: 1.2rem; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">${emoji}</div>`;
            });
            emojiHtml += `</div>`;
        }

        emojiHtml += `</div>`;
        this.container.innerHTML = emojiHtml;
    }

    attachEvents() {
        this.emojiTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });

        if (this.gifTrigger) {
            this.gifTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggle();
                // In real app, switch to GIF tab
            });
        }

        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.container.contains(e.target) && e.target !== this.emojiTrigger) {
                this.close();
            }
        });

        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('emoji-item')) {
                const emoji = e.target.innerText;
                const startPos = this.input.selectionStart;
                const endPos = this.input.selectionEnd;
                
                this.input.value = this.input.value.substring(0, startPos) + emoji + this.input.value.substring(endPos);
                this.input.selectionStart = this.input.selectionEnd = startPos + emoji.length;
                this.input.focus();
            }
        });
    }

    toggle() {
        this.isOpen = !this.isOpen;
        this.container.style.display = this.isOpen ? 'flex' : 'none';
        if (this.isOpen) {
            this.container.style.animation = 'anim-pop-in 0.3s ease';
        }
    }

    close() {
        this.isOpen = false;
        this.container.style.display = 'none';
    }
}
