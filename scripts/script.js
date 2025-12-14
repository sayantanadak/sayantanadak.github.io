// Init on load
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('yearNow').textContent = new Date().getFullYear();
    setupCTA();
    setupBrandReset();
    updateLayoutOffset();
    fetchLastUpdated();
});

let isTransitioning = false;

function setupCTA() {
    document.querySelectorAll('[data-load]').forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.getAttribute('data-load');
            loadContent(page, page);
        });
    });
}

function setupBrandReset(){
    const brand = document.getElementById('homeBrand');
    if(!brand) return;
    brand.addEventListener('click', e => {
        e.preventDefault();
        if(isTransitioning) return;
        const overlay = document.getElementById('contentArea');
        const shell = overlay.querySelector('.content-shell');
        if(!document.body.classList.contains('content-active')) return;
        isTransitioning = true;
        shell.classList.remove('content-entering');
        shell.classList.add('content-exiting');
        const finish = () => {
            shell.removeEventListener('animationend', finish);
            document.body.classList.remove('content-active');
            clearContent();
            clearActive();
            isTransitioning = false;
        };
        shell.addEventListener('animationend', finish, { once:true });
        setTimeout(()=> { if(isTransitioning) finish(); }, 600);
    });
}

// Load content partials
function loadContent(pageId, activeId) {
    if(isTransitioning) return;
    const overlay = document.getElementById('contentArea');
    const shell = overlay.querySelector('.content-shell');
    const firstLoad = !document.body.classList.contains('content-active') || !shell.innerHTML.trim();

    const doFetch = () => {
        overlay.classList.remove('loaded');
        shell.classList.remove('content-exiting');
        shell.classList.add('content-entering');
        shell.innerHTML = '<div class="text-center py-5 text-secondary"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>';
        fetch(`pages/${pageId}.html`)
            .then(r => { if(!r.ok) throw new Error('Network response was not ok'); return r.text(); })
            .then(html => {
                shell.innerHTML = html;
                document.body.classList.add('content-active');
                requestAnimationFrame(() => {
                    overlay.classList.add('loaded');
                    shell.classList.remove('content-entering');
                    animateCards();
                    // If we loaded the Skills partial, ensure its renderer script is loaded and executed.
                    try {
                        if (activeId === 'skills') {
                            if (!window._skillsRendererLoaded) {
                                const s = document.createElement('script');
                                s.src = '/scripts/renderSkills.js';
                                s.onload = () => {
                                    window._skillsRendererLoaded = true;
                                    if (typeof renderSkills === 'function') renderSkills();
                                };
                                document.body.appendChild(s);
                            } else if (typeof renderSkills === 'function') {
                                renderSkills();
                            }
                        }
                    } catch (e) { console.warn('Failed to init skills renderer', e); }
                    // projects extra features removed (reverted)
                });
                setActive(activeId);
            })
            .catch(err => { shell.innerHTML = `<div class=\"alert alert-danger m-3\">Failed to load content: ${err.message}</div>`; console.error(err); })
            .finally(()=> { isTransitioning = false; });
    };

    if(firstLoad){ isTransitioning = true; doFetch(); collapseIfMobile(); return; }

    isTransitioning = true;
    shell.classList.remove('content-entering');
    shell.classList.add('content-exiting');
    const afterExit = () => { shell.removeEventListener('animationend', afterExit); doFetch(); };
    shell.addEventListener('animationend', afterExit, { once:true });
    setTimeout(()=> { if(isTransitioning) afterExit(); }, 500);
    collapseIfMobile();
}

function setActive(activeId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.id === activeId);
    });
    updateNavIndicator();
}

function clearActive(){
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    updateNavIndicator();
}

function clearContent(){
    const overlay = document.getElementById('contentArea');
    if(!overlay) return;
    overlay.classList.remove('loaded');
    const shell = overlay.querySelector('.content-shell');
    shell.innerHTML = '';
}

function collapseIfMobile() {
    /* no-op: legacy from previous collapsing navbar */
}

function addNavListener(elementId, pageId) {
    const el = document.getElementById(elementId); if(!el) return;
    el.addEventListener('click', e => { e.preventDefault(); loadContent(pageId, elementId); });
}

['aboutMe','skills','workplace','projects','blogs'].forEach(id => {
    const map = { aboutMe: 'about_me', skills: 'skills', workplace: 'workplace', projects: 'projects', blogs: 'blogs' };
    addNavListener(id, map[id]);
});

// Animated background highlight for nav selection
function updateNavIndicator(){
    const highlight = document.getElementById('navActiveBg');
    if(!highlight) return;
    if(window.innerWidth < 992){ highlight.style.opacity = 0; return; }
    const active = document.querySelector('.nav-link.active');
    if(!active){ highlight.style.opacity = 0; highlight.style.width = 0; return; }
    const container = document.getElementById('navLinks');
    const rect = active.getBoundingClientRect();
    const crect = container.getBoundingClientRect();
    const left = rect.left - crect.left;
    const top = rect.top - crect.top;
    const width = rect.width;
    const height = rect.height;
    highlight.style.opacity = 1;
    highlight.style.left = left + 'px';
    highlight.style.top = top + 'px';
    highlight.style.width = width + 'px';
    highlight.style.height = height + 'px';
}

window.addEventListener('resize', () => { updateNavIndicator(); });
window.addEventListener('orientationchange', () => { updateNavIndicator(); });
window.addEventListener('resize', () => { updateLayoutOffset(); });
window.addEventListener('orientationchange', () => { updateLayoutOffset(); });

function updateLayoutOffset(){
    const header = document.querySelector('.site-header');
    const footer = document.querySelector('footer');
    if(!footer) return;
    // Floating nav is fixed and shouldn't reduce hero height; keep minimal header height
    const headerHeight = header ? header.offsetHeight : 0;
    const total = headerHeight + footer.offsetHeight + 32;
    document.documentElement.style.setProperty('--layout-offset', total + 'px');
}

// Intersection observer for card reveal
function animateCards() {
    const cards = document.querySelectorAll('#contentArea .card');
    if(!('IntersectionObserver' in window)) { cards.forEach(c => c.classList.add('in-view')); return; }
    const obs = new IntersectionObserver(entries => {
        entries.forEach(en => { if(en.isIntersecting) { en.target.classList.add('in-view'); obs.unobserve(en.target);} });
    }, { threshold: .15 });
    cards.forEach(c => obs.observe(c));
}

// (Carousel logic removed – grid view now used for skills.)

// (project enhancements removed)

// ===== Last updated (GitHub commit date) =====
function fetchLastUpdated(){
    const el = document.getElementById('lastUpdated');
    if(!el) return;
    // GitHub API: latest commit on main for this repo
    fetch('https://api.github.com/repos/sayantanadak/sayantanadak.github.io/commits?sha=main&per_page=1')
        .then(r => { if(!r.ok) throw new Error(r.status); return r.json(); })
        .then(data => {
            if(!Array.isArray(data) || !data.length) throw new Error('No commits');
            const iso = data[0].commit.committer.date;
            const d = new Date(iso);
            const formatted = d.toLocaleDateString(undefined, { year:'numeric', month:'short', day:'2-digit'});
            el.textContent = formatted;
        })
        .catch(()=> { el.textContent = new Date().toLocaleDateString(); });
}