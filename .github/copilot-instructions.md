# AI Coding Agent Instructions

## Project Overview
**Portfolio SPA** - A single-page application (SPA) for a Flutter/mobile engineer. Built with vanilla HTML/CSS/JS (no framework). Hosted on GitHub Pages with Bootstrap 5.

## Architecture & Data Flow

### Single-Page Application Pattern
- **Entry point**: [index.html](../index.html) - Static shell with header, floating navigation, hero section, and content placeholder
- **Dynamic loading**: [script.js](../scripts/script.js) loads page partials (HTML fragments) from `/pages/` directory on nav click
- **Page partials**: Each page (`about_me.html`, `skills.html`, `projects.html`, `workplace.html`, `blogs.html`) is a self-contained HTML fragment (NOT full documents) rendered into `#contentArea .content-shell`
- **Async skills renderer**: [renderSkills.js](../scripts/renderSkills.js) dynamically fetches JSON data and renders the skills grid when the skills page loads

### Key Components
1. **Navigation**: Fixed floating nav bar with animated highlight (`navActiveBg`) that tracks active page
2. **Content Area**: `#contentArea` overlay div that swaps page partials with CSS animations (`content-entering`, `content-exiting`)
3. **Skills System**: Reads from [data/skills.json](../data/skills.json) (structured as array of objects with title, chipClass, bgImage, bullets), renders as card grid with Intersection Observer animation
4. **Last Updated Footer**: Queries GitHub API to show latest commit date on main branch

## Critical Workflows & Conventions

### Adding/Modifying Pages
1. Create HTML fragment in `pages/` (NO `<html>`, `<head>`, `<body>` tags - just content elements)
2. Register nav link in [script.js](../scripts/script.js) around line 120: `['aboutMe','skills','workplace','projects','blogs'].forEach(...)`
3. Map the element ID to page name in the `map` object if naming differs
4. **Important**: Content is injected into `#contentArea .content-shell`, so use selectors expecting no parent layout constraints

### Updating Skills
- Edit [data/skills.json](../data/skills.json) directly
- Each skill object MUST have: `id`, `title`, `chipClass` (CSS class for color), `bgImage`, `bullets` (array of strings)
- Renderer dynamically creates cards with background image and bullet list
- New chipClass values require corresponding CSS in [style_global.css](../styles/style_global.css) (e.g., `.chip-sky`, `.chip-indigo`)

### Styling Approach
- **CSS Custom Properties**: Theme stored in `:root` (colors, spacing, shadows, gradients). Prefer updating variables over hardcoding values
- **Bootstrap 5 Classes**: Used for layout (flex, grid, responsive). Keep markup semantic with `.container`, `.row`, `.col-*`
- **Modern CSS**: Uses `clamp()` for responsive sizing, CSS Grid for skills layout, Intersection Observer for lazy card animation
- **Dark Mode**: Handled via `data-bs-theme="light"` on `<html>` tag; theme tokens switch on attribute change

### State & Event Flow
- **Global flag**: `isTransitioning` prevents rapid nav clicks during animation
- **Animation lifecycle**: Exit animation → fetch partial → enter animation → call `animateCards()` → conditionally load `renderSkills.js` if skills page
- **Window events**: Resize listeners update nav highlight position and layout offset (`--layout-offset` CSS var)

## External Dependencies
- **Bootstrap 5.3.3**: Via CDN for layout/utilities (no JS components used except spinner)
- **Bootstrap Icons 1.11.3**: Icon font via CDN
- **Google Fonts (Inter)**: For typography
- **GitHub API**: Fetched in `fetchLastUpdated()` - ensure repo path is correct when forking

## Common Pitfalls
- **Page fragments must be fragments**: Don't include doctype, html, head, body tags in `pages/*.html`
- **Paths are relative to domain root**: Use `/pages/`, `/data/`, `/scripts/`, `/styles/` (leading slash)
- **Skills renderer is lazy-loaded**: Only loads if user navigates to skills page (check `window._skillsRendererLoaded` flag)
- **Content injection target**: Always inject into `#contentArea .content-shell` - other DOM changes may break animation
- **Nav ID ↔ Page name mapping**: Update both the click listener AND the map object if adding new pages

## File Organization
```
index.html                      # SPA shell & hero
pages/                          # Page content fragments
  ├── about_me.html
  ├── skills.html              # Container with .skills-grid
  ├── projects.html
  ├── workplace.html
  └── blogs.html
data/
  └── skills.json              # Skills data source
scripts/
  ├── script.js                # SPA loader, nav, animations
  └── renderSkills.js          # Dynamic skills grid renderer
styles/
  ├── style_global.css         # Theme tokens, nav, animations, utilities
  └── style_projects.css       # Project-specific styles
assets/images/                 # Icons, backgrounds, hero image
```

## Testing & Validation
- No automated tests present. Manual testing via `python3 -m http.server 8000` (required to test GitHub API calls and avoid CORS)
- Verify nav highlight animation on resize
- Verify skills grid renders after fetching JSON
- Verify page transitions with and without CSS animation support
