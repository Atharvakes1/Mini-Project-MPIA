const CURRENT_USER_ID = 1; // Assuming Member 1 is the current user

const teamMembers = [
    { name: 'Atharva Vaish', role: 'Lead', id: 1, initials: 'AV', color: '#FF5577' },
    { name: 'Bhoomika', role: 'Member 2', id: 2, initials: 'B', color: '#0066FF' },
    { name: 'Bhavya', role: 'Frontend', id: 3, initials: 'BH', color: '#00E080' },
    { name: 'Ayush Soni', role: 'Member 4', id: 4, initials: 'AS', color: '#FFB020' }
];

let tasks = JSON.parse(localStorage.getItem('campusTasks')) || [
    { id: 1, title: 'Design Homepage Layout', desc: 'Create the initial UI/UX for the main dashboard.', priority: 'High', assigneeId: 1, currentStage: 1, totalStages: 4, dueDate: '2023-11-01', status: 'In Progress', completedStages: [] },
    { id: 2, title: 'API Integration', desc: 'Connect the frontend to backend endpoints.', priority: 'Medium', assigneeId: 2, currentStage: 2, totalStages: 4, dueDate: '2023-11-05', status: 'In Progress', completedStages: [1] },
    { id: 3, title: 'Build Chat Backend', desc: 'Implement WebSocket connections for real-time chat.', priority: 'High', assigneeId: 3, currentStage: 3, totalStages: 4, dueDate: '2023-11-10', status: 'In Progress', completedStages: [1, 2] },
    { id: 4, title: 'Create Login Page', desc: 'Authentication UI and logic.', priority: 'Medium', assigneeId: 4, currentStage: 4, totalStages: 4, dueDate: '2023-10-25', status: 'Completed', completedStages: [1, 2, 3, 4] },
    { id: 5, title: 'Test & Deploy', desc: 'Write unit tests and setup CI/CD.', priority: 'Low', assigneeId: 1, currentStage: 1, totalStages: 4, dueDate: '2023-11-15', status: 'Pending', completedStages: [] }
];

let currentFilter = 'all';
let handoffTaskId = null;

function init() {
    renderPipeline();
    renderTasks();
    renderStats();
    setupFilters();
    
    document.getElementById('create-form').addEventListener('submit', handleCreateTask);
}

function saveTasks() {
    localStorage.setItem('campusTasks', JSON.stringify(tasks));
}

function renderPipeline() {
    const container = document.getElementById('pipeline-container');
    container.innerHTML = '';
    
    const activeTaskId = tasks.find(t => t.status !== 'Completed')?.id || null;
    let activeMemberId = tasks.find(t => t.id === activeTaskId)?.assigneeId || 1;

    teamMembers.forEach((member, index) => {
        const memberTasksCount = tasks.filter(t => t.assigneeId === member.id && t.status !== 'Completed').length;
        
        let statusClass = 'status-idle';
        if (memberTasksCount > 0) statusClass = 'status-active';
        if (memberTasksCount === 0 && activeMemberId > member.id) statusClass = 'status-waiting';

        const memberEl = document.createElement('div');
        memberEl.className = `pipeline-member ${activeMemberId === member.id ? 'active' : ''}`;
        memberEl.innerHTML = `
            <div class="avatar">${member.initials}</div>
            <div style="font-weight: bold; margin-bottom: 0.25rem;">${member.name}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${member.role}</div>
            <div style="margin-top: 0.5rem; display: flex; align-items: center; justify-content: center; gap: 0.25rem;">
                <span class="status-dot ${statusClass}"></span>
                <span style="font-size: 0.8rem;">${memberTasksCount} tasks</span>
            </div>
        `;
        container.appendChild(memberEl);

        if (index < teamMembers.length - 1) {
            const arrowEl = document.createElement('div');
            arrowEl.className = `pipeline-arrow ${activeMemberId > member.id ? 'flowing' : ''}`;
            container.appendChild(arrowEl);
        }
    });
}

function getAssignee(id) {
    return teamMembers.find(m => m.id === id);
}

