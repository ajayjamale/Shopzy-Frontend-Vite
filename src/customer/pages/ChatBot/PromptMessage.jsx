const PromptMessage = ({ message }) => {
  return (
    <div className="prompt-message">
      <div className="prompt-bubble">{message}</div>

      <style>{`
        .prompt-message {
          display: flex;
          justify-content: flex-end;
          margin: 6px 0;
          animation: fadeSlideIn 0.25s ease;
        }
        .prompt-bubble {
          background: #18181b;
          color: #fafafa;
          border-radius: 16px 16px 0 16px;
          padding: 10px 14px;
          font-size: 14px;
          line-height: 1.6;
          max-width: 75%;
          font-family: 'Georgia', serif;
          letter-spacing: 0.1px;
          word-break: break-word;
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
export default PromptMessage
