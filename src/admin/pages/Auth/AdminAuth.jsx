import React from 'react'
import AdminLoginForm from './AdminLogin'
const AdminAuth = () => {
  return (
    <>
      <style>{`
        .aa-page {
          min-height: 100vh;
          background: #0f1111;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
          font-family: Arial, sans-serif;
          position: relative;
          overflow: hidden;
        }

        .aa-page::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,153,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,153,0,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        .aa-page::after {
          content: '';
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,153,0,0.07) 0%, transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .aa-card {
          position: relative;
          z-index: 1;
          background: #fff;
          border-radius: 12px;
          width: 100%;
          max-width: 420px;
          overflow: hidden;
          box-shadow: 0 24px 64px rgba(0,0,0,0.5);
        }

        .aa-accent { height: 4px; background: linear-gradient(to right, #0F766E, #FF6600); }

        .aa-header {
          background: #0F172A;
          padding: 24px 32px 20px;
          text-align: center;
        }
        .aa-logo {
          font-size: 24px;
          font-weight: 900;
          color: #0F766E;
          letter-spacing: -1px;
          margin-bottom: 4px;
        }
        .aa-badge {
          display: inline-block;
          background: rgba(255,153,0,0.15);
          border: 1px solid rgba(255,153,0,0.3);
          color: #0F766E;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 999px;
        }

        .aa-body { padding: 28px 32px 32px; }

        .aa-title {
          font-size: 20px;
          font-weight: 700;
          color: #0F172A;
          margin: 0 0 4px;
        }
        .aa-sub {
          font-size: 13px;
          color: #888;
          margin: 0 0 24px;
        }

        .aa-footer {
          text-align: center;
          margin-top: 20px;
          font-size: 11px;
          color: #aaa;
          line-height: 1.6;
        }
        .aa-footer a { color: #0F766E; text-decoration: none; }
        .aa-footer a:hover { text-decoration: underline; }
      `}</style>

      <div className="aa-page">
        <div className="aa-card">
          <div className="aa-accent" />

          <div className="aa-header">
            <div className="aa-logo">Shopzy</div>
            <span className="aa-badge">Admin Portal</span>
          </div>

          <div className="aa-body">
            <h2 className="aa-title">Sign in to your account</h2>
            <p className="aa-sub">Enter your admin email to receive a one-time password</p>
            <AdminLoginForm />
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1, marginTop: 20 }}>
          <p className="aa-footer">
            (c) 2026 Shopzy India | <a href="/">Back to store</a>
          </p>
        </div>
      </div>
    </>
  )
}
export default AdminAuth