function renderTasks() {
    const grid = document.getElementById('task-grid');
    grid.innerHTML = '';
    
    let filteredTasks = tasks;
    if (currentFilter === 'my') {
        filteredTasks = tasks.filter(t => t.assigneeId === CURRENT_USER_ID);
    } else if (currentFilter === 'in-progress') {
        filteredTasks = tasks.filter(t => t.status === 'In Progress' || t.status === 'Pending' || t.status === 'Awaiting Handoff');
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(t => t.status === 'Completed');
    }

    filteredTasks.forEach(task => {
        const assignee = getAssignee(task.assigneeId);
        
        let dotsHtml = '';
        for (let i = 1; i <= task.totalStages; i++) {
            dotsHtml += `<div class="progress-dot ${task.completedStages.includes(i) || task.currentStage > i || task.status === 'Completed' ? 'completed' : ''}"></div>`;
        }

        const card = document.createElement('div');
        card.className = `task-card task-priority-${task.priority}`;
        
        let actionBtnHtml = '';
        if (task.assigneeId === CURRENT_USER_ID && task.status !== 'Completed') {
            actionBtnHtml = `<button class="btn btn-primary" style="margin-top: 1rem; width: 100%;" onclick="openHandoffModal(${task.id})">Complete & Handoff</button>`;
        }

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <h3 style="font-weight: bold; font-size: 1.1rem;">${task.title}</h3>
                <span style="font-size: 0.75rem; padding: 0.25rem 0.5rem; border-radius: 4px; background: #1E2A45;">${task.status}</span>
            </div>
            <p style="color: var(--text-muted); font-size: 0.9rem;">${task.desc.substring(0, 60)}${task.desc.length > 60 ? '...' : ''}</p>
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <div style="width: 24px; height: 24px; border-radius: 50%; background: var(--accent-primary); display: flex; align-items: center; justify-content: center; font-size: 0.6rem; font-weight: bold; color: white;">${assignee.initials}</div>
                    <span style="font-size: 0.8rem;">${assignee.name}</span>
                </div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">${task.dueDate}</div>
            </div>
            <div style="margin-top: 0.5rem;">
                <div style="font-size: 0.75rem; margin-bottom: 0.25rem; color: var(--text-muted);">Pipeline Progress: Stage ${Math.min(task.currentStage, task.totalStages)}/${task.totalStages}</div>
                <div class="progress-dots">${dotsHtml}</div>
            </div>
            ${actionBtnHtml}
        `;
        grid.appendChild(card);
    });
}

function renderStats() {
    const bar = document.getElementById('stats-bar');
    const labels = document.getElementById('stats-labels');
    bar.innerHTML = '';
    labels.innerHTML = '';
    
    const activeTasks = tasks.filter(t => t.status !== 'Completed');
    const total = activeTasks.length || 1; 

    teamMembers.forEach(member => {
        const count = activeTasks.filter(t => t.assigneeId === member.id).length;
        const percentage = (count / total) * 100;
        
        if (percentage > 0) {
            const segment = document.createElement('div');
            segment.className = 'stats-segment';
            segment.style.width = `${percentage}%`;
            segment.style.backgroundColor = member.color;
            segment.title = `${member.name}: ${count} tasks`;
            bar.appendChild(segment);
            
            const label = document.createElement('div');
            label.innerHTML = `<span style="color: ${member.color};">■</span> ${member.name} (${Math.round(percentage)}%)`;
            labels.appendChild(label);
        }
    });

    // Warning logic
    const counts = teamMembers.map(m => activeTasks.filter(t => t.assigneeId === m.id).length);
    const max = Math.max(...counts);
    const min = Math.min(...counts);
    if (max - min > 3 && max > 0) {
        showToast('Warning: Unequal task distribution detected.', 'error');
    }
}

function setupFilters() {
    const tabs = document.querySelectorAll('.filter-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.getAttribute('data-filter');
            renderTasks();
        });
    });
}

function openCreateModal() {
    document.getElementById('create-modal').classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

function handleCreateTask(e) {
    e.preventDefault();
    const title = document.getElementById('task-title').value;
    const desc = document.getElementById('task-desc').value;
    const priority = document.getElementById('task-priority').value;
    const dueDate = document.getElementById('task-date').value;

    const newTask = {
        id: Date.now(),
        title,
        desc,
        priority,
        dueDate,
        assigneeId: 1, // Always Member 1 first
        currentStage: 1,
        totalStages: 4,
        status: 'Pending',
        completedStages: []
    };

    tasks.push(newTask);
    saveTasks();
    closeModal('create-modal');
    document.getElementById('create-form').reset();
    
    renderPipeline();
    renderTasks();
    renderStats();
    showToast('Task created and assigned to Member 1.', 'success');
}

function openHandoffModal(taskId) {
    handoffTaskId = taskId;
    const task = tasks.find(t => t.id === taskId);
    
    if (task.assigneeId !== CURRENT_USER_ID) {
        showToast('You can only handoff your own tasks.', 'error');
        return;
    }

    const nextMember = teamMembers.find(m => m.id === task.currentStage + 1);
    
    let msg = '';
    if (nextMember) {
        msg = `Hand off <b>${task.title}</b> to <b>${nextMember.name}</b>?`;
    } else {
        msg = `Complete <b>${task.title}</b>? This is the final stage.`;
    }
    
    document.getElementById('handoff-msg').innerHTML = msg;
    document.getElementById('human-verify').checked = false;
    document.getElementById('handoff-notes').value = '';
    toggleHandoffBtn();
    
    document.getElementById('handoff-modal').classList.add('active');
}

function toggleHandoffBtn() {
    const isChecked = document.getElementById('human-verify').checked;
    const btn = document.getElementById('btn-confirm-handoff');
    if (isChecked) {
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
    } else {
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
    }
}

function confirmHandoff() {
    if (!document.getElementById('human-verify').checked) return;
    
    const taskIndex = tasks.findIndex(t => t.id === handoffTaskId);
    if (taskIndex !== -1) {
        const task = tasks[taskIndex];
        
        if (!task.completedStages.includes(task.currentStage)) {
            task.completedStages.push(task.currentStage);
        }
        
        if (task.currentStage < task.totalStages) {
            task.currentStage++;
            task.assigneeId = task.currentStage;
            task.status = 'In Progress';
            showToast('Task handed off successfully.', 'success');
        } else {
            task.status = 'Completed';
            showToast('Task fully completed!', 'success');
        }
        
        saveTasks();
        renderPipeline();
        renderTasks();
        renderStats();
    }
    
    closeModal('handoff-modal');
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    let bgColor = '#1E2A45';
    if (type === 'success') bgColor = '#00E080';
    if (type === 'error') bgColor = '#FF5577';

    toast.style.cssText = `
        background: ${bgColor};
        color: white;
        padding: 0.75rem 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease-out forwards;
        font-size: 0.9rem;
    `;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', init);
