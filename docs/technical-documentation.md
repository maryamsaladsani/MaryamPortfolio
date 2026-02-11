# Technical Documentation

## Overview

This portfolio website demonstrates advanced web development skills including API integration, state management, dynamic content, form validation, and theme switching. Built entirely with vanilla HTML, CSS, and JavaScript—no frameworks or build tools required.

---

## Technologies Used

| Area | Technology | Purpose |
|------|------------|---------|
| **Frontend** | HTML5 | Semantic structure, accessibility, SEO |
| | CSS3 | Responsive design, animations, theme system, CSS Grid/Flexbox |
| | JavaScript (ES6+) | Interactivity, API calls, state management, DOM manipulation |
| **External APIs** | GitHub REST API | Fetch and display repositories dynamically |
| | EmailJS | Send contact form emails without a backend |
| **Development Tools** | IntelliJ IDEA | Primary IDE for development and testing |
| | Git & GitHub | Version control and source management |
| **Deployment** | Vercel | Hosting and continuous deployment |

---

## File Structure

```
assignment-4/
├── index.html                  # Main HTML file with semantic structure
├── css/
│   ├── styles.css              # Base styles, CSS reset, variables, utilities
│   ├── theme.css               # Theme toggle, navigation, light/dark modes
│   ├── hero.css                # Hero section with animated photo border
│   ├── greeting-modal.css      # Welcome modal for first-time visitors
│   ├── skills.css              # About section and skills cards
│   ├── projects.css            # GitHub projects grid and cards
│   ├── volunteering.css        # Horizontal timeline component
│   └── contact.css             # Contact form and validation states
├── js/
│   ├── theme.js                # Dark/light mode toggle with persistence
│   ├── greeting.js             # Personalized greeting and welcome modal
│   ├── github-api.js           # GitHub API integration with caching
│   ├── volunteering.js         # Timeline interaction and filtering
│   ├── contact.js              # Form validation and EmailJS integration
│   └── scroll-progress.js      # Scroll progress indicator
├── assets/
│   └── images/
│       ├── mainImage/          # Profile photo
│       ├── skillsLogos/        # Technology icons
│       └── contactIcons/       # Social media icons
└── docs/
    ├── ai-usage-report.md      # Detailed AI usage documentation
    └── technical-documentation.md
```

---

## Architecture Decisions

### CSS Architecture

**Modular Approach**: CSS is split into 8 focused files rather than one monolithic stylesheet. This improves maintainability, reduces merge conflicts, and allows for easier debugging.

**CSS Custom Properties**: All colors, spacing, typography, and effects are defined as CSS variables in `:root`, enabling:
- Easy theme switching (light/dark mode)
- Consistent design tokens across components
- Single source of truth for design values

```css
:root {
    --color-bg-primary: #00343a;
    --color-accent: #fd3866;
    --space-4: 1rem;
    --radius-lg: 0.75rem;
    /* ... */
}
```

**Mobile-First Responsive Design**: Base styles target mobile devices, with `@media (min-width: ...)` queries adding complexity for larger screens.

### JavaScript Architecture

**IIFE Module Pattern**: Each JavaScript file uses an Immediately Invoked Function Expression to prevent global namespace pollution:

```javascript
(function() {
    'use strict';
    // Module code encapsulated here
    function init() { /* ... */ }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
```

**Benefits**:
- No global variables (except intentional ones)
- Each module is self-contained
- Modules can be loaded in any order
- Easy to test and maintain

---

## API Integration

### GitHub API

**Endpoint**: `https://api.github.com/users/maryamsaladsani/repos`

**Implementation Details**:

| Feature | Implementation |
|---------|----------------|
| **Filtering** | Excludes forked repositories (`repo.fork === false`) |
| **Sorting** | By `updated_at` descending (most recent first) |
| **Limiting** | Displays top 6 repositories |
| **Caching** | 5-minute localStorage cache to reduce API calls |
| **Rate Limiting** | Handles 403 errors with informative messages |

**Data Flow**:
```
Page Load → Check Cache → Cache Valid? 
    ├── Yes → Render from cache → Background refresh
    └── No  → Show loading → Fetch API → Cache → Render
```

**Error Handling**:
- Loading spinner while fetching
- Error message with retry button on failure
- Graceful "No repositories found" state
- Rate limit detection with reset time display

**Code Location**: `js/github-api.js`

### EmailJS Integration

**Purpose**: Send contact form submissions without a backend server.

**Implementation**:
- Lazy initialization (waits for EmailJS script to load)
- Multiple retry attempts for initialization
- Async/await for clean error handling

**Code Location**: `js/contact.js`

---

## Complex Logic Breakdown

### 1. Welcome Modal System

**File**: `js/greeting.js`

**Purpose**: Create a personalized first-visit experience.

**Logic Flow**:
```
Page Load → Check localStorage for 'username'
    ├── null (first visit) → Show welcome modal
    │       ├── User enters name → Save to localStorage → Close modal
    │       └── User skips → Save empty string → Close modal
    └── exists → Display personalized greeting
```

**Features**:
- Time-based greeting (morning/afternoon/evening/night)
- Modal with backdrop blur and animations
- Input validation with shake animation on error
- Keyboard support (Escape to close, Enter to submit)
- Prevents body scroll when modal is open

### 2. Contact Form Validation

**File**: `js/contact.js`

**Validation Rules**:

| Field | Rule | Regex/Logic |
|-------|------|-------------|
| Name | 2-100 characters | `length >= 2 && length <= 100` |
| Email | Valid email format | `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` |
| Message | 10-2000 characters | `length >= 10 && length <= 2000` |

