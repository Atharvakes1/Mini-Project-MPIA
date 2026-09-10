/**
 * Authentication Logic for Campus Clone MPIA
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Tab Switching Logic
    const tabs = document.querySelectorAll('.tab');
    const forms = document.querySelectorAll('.form-section');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active classes
            tabs.forEach(t => t.classList.remove('active'));
            forms.forEach(f => f.classList.remove('active'));

            // Add active class to clicked tab and target form
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-target') + '-form';
            document.getElementById(targetId).classList.add('active');
        });
    });

    // 2. Remember Me Pre-fill
    const savedEmail = localStorage.getItem('glbitm_saved_email');
    if (savedEmail) {
        document.getElementById('login-email').value = savedEmail;
        document.getElementById('remember-me').checked = true;
    }

    // 3. Form Submit Handlers
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);
});

// Sound Effect
const playSuccessSound = () => {
    // Short synth beep (data URI for standalone use)
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
    oscillator.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.3);
};

// Toast Notification System
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'info';
    if(type === 'success') icon = 'check-circle';
    if(type === 'error') icon = 'alert-circle';

    toast.innerHTML = `
        <i data-lucide="${icon}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    lucide.createIcons();

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove after 3s
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// Password Toggle
window.togglePassword = function(inputId, iconElement) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        iconElement.setAttribute('data-lucide', 'eye-off');
    } else {
        input.type = 'password';
        iconElement.setAttribute('data-lucide', 'eye');
    }
    lucide.createIcons();
};

// Password Strength
window.checkStrength = function(password) {
    const bar = document.getElementById('pwd-bar');
    const container = document.getElementById('pwd-bar-container');
    const text = document.getElementById('pwd-text');
    
    if (password.length === 0) {
        container.style.display = 'none';
        text.style.display = 'none';
        return;
    }
    
    container.style.display = 'block';
    text.style.display = 'block';

    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.match(/[A-Z]/)) strength += 1;
    if (password.match(/[0-9]/)) strength += 1;
    if (password.match(/[^A-Za-z0-9]/)) strength += 1;

    bar.className = 'pwd-fill'; // reset
    text.className = 'pwd-text';
    
    if (strength <= 1) {
        bar.style.width = '33%';
        bar.style.backgroundColor = '#FF5577';
        text.innerText = 'Strength: Weak';
        text.style.color = '#FF5577';
    } else if (strength === 2 || strength === 3) {
        bar.style.width = '66%';
        bar.style.backgroundColor = '#FFB020';
        text.innerText = 'Strength: Medium';
        text.style.color = '#FFB020';
    } else {
        bar.style.width = '100%';
        bar.style.backgroundColor = '#00E080';
        text.innerText = 'Strength: Strong';
        text.style.color = '#00E080';
    }
};

// Human Verification State
const verificationState = {
    'login-human': false,
    'reg-human': false
};

window.verifyHuman = function(id) {
    if(verificationState[id]) return; // Already verified

    const el = document.getElementById(id);
    const box = el.querySelector('.check-box');
    const icon = box.querySelector('i, svg');
    
    box.classList.add('loading');
    
    setTimeout(() => {
        box.classList.remove('loading');
        box.classList.add('success');
        if (icon) icon.style.display = 'block';
        verificationState[id] = true;
    }, 1500);
};

// Domain Validator
function validateDomain(email) {
    return email.endsWith('@glbitm.ac.in');
}

// Handlers
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    
    if (!validateDomain(email)) {
        showToast('Only @glbitm.ac.in emails are allowed.', 'error');
        return;
    }
    
    if (!verificationState['login-human']) {
        showToast('Please verify you are human.', 'error');
        return;
    }

    if (rememberMe) {
        localStorage.setItem('glbitm_saved_email', email);
    } else {
        localStorage.removeItem('glbitm_saved_email');
    }

    // Simulate login success
    processAuthSuccess({
        email: email,
        name: email.split('@')[0].replace('.', ' '),
        role: 'student'
    });
}

function handleRegister(e) {
    e.preventDefault();
    
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;
    const name = document.getElementById('reg-name').value;
    const id = document.getElementById('reg-id').value;
    const branch = document.getElementById('reg-branch').value;
    const year = document.getElementById('reg-year').value;

    if (!validateDomain(email)) {
        showToast('Only @glbitm.ac.in emails are allowed.', 'error');
        return;
    }

    if (password !== confirm) {
        showToast('Passwords do not match.', 'error');
        return;
    }
    
    if (!verificationState['reg-human']) {
        showToast('Please verify you are human.', 'error');
        return;
    }

    // Simulate register success
    processAuthSuccess({
        email, name, id, branch, year, role: 'student'
    });
}

function processAuthSuccess(userData) {
    playSuccessSound();
    showToast('Authentication Successful! Redirecting...', 'success');
    
    // Export data to sessionStorage
    sessionStorage.setItem('mpia_user', JSON.stringify(userData));
    sessionStorage.setItem('mpia_auth_token', 'dummy-jwt-token-12345');

    // Redirect
    setTimeout(() => {
        window.location.href = '/pages/home.html';
    }, 1500);
}

// WebAuthn Passkey Stub
window.loginWithPasskey = async function() {
    try {
        if (!window.PublicKeyCredential) {
            showToast('WebAuthn not supported on this device/browser.', 'error');
            return;
        }
        
        // This is a stub simulating the UI flow
        showToast('Initiating Passkey auth...', 'info');
        
        // Simulating the delay of a fingerprint scan
        setTimeout(() => {
            if(Math.random() > 0.3) {
                // Success
                processAuthSuccess({ email: 'passkey_user@glbitm.ac.in', name: 'Passkey User', role: 'student' });
            } else {
                showToast('Passkey verification failed or cancelled.', 'error');
            }
        }, 2000);

    } catch (e) {
        console.error(e);
        showToast('Passkey error occurred.', 'error');
    }
};

// Forgot Password Modal
window.openForgotModal = function() {
    document.getElementById('forgot-modal').classList.add('active');
};

window.closeForgotModal = function() {
    document.getElementById('forgot-modal').classList.remove('active');
    document.getElementById('reset-email').value = '';
};

window.sendResetLink = function() {
    const email = document.getElementById('reset-email').value;
    if (!email || !validateDomain(email)) {
        showToast('Enter a valid @glbitm.ac.in email.', 'error');
        return;
    }
    
    showToast('Reset protocol initiated. Check your inbox.', 'success');
    closeForgotModal();
};
