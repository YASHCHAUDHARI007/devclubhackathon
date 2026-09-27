# AURA MOTORS

### Performance, Reimagined.

AURA MOTORS is a futuristic premium electric vehicle website concept built entirely with **HTML, CSS, and vanilla JavaScript**.

The project presents AURA as a next-generation electric performance automobile company, combining cinematic visuals, interactive vehicle configuration, performance telemetry, technology showcases, interior exploration, and a premium automotive UI.

> **AURA MOTORS — Electric Performance Reimagined.**

---

## ✨ Features

### 🚘 Premium Automotive Experience

* Cinematic full-screen hero section
* Premium dark automotive aesthetic
* Futuristic typography and visual hierarchy
* Responsive design across desktop, tablet, and mobile
* Custom cursor interaction on supported desktop devices
* Smooth scrolling using Lenis
* Scroll-based animations and reveal effects
* Parallax visual effects
* Liquid-glass / 3D card interactions
* Page transition effects

### ⚡ Performance Showcase

The performance experience includes:

* 0–100 km/h acceleration visualization
* Live-style launch telemetry
* Speed indicators
* G-force visualization
* Performance metrics
* Animated vehicle performance data

### 🎨 Vehicle Configurator

The AURA configurator allows users to customize their vehicle through an interactive interface.

Users can configure:

* Exterior color
* Wheel package
* Interior suite
* Technology package
* Track dynamics package

The configurator dynamically calculates the estimated vehicle price.

Configurations are stored locally using browser `localStorage`, allowing the selected configuration to persist between visits.

### 🧠 Technology Experience

The technology section presents AURA's fictional technology platform through an interactive storytelling interface.

Highlights include:

* AURA Drive OS
* Neural driving intelligence
* Adaptive suspension
* LiDAR vision
* 900V architecture
* Ultra-fast charging
* Interactive technology story sections

### 🛋️ Interior Experience

The interior section presents:

* Digital cockpit
* Curved OLED display
* Spatial audio
* Premium vegan materials
* Interior configuration switching
* Interactive interior visuals

### 🌱 Sustainability

The sustainability experience focuses on:

* Circular materials
* Sustainable manufacturing
* Electric mobility
* Battery lifecycle
* Responsible material choices

### 📩 Experience & Contact

The contact experience provides a premium automotive concierge-style interface for:

* Test-drive requests
* Vehicle interest
* Customer information
* Newsletter subscription

The current forms are **frontend demonstration interfaces** and do not connect to a production backend.

---

# 📄 Website Pages

| Page           | File                  | Purpose                           |
| -------------- | --------------------- | --------------------------------- |
| Overview       | `index.html`          | Main AURA MOTORS experience       |
| Models         | `models.html`         | AURA vehicle lineup               |
| The Car        | `the-car.html`        | Vehicle design and engineering    |
| Performance    | `performance.html`    | Performance and telemetry         |
| Technology     | `technology.html`     | Vehicle technology                |
| Interior       | `interior.html`       | Interior and cockpit              |
| Configurator   | `configurator.html`   | Vehicle customization             |
| Sustainability | `sustainability.html` | Sustainability vision             |
| Experience     | `contact.html`        | Contact and test-drive experience |

---

# 🧱 Project Structure

```text
devclubhackathon/
│
├── assets/
│   ├── chassis.jpg
│   ├── cta.jpg
│   ├── hero.jpg
│   ├── interior.jpg
│   ├── interior_ivory.jpg
│   ├── lenis.min.js
│   ├── profile.jpg
│   ├── profile_blue.jpg
│   ├── profile_silver.jpg
│   ├── profile_white.jpg
│   └── sustainability.jpg
│
├── index.html
├── models.html
├── the-car.html
├── performance.html
├── technology.html
├── interior.html
├── configurator.html
├── sustainability.html
├── contact.html
│
├── style.css
└── script.js
```

---

# 🛠️ Tech Stack

AURA MOTORS intentionally uses a lightweight, framework-free architecture.

### Frontend

* **HTML5**
* **CSS3**
* **Vanilla JavaScript (ES6+)**

### Browser APIs & Technologies

* Intersection Observer API
* Web Audio API
* `requestAnimationFrame`
* `localStorage`
* CSS Custom Properties
* CSS animations and transitions
* Responsive media queries

### Smooth Scrolling

* **Lenis**

Lenis is included locally at:

```text
assets/lenis.min.js
```

No frontend framework is required.

---

# 🎨 Design System

The interface follows a premium dark automotive design language.

### Core Colors

```css
Background: #050505
Surface:    #0B0B0B
Cards:      #111111
Text:       #F5F5F5
Muted:      #858585
Accent:     #00E5FF
```

### Typography

The project uses:

* **Inter**
* **Space Grotesk**

Inter is primarily used for readable interface text, while Space Grotesk is used for stronger display and automotive branding elements.

---

# 🚀 Getting Started

Because the project uses static HTML, CSS, and JavaScript, no framework installation or build process is required.

## 1. Clone the repository

```bash
git clone https://github.com/YASHCHAUDHARI007/devclubhackathon.git
```

## 2. Enter the project

```bash
cd devclubhackathon
```

## 3. Run the website

You can open `index.html` directly in a browser.

For the best development experience, use a local server.

### VS Code Live Server

Install the **Live Server** extension and open:

```text
index.html
```

Then select:

```text
Open with Live Server
```

### Python local server

If Python is installed:

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

---

# 🧩 Architecture

The project follows a simple shared-asset architecture.

