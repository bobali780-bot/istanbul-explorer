'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [showPrompt, setShowPrompt] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! 👋 I'm your Istanbul travel assistant. Ask me anything about places to visit, neighborhoods, dining, shopping, or activities in Istanbul!"
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Ensure component is mounted (for portal)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Hide prompt after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPrompt(false)
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.response
        }])
      } else {
        // Show actual error message for debugging
        const errorMsg = data.error || "I'm sorry, I encountered an error. Please try again."
        console.error('Chat API error:', data)
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Error: ${errorMsg}`
        }])
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting. Please try again in a moment."
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const suggestedQuestions = [
    "What are the top 5 must-see attractions?",
    "Best restaurants in Sultanahmet?",
    "Where should I go shopping?",
    "Family-friendly activities?",
    "Hidden gems in Beyoğlu?"
  ]

  // Don't render on server or before mount
  if (!mounted) return null

  const chatbotContent = (
    <>
      {/* Backdrop overlay - clicking closes chat */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9998,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            pointerEvents: 'auto'
          }}
        />
      )}

      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          pointerEvents: 'auto',
          transform: 'translateZ(0)',
          willChange: 'transform'
        }}
        className="chatbot-container-fixed"
      >
      {/* Chat Button with animations */}
      {!isOpen && (
        <div className="relative">
          {/* Speech Bubble */}
          {showPrompt && (
            <div className="absolute bottom-full right-0 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="relative bg-white rounded-lg shadow-xl p-3 pr-8 whitespace-nowrap">
                <button
                  onClick={() => setShowPrompt(false)}
                  className="absolute top-1 right-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3 h-3" />
                </button>
                <p className="text-sm font-medium text-gray-900">
                  👋 Need help exploring Istanbul?
                </p>
                <p className="text-xs text-gray-600">Click here to chat!</p>
                {/* Arrow */}
                <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white transform rotate-45"></div>
              </div>
            </div>
          )}

          {/* Bouncing Button */}
          <Button
            onClick={() => {
              setIsOpen(true)
              setShowPrompt(false)
            }}
            size="lg"
            className="relative rounded-full w-16 h-16 shadow-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 animate-bounce"
            style={{
              animation: 'bounce 2s infinite'
            }}
          >
            <MessageCircle className="w-6 h-6" />
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-75"></span>
          </Button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="w-96 h-[600px] shadow-2xl flex flex-col animate-in slide-in-from-bottom-4 duration-300 bg-white overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <CardTitle className="text-lg">Istanbul AI Assistant</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 break-words ${
                      msg.role === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions (only show at start) */}
            {messages.length === 1 && (
              <div className="p-4 border-t bg-gray-50">
                <p className="text-xs text-gray-600 mb-2 font-semibold">Try asking:</p>
                <div className="space-y-1">
                  {suggestedQuestions.slice(0, 3).map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setInput(q)
                        handleSend()
                      }}
                      className="block w-full text-left text-xs text-purple-600 hover:text-purple-800 hover:bg-purple-50 p-2 rounded transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about Istanbul..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      </div>
    </>
  );

  // Use portal to render at body level
  return createPortal(chatbotContent, document.body);
}
