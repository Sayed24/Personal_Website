// ========================================
// DATA MANAGEMENT - LOCAL STORAGE
// ========================================

class DataManager {
    constructor() {
        this.projects = JSON.parse(localStorage.getItem('projects')) || this.getDefaultProjects();
        this.skills = JSON.parse(localStorage.getItem('skills')) || this.getDefaultSkills();
        this.blog = JSON.parse(localStorage.getItem('blog')) || this.getDefaultBlog();
        this.about = localStorage.getItem('about') || this.getDefaultAbout();
    }

    getDefaultProjects() {
        return [
            {
                id: 1,
                title: 'Modern Portfolio',
                description: 'A sleek portfolio website built with clean HTML, CSS, and JavaScript. Features smooth animations and mobile-first design.',
                category: 'html',
                tags: ['HTML', 'CSS', 'JavaScript'],
                color1: '#F5A976',
                color2: '#D4845C'
            },
            {
                id: 2,
                title: 'Task Management App',
                description: 'A productivity app designed with user experience in mind. Includes real-time updates and an intuitive interface.',
                category: 'react',
                tags: ['React', 'Firebase', 'Design System'],
                color1: '#78C7A1',
                color2: '#5A9E7E'
            },
            {
                id: 3,
                title: 'E-Commerce Platform',
                description: 'Full-stack e-commerce solution with payment integration, inventory management, and admin dashboard.',
                category: 'fullstack',
                tags: ['Next.js', 'Node.js', 'MongoDB'],
                color1: '#6B9EDB',
                color2: '#4A73B8'
            }
        ];
    }

    getDefaultSkills() {
        return [
            { id: 1, name: 'Web Development', icon: '💻' },
            { id: 2, name: 'UI/UX Design', icon: '🎨' },
            { id: 3, name: 'Responsive Design', icon: '📱' },
            { id: 4, name: 'Performance', icon: '⚡' }
        ];
    }

    getDefaultBlog() {
        return [
            {
                id: 1,
                title: 'Getting Started with Web Development',
                content: '<p>Learn the fundamentals of web development and start your journey as a developer. We\'ll cover HTML, CSS, and JavaScript basics.</p>',
                tags: ['webdev', 'tutorial', 'beginner'],
                date: new Date(Date.now() - 7*24*60*60*1000).toLocaleDateString()
            },
            {
                id: 2,
                title: 'Dark Mode Implementation Best Practices',
                content: '<p>Explore the best practices for implementing dark mode in your web applications. Learn about CSS variables, local storage, and user preferences.</p>',
                tags: ['css', 'ux', 'design'],
                date: new Date(Date.now() - 14*24*60*60*1000).toLocaleDateString()
            }
        ];
    }

    getDefaultAbout() {
        return '<p>I\'m a passionate developer who loves creating elegant solutions to complex problems. With a keen eye for design and a solid foundation in web technologies, I build websites and applications that are both beautiful and functional.</p><p>When I\'m not coding, you\'ll find me exploring new design trends, contributing to open-source projects, or enjoying a good cup of coffee.</p>';
    }

    save() {
        localStorage.setItem('projects', JSON.stringify(this.projects));
        localStorage.setItem('skills', JSON.stringify(this.skills));
        localStorage.setItem('blog', JSON.stringify(this.blog));
        localStorage.setItem('about', this.about);
    }

    addProject(project) {
        project.id = Date.now();
        this.projects.push(project);
        this.save();
        return project;
    }

    deleteProject(id) {
        this.projects = this.projects.filter(p => p.id !== id);
        this.save();
    }

    addSkill(skill) {
        skill.id = Date.now();
        this.skills.push(skill);
        this.save();
        return skill;
    }

    deleteSkill(id) {
        this.skills = this.skills.filter(s => s.id !== id);
        this.save();
    }

    addBlog(post) {
        post.id = Date.now();
        post.date = new Date().toLocaleDateString();
        this.blog.push(post);
        this.save();
        return post;
    }

    deleteBlog(id) {
        this.blog = this.blog.filter(b => b.id !== id);
        this.save();
    }

    updateAbout(text) {
        this.about = text;
        this.save();
    }

    exportData() {
        return {
            projects: this.projects,
            skills: this.skills,
            blog: this.blog,
            about: this.about
        };
    }

    importData(data) {
        if (data.projects) this.projects = data.projects;
        if (data.skills) this.skills = data.skills;
        if (data.blog) this.blog = data.blog;
        if (data.about) this.about = data.about;
        this.save();
    }