```text
HTML Pages
     │
     ├── Shared Navigation
     ├── Shared Footer
     ├── Shared Components
     │
     ▼
 style.css
     │
     └── Global Design System
     
 script.js
     │
     ├── Navigation
     ├── Mobile Drawer
     ├── Smooth Scrolling
     ├── Scroll Reveal
     ├── Parallax
     ├── Custom Cursor
     ├── Liquid Glass
     ├── Performance Telemetry
     ├── Configurator
     ├── Model Comparison
     ├── Technology Story
     ├── Modal
     └── Forms
```

The JavaScript is intentionally written as reusable initialization functions so individual features can safely activate only when their corresponding DOM elements exist.

---

# ⚙️ Interactive Systems

## Smooth Scrolling

Lenis provides the primary smooth-scrolling experience.

The project also uses native browser APIs as fallbacks where necessary.

---

## Scroll Reveal

Sections and cards can enter the viewport using `IntersectionObserver`.

This avoids requiring a large animation library for basic scroll-reveal behavior.

---

## Custom Cursor

Desktop devices with a fine pointer can use the custom AURA cursor.

The cursor consists of:

* Cursor dot
* Cursor ring
* Hover interaction states

Touch devices do not require the custom cursor.

---

## Liquid Glass

Interactive cards use a custom liquid-glass visual system.

It combines:

* Transparency
* Borders
* Glow
* Blur
* Mouse positioning
* 3D tilt
* Highlight effects

The effect is implemented with CSS and vanilla JavaScript rather than a UI framework.

---

## Web Audio

AURA includes an optional synthetic electric propulsion sound experience.

The user can enable or disable the sound through the audio control interface.

Audio is intentionally opt-in rather than automatically playing on page load.

---

# 🚗 AURA Vehicle Lineup

The fictional AURA lineup contains three vehicle concepts:

### AURA S

The endurance-focused touring model.

### AURA GT

The flagship performance model.

Key concept specifications presented by the website include:

```text
800 HP
2.8 sec 0–100 km/h
620 km WLTP range
```

### AURA X

The track-focused performance model.

The website presents it as the highest-performance model in the lineup.

---

# 💰 Configurator

The configurator starts with a fictional base vehicle price of:

```text
₹89,00,000
```

Users can modify:

```text
Exterior Color
Wheels
Interior
Technology Package
Track Dynamics Package
```

The final price is calculated dynamically.

Example:

```text
Base Vehicle
      +
Selected Options
      =
Estimated Configuration Price
```

The selected configuration is stored using:

```text
localStorage
```

with the application configuration key:

```text
aura_configuration
```

---

# 📱 Responsive Design

The website is designed to adapt to:

```text
Mobile
Tablet
Laptop
Desktop
Large Desktop
```

The navigation changes into a mobile drawer on smaller screens.

The design uses CSS media queries rather than a responsive UI framework.

---

# ♿ Accessibility

The project includes several accessibility-oriented features, including:

* Semantic HTML
* ARIA labels
* Accessible navigation labels
* Alternative text for images
* Keyboard-accessible buttons
* `aria-live` status areas
* Reduced-motion considerations
* Mobile navigation state attributes

Accessibility remains an ongoing area for improvement as the interaction layer becomes more advanced.

---

# ⚡ Performance

The project is intentionally built without a large frontend framework.

Current performance-oriented techniques include:

* `IntersectionObserver`
* `requestAnimationFrame`
* Lazy loading for below-the-fold images
* Async image decoding
* Transform-based animations
* Local Lenis asset
* Conditional desktop cursor behavior
* CSS animations
* Browser-native APIs

Images used below the fold generally use:

```html
loading="lazy"
decoding="async"
```

Hero imagery is prioritized separately.

---

# 🔮 Future Improvements

Potential future improvements include:

* Native ES module-based JavaScript architecture
* More aggressive image optimization
* WebP / AVIF image variants
* Advanced focus management for modals
* Improved mobile navigation focus trapping
* Better animation scheduling
* More robust reduced-motion handling
* Production backend for forms
* Real test-drive booking system
* Real newsletter integration
* Advanced vehicle configurator
* Vehicle 3D visualization
* Production analytics
* Automated accessibility testing
* Lighthouse performance optimization
* SEO structured data
* Progressive page transitions

---

# 🧪 Development Guidelines

When contributing to this project:

### Keep it Vanilla

Do not introduce a frontend framework unless the architecture is intentionally being redesigned.

Preferred:

```text
HTML
CSS
JavaScript
```

Avoid unnecessary dependencies.

### Preserve the Design System

Use the existing:

```text
#050505
#0B0B0B
#111111
#F5F5F5
#858585
#00E5FF
```

visual language unless there is a strong reason to change it.

### Prefer Native Browser APIs

Before adding a library, check whether the functionality can be implemented with:

* IntersectionObserver
* ResizeObserver
* Web Audio API
* CSS animations
* CSS custom properties
* requestAnimationFrame
* localStorage
* View Transition API

### Avoid Breaking Existing Interactions

Changes should be tested across all pages because `style.css` and `script.js` are shared across the website.

---

# 🌐 Deployment

The project is a static website and can be deployed on platforms such as:

* Vercel
* Netlify
* GitHub Pages
* Cloudflare Pages
* Any static web server

No server-side runtime is required for the current demo.

---

# 📌 Project Status

**Status:** Active Development

AURA MOTORS is currently a frontend-focused automotive web experience and concept project.

The current implementation focuses on:

* Visual storytelling
* Interactive UI
* Automotive branding
* Performance visualization
* Vehicle configuration
* Responsive design
* Vanilla frontend engineering

Backend integrations are not currently part of the core implementation.

---

# 👨‍💻 Project

**AURA MOTORS**

> Performance, Reimagined.

Built as a futuristic electric vehicle web experience using vanilla web technologies.

---

## License

This project is currently a personal/educational project.

No explicit open-source license is currently included in the repository. If this project is intended to be reused or distributed publicly, add an appropriate `LICENSE` file.
