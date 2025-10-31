// Get category from page URL
function getCurrentCategory() {
    const page = window.location.pathname.split('/').pop().replace('.html', '');
    return page; // 'software', 'music', 'games', or 'ai'
}

// Load and render projects for this category
function loadProjects() {
    const category = getCurrentCategory();
    const stored = localStorage.getItem('projects');
    const allProjects = stored ? JSON.parse(stored) : [];
    
    // Filter projects by category
    const projects = allProjects.filter(p => p.category === category);
    
    const container = document.getElementById('projectsContainer');
    
    if (projects.length === 0) {
        container.innerHTML = `
            <div class="card">
                <p class="muted" style="text-align:center">No projects yet. Check back soon!</p>
                <p style="text-align:center;margin-top:16px">
                    <a href="contact.html" class="btn">Get in Touch</a>
                </p>
            </div>
        `;
        return;
    }
    
    // Render projects
    container.innerHTML = projects.map(project => `
        <div class="card">
            <h3>${project.name}</h3>
            ${project.description ? `<p class="muted">${project.description}</p>` : ''}
            ${project.tags ? `
                <p class="small" style="margin-top:12px">
                    ${project.tags.split(',').map(tag => `<span style="display:inline-block;padding:4px 10px;background:var(--glass);border-radius:6px;margin-right:6px;margin-bottom:6px">${tag.trim()}</span>`).join('')}
                </p>
            ` : ''}
            ${project.link ? `
                <p style="margin-top:16px">
                    <a href="${project.link}" target="_blank" rel="noopener" class="btn">View Project →</a>
                </p>
            ` : ''}
        </div>
    `).join('');
}

// Load projects when page loads
document.addEventListener('DOMContentLoaded', loadProjects);
