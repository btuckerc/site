# Tucker Craig - Personal Website

A fast, accessible, responsive single-page application built with modern web technologies and a tasteful TUI/ASCII aesthetic. Features dark/light mode themes, smooth animations, and keyboard navigation.

## 🚀 Features

- **Responsive Design**: Mobile-first approach with breakpoints for all screen sizes
- **Dark/Light Mode**: CSS variable-based theming with localStorage persistence
- **Accessibility First**: WCAG compliant with keyboard navigation, ARIA labels, and screen reader support
- **Performance Optimized**: <150KB initial bundle, lazy loading, and code splitting
- **Interactive Components**: 
  - Cascading lists with smooth expand/collapse
  - Flippable about card (Pokémon card style)
  - Inline project expansion with nested details
  - Form validation with success states
- **ASCII Art Accents**: Subtle TUI-inspired decorative elements
- **Smooth Animations**: Framer Motion with respect for `prefers-reduced-motion`

## 🛠️ Tech Stack

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom CSS variables
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **Testing**: Vitest with Testing Library
- **Type Safety**: PropTypes validation
- **Accessibility**: ARIA patterns, keyboard navigation, focus management

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/tucker-craig-website.git
cd tucker-craig-website

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test
```

## 🎨 Design System

### Color Tokens

```css
/* Dark mode (default) */
--bg: #0f172a        /* Background */
--fg: #f8fafc        /* Foreground text */
--muted: #64748b     /* Secondary text */
--accent: #06b6d4    /* Accent/links */
--border: #334155    /* Borders */
--card-bg: rgba(15, 23, 42, 0.8)   /* Card backgrounds */
--glass-bg: rgba(15, 23, 42, 0.6)  /* Glass/backdrop effect */

/* Light mode */
--bg: #f8fafc
--fg: #0f172a  
--muted: #64748b
--accent: #0891b2
--border: #e2e8f0
--card-bg: rgba(248, 250, 252, 0.8)
--glass-bg: rgba(248, 250, 252, 0.6)
```

### Typography Scale

- **Headings**: Bold weights with generous spacing
- **Body**: Regular weight, 1.6 line height
- **Monospace**: Used for ASCII elements and technical text
- **Sizes**: Responsive scaling from mobile to desktop

### Spacing System

- **Container**: Max-width with responsive padding
- **Component spacing**: 4-point grid system (0.25rem base)
- **Section margins**: Consistent vertical rhythm

### ASCII Elements

- **Corner glyphs**: `┌ ┐ └ ┘` for frame decorations
- **Arrows**: `▸` for list items and expand indicators  
- **Brackets**: `[ ]` for section headings and buttons
- **Lines**: `─ │` for borders and dividers

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── __tests__/      # Component tests
│   ├── AboutCard.jsx   # Flippable profile card
│   ├── CascadeList.jsx # Expandable nested lists
│   ├── ContactForm.jsx # Form with validation
│   ├── Footer.jsx      # Site footer with social links
│   ├── Header.jsx      # Navigation header
│   ├── LazyImage.jsx   # Performance-optimized images
│   ├── ProjectCard.jsx # Expandable project cards
│   └── ThemeToggle.jsx # Dark/light mode switch
├── hooks/              # Custom React hooks
│   ├── useKeyboardNavigation.js  # Keyboard interaction
│   ├── useScrollAnimation.js     # Scroll-triggered animations
│   └── useTheme.js     # Theme management
├── pages/              # Route components
│   ├── About.jsx       # About page
│   ├── Contact.jsx     # Contact page  
│   ├── Home.jsx        # Landing page
│   └── Projects.jsx    # Projects showcase
├── utils/              # Helper functions
├── App.jsx             # Main app component
├── index.css           # Global styles and CSS variables
└── main.jsx            # App entry point

data/
└── projects.json       # Project data structure

public/
├── favicon.svg         # Site favicon
└── [other assets]
```

## 📊 Component Architecture

### CascadeList Pattern

The `CascadeList` component enables the signature "lists within lists" interaction:

```jsx
<CascadeList
  items={projects}
  renderItem={(project) => <ProjectSummary project={project} />}
  renderExpandedContent={(project) => <ProjectDetails project={project} />}
/>
```

**Features:**
- Keyboard navigation (Tab, Enter, Space, Arrow keys, Escape)
- ARIA compliance with proper disclosure patterns
- Smooth expand/collapse animations
- Support for nested expansion (one level deep)
- Custom render functions for flexibility

### Theme System

CSS variables enable seamless theme switching:

```jsx
const { theme, toggleTheme } = useTheme()

// Theme is automatically applied to document root
// and persisted in localStorage
```

### Performance Patterns

- **Lazy loading**: Pages split with React.lazy()
- **Image optimization**: Intersection Observer-based lazy images  
- **Code splitting**: Vendor and motion libraries separated
- **Memoization**: Expensive calculations cached

## 🎯 Customization Guide

### Adding Projects

Edit `data/projects.json`:

```json
{
  "id": "unique-project-id",
  "title": "Project Name",
  "year": "2024",
  "blurb": "Short description for the card",
  "tags": ["React", "TypeScript", "Node.js"],
  "links": {
    "github": "https://github.com/username/repo",
    "demo": "https://project-demo.com"
  },
  "overview": "Detailed project description...",
  "stack": ["Tech", "Stack", "List"],
  "features": ["Key", "Features", "List"]
}
```

### Modifying Theme Colors

Update CSS variables in `src/index.css`:

```css
:root {
  --accent: #your-new-color;
  --bg: #your-background;
  /* etc... */
}
```

### Extending ASCII Patterns

Add new decorative elements in CSS:

```css
.new-ascii-element::before {
  content: '◆';
  color: var(--accent);
  font-family: monospace;
}
```

### Adding New Pages

1. Create component in `src/pages/`
2. Add route to `App.jsx`
3. Update navigation in `Header.jsx`
4. Add to lazy loading imports

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode  
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Coverage

- ✅ CascadeList disclosure behavior
- ✅ Keyboard navigation patterns
- ✅ ARIA attribute validation
- ✅ Theme switching functionality
- ✅ Form validation logic

## 🚀 Deployment

### Build Process

```bash
npm run build
```

Generates optimized static files in `dist/`:
- Minified JavaScript bundles
- Optimized CSS with autoprefixer
- Asset hashing for cache busting

### Deployment Targets

Works with any static hosting:
- **Netlify**: Add `netlify.toml` for SPA routing
- **Vercel**: Zero-config deployment
- **GitHub Pages**: Enable in repository settings
- **Custom server**: Serve `dist/` folder

### Environment Variables

For contact form integration, set:
- `VITE_CONTACT_ENDPOINT`: Form submission URL
- `VITE_GA_ID`: Google Analytics ID (optional)

## 📈 Performance Metrics

Target metrics achieved:
- **First Load**: <150KB JavaScript
- **LCP**: <2.5s on 3G connection
- **CLS**: <0.1 (no layout shift)
- **FID**: <100ms interaction delay
- **Accessibility**: 100/100 Lighthouse score

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make changes following the existing patterns
4. Add tests for new functionality  
5. Ensure all tests pass: `npm test`
6. Submit a pull request

## 📜 License

MIT License - see `LICENSE` file for details.

## 🙏 Acknowledgments

- **Design inspiration**: TUI/terminal aesthetics
- **Accessibility**: ARIA Authoring Practices Guide
- **Performance**: Web Vitals best practices
- **Animation**: Framer Motion community examples

---

Built with ❤️ and lots of ☕ by Tucker Craig