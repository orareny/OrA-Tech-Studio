// Load updates from localStorage and render on public pages
function loadSiteUpdates(){
    const container = document.getElementById('updatesContainer');
    if(!container) return;
    const stored = localStorage.getItem('updates');
    const updates = stored ? JSON.parse(stored) : [];

    if(updates.length === 0){
        container.innerHTML = '<div class="update-item"><div class="muted">No updates yet. Check back later.</div></div>';
        return;
    }

    container.innerHTML = updates.map(u => `
        <div class="update-item">
            <div style="display:flex;justify-content:space-between;align-items:center">
                <strong style="font-size:15px">${escapeHtml(u.title)}</strong>
                <div class="muted" style="font-size:12px">${new Date(u.date).toLocaleDateString()}</div>
            </div>
            ${u.body ? `<div style="margin-top:8px;color:var(--muted)">${escapeHtml(u.body)}</div>` : ''}
        </div>
    `).join('');
}

function escapeHtml(s){
    if(!s) return '';
    return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
}

// Run on DOMContentLoaded
document.addEventListener('DOMContentLoaded', loadSiteUpdates);
