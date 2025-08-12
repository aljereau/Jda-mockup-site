# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A modern React website featuring scroll-controlled video background for JDA Local AI implementations. The site showcases a scroll-linked video hero section with GSAP-powered liquid metal transitions, morphing animations, and dynamic navigation.

## Key Architecture

### Core Component Structure
- **App.jsx**: Simple wrapper component that renders the main ScrollVideoHero component
- **ScrollVideoHero.jsx**: Main component (430+ lines) handling all scroll-video synchronization, GSAP animations, and chat overlay functionality
- **CubeChatLauncher.jsx**: Secondary 3D chat component with Three.js/React Three Fiber (available but not integrated)

### Scroll-Video Synchronization System
The core innovation is in ScrollVideoHero.jsx:
- Video playback time is directly tied to scroll progress (0-100%)
- Uses `requestAnimationFrame` for smooth 60fps updates
- Throttled scroll events with passive listeners for performance
- Video time updates only when difference exceeds ~30fps threshold

### Animation System (GSAP-powered)
The component uses GSAP for complex liquid metal transitions:
- **Morphing elements**: Clicked elements morph into chat input with clip-path animations
- **Progressive reveals**: Chat suggestion cards animate in based on user input word count
- **Liquid metal overlay**: Full-screen chat uses radial clip-path expansion from click origin
- **3D card animations**: Uses rotateY, rotateX, and scale transforms with back.out easing

### State Management Pattern
Uses multiple useState hooks for complex state:
- `scrollProgress`: Controls video time and UI animations
- `isChatOpen`: Manages full-screen chat overlay
- `revealedCards`: Progressive revelation of suggestion cards
- `isTransitioning`: Controls GSAP morphing state
- `clickedElement`: Stores click position/dimensions for morphing

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build  

# Preview production build
npm run preview
```

## Technology Stack & Dependencies

### Core React
- `react` ^18.2.0 with hooks (useState, useEffect, useRef, useMemo)
- `react-dom` ^18.2.0

### 3D Graphics (Available)
- `three` ^0.158.0
- `@react-three/fiber` ^8.18.0  
- `@react-three/drei` ^9.122.0

### Animation
- `gsap` ^3.13.0 (used extensively for morphing transitions)

### Build Tools
- `vite` ^5.0.8 with React plugin
- TypeScript types available for React and Three.js

## Performance Optimizations

### Video Synchronization
- Video time updates throttled to ~30fps using `Math.abs(targetTime - currentTime) > 0.033`
- Uses `requestAnimationFrame` for smooth video seeking
- Passive scroll listeners to avoid blocking main thread

### GSAP Animation Performance
- Hardware-accelerated transforms (translateY, rotateY, rotateX, scale)
- CSS `will-change` properties for smooth animations
- Timeline-based animations to prevent animation conflicts

## Key Animation Patterns

### Scroll-Driven Animations
```javascript
// Video sync pattern
const progress = Math.max(0, Math.min(1, scrollY / maxScroll));
video.currentTime = progress * video.duration;

// UI element fade based on scroll
style={{ opacity: Math.max(0, 1 - scrollProgress * 1) }}
```

### GSAP Morphing Transitions
The chat opening animation uses a complex 3-phase GSAP timeline:
1. **Morphing element**: Animates from click position to final input position
2. **Liquid overlay**: Radial clip-path expansion from click origin
3. **Background blur**: Other elements fade and blur during transition

### Progressive Card Reveals
Cards animate in based on user input word count using 3D transforms:
```javascript
gsap.fromTo(card, {
  rotateY: -90, rotateX: -20, scale: 0.6
}, {
  rotateY: 0, rotateX: 0, scale: 1,
  ease: "back.out(1.7)"
});
```

## File Organization

```
src/
├── App.jsx                 # Main app wrapper (13 lines)
├── App.css                 # Base application styles  
├── main.jsx               # React entry point
├── ScrollVideoHero.jsx     # Core component (434 lines)
├── ScrollVideoHero.css     # Component-specific styles
├── CubeChatLauncher.jsx    # Alternative 3D chat component
└── CubeChatLauncher.css    # 3D chat component styles

Videos/
└── Rotating Hand V1.mp4   # Scroll-linked background video (key asset)
```

## Integration Notes

### Video Requirements
- Video must be placed in `public/Videos/` directory
- Currently uses `./Videos/Rotating Hand V1.mp4` 
- Video should have sufficient duration for scroll range
- Requires `preload="metadata"` for duration access

### 3D Component Integration
The CubeChatLauncher component is available but not integrated:
- Uses React Three Fiber for 3D cube rendering
- Has its own chat system with message state
- Could be integrated as alternative to current 2D chat system

### Responsive Considerations
- Navigation collapses at `scrollProgress > 0`
- Hero section opacity tied to scroll progress
- Second section appears at 40% scroll progress (`scrollProgress > 0.4`)
- Mobile breakpoints handled via CSS media queries

## Development Patterns

### Event Handling
- All scroll events use throttled `requestAnimationFrame`
- Click events capture position data for morphing animations
- Keyboard events (Escape key) for chat closing

### Animation Coordination
- Use GSAP timelines to coordinate complex multi-element animations
- Store click position data in state for morphing calculations
- Progressive reveals based on input word count logic

### Performance Monitoring
- Video time updates have built-in threshold checks
- Animation frame requests are properly cleaned up in useEffect
- Passive event listeners used where possible