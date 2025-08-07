import { useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import './CubeChatLauncher.css'

// 3D Cube Component
function AnimatedCube() {
  const meshRef = useRef()
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.2
      meshRef.current.position.y = Math.sin(t * 0.5) * 0.02
    }
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[0.04, 0.04, 0.04]} />
      <meshStandardMaterial
        color="#000"
        roughness={1}
        metalness={0}
      />
    </mesh>
  )
}

// Chat Message Component
function ChatMessage({ message, isUser }) {
  return (
    <div className={`chat-message ${isUser ? 'user' : 'bot'}`}>
      <div className="message-content">
        {message}
      </div>
    </div>
  )
}

// Main Component
export default function CubeChatLauncher({
  cubeImageUrl,
  widthCollapsed = 300,
  heightCollapsed = 200,
  widthExpanded = 500,
  heightExpanded = '80vh'
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')

  const handleInputFocus = () => {
    setIsOpen(true)
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (inputValue.trim()) {
      setMessages(prev => [...prev, { text: inputValue, isUser: true }])
      // Simulate bot response
      setTimeout(() => {
        setMessages(prev => [...prev, { text: "I'm processing your request...", isUser: false }])
      }, 500)
      setInputValue('')
    }
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <div 
      className={`cube-chat-launcher ${isOpen ? 'expanded' : 'collapsed'}`}
      style={{
        '--width-collapsed': `${widthCollapsed}px`,
        '--height-collapsed': `${heightCollapsed}px`,
        '--width-expanded': `${widthExpanded}px`,
        '--height-expanded': heightExpanded
      }}
    >
      {/* Collapsed State */}
      {!isOpen && (
        <div className="collapsed-content">
          <img 
            src={cubeImageUrl} 
            alt="Cube" 
            className="static-cube"
          />
          <input
            type="text"
            placeholder="Chat with the box..."
            className="seed-input"
            onFocus={handleInputFocus}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
      )}

      {/* Expanded State */}
      {isOpen && (
        <div className="expanded-content">
          {/* Top-right 3D Cube */}
          <div className="cube-canvas-container">
            <Canvas camera={{ position: [0, 0, 0.1] }}>
              <ambientLight intensity={0.2} />
              <directionalLight position={[1, 1, 1]} intensity={0.8} />
              <AnimatedCube />
            </Canvas>
            <button className="close-button" onClick={handleClose}>
              ×
            </button>
          </div>

          {/* Chat Messages */}
          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="welcome-message">
                <p>Welcome! How can I help you today?</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  message={message.text}
                  isUser={message.isUser}
                />
              ))
            )}
          </div>

          {/* Input Area */}
          <form className="chat-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Type your message..."
              className="chat-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              autoFocus
            />
            <button type="submit" className="send-button">
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  )
}