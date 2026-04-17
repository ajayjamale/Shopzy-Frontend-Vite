import { useEffect, useState } from 'react'
const ResponseMessage = ({ message }) => {
  const safeMessage = message || ''
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    const interval = setInterval(() => {
      if (i < safeMessage.length) {
        setDisplayed(safeMessage.slice(0, i + 1))
        i++
      } else {
        setDone(true)
        clearInterval(interval)
      }
    }, 18)
    return () => clearInterval(interval)
  }, [safeMessage])
  return (
    <div className="response-message">
      <div className="response-avatar">S</div>
      <div className="response-bubble">
        <span>{displayed}</span>
        {!done && <span className="typing-cursor">|</span>}
      </div>

      <style>{`
        .response-message {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin: 6px 0;
          max-width: 80%;
          animation: fadeSlideIn 0.3s ease;
        }
        .response-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #1a1a1a;
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
          font-family: 'Georgia', serif;
          letter-spacing: 0.5px;
        }
        .response-bubble {
          background: #f4f4f5;
          border: 1px solid #e4e4e7;
          border-radius: 0 16px 16px 16px;
          padding: 10px 14px;
          font-size: 14px;
          line-height: 1.6;
          color: #18181b;
          font-family: 'Georgia', serif;
          letter-spacing: 0.1px;
        }
        .typing-cursor {
          display: inline-block;
          margin-left: 2px;
          color: #71717a;
          animation: blink 0.7s step-end infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
export default ResponseMessage
