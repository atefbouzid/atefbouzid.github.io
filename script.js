// Theme Toggle

const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to dark
const currentTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', currentTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    } else {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    }
});

// Active navigation link highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Initialize EmailJS
(function () {
    if (typeof EMAILJS_CONFIG !== 'undefined' && EMAILJS_CONFIG.PUBLIC_KEY) {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    } else {
        console.warn('EmailJS config not found. Please check config.js file.');
    }
})();

// Contact form handling
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Check if EmailJS is configured
        if (typeof EMAILJS_CONFIG === 'undefined' ||
            !EMAILJS_CONFIG.PUBLIC_KEY ||
            !EMAILJS_CONFIG.SERVICE_ID ||
            !EMAILJS_CONFIG.TEMPLATE_ID) {
            formStatus.className = 'form-status error';
            formStatus.textContent = 'Email service not configured. Please contact me directly at atef.bouzid@outlook.com';
            formStatus.style.display = 'block';
            return;
        }

        // Show sending status
        formStatus.className = 'form-status sending';
        formStatus.textContent = 'Sending message...';
        formStatus.style.display = 'block';

        // Get form values
        const formData = {
            from_name: document.getElementById('name').value,
            from_email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
            to_email: 'atef.bouzid@outlook.com'
        };

        // Send email using EmailJS
        emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, formData)
            .then(() => {
                // Success
                formStatus.className = 'form-status success';
                formStatus.textContent = 'Message sent successfully! I\'ll get back to you soon.';
                contactForm.reset();

                // Hide status after 5 seconds
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 5000);
            })
            .catch((error) => {
                // Error
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Failed to send message. Please try again or contact me directly at atef.bouzid@outlook.com';
                console.error('EmailJS Error:', error);
            });
    });
}

// Scroll education section to show the last (most recent) item by default
function scrollEducationToEnd() {
    const educationFlex = document.querySelector('.education-flex');
    if (educationFlex) {
        // Use setTimeout to ensure the layout is complete
        setTimeout(() => {
            educationFlex.scrollLeft = educationFlex.scrollWidth;
        }, 100);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    scrollEducationToEnd();

    // Also scroll when the education section comes into view
    const educationSection = document.querySelector('.education');
    if (educationSection) {
        const educationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    scrollEducationToEnd();
                    educationObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        educationObserver.observe(educationSection);
    }
});

// Intersection Observer for fade-in animations (inspired by featured projects snippet)
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            // Only animate once per element
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Handle project images - hide placeholder when image loads successfully
document.addEventListener('DOMContentLoaded', () => {
    const projectImages = document.querySelectorAll('.project-image img');
    projectImages.forEach(img => {
        img.addEventListener('load', function () {
            const placeholder = this.nextElementSibling;
            if (placeholder && placeholder.classList.contains('project-placeholder')) {
                placeholder.style.display = 'none';
            }
        });
        img.addEventListener('error', function () {
            this.style.display = 'none';
            const placeholder = this.nextElementSibling;
            if (placeholder && placeholder.classList.contains('project-placeholder')) {
                placeholder.style.display = 'flex';
            }
        });
    });

    // Handle skill icons - show fallback if image fails to load
    const skillIcons = document.querySelectorAll('.skill-icon img');
    skillIcons.forEach(img => {
        img.addEventListener('error', function () {
            this.style.display = 'none';
            const fallback = this.nextElementSibling;
            if (fallback && fallback.classList.contains('skill-fallback')) {
                fallback.style.display = 'block';
            }
        });
        img.addEventListener('load', function () {
            const fallback = this.nextElementSibling;
            if (fallback && fallback.classList.contains('skill-fallback')) {
                fallback.style.display = 'none';
            }
        });
    }); // End skillIcons forEach

    // Verify CV availability and date
    checkCVStatus();
});

