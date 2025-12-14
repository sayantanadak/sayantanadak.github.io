async function renderSkills() {
  try {
    const res = await fetch('/data/skills.json');
    if (!res.ok) throw new Error('Failed to fetch skills.json');
    const skills = await res.json();
    const grid = document.querySelector('.skills-grid');
    if (!grid) return;
    grid.innerHTML = '';
    skills.forEach(s => {
      const card = document.createElement('div');
      card.className = 'card skill-card-modern';
      card.innerHTML = `
        <div class="card-bg" style="background-image: url('${s.bgImage}')"></div>
        <div class="card-body p-3 d-flex flex-column">
          <h6 class="skill-title mb-2"><span class="skill-chip ${s.chipClass}">${s.title}</span></h6>
          <ul class="skill-points small mb-0">
            ${s.bullets.map(b => `<li>${b}</li>`).join('\n')}
          </ul>
        </div>
      `;
      grid.appendChild(card);
    });
  } catch (err) {
    console.error('renderSkills error', err);
  }
}

// Attach to DOMContentLoaded so this also works when pages are loaded dynamically
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderSkills);
} else {
  renderSkills();
}