    reset() {
        this.projects = this.getDefaultProjects();
        this.skills = this.getDefaultSkills();
        this.blog = this.getDefaultBlog();
        this.about = this.getDefaultAbout();
        this.save();
    }
}

// ========================================
// THEME MANAGEMENT
// ========================================

class ThemeManager {
    constructor() {
        this.isDarkMode = localStorage.getItem('darkMode') === 'true';
        this.applyTheme();
    }

    toggle() {
        this.isDarkMode = !this.isDarkMode;
        localStorage.setItem('darkMode', this.isDarkMode);
        this.applyTheme();
        this.updateButton();
    }

    applyTheme() {
        if (this.isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    updateButton() {
        const btn = document.getElementById('themeToggle');
        if (btn) {
            btn.textContent = this.isDarkMode ? '☀️' : '🌙';
        }
    }
}

// ========================================
// RENDERING FUNCTIONS
// ========================================

function renderProjects() {
    const grid = document.getElementById('projectsGrid');
    grid.innerHTML = '';

    dataManager.projects.forEach(project => {
        const card = document.createElement('article');
        card.className = 'project-card';
        card.dataset.category = project.category;
        
        const tagsHtml = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        
        card.innerHTML = `
            <div class="project-image" style="background: linear-gradient(135deg, ${project.color1} 0%, ${project.color2} 100%);"></div>
            <div class="project-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tags">${tagsHtml}</div>
            </div>
            <button class="delete-btn" onclick="deleteProject(${project.id})" style="display: none;">Delete</button>
        `;
        
        card.addEventListener('mouseenter', () => {
            const btn = card.querySelector('.delete-btn');
            if (isAdminMode) btn.style.display = 'block';
        });
        
        grid.appendChild(card);
    });

    applyProjectFilters();
}

function renderSkills() {
    const grid = document.getElementById('skillsGrid');
    grid.innerHTML = '';

    dataManager.skills.forEach(skill => {
        const item = document.createElement('div');
        item.className = 'skill-item';
        item.innerHTML = `
            <span class="skill-icon">${skill.icon}</span>
            <h3>${skill.name}</h3>
            <button class="delete-btn" onclick="deleteSkill(${skill.id})" style="display: none;">✕</button>
        `;
        
        item.addEventListener('mouseenter', () => {
            const btn = item.querySelector('.delete-btn');
            if (isAdminMode) btn.style.display = 'block';
        });
        
        grid.appendChild(item);
    });
}

function renderBlog() {
    const grid = document.getElementById('blogGrid');
    grid.innerHTML = '';

    dataManager.blog.forEach(post => {
        const card = document.createElement('article');
        card.className = 'blog-card';
        
        const tagsHtml = post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('');
        
        card.innerHTML = `
            <div class="blog-header">
                <div class="blog-date">${post.date}</div>
                <h3>${post.title}</h3>
            </div>
            <div class="blog-content">${post.content}</div>
            <div class="blog-footer">${tagsHtml}</div>
            <button class="delete-btn" onclick="deleteBlog(${post.id})" style="display: none;">Delete</button>
        `;
        
        card.addEventListener('mouseenter', () => {
            const btn = card.querySelector('.delete-btn');
            if (isAdminMode) btn.style.display = 'block';
        });
        
        grid.appendChild(card);
    });
}

function renderAbout() {
    const aboutText = document.getElementById('aboutText');
    if (aboutText) {
        aboutText.innerHTML = dataManager.about;
    }
}

function renderAdminPanelLists() {
    // Projects List
    const projectsList = document.getElementById('projectsList');
    projectsList.innerHTML = '';
    dataManager.projects.forEach(project => {
        const item = document.createElement('div');
        item.className = 'admin-item';
        item.innerHTML = `
            <div class="admin-item-content">
                <div class="admin-item-title">${project.title}</div>
                <div class="admin-item-meta">${project.tags.join(', ')}</div>
            </div>
            <div class="admin-item-actions">
                <button class="admin-delete-btn" onclick="deleteProject(${project.id})">Delete</button>
            </div>
        `;
        projectsList.appendChild(item);
    });

    // Skills List
    const skillsList = document.getElementById('skillsList');
    skillsList.innerHTML = '';
    dataManager.skills.forEach(skill => {
        const item = document.createElement('div');
        item.className = 'admin-item';
        item.innerHTML = `
            <div class="admin-item-content">
                <div class="admin-item-title">${skill.icon} ${skill.name}</div>
            </div>
            <div class="admin-item-actions">
                <button class="admin-delete-btn" onclick="deleteSkill(${skill.id})">Delete</button>
            </div>
        `;
        skillsList.appendChild(item);
    });

    // Blog List
    const blogList = document.getElementById('blogList');
    blogList.innerHTML = '';
    dataManager.blog.forEach(post => {
        const item = document.createElement('div');
        item.className = 'admin-item';
        item.innerHTML = `
            <div class="admin-item-content">
                <div class="admin-item-title">${post.title}</div>
                <div class="admin-item-meta">${post.date}</div>
            </div>
            <div class="admin-item-actions">
                <button class="admin-delete-btn" onclick="deleteBlog(${post.id})">Delete</button>
            </div>
        `;
        blogList.appendChild(item);
    });

    // About Text
    const aboutContent = document.getElementById('aboutContent');
    if (aboutContent) {
        aboutContent.value = dataManager.about;
    }
}

// ========================================
// ADMIN FUNCTIONS
// ========================================

let isAdminMode = false;

function toggleAdmin() {
    isAdminMode = !isAdminMode;
    const modal = document.getElementById('adminModal');
    
    if (isAdminMode) {
        modal.classList.add('active');
        renderAdminPanelLists();
        document.body.style.overflow = 'hidden';
    } else {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    // Show/hide delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        if (isAdminMode && btn.parentElement.querySelector(':hover') === btn.parentElement) {
            btn.style.display = 'block';
        }
    });
}

