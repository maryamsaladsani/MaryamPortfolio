# 💼 Maryam Aladsani - Portfolio Website

A modern, fully responsive portfolio website built with vanilla HTML, CSS, and JavaScript. This project demonstrates advanced web development concepts including API integration, state management, form validation, and theme switching.

## 🎯 Project Description

This portfolio website showcases my skills, projects, and volunteering experience as a Software Engineering student at KFUPM. Key features include:

| Feature | Description                                                     |
|---------|-----------------------------------------------------------------|
| 🔗 **GitHub API Integration** | Dynamically fetches and displays my latest repositories         |
| 💾 **State Management** | Uses localStorage for theme preferences, user data, and caching |
| ✅ **Form Validation** | Real-time contact form validation with inline feedback          |
| 🎨 **Theme System** | Dark/light mode toggle with system preference detection         |
| 📱 **Responsive Design** | Mobile-first approach optimized for all screen sizes            |
| ⚡ **Performance** | Lighthouse score of 98/100 on desktop and mobile                |
| ♿ **Accessibility** | ARIA attributes, keyboard navigation, skip links                |

---

## 🚀 How to Run Locally

### Option 1: Direct File Opening
```bash
# Clone the repository
git clone https://github.com/maryamsaladsani/assignment-4.git
cd assignment-4

# Open in browser
# Simply open index.html in your web browser
# No build process, dependencies, or server required! 🎉
```

---

## 📂 Project Structure

```
├── index.html              # Main HTML file
├── css/
│   ├── styles.css          # Base styles, variables, reset
│   ├── theme.css           # Theme toggle & navigation
│   ├── hero.css            # Hero section
│   ├── greeting-modal.css  # Welcome modal popup
│   ├── skills.css          # About & skills cards
│   ├── projects.css        # GitHub projects grid
│   ├── volunteering.css    # Timeline component
│   └── contact.css         # Contact form & validation
├── js/
│   ├── theme.js            # Dark/light mode toggle
│   ├── greeting.js         # Personalized greeting & modal
│   ├── github-api.js       # GitHub API integration
│   ├── volunteering.js     # Timeline interaction & filtering
│   ├── contact.js          # Form validation & EmailJS
│   └── scroll-progress.js  # Scroll progress indicator
├── assets/images/          # Images and icons
└── docs/
    ├── technical-documentation.md
    └── ai-usage-report.md
```

---

## 🤖 AI Tools Used (Summary)

**Primary Tool**: Claude (Anthropic)

Claude AI assisted with the following development tasks:

| Use Case | Description |
|----------|-------------|
| **Code Generation** | GitHub API integration, form validation, modal system |
| **CSS Architecture** | Modularizing 800+ lines into organized files |
| **JavaScript Patterns** | IIFE modules, async/await patterns, error handling |
| **Debugging** | Identifying and fixing edge cases |
| **Code Review** | Improving code quality and consistency |
| **Documentation** | Structuring technical documentation |

### Key Examples

1. **GitHub API**: Generated fetch logic with caching and retry functionality
2. **Form Validation**: Created real-time validation with inline feedback
3. **Theme Toggle**: Implemented localStorage persistence with system preference fallback
4. **Modal System**: Built accessible welcome modal with animations

### My Contributions
- Modified all AI-generated code to match my design system
- Added features not initially suggested (e.g., topics display, shake animations)
- Fixed edge cases and improved error messages
- Ensured accessibility compliance
- Tested across browsers and devices

📖 **See [docs/ai-usage-report.md](docs/ai-usage-report.md) for the complete AI usage log with prompts, outputs, edits, and learning outcomes.**

---

## ⚡ Performance Metrics

### Lighthouse Scores

| Metric | Desktop | Mobile  |
|--------|---------|---------|
| **Performance** | 100/100 | 97/100  |
| **Accessibility** | 92/100  | 92/100  |
| **Best Practices** | 100/100 | 100/100 |
| **SEO** | 100/100 | 100/100 |

---

## 🌐 Live Demo

🔗 **[View Live Site](https://maryamaladsani.site)**

---

## 🛠️ Technologies Used

| Category | Technologies |
|----------|--------------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) |
| **APIs** | GitHub REST API, EmailJS |
| **Tools** | IntelliJ IDEA, Git, Vercel |
| **Design** | CSS Custom Properties, Flexbox, Grid |

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| 📖 [Technical Documentation](docs/technical-documentation.md) | Architecture, file structure, and implementation details |
| 🤖 [AI Usage Report](docs/ai-usage-report.md) | Complete log of AI tool usage with prompts and learning outcomes |

---

## ✨ Features Breakdown

### Dynamic GitHub Projects
- Fetches repositories via GitHub API
- Filters out forks, sorts by recent activity
- Displays with loading state and error handling
- Caches results for 5 minutes

### Personalized Greeting
- First-visit modal asks for user's name
- Time-based greeting (morning/afternoon/evening)
- Saves to localStorage for returning visitors

### Contact Form
- Real-time validation with inline feedback
- EmailJS integration for actual email sending
- Remembers name/email for returning users

### Theme System
- Dark mode default with light mode option
- Persists preference in localStorage
- Updates mobile browser theme color

### Volunteering Timeline
- Horizontal scrolling timeline
- Click to expand for details
- Filter by current/all experiences

---

## 📫 Contact

| Platform | Link |
|----------|------|
| **Email** | maryamsaladsani@gmail.com |
| **GitHub** | [@maryamsaladsani](https://github.com/maryamsaladsani) |
| **LinkedIn** | [Maryam Aladsani](https://shorturl.at/3AFIq) |

---

## 📄 License

© 2025 Maryam Aladsani

---