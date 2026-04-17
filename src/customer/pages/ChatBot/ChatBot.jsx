import { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../context/AppContext'
import { chatBot, clearMessages } from '../../../store/customer/AiChatBotSlice'
import { IconButton } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import CloseIcon from '@mui/icons-material/Close'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import PromptMessage from './PromptMessage'
import ResponseMessage from './ResponseMessage'
const ChatBot = ({ handleClose, productId, mode = 'customer' }) => {
  const dispatch = useAppDispatch()
  const [prompt, setPrompt] = useState('')
  const chatBottomRef = useRef(null)
  const { aiChatBot } = useAppSelector((store) => store)
  const isSellerMode = mode === 'seller'
  const handleGivePrompt = (e) => {
    e.stopPropagation()
    if (!prompt.trim() || aiChatBot.loading) return
    dispatch(
      chatBot({
        prompt: {
          prompt: prompt.trim(),
        },
        productId,
        userId: null,
        mode,
      }),
    )
    setPrompt('')
  }
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleGivePrompt(e)
  }
  useEffect(() => {
    // Clear previous chat history every time the chatbot is opened
    dispatch(clearMessages())
  }, [dispatch])
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [aiChatBot.messages, aiChatBot.loading])
  return (
    <div style={styles.wrapper}>
      {/* ── Header ── */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.iconWrap}>
            <AutoAwesomeIcon
              style={{
                fontSize: 16,
                color: '#fff',
              }}
            />
          </div>
          <div>
            <p style={styles.headerTitle}>
              {isSellerMode ? 'Seller Assistant' : 'Shopzy Assistant'}
            </p>
            <p style={styles.headerSub}>
              {productId
                ? `Product #${productId}`
                : isSellerMode
                  ? 'Orders, products & settlements'
                  : 'Cart & order support'}
            </p>
          </div>
        </div>
        <IconButton onClick={handleClose} size="small" style={styles.closeBtn}>
          <CloseIcon
            style={{
              fontSize: 18,
              color: '#71717a',
            }}
          />
        </IconButton>
      </div>

      {/* ── Messages ── */}
      <div style={styles.messageArea}>
        <div style={styles.welcomeBadge}>
          {productId
            ? `Asking about product #${productId}`
            : isSellerMode
              ? 'Ask about your orders, returns, payouts, or inventory'
              : 'Ask me about your cart or order history'}
        </div>

        {aiChatBot.messages.map((item, index) =>
          item.role === 'user' ? (
            <PromptMessage key={index} message={item.message} index={index} />
          ) : (
            <ResponseMessage key={index} message={item.message} />
          ),
        )}

        {aiChatBot.loading && (
          <div style={styles.loadingWrap}>
            <span style={styles.dot} />
            <span
              style={{
                ...styles.dot,
                animationDelay: '0.15s',
              }}
            />
            <span
              style={{
                ...styles.dot,
                animationDelay: '0.3s',
              }}
            />
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* ── Input ── */}
      <div style={styles.inputArea}>
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          type="text"
          placeholder={isSellerMode ? 'Ask about your seller data...' : 'Ask something...'}
          style={styles.input}
        />
        <button
          onClick={handleGivePrompt}
          disabled={!prompt.trim() || aiChatBot.loading}
          style={{
            ...styles.sendBtn,
            opacity: prompt.trim() && !aiChatBot.loading ? 1 : 0.4,
            cursor: prompt.trim() && !aiChatBot.loading ? 'pointer' : 'not-allowed',
          }}
        >
          <SendIcon
            style={{
              fontSize: 17,
              color: '#fff',
            }}
          />
        </button>
      </div>

      <style>{`
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%            { transform: translateY(-5px); opacity: 1; }
        }
        .chatbot-scroll::-webkit-scrollbar { width: 4px; }
        .chatbot-scroll::-webkit-scrollbar-track { background: transparent; }
        .chatbot-scroll::-webkit-scrollbar-thumb { background: #e4e4e7; border-radius: 4px; }
      `}</style>
    </div>
  )
}
/* ── Inline styles ── */
const styles = {
  wrapper: {
    width: 'clamp(320px, 40vw, 480px)',
    height: '82vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 24px 64px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)',
    overflow: 'hidden',
    fontFamily: "'Georgia', serif",
    border: '1px solid #e4e4e7',
    position: 'relative',
    zIndex: 9999,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 16px',
    borderBottom: '1px solid #f4f4f5',
    background: '#fafafa',
    flexShrink: 0,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: '10px',
    background: '#18181b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerTitle: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 700,
    color: '#18181b',
    letterSpacing: '0.2px',
  },
  headerSub: {
    margin: 0,
    fontSize: '11px',
    color: '#71717a',
    marginTop: '1px',
  },
  closeBtn: {
    background: '#f4f4f5',
    borderRadius: '8px',
    padding: '4px',
  },
  messageArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  welcomeBadge: {
    alignSelf: 'center',
    background: '#f4f4f5',
    border: '1px solid #e4e4e7',
    position: 'relative',
    zIndex: 9999,
    borderRadius: '20px',
    padding: '5px 12px',
    fontSize: '11px',
    color: '#71717a',
    marginBottom: '10px',
    letterSpacing: '0.2px',
  },
  loadingWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '8px 4px',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: '#a1a1aa',
    display: 'inline-block',
    animation: 'dotBounce 1.2s ease-in-out infinite',
  },
  inputArea: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 14px',
    borderTop: '1px solid #f4f4f5',
    background: '#fafafa',
    gap: '8px',
    flexShrink: 0,
  },
  input: {
    flex: 1,
    border: '1px solid #e4e4e7',
    position: 'relative',
    zIndex: 9999,
    borderRadius: '10px',
    padding: '10px 14px',
    fontSize: '13.5px',
    background: '#fff',
    outline: 'none',
    color: '#18181b',
    fontFamily: "'Georgia', serif",
    transition: 'border-color 0.2s',
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: '10px',
    background: '#18181b',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'opacity 0.2s',
  },
}
export default ChatBot
