// js/script.js
// Combined site script: nav, animations, forms, project filtering/modals, AND video modal

document.addEventListener('DOMContentLoaded', function() {
    /* ------------------ Mobile navigation toggle ------------------ */
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    /* ------------------ Smooth scrolling for anchors ------------------ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    /* ------------------ Navbar background on scroll ------------------ */
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    /* ------------------ Animate elements on scroll ------------------ */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe skill cards and project cards for animation
    document.querySelectorAll('.skill-card, .project-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    /* ------------------ Typing effect for hero title ------------------ */
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.innerHTML;
        heroTitle.innerHTML = '';
        heroTitle.style.borderRight = '2px solid #ffd700';
        
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                heroTitle.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                setTimeout(() => {
                    heroTitle.style.borderRight = 'none';
                }, 1000);
            }
        }
        
        setTimeout(typeWriter, 1000);
    }

    /* ------------------ Parallax effect for hero ------------------ */
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            // gentle parallax: use transform but keep it subtle and safe on mobile
            hero.style.transform = `translateY(${scrolled * 0.05}px)`;
        }
    });

    /* ------------------ Contact form handling ------------------ */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = document.querySelector('.form-submit');
            const submitText = document.querySelector('.submit-text');
            const submitLoading = document.querySelector('.submit-loading');
            const formMessage = document.getElementById('formMessage');
            
            // Show loading state
            if (submitBtn) submitBtn.disabled = true;
            if (submitText) submitText.style.display = 'none';
            if (submitLoading) submitLoading.style.display = 'inline';
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Simulate form submission (replace with actual form handler)
            setTimeout(() => {
                // Reset button
                if (submitBtn) submitBtn.disabled = false;
                if (submitText) submitText.style.display = 'inline';
                if (submitLoading) submitLoading.style.display = 'none';
                
                // Show success message
                if (formMessage) {
                    formMessage.style.display = 'block';
                    formMessage.className = 'form-message success';
                    formMessage.textContent = 'Thank you for your message! I\'ll get back to you soon.';
                }
                
                // Reset form
                contactForm.reset();
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    if (formMessage) formMessage.style.display = 'none';
                }, 5000);
                
            }, 2000); // Simulate 2 second delay
        });
    }

    /* ------------------ Form validation on blur/input ------------------ */
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = '#dc3545';
            } else {
                this.style.borderColor = '#ddd';
            }
        });

        input.addEventListener('input', function() {
            // Reset red border when user starts typing
            if (this.style.borderColor === 'rgb(220, 53, 69)' || this.style.borderColor === '#dc3545') {
                this.style.borderColor = '#ddd';
            }
        });
    });

    /* ------------------ Project filtering ------------------ */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cat = card.getAttribute('data-category') || '';
                if (filterValue === 'all' || cat.includes(filterValue)) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    /* ------------------ Bind live-demo links (video popup) ------------------ */
    // This function will be declared below; call it here after DOM elements exist
    // (binding code is defined later in this file)
    // If modal element exists, binding happens; else no-op.
});

/* ------------------ Project modal functions (outside DOMContentLoaded so other handlers can call) ------------------ */
function openProjectModal(projectId) {
    const modal = document.getElementById(projectId + '-modal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeProjectModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        closeProjectModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeProjectModal();
    }
});

/* ------------------ Fade in animation for filtered projects ------------------ */
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

/* ------------------ Video Modal: supports local video files and YouTube ------------------ */
/*
  Usage:
  - Add modal HTML once per page (before </body>):
    <div id="videoModal" class="video-modal" aria-hidden="true" role="dialog" aria-label="Video preview">
      <div class="video-modal-content" role="document">
        <button class="modal-close" aria-label="Close video">&times;</button>
        <div class="video-container"></div>
      </div>
    </div>

  - Add data-video attributes to Live Demo links:
    <a href="#" class="project-link live-demo" data-video="videos/train_demo.mp4">Live Demo</a>
    or
    <a href="#" class="project-link live-demo" data-video="https://www.youtube.com/watch?v=VIDEO_ID">Live Demo</a>
*/

(function setupVideoModal() {
    const modal = document.getElementById('videoModal');
    if (!modal) {
        // No modal on page — nothing to do. If you want the modal, paste the modal HTML.
        return;
    }

    const container = modal.querySelector('.video-container');
    const closeBtn = modal.querySelector('.modal-close');

    // Convert YouTube watch URL (or youtu.be) -> embed URL with autoplay
    function youtubeEmbedUrl(url) {
        try {
            const u = new URL(url);
            const host = u.hostname.toLowerCase();
            if (host.includes('youtu.be')) {
                const id = u.pathname.slice(1);
                if (!id) return null;
                return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
            }
            if (host.includes('youtube.com')) {
                const v = u.searchParams.get('v');
                if (v) return `https://www.youtube.com/embed/${v}?autoplay=1&rel=0`;
            }
        } catch (err) {
            // not a valid absolute URL; treat as file path
        }
        return null;
    }

    function openVideo(src) {
        if (!src) return console.warn('openVideo called without src');

        // clear previous content
        container.innerHTML = '';

        const yt = youtubeEmbedUrl(src);
        if (yt) {
            const iframe = document.createElement('iframe');
            iframe.setAttribute('src', yt);
            iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
            iframe.setAttribute('allowfullscreen', '');
            iframe.setAttribute('title', 'Video player');
            container.appendChild(iframe);
        } else {
            // assume it's a direct video file path (mp4/webm/ogg)
            const video = document.createElement('video');
            video.setAttribute('controls', '');
            video.setAttribute('playsinline', ''); // mobile
            video.style.background = '#000';

            const source = document.createElement('source');
            source.src = src;

            // guess mime-type by extension
            const lower = src.toLowerCase();
            if (lower.endsWith('.webm')) source.type = 'video/webm';
            else if (lower.endsWith('.ogv') || lower.endsWith('.ogg')) source.type = 'video/ogg';
            else source.type = 'video/mp4';

            video.appendChild(source);
            container.appendChild(video);

            // try to autoplay — may be blocked if not muted
            video.load();
            const p = video.play();
            if (p !== undefined) {
                p.catch(() => {
                    // autoplay prevented — user will press play
                });
            }
        }

        // Show modal
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
        closeBtn.focus();
        document.body.style.overflow = 'hidden';
    }

    function closeVideo() {
        const media = container.firstElementChild;
        if (media) {
            const tag = media.tagName.toLowerCase();
            if (tag === 'video') {
                try {
                    media.pause();
                    media.removeAttribute('src');
                    while (media.firstChild) media.removeChild(media.firstChild);
                } catch (e) { /* ignore */ }
            } else if (tag === 'iframe') {
                try { media.src = ''; } catch (e) { /* ignore */ }
            }
        }

        container.innerHTML = '';
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Close button
    closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeVideo();
    });

    // Click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeVideo();
    });

    // ESC to close
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeVideo();
        }
    });

    // Bind live-demo links (prevents double-binding)
    function bindLiveDemoLinks(root = document) {
        root.querySelectorAll('.live-demo').forEach(link => {
            if (link.dataset.videoBound) return;
            link.dataset.videoBound = 'true';

            link.addEventListener('click', (e) => {
                e.preventDefault();
                const src = link.getAttribute('data-video');
                if (!src) {
                    console.warn('No data-video attribute on live-demo link.');
                    return;
                }
                openVideo(src);
            });
        });
    }

    // initial bind
    bindLiveDemoLinks();

    // Expose binder in case content is added dynamically later:
    window.bindLiveDemoLinks = bindLiveDemoLinks;
})();