function addProject() {
    const title = document.getElementById('projectTitle').value;
    const desc = document.getElementById('projectDesc').value;
    const tech = document.getElementById('projectTech').value;
    const category = document.getElementById('projectCategory').value;
    const color1 = document.getElementById('projectColor1').value;
    const color2 = document.getElementById('projectColor2').value;

    if (!title || !desc || !tech) {
        showToast('Please fill all fields', 'error');
        return;
    }

    dataManager.addProject({
        title,
        description: desc,
        category,
        tags: tech.split(',').map(t => t.trim()),
        color1,
        color2
    });

    // Clear form
    document.getElementById('projectTitle').value = '';
    document.getElementById('projectDesc').value = '';
    document.getElementById('projectTech').value = '';
    document.getElementById('projectCategory').value = 'html';
    document.getElementById('projectColor1').value = '#F5A976';
    document.getElementById('projectColor2').value = '#D4845C';

    renderProjects();
    renderAdminPanelLists();
    showToast('Project added successfully!', 'success');
}

function deleteProject(id) {
    if (confirm('Are you sure you want to delete this project?')) {
        dataManager.deleteProject(id);
        renderProjects();
        renderAdminPanelLists();
        showToast('Project deleted', 'success');
    }
}

function addSkill() {
    const name = document.getElementById('skillName').value;
    const icon = document.getElementById('skillIcon').value;

    if (!name || !icon) {
        showToast('Please fill all fields', 'error');
        return;
    }

    dataManager.addSkill({ name, icon });

    document.getElementById('skillName').value = '';
    document.getElementById('skillIcon').value = '💻';

    renderSkills();
    renderAdminPanelLists();
    showToast('Skill added successfully!', 'success');
}

function deleteSkill(id) {
    if (confirm('Are you sure you want to delete this skill?')) {
        dataManager.deleteSkill(id);
        renderSkills();
        renderAdminPanelLists();
        showToast('Skill deleted', 'success');
    }
}

function addBlog() {
    const title = document.getElementById('blogTitle').value;
    const content = document.getElementById('blogContent').value;
    const tags = document.getElementById('blogTags').value;

    if (!title || !content) {
        showToast('Please fill all fields', 'error');
        return;
    }

    dataManager.addBlog({
        title,
        content,
        tags: tags.split(',').map(t => t.trim()).filter(t => t)
    });

    document.getElementById('blogTitle').value = '';
    document.getElementById('blogContent').value = '';
    document.getElementById('blogTags').value = '';

    renderBlog();
    renderAdminPanelLists();
    showToast('Blog post added successfully!', 'success');
}

function deleteBlog(id) {
    if (confirm('Are you sure you want to delete this blog post?')) {
        dataManager.deleteBlog(id);
        renderBlog();
        renderAdminPanelLists();
        showToast('Blog post deleted', 'success');
    }
}

function updateAbout() {
    const content = document.getElementById('aboutContent').value;
    if (!content.trim()) {
        showToast('About section cannot be empty', 'error');
        return;
    }
    dataManager.updateAbout(content);
    renderAbout();
    showToast('About section updated!', 'success');
}