// Check CV Status
async function checkCVStatus() {
    const cvPath = 'cv/CV_Atef_Bouzid.pdf';
    const updateInfo = document.querySelector('.cv-update-info');
    const cvButton = document.querySelector('.btn-cv');

    if (!updateInfo) return;

    try {
        const response = await fetch(cvPath, { method: 'HEAD' });

        if (response.ok) {
            const lastModified = response.headers.get('Last-Modified');
            if (lastModified) {
                const date = new Date(lastModified);
                const formattedDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
                updateInfo.textContent = `Last updated: ${formattedDate}`;
            } else {
                updateInfo.textContent = 'Last updated: Available';
            }
        } else {
            updateInfo.textContent = 'CV not available';
            if (cvButton) {
                cvButton.style.opacity = '0.5';
                cvButton.style.pointerEvents = 'none';
                cvButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    CV Not Available
                `;
            }
        }
    } catch (error) {
        console.error('Error checking CV status:', error);
        updateInfo.textContent = 'CV status unknown';
    }
}

// GitHub API Integration - get projects directly from github (no custom projects)
async function fetchGitHubProjects() {
    const username = 'atefbouzid';
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;

    try {
        // Fetch all repos. We sort manually later to ensure Star count is the primary factor.
        const response = await fetch(
            `https://api.github.com/users/${username}/repos?per_page=100&type=all`
        );
        if (!response.ok) throw new Error('GitHub API failed');
        const repos = await response.json();

        // Filter: 1. Not portfolio repo. 2. Must have 'public' in topics.
        const filteredRepos = repos.filter(repo =>
            repo.name !== `${username}.github.io` &&
            repo.topics && repo.topics.includes('public')
        );

        // Sort by Stars (Descending)
        filteredRepos.sort((a, b) => b.stargazers_count - a.stargazers_count);

        // Display matching projects
        filteredRepos.forEach(repo => {
            createProjectCard(repo.name, repo, projectsGrid);
        });

    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
    }
}

function createProjectCard(repoName, repo, container) {
    const card = document.createElement('div');
    card.className = 'project-card';

    // Determine image - fallback to GitHub OpenGraph preview
    let imageHtml = '';
    const imagePath = repo
        ? `https://opengraph.githubassets.com/1/${repo.owner.login}/${repo.name}`
        : null;
    const displayName = repoName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    if (imagePath) {
        imageHtml = `
            <div class="project-image">
                <img src="${imagePath}" alt="${displayName}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="project-placeholder" style="display:none; background: ${getRandomGradient(repoName)}">${displayName}</div>
            </div>`;
    } else {
        imageHtml = `
            <div class="project-image">
                <div class="project-placeholder" style="background: ${getRandomGradient(repoName)}">
                    ${displayName}
                </div>
            </div>`;
    }

    // Use GitHub description
    const description = repo?.description || 'No description available.';

    // Filter Tags: Include ALL tags EXCEPT 'public' and 'demo'
    // Also include language if not already in topics
    let displayTags = [];

    if (repo?.topics) {
        const excludedTags = ['public', 'demo'];
        displayTags = repo.topics.filter(tag => !excludedTags.includes(tag));
    }

    // Add primary language if it's not in the filtered topics (case-insensitive check)
    if (repo?.language && !displayTags.some(t => t.toLowerCase() === repo.language.toLowerCase())) {
        displayTags.unshift(repo.language);
    }

    const tagsHtml = displayTags.map(tag => `<span>${tag}</span>`).join('');

    // Check for 'demo' tag to show Demo button
    const hasDemoTag = repo?.topics && repo.topics.includes('demo');
    const showDemoButton = hasDemoTag && repo?.homepage;

    const githubUrl = repo?.html_url || '#';

    // Star Count
    const starHtml = repo?.stargazers_count > 0
        ? `<div class="project-star">⭐ ${repo.stargazers_count}</div>`
        : '';

    // Creation Date
    const creationDate = repo?.created_at
        ? new Date(repo.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : '';
    const dateHtml = creationDate ? `<span class="project-date" style="font-size: 0.8rem; color: var(--text-secondary); display: block; margin-bottom: 0.5rem;">${creationDate}</span>` : '';

    card.innerHTML = `
        ${starHtml}
        ${imageHtml}
        <div class="project-content">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <h3>${displayName}</h3>
                ${dateHtml}
            </div>
            <p>${description}</p>
            <div class="project-tags">
                ${tagsHtml}
            </div>
            <div class="project-links">
                ${showDemoButton ? `<a href="${repo.homepage}" target="_blank" rel="noopener" class="project-link project-demo">View Demo</a>` : ''}
                <a href="${githubUrl}" target="_blank" rel="noopener" class="project-link">View on GitHub</a>
            </div>
        </div>
    `;

    // Animation handling
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

    container.appendChild(card);

    // Observe for animation after a short delay
    setTimeout(() => {
        if (typeof observer !== 'undefined') {
            observer.observe(card);
        } else {
            // Fallback: just show the card
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    }, 100);
}

function getRandomGradient(name) {
    const colors = [
        ['#ef4444', '#f87171'],
        ['#3b82f6', '#60a5fa'],
        ['#10b981', '#34d399'],
        ['#f59e0b', '#fbbf24'],
        ['#8b5cf6', '#a78bfa'],
        ['#ec4899', '#f472b6']
    ];
    // Use name hash to pick consistent color
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return `linear-gradient(135deg, ${colors[index][0]}, ${colors[index][1]})`;
}

// Handle project images - hide placeholder when image loads successfully
document.addEventListener('DOMContentLoaded', () => {
    // Clear existing static projects and fetch from GitHub
    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid) {
        // Remove static project cards but keep achievements
        const staticProjects = projectsGrid.querySelectorAll('.project-card');
        staticProjects.forEach(card => card.remove());

        // Fetch and display GitHub projects
        fetchGitHubProjects();
    }

    // Handle image loading for dynamically added projects
    setTimeout(() => {
        const projectImages = document.querySelectorAll('.project-image img');
        projectImages.forEach(img => {
            img.addEventListener('load', function () {
                const placeholder = this.nextElementSibling;
                if (placeholder && placeholder.classList.contains('project-placeholder')) {
                    placeholder.style.display = 'none';
                }
            });
            img.addEventListener('error', function () {
                this.style.display = 'none';
                const placeholder = this.nextElementSibling;
                if (placeholder && placeholder.classList.contains('project-placeholder')) {
                    placeholder.style.display = 'flex';
                }
            });
        });
    }, 500);
});

