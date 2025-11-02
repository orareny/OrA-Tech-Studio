// Check authentication
if (!localStorage.getItem('adminAuth')) {
    window.location.href = 'admin-login.html';
}

// Get projects from localStorage
function getProjects() {
    const stored = localStorage.getItem('projects');
    return stored ? JSON.parse(stored) : [];
}

// Save projects to localStorage
function saveProjects(projects) {
    localStorage.setItem('projects', JSON.stringify(projects));
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Render projects list
function renderProjects() {
    const projects = getProjects();
    const container = document.getElementById('projectsList');
    const countEl = document.getElementById('projectCount');
    
    countEl.textContent = projects.length;
    
    if (projects.length === 0) {
        container.innerHTML = '<p class="muted">No projects yet. Add your first project above.</p>';
        return;
    }
    
    container.innerHTML = projects.map(project => `
        <div class="project-item">
            <div>
                <strong>${project.name}</strong>
                <span class="muted"> — ${getCategoryName(project.category)}</span>
                ${project.tags ? `<br><small class="muted">${project.tags}</small>` : ''}
            </div>
            <div class="project-actions">
                <button class="btn btn-small ghost" onclick="editProject('${project.id}')">Edit</button>
                <button class="btn btn-small btn-danger" onclick="deleteProject('${project.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Get category display name
function getCategoryName(category) {
    const names = {
        'software': 'Software Engineering',
        'music': 'Music Production',
        'games': 'Game Development',
        'ai': 'AI & ML'
    };
    return names[category] || category;
}

// Add/Update project
document.getElementById('projectForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const projects = getProjects();
    const id = document.getElementById('projectId').value;
    
    const project = {
        id: id || generateId(),
        name: document.getElementById('projectName').value,
        category: document.getElementById('projectCategory').value,
        description: document.getElementById('projectDescription').value,
        tags: document.getElementById('projectTags').value,
        link: document.getElementById('projectLink').value,
        createdAt: id ? projects.find(p => p.id === id).createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    if (id) {
        // Update existing
        const index = projects.findIndex(p => p.id === id);
        projects[index] = project;
    } else {
        // Add new
        projects.push(project);
    }
    
    saveProjects(projects);
    renderProjects();
    resetForm();
});

// Edit project
function editProject(id) {
    const projects = getProjects();
    const project = projects.find(p => p.id === id);
    
    if (!project) return;
    
    document.getElementById('projectId').value = project.id;
    document.getElementById('projectName').value = project.name;
    document.getElementById('projectCategory').value = project.category;
    document.getElementById('projectDescription').value = project.description;
    document.getElementById('projectTags').value = project.tags;
    document.getElementById('projectLink').value = project.link;
    
    document.getElementById('formTitle').textContent = 'Edit Project';
    document.getElementById('submitBtn').textContent = 'Update Project';
    document.getElementById('cancelBtn').style.display = 'block';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Delete project
function deleteProject(id) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    const projects = getProjects();
    const filtered = projects.filter(p => p.id !== id);
    saveProjects(filtered);
    renderProjects();
}

// Reset form
function resetForm() {
    document.getElementById('projectForm').reset();
    document.getElementById('projectId').value = '';
    document.getElementById('formTitle').textContent = 'Add New Project';
    document.getElementById('submitBtn').textContent = 'Add Project';
    document.getElementById('cancelBtn').style.display = 'none';
}

// Cancel edit
document.getElementById('cancelBtn').addEventListener('click', resetForm);

// Logout
document.getElementById('logoutBtn').addEventListener('click', function() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('adminAuth');
        window.location.href = 'index.html';
    }
});

// Change password function
function changePassword() {
    const currentPassword = localStorage.getItem('adminPassword') || 'OrA2025!';
    const inputCurrent = prompt('Enter your current password:');
    
    if (inputCurrent !== currentPassword) {
        alert('❌ Incorrect current password!');
        return;
    }
    
    const newPassword = prompt('Enter your new password (min 8 characters):');
    
    if (!newPassword || newPassword.length < 8) {
        alert('❌ Password must be at least 8 characters long!');
        return;
    }
    
    const confirmPassword = prompt('Confirm your new password:');
    
    if (newPassword !== confirmPassword) {
        alert('❌ Passwords do not match!');
        return;
    }
    
    localStorage.setItem('adminPassword', newPassword);
    alert('✅ Password changed successfully!');
}

// Initial render
renderProjects();

// --- Updates management (site news / changelog) ---
function getUpdates() {
    const stored = localStorage.getItem('updates');
    return stored ? JSON.parse(stored) : [];
}

function saveUpdates(items) {
    localStorage.setItem('updates', JSON.stringify(items));
}

function renderUpdates() {
    const updates = getUpdates();
    const container = document.getElementById('updatesList');
    if (!container) return;

    if (updates.length === 0) {
        container.innerHTML = '<p class="muted">No updates yet. Add one above.</p>';
        return;
    }

    container.innerHTML = updates.map(u => `
        <div class="project-item" style="flex-direction:column;align-items:flex-start">
            <div style="width:100%;display:flex;justify-content:space-between;align-items:center">
                <div>
                    <strong>${escapeHtml(u.title)}</strong>
                    <div class="muted" style="font-size:12px">${u.status} • ${new Date(u.date).toLocaleString()}</div>
                </div>
                <div class="project-actions">
                    <button class="btn btn-small ghost" onclick="editUpdate('${u.id}')">Edit</button>
                    <button class="btn btn-small btn-danger" onclick="deleteUpdate('${u.id}')">Delete</button>
                </div>
            </div>
            ${u.body ? `<div style="margin-top:8px;color:var(--muted)">${escapeHtml(u.body)}</div>` : ''}
        </div>
    `).join('');
}

// Simple escaper for rendering text
function escapeHtml(s){
    if (!s) return '';
    return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
}

// Add/update handler for updates form
const updateForm = document.getElementById('updateForm');
if (updateForm) {
    updateForm.addEventListener('submit', function(e){
        e.preventDefault();
        const updates = getUpdates();
        const id = document.getElementById('updateId').value;
        const title = document.getElementById('updateTitle').value.trim();
        const body = document.getElementById('updateBody').value.trim();
        const status = document.getElementById('updateStatus').value;

        if (!title) {
            alert('Title is required');
            return;
        }

        const item = {
            id: id || generateId(),
            title,
            body,
            status,
            date: new Date().toISOString()
        };

        if (id) {
            const idx = updates.findIndex(u=>u.id===id);
            updates[idx] = Object.assign({}, updates[idx], item);
        } else {
            updates.unshift(item); // newest first
        }

        saveUpdates(updates);
        renderUpdates();
        // reset form
        document.getElementById('updateForm').reset();
        document.getElementById('updateId').value = '';
        document.getElementById('cancelUpdateBtn').style.display = 'none';
        document.getElementById('addUpdateBtn').textContent = 'Add Update';
    });

    document.getElementById('cancelUpdateBtn').addEventListener('click', function(){
        document.getElementById('updateForm').reset();
        document.getElementById('updateId').value = '';
        this.style.display = 'none';
        document.getElementById('addUpdateBtn').textContent = 'Add Update';
    });
}

// Edit update
function editUpdate(id) {
    const updates = getUpdates();
    const u = updates.find(x=>x.id===id);
    if (!u) return;
    document.getElementById('updateId').value = u.id;
    document.getElementById('updateTitle').value = u.title;
    document.getElementById('updateBody').value = u.body;
    document.getElementById('updateStatus').value = u.status || 'published';
    document.getElementById('cancelUpdateBtn').style.display = 'inline-block';
    document.getElementById('addUpdateBtn').textContent = 'Update';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Delete update
function deleteUpdate(id) {
    if (!confirm('Delete this update?')) return;
    const updates = getUpdates();
    const filtered = updates.filter(u=>u.id!==id);
    saveUpdates(filtered);
    renderUpdates();
}

// Render updates on load
renderUpdates();

// --- External Links Management (for topic pages) ---
function getLinks() {
    const stored = localStorage.getItem('externalLinks');
    return stored ? JSON.parse(stored) : [];
}

function saveLinks(links) {
    localStorage.setItem('externalLinks', JSON.stringify(links));
}

function renderLinks() {
    const links = getLinks();
    const container = document.getElementById('linksList');
    const countEl = document.getElementById('linkCount');
    
    if (!container || !countEl) return;
    
    countEl.textContent = links.length;
    
    if (links.length === 0) {
        container.innerHTML = '<p class="muted">No external links yet. Add links to your portfolios (itch.io, GitHub, etc.) above.</p>';
        return;
    }
    
    container.innerHTML = links.map(link => `
        <div class="project-item">
            <div>
                <strong>${escapeHtml(link.title)}</strong>
                <span class="muted"> — ${getCategoryName(link.category)}</span>
                <br><a href="${link.url}" target="_blank" class="muted" style="font-size:13px">${link.url}</a>
                ${link.description ? `<br><small class="muted">${escapeHtml(link.description)}</small>` : ''}
            </div>
            <div class="project-actions">
                <button class="btn btn-small ghost" onclick="editLink('${link.id}')">Edit</button>
                <button class="btn btn-small btn-danger" onclick="deleteLink('${link.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Add/Update link
const linkForm = document.getElementById('linkForm');
if (linkForm) {
    linkForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const links = getLinks();
        const id = document.getElementById('linkId').value;
        
        const link = {
            id: id || generateId(),
            title: document.getElementById('linkTitle').value,
            category: document.getElementById('linkCategory').value,
            url: document.getElementById('linkUrl').value,
            description: document.getElementById('linkDescription').value,
            createdAt: id ? links.find(l => l.id === id).createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        if (id) {
            // Update existing
            const index = links.findIndex(l => l.id === id);
            links[index] = link;
        } else {
            // Add new
            links.push(link);
        }
        
        saveLinks(links);
        renderLinks();
        resetLinkForm();
    });
}

// Edit link
function editLink(id) {
    const links = getLinks();
    const link = links.find(l => l.id === id);
    
    if (!link) return;
    
    document.getElementById('linkId').value = link.id;
    document.getElementById('linkTitle').value = link.title;
    document.getElementById('linkCategory').value = link.category;
    document.getElementById('linkUrl').value = link.url;
    document.getElementById('linkDescription').value = link.description;
    
    document.getElementById('submitLinkBtn').textContent = 'Update Link';
    document.getElementById('cancelLinkBtn').style.display = 'block';
    
    window.scrollTo({ top: document.getElementById('linkForm').offsetTop - 20, behavior: 'smooth' });
}

// Delete link
function deleteLink(id) {
    if (!confirm('Are you sure you want to delete this link?')) return;
    
    const links = getLinks();
    const filtered = links.filter(l => l.id !== id);
    saveLinks(filtered);
    renderLinks();
}

// Reset link form
function resetLinkForm() {
    if (!document.getElementById('linkForm')) return;
    document.getElementById('linkForm').reset();
    document.getElementById('linkId').value = '';
    document.getElementById('submitLinkBtn').textContent = 'Add Link';
    document.getElementById('cancelLinkBtn').style.display = 'none';
}

// Cancel link edit
const cancelLinkBtn = document.getElementById('cancelLinkBtn');
if (cancelLinkBtn) {
    cancelLinkBtn.addEventListener('click', resetLinkForm);
}

// Initial render for links
renderLinks();