// ========================================
// BACKUP & RESTORE
// ========================================

function exportData() {
    const data = dataManager.exportData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported successfully!', 'success');
}

function importData() {
    const input = document.getElementById('importFile');
    input.click();
    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                dataManager.importData(data);
                renderProjects();
                renderSkills();
                renderBlog();
                renderAbout();
                renderAdminPanelLists();
                showToast('Data imported successfully!', 'success');
            } catch (error) {
                showToast('Invalid JSON file', 'error');
            }
        };
        reader.readAsText(file);
    });
}

function resetData() {
    if (confirm('Are you sure? This will reset all data to defaults. This cannot be undone!')) {
        dataManager.reset();
        renderProjects();
        renderSkills();
        renderBlog();
        renderAbout();
        renderAdminPanelLists();
        showToast('Data reset to defaults', 'success');
    }
}

// ========================================
// CONTACT FORM
// ========================================

function handleContactForm(e) {
    e.preventDefault();

    const name = document.getElementById('formName').value;
    const email = document.getElementById('formEmail').value;
    const message = document.getElementById('formMessage').value;
    const messageDiv = document.querySelector('.form-message');

    // Validation
    if (!name || !email || !message) {
        showFormMessage('Please fill all fields', 'error');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFormMessage('Please enter a valid email', 'error');
        return;
    }

    // Send via FormSubmit.co (no backend needed)
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('message', message);
    formData.append('_captcha', 'false');
    formData.append('_next', window.location.href);

    fetch('https://formspree.io/f/xdoqebnl', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            showFormMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
            document.getElementById('contactForm').reset();
        } else {
            showFormMessage('Something went wrong. Please try again.', 'error');
        }
    })
    .catch(error => {
        // Fallback: save to local storage if network fails
        let messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        messages.push({ name, email, message, date: new Date().toLocaleString() });
        localStorage.setItem('contactMessages', JSON.stringify(messages));
        
        showFormMessage('Message saved locally. You can review it in admin panel.', 'success');
        document.getElementById('contactForm').reset();
    });
}

function showFormMessage(message, type) {
    const messageDiv = document.querySelector('.form-message');
    messageDiv.textContent = message;
    messageDiv.className = `form-message ${type}`;
    
    setTimeout(() => {
        messageDiv.className = 'form-message';
    }, 5000);
}

// ========================================
// PROJECT FILTERING
// ========================================

function applyProjectFilters() {
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        if (activeFilter === 'all' || card.dataset.category === activeFilter) {
            card.style.display = '';
            setTimeout(() => card.style.opacity = '1', 10);
        } else {
            card.style.opacity = '0';
            setTimeout(() => card.style.display = 'none', 300);
        }
    });
}

// ========================================
// TOAST NOTIFICATIONS
// ========================================

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ========================================
// INITIALIZATION
// ========================================

let dataManager;
let themeManager;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize managers
    dataManager = new DataManager();
    themeManager = new ThemeManager();

    // Set year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Render initial content
    renderProjects();
    renderSkills();
    renderBlog();
    renderAbout();
    themeManager.updateButton();

    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !mobileMenuToggle.contains(e.target)) {
            mobileMenuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.project-card, .skill-item, .blog-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', () => {
        themeManager.toggle();
    });

    // Admin toggle
    document.getElementById('adminToggle').addEventListener('click', toggleAdmin);

    // Keyboard shortcut for admin (Ctrl+Shift+A)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'A') {
            e.preventDefault();
            toggleAdmin();
        }
    });

    // Admin modal close
    document.getElementById('modalClose').addEventListener('click', toggleAdmin);
    document.getElementById('adminModal').addEventListener('click', (e) => {
        if (e.target.id === 'adminModal') toggleAdmin();
    });

    // Admin tabs
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            
            document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.admin-tab-content').forEach(content => content.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });

    // Admin form handlers
    document.getElementById('addProjectBtn').addEventListener('click', addProject);
    document.getElementById('addSkillBtn').addEventListener('click', addSkill);
    document.getElementById('addBlogBtn').addEventListener('click', addBlog);
    document.getElementById('updateAboutBtn').addEventListener('click', updateAbout);

    // Backup handlers
    document.getElementById('exportBtn').addEventListener('click', exportData);
    document.getElementById('importBtn').addEventListener('click', importData);
    document.getElementById('resetBtn').addEventListener('click', resetData);

    // Contact form
    document.getElementById('contactForm').addEventListener('submit', handleContactForm);

    // Project filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyProjectFilters();
        });
    });
});
