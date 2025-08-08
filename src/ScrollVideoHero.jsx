import React, { useEffect, useRef, useState, useMemo } from 'react';
import './ScrollVideoHero.css';

const ScrollVideoHero = () => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
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

  const openChat = () => {
    setIsChatOpen(true);
    // prevent background scroll
    document.body.style.overflow = 'hidden';
  };

  const closeChat = () => {
    setIsChatOpen(false);
    document.body.style.overflow = '';
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
            <div className="message-container" onClick={openChat} role="button" tabIndex={0}>
              <input 
                type="text" 
                className="message-input" 
                placeholder="Type your message here..." 
              />
              <button className="send-button">
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
            <button className="jade-chat-button" onClick={openChat}>
              Talk to Jade
            </button>
          </div>
        </div>
      </section>

      {/* Full-screen chat overlay */}
      <div className={`chat-overlay ${isChatOpen ? 'open' : ''}`} aria-hidden={!isChatOpen}>
        <button className="chat-close" onClick={closeChat} aria-label="Close chat">×</button>
        {/* Background layer handled in CSS; we only need content */}

        <div className="overlay-content">
          {/* Suggestion Cards */}
          <div className="suggestions-grid">
            {suggestions.map((q, idx) => (
              <button key={idx} className={`suggestion-card s${idx + 1}`}>
                <span className="suggestion-text">{q}</span>
                <span className="suggestion-arrow">→</span>
              </button>
            ))}
          </div>

          {/* Rolling message bar */}
          <div className="overlay-message-bar">
            <input className="overlay-input" placeholder="Ask about our service..." />
            <button className="overlay-send">→</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollVideoHero;
