import React, { useEffect, useRef, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import './ScrollVideoHero.css';

const ScrollVideoHero = () => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [revealedCards, setRevealedCards] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [clickedElement, setClickedElement] = useState(null);
  const overlayRef = useRef(null);
  const morphElementRef = useRef(null);
  useEffect(() => {
    const handleScroll = () => {
      if (!videoRef.current) return;

      const video = videoRef.current;
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Calculate scroll progress as a percentage of total scrollable distance
      const maxScroll = documentHeight - windowHeight;
      const progress = Math.max(0, Math.min(1, scrollY / maxScroll));
      
      setScrollProgress(progress);

      // Update video time based on scroll progress with smoother interpolation
      if (video.duration && video.readyState >= 1) {
        const targetTime = progress * video.duration;
        const currentTime = video.currentTime;
        
        // Use requestAnimationFrame for smoother video updates
        const updateVideoTime = () => {
          if (Math.abs(targetTime - currentTime) > 0.033) { // ~30fps threshold
            video.currentTime = targetTime;
          }
        };
        requestAnimationFrame(updateVideoTime);
      }
    };

    // Load video metadata to get duration
    const video = videoRef.current;
    const handleLoadedMetadata = () => {
      handleScroll(); // Initial call
    };

    if (video) {
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('canplay', handleLoadedMetadata);
    }

    // Throttle scroll events for smoother performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      window.removeEventListener('resize', handleScroll);
      if (video) {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('canplay', handleLoadedMetadata);
      }
    };
  }, []);

  // Work out which section the user is on to provide contextual suggestions
  const activeSection = useMemo(() => {
    if (scrollProgress < 0.35) return 'hero';
    return 'solutions';
  }, [scrollProgress]);

  const suggestionSets = useMemo(
    () => ({
      hero: [
        'What is the difference between Local AI and Cloud AI?',
        'How secure is on-premise AI vs cloud-based solutions?',
        'Can you integrate with our existing data systems?'
      ],
      solutions: [
        'Which AI solution fits my business needs best?',
        'How long does a typical on-premise deployment take?',
        'What are the costs compared to SaaS AI tools?',
        'Can models be customized for our workflows?'
      ]
    }),
    []
  );

  const suggestions = suggestionSets[activeSection];

  const openChat = (event, elementType = 'default') => {
    // Capture click position and element info for morphing
    const clickedRect = event.currentTarget.getBoundingClientRect();
    const clickData = {
      type: elementType,
      rect: clickedRect,
      x: clickedRect.left + clickedRect.width / 2,
      y: clickedRect.top + clickedRect.height / 2,
      width: clickedRect.width,
      height: clickedRect.height
    };
    
    setClickedElement(clickData);
    setIsTransitioning(true);
    
    // GSAP Timeline for liquid metal transition
    const tl = gsap.timeline({
      onComplete: () => {
        setIsTransitioning(false);
        const overlayInput = document.querySelector('.overlay-input');
        if (overlayInput) overlayInput.focus();
      }
    });

    // Prevent background scroll
    document.body.style.overflow = 'hidden';

    // Phase 1: Create and animate morphing element
    if (morphElementRef.current) {
      gsap.set(morphElementRef.current, {
        left: clickData.x,
        top: clickData.y,
        width: clickData.width,
        height: clickData.height,
        x: '-50%',
        y: '-50%',
        borderRadius: '50px',
        opacity: 1,
        scale: 1
      });

      // Morph element animation
      tl.to(morphElementRef.current, {
        duration: 0.4,
        left: '50vw',
        top: '70vh',
        width: clickData.width * 1.5,
        height: clickData.height * 1.2,
        scale: 1.1,
        borderRadius: '60px',
        ease: "power2.out"
      })
      .to(morphElementRef.current, {
        duration: 0.6,
        left: '50vw',
        top: 'calc(100vh - 80px)',
        width: 'min(1000px, 92vw)',
        height: '64px',
        borderRadius: '999px',
        scale: 1,
        ease: "power3.inOut"
      })
      .to(morphElementRef.current, {
        duration: 0.2,
        opacity: 0,
        scale: 1.05,
        ease: "power2.out"
      });
    }

    // Phase 2: Liquid metal reveal (parallel with morph)
    if (overlayRef.current) {
      const centerX = (clickData.x / window.innerWidth) * 100;
      const centerY = (clickData.y / window.innerHeight) * 100;
      
      gsap.set(overlayRef.current, {
        clipPath: `circle(0% at ${centerX}% ${centerY}%)`,
        opacity: 1
      });

      tl.to(overlayRef.current, {
        duration: 0.3,
        clipPath: `circle(20% at ${centerX}% ${centerY}%)`,
        ease: "power2.out"
      }, 0.2)
      .to(overlayRef.current, {
        duration: 0.8,
        clipPath: `circle(150% at 50% 50%)`,
        ease: "power3.inOut"
      }, 0.4);
    }

    // Phase 3: Fade out other elements
    const elementsToFade = ['.video-background', '.header', '.hero', '.second-section'];
    elementsToFade.forEach(selector => {
      const element = document.querySelector(selector);
      if (element) {
        tl.to(element, {
          duration: 0.6,
          opacity: 0.3,
          filter: 'blur(2px)',
          ease: "power2.out"
        }, 0);
      }
    });

    // Phase 4: Show chat overlay
    tl.call(() => {
      setIsChatOpen(true);
    }, [], 0.5);
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setChatInput('');
    setRevealedCards(0);
    setIsTransitioning(false);
    setClickedElement(null);
    document.body.style.overflow = '';
  };

  const handleChatInputChange = (e) => {
    const value = e.target.value;
    setChatInput(value);
    
    // Count words (split by spaces, filter out empty strings)
    const wordCount = value.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    // Progressive reveal logic
    let cardsToReveal = 0;
    if (value.length > 0) cardsToReveal = 1; // First card on any input
    if (wordCount >= 2) cardsToReveal = 2;   // Second card after 2 words
    if (wordCount >= 3) cardsToReveal = 3;   // Third card after 3 words
    if (wordCount >= 4) cardsToReveal = 4;   // Fourth card after 4 words
    
    // GSAP-powered card reveal animation
    if (cardsToReveal > revealedCards) {
      // Animate new cards
      for (let i = revealedCards; i < cardsToReveal; i++) {
        const card = document.querySelector(`.suggestion-card.s${i + 1}`);
        if (card) {
          gsap.fromTo(card, {
            opacity: 0,
            rotateY: -90,
            rotateX: -20,
            scale: 0.6,
            z: -100
          }, {
            duration: 0.8,
            opacity: 1,
            rotateY: 0,
            rotateX: 0,
            scale: 1,
            z: 0,
            ease: "back.out(1.7)",
            delay: i * 0.2
          });
        }
      }
    }
    
    setRevealedCards(cardsToReveal);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeChat();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return (
    <div ref={containerRef} className="scroll-video-container">
      {/* Video Background */}
      <div className="video-background">
        <video
          ref={videoRef}
          className="background-video"
          muted
          playsInline
          preload="metadata"
        >
          <source src="./Videos/Rotating Hand V1.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Header Navigation */}
      <header className="header">
        <nav className="nav">
          <div className="nav-left">
            <div className={`nav-container ${scrollProgress > 0 ? 'collapsed' : ''}`}>
              <a href="/" className="logo">JDA</a>
              
              <div className="nav-sections">
                <div className="nav-group">
                  <h3>Solution</h3>
                  <div className="nav-links">
                    <a href="#">Local AI System</a>
                    <a href="#">How It Works</a>
                    <a href="#">Use Cases</a>
                  </div>
                </div>
                
                <div className="nav-group">
                  <h3>Company</h3>
                  <div className="nav-links">
                    <a href="#">About</a>
                    <a href="#">Our Process</a>
                    <a href="#">Why Choose Us</a>
                  </div>
                </div>
                
                <div className="nav-group">
                  <h3>Get Started</h3>
                  <div className="nav-links">
                    <a href="#">Discovery Call</a>
                    <a href="#">FAQ</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section 
        className="hero"
        style={{
          opacity: Math.max(0, 1 - scrollProgress * 1),
          transform: `translateY(${scrollProgress * 30}px)`
        }}
      >
        <div className="hero-content">
          <h1 className="hero-text">
            We implement local AI<br />
            for businesses with<br />
            sensitive data
          </h1>
          
          {/* Message Entry Box - now part of hero */}
          <div className="message-box">
            <div className="message-container" onClick={(e) => openChat(e, 'hero-message')} role="button" tabIndex={0}>
              <input 
                type="text" 
                className="message-input" 
                placeholder="Type your message here..."
                onClick={(e) => openChat(e, 'hero-message')}
                readOnly
              />
              <button className="send-button" onClick={(e) => openChat(e, 'hero-message')}>
                Send
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Second Section - appears on scroll */}
      <section 
        className="second-section"
        style={{
          opacity: scrollProgress > 0.4 ? Math.min(1, (scrollProgress - 0.4) * 1.67) : 0,
          transform: `translateY(${Math.max(0, (1 - scrollProgress) * 30)}px)`
        }}
      >
        <div className="second-content">
          <h2>Our AI Solutions</h2>
          <p>Discover how our local AI implementations can transform your business without exposing your sensitive data to external risks.</p>
          
          {/* Talk to Jade Button */}
          <div className="jade-chat-bubble">
            <button className="jade-chat-button" onClick={(e) => openChat(e, 'jade-button')}>
              Talk to Jade
            </button>
          </div>
        </div>
      </section>

      {/* GSAP-powered morphing transition element */}
      {isTransitioning && (
        <div 
          ref={morphElementRef}
          className="gsap-morph-element"
        />
      )}

      {/* Full-screen chat overlay */}
      <div 
        ref={overlayRef}
        className={`chat-overlay ${isChatOpen ? 'open' : ''}`} 
        aria-hidden={!isChatOpen}
      >
        <button className="chat-close" onClick={closeChat} aria-label="Close chat">×</button>
        
        <div className="overlay-content">
          {/* Suggestion Cards */}
          <div className="suggestions-grid">
            {suggestions.map((q, idx) => (
              <button 
                key={idx} 
                className={`suggestion-card s${idx + 1}`}
                style={{ opacity: 0 }} // GSAP controls visibility
              >
                <span className="suggestion-text">{q}</span>
                <span className="suggestion-arrow">→</span>
              </button>
            ))}
          </div>

          {/* Rolling message bar */}
          <div className="overlay-message-bar">
            <input 
              className="overlay-input" 
              placeholder="Ask about our service..." 
              value={chatInput}
              onChange={handleChatInputChange}
            />
            <button className="overlay-send">→</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollVideoHero;
