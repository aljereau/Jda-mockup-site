# JDA Website - AI Assistant Development Guide

## Project Overview

A modern React website featuring scroll-controlled video background for JDA Local AI implementations. The site showcases a scroll-linked video hero section with dynamic navigation and smooth animations.

## Key Components

### ScrollVideoHero (`src/ScrollVideoHero.jsx`)
- **Main Component**: Handles scroll-linked video playback and animations
- **Video Sync**: Video progress tied to scroll position (0-100%)
- **Performance**: Uses `requestAnimationFrame` for smooth 60fps updates
- **Responsive**: Adaptive layout for desktop/tablet/mobile

### Navigation System
- **Auto-collapse**: Menu collapses when user starts scrolling  
- **Hover Effects**: White card background appears on collapsed menu hover
- **Structured Links**: Organized into Solution, Company, and Get Started sections

## Technology Stack

- **React 18** with hooks (useState, useEffect, useRef)
- **Vite** for development and build tooling
- **Three.js & React Three Fiber** (available but not currently used)
- **CSS3** with advanced animations and transforms
- **HTML5 Video** for scroll-synchronized playback

## Development Commands

```bash
# Start development server
npm run dev

# Build for production  
npm run build

# Preview production build
npm run preview
```

## File Structure

```
src/
├── App.jsx                 # Main app wrapper
├── App.css                 # Base application styles
├── main.jsx               # React entry point
├── ScrollVideoHero.jsx     # Core scroll-video component
├── ScrollVideoHero.css     # Component-specific styles
├── CubeChatLauncher.jsx    # 3D chat launcher (available)
└── CubeChatLauncher.css    # Chat launcher styles

Videos/
└── Rotating Hand V1.mp4   # Scroll-linked background video

Images/                    # Static assets
```

## Key Features & Animations

### Scroll Progress Calculation
```javascript
const maxScroll = documentHeight - windowHeight;
const progress = Math.max(0, Math.min(1, scrollY / maxScroll));
```

### Animation Timing
- **0% scroll**: Full hero visible, expanded navigation
- **>0% scroll**: Navigation collapses, hero begins fade
- **0-100% scroll**: Video plays in sync with scroll
- **40%+ scroll**: Second section ("Our AI Solutions") fades in

### Performance Optimizations
- Throttled scroll events with `requestAnimationFrame`
- Passive event listeners for smoother scrolling
- CSS `will-change` properties for hardware acceleration
- Video time updates limited to ~30fps threshold

## Browser Support

- Chrome 88+
- Firefox 85+  
- Safari 14+
- Edge 88+

## Available Dependencies

### Core
- `react` ^18.2.0
- `react-dom` ^18.2.0

### 3D Graphics (Ready for use)
- `three` ^0.158.0
- `@react-three/fiber` ^8.15.11
- `@react-three/drei` ^9.92.7

### Development
- `vite` ^5.0.8
- `@vitejs/plugin-react` ^4.2.1
- TypeScript types available for React and Three.js

## Design Principles

- **Glassmorphism**: Transparent elements with blur effects
- **Scroll-driven UX**: All interactions based on scroll behavior
- **Smooth Animations**: 60fps performance target
- **Minimalist Aesthetic**: Clean, professional design
- **Mobile-first**: Responsive breakpoints at 768px and 480px

## Development Notes

- Video path is relative: `./Videos/Rotating Hand V1.mp4`
- Scroll progress drives both video time and UI animations
- Navigation hover effects only active in collapsed state
- Hero content uses translateY transforms for parallax effect
- Second section uses opacity + transform for smooth reveal

## Future Enhancement Opportunities

- Integrate existing CubeChatLauncher component
- Add Three.js 3D elements for visual interest
- Implement chat functionality behind message input
- Add loading states for video content
- Consider lazy loading for performance

---

*This project demonstrates modern web animation techniques with React and scroll-driven interactions.*