**Validation Timing**:
- `blur` event: Validate when user leaves field
- `input` event: Re-validate only if field already has error (reduces noise)
- `submit` event: Validate all fields before sending

**User Feedback**:
- Inline messages below each field
- Red border on invalid fields
- Green checkmark on valid fields
- Focus moves to first invalid field on submit

**State Persistence**:
- Saves valid name/email to localStorage
- Pre-fills form for returning visitors

### 3. Volunteering Timeline

**File**: `js/volunteering.js`

**Features**:

| Feature | Implementation |
|---------|----------------|
| **Expand/Collapse** | Click to toggle description visibility |
| **Auto-Close** | Opening one item closes all others |
| **Filtering** | "All" and "Current" filter buttons |
| **Keyboard Support** | Enter/Space to toggle items |
| **Responsive** | Scrolls to center item on mobile |

**Accessibility**:
- `role="button"` on timeline items
- `aria-expanded` attribute updated dynamically
- `tabindex="0"` for keyboard navigation

### 4. Theme System

**File**: `js/theme.js`

**Default**: Dark mode

**Logic**:
```
Page Load → Check localStorage for 'theme'
    ├── 'light' → Apply light theme
    ├── 'dark' → Apply dark theme
    └── null → Default to dark (not system preference)
```

**Implementation Details**:
- Toggles `.theme-light` class on `<html>` element
- Updates button icon (🌙 ↔ ☀️)
- Updates `<meta name="theme-color">` for mobile browsers
- Listens for system preference changes (only if no saved preference)

### 5. Scroll Progress Indicator

**File**: `js/scroll-progress.js`

**Calculation**:
```javascript
const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
```

**Performance Optimization**:
- Uses `requestAnimationFrame` for throttling
- Passive event listener (`{ passive: true }`)
- `will-change: width` for GPU acceleration

---

## State Management

### localStorage Keys

| Key | Module | Purpose | Example Value |
|-----|--------|---------|---------------|
| `theme` | theme.js | User's theme preference | `"light"` or `"dark"` |
| `username` | greeting.js | Saved name for greeting | `"Maryam"` |
| `contact_name` | contact.js | Pre-fill contact form | `"John Doe"` |
| `contact_email` | contact.js | Pre-fill contact form | `"john@example.com"` |
| `github_repos_cache` | github-api.js | Cached API response | `{data: [...], timestamp: 123456}` |

### Storage Safety

All modules check localStorage availability before use:

```javascript
function canUseStorage() {
    try {
        const testKey = '__test__';
        localStorage.setItem(testKey, '1');
        localStorage.removeItem(testKey);
        return true;
    } catch (e) {
        return false;
    }
}
```

This handles cases where localStorage is disabled or in private browsing mode.

---

## Accessibility Features

| Feature | Implementation |
|---------|----------------|
| **Skip Link** | Hidden link at top of page, visible on focus, jumps to main content |
| **Semantic HTML** | Proper use of `<header>`, `<main>`, `<section>`, `<nav>`, `<article>` |
| **ARIA Labels** | Social links have `aria-label` for screen readers |
| **ARIA Live Regions** | Form status and greeting use `aria-live="polite"` |
| **Keyboard Navigation** | All interactive elements accessible via keyboard |
| **Focus Indicators** | Custom `:focus-visible` styles for keyboard users |
| **Color Contrast** | Text meets WCAG AA contrast requirements |
| **Reduced Motion** | Respects `prefers-reduced-motion` media query |

---

## Performance Optimizations

### Loading Strategy

| Resource | Strategy |
|----------|----------|
| **CSS** | Loaded in `<head>` (render-blocking, but small files) |
| **JavaScript** | `defer` attribute for non-blocking load |
| **Images** | `loading="lazy"` for below-fold images |
| **External Scripts** | EmailJS loaded with `defer` |

### Runtime Optimizations

| Optimization | Location | Benefit |
|--------------|----------|---------|
| **Passive Event Listeners** | scroll-progress.js | Smoother scrolling |
| **requestAnimationFrame** | scroll-progress.js | 60fps scroll indicator |
| **Debounced Resize** | volunteering.js | Reduces layout thrashing |
| **API Response Caching** | github-api.js | Fewer network requests |
| **CSS will-change** | scroll progress bar | GPU acceleration |

### Lighthouse Scores

| Metric | Desktop | Mobile  |
|--------|---------|---------|
| **Performance** | 100/100 | 97/100  |
| **Accessibility** | 92/100  | 92/100  |
| **Best Practices** | 100/100 | 100/100 |
| **SEO** | 100/100 | 100/100 |

---

## Browser Compatibility

**Tested Browsers**:
- Chrome
- Safari 
- Edge 

**CSS Fallbacks**:
- `clamp()` with fallback fixed values
- Vendor prefixes for `backdrop-filter`
- Scrollbar styling for Firefox (`scrollbar-width`, `scrollbar-color`)

**JavaScript Features Used**:
- ES6+ (const, let, arrow functions, template literals)
- Async/await
- Fetch API
- localStorage
- Custom Events

---

## Security Considerations

| Concern | Mitigation |
|---------|------------|
| **XSS in GitHub Data** | `escapeHtml()` function sanitizes all API data |
| **XSS in User Input** | Name input sanitized, special characters stripped |
| **External Links** | `rel="noopener noreferrer"` on all external links |
| **API Keys** | EmailJS public key is safe for client-side use |

---

## Future Improvements

1. **Service Worker**: Add offline support and caching
2. **Intersection Observer**: Lazy-load sections as they enter viewport
3**Dark Mode Images**: Serve different images per theme

---

**Last Updated**: December 2025