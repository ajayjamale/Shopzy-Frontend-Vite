import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
const NotFound = () => {
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  return (
    <>
      <style>{`
        .nf-page {
          min-height: 100vh;
          background: #fff;
          font-family: Arial, sans-serif;
          display: flex;
          flex-direction: column;
        }

        /* ── Top accent bar ── */
        .nf-topbar {
          height: 4px;
          background: linear-gradient(to right, #0F766E, #14B8A6);
          width: 0;
          transition: width 0.8s ease;
        }
        .nf-topbar.show { width: 100%; }

        /* ── Header ── */
        .nf-header {
          background: #0F172A;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .nf-logo-text {
          font-size: 22px;
          font-weight: 900;
          letter-spacing: -1px;
          color: #0F766E;
        }
        .nf-logo-dot { color: #0F766E; }

        /* ── Main ── */
        .nf-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
          max-width: 900px;
          margin: 0 auto;
          width: 100%;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.5s 0.2s ease, transform 0.5s 0.2s ease;
        }
        .nf-main.show {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Dog illustration area ── */
        .nf-illustration {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: 0;
          margin-bottom: 32px;
        }

        /* Animated dog SVG */
        .nf-dog {
          width: 180px;
          filter: drop-shadow(0 8px 16px rgba(0,0,0,0.1));
        }
        .nf-dog-tail {
          transform-origin: 95% 50%;
          animation: nf-wag 0.6s ease-in-out infinite alternate;
        }
        @keyframes nf-wag {
          from { transform: rotate(-15deg); }
          to   { transform: rotate(15deg); }
        }
        .nf-dog-ear {
          transform-origin: 50% 10%;
          animation: nf-ear 1.8s ease-in-out infinite alternate;
        }
        @keyframes nf-ear {
          from { transform: rotate(-5deg); }
          to   { transform: rotate(5deg); }
        }

        /* ── 404 code ── */
        .nf-code {
          font-size: 13px;
          color: #c45500;
          font-weight: 700;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }

        /* ── Heading ── */
        .nf-heading {
          font-size: clamp(22px, 4vw, 30px);
          font-weight: 700;
          color: #0F172A;
          margin: 0 0 12px;
          text-align: center;
        }

        /* ── Description ── */
        .nf-desc {
          font-size: 14px;
          color: #64748B;
          text-align: center;
          max-width: 480px;
          line-height: 1.6;
          margin: 0 0 28px;
        }
        .nf-desc a {
          color: #0E7490;
          text-decoration: none;
        }
        .nf-desc a:hover { text-decoration: underline; color: #C7511F; }

        /* ── Search bar ── */
        .nf-search {
          display: flex;
          width: 100%;
          max-width: 480px;
          border: 1px solid #888;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 28px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
          transition: box-shadow 0.15s;
        }
        .nf-search:focus-within {
          border-color: #e77600;
          box-shadow: 0 0 0 3px rgba(231,118,0,0.25);
        }
        .nf-search input {
          flex: 1;
          padding: 9px 12px;
          border: none;
          outline: none;
          font-size: 14px;
          color: #0F172A;
          background: #fff;
        }
        .nf-search-btn {
          padding: 0 16px;
          background: linear-gradient(135deg, #0F766E, #14B8A6);
          border: none;
          border-left: 1px solid #0B5F59;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: background 0.15s;
        }
        .nf-search-btn:hover {
          background: linear-gradient(135deg, #0B5F59, #0F766E);
        }

        /* ── Buttons ── */
        .nf-buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 40px;
        }
        .nf-btn-home {
          padding: 8px 20px;
          background: linear-gradient(135deg, #0F766E, #14B8A6);
          border: 1px solid #0B5F59;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 600;
          color: #ffffff;
          cursor: pointer;
          transition: background 0.15s, box-shadow 0.15s;
        }
        .nf-btn-home:hover {
          background: linear-gradient(135deg, #0B5F59, #0F766E);
          box-shadow: 0 2px 5px rgba(0,0,0,0.15);
        }
        .nf-btn-back {
          padding: 8px 20px;
          background: linear-gradient(to bottom, #f7f8f8, #e7e9ec);
          border: 1px solid #adb1b8;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 600;
          color: #0F172A;
          cursor: pointer;
          transition: background 0.15s;
        }
        .nf-btn-back:hover { background: linear-gradient(to bottom, #e7e9ec, #d9dce1); }

        /* ── Divider ── */
        .nf-divider {
          width: 100%;
          max-width: 700px;
          border: none;
          border-top: 1px solid #e7e7e7;
          margin: 0 0 28px;
        }

        /* ── Helpful links ── */
        .nf-links-title {
          font-size: 14px;
          font-weight: 700;
          color: #0F172A;
          margin-bottom: 14px;
          text-align: center;
        }
        .nf-links {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .nf-link-pill {
          padding: 7px 16px;
          border: 1px solid #ddd;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          color: #0E7490;
          background: #fff;
          cursor: pointer;
          transition: background 0.12s, border-color 0.12s, color 0.12s;
          white-space: nowrap;
        }
        .nf-link-pill:hover {
          background: #f0fafa;
          border-color: #0E7490;
          color: #005f6b;
        }

        /* ── Footer ── */
        .nf-footer {
          background: #1E293B;
          padding: 20px 24px;
          text-align: center;
        }
        .nf-footer-logo {
          font-size: 18px;
          font-weight: 900;
          color: #0F766E;
          letter-spacing: -0.5px;
          margin-bottom: 6px;
        }
        .nf-footer-text {
          font-size: 11px;
          color: #777;
        }
      `}</style>

      <div className="nf-page">
        {/* Orange progress bar */}
        <div className={`nf-topbar ${mounted ? 'show' : ''}`} />

        {/* Header */}
        <div className="nf-header">
          <span className="nf-logo-text">
            Shopzy<span className="nf-logo-dot">.</span>
          </span>
        </div>

        {/* Main content */}
        <div className={`nf-main ${mounted ? 'show' : ''}`}>
          {/* Dog illustration */}
          <div className="nf-illustration">
            <svg className="nf-dog" viewBox="0 0 200 180" fill="none">
              {/* Body */}
              <ellipse cx="100" cy="120" rx="55" ry="38" fill="#F5A623" />
              {/* Head */}
              <ellipse cx="148" cy="88" rx="32" ry="28" fill="#F5A623" />
              {/* Snout */}
              <ellipse cx="172" cy="98" rx="14" ry="10" fill="#D4871A" />
              {/* Nose */}
              <ellipse cx="180" cy="94" rx="5" ry="4" fill="#2C1810" />
              {/* Eye */}
              <circle cx="158" cy="82" r="5" fill="#2C1810" />
              <circle cx="159.5" cy="80.5" r="1.5" fill="#fff" />
              {/* Ear */}
              <g className="nf-dog-ear">
                <ellipse
                  cx="130"
                  cy="68"
                  rx="14"
                  ry="20"
                  fill="#D4871A"
                  transform="rotate(-20 130 68)"
                />
              </g>
              {/* Tail */}
              <g className="nf-dog-tail">
                <path d="M50 108 Q20 80 30 60 Q35 50 45 58 Q38 75 55 100Z" fill="#F5A623" />
              </g>
              {/* Front legs */}
              <rect x="70" y="148" width="18" height="28" rx="9" fill="#D4871A" />
              <rect x="108" y="148" width="18" height="28" rx="9" fill="#D4871A" />
              {/* Back legs */}
              <rect x="50" y="140" width="16" height="24" rx="8" fill="#D4871A" />
              <rect x="128" y="140" width="16" height="24" rx="8" fill="#D4871A" />
              {/* Spots */}
              <circle cx="90" cy="115" r="8" fill="#D4871A" opacity="0.5" />
              <circle cx="115" cy="125" r="5" fill="#D4871A" opacity="0.5" />
              {/* Mouth */}
              <path
                d="M168 102 Q172 106 176 102"
                stroke="#2C1810"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
              {/* Tongue */}
              <ellipse cx="174" cy="106" rx="4" ry="5" fill="#E05C5C" />
              {/* 404 on dog sign */}
              <rect x="62" y="88" width="52" height="28" rx="4" fill="#fff" stroke="#ddd" />
              <text
                x="88"
                y="107"
                textAnchor="middle"
                fontSize="13"
                fontWeight="800"
                fill="#C45500"
                fontFamily="Arial"
              >
                404
              </text>
            </svg>
          </div>

          {/* Error code */}
          <p className="nf-code">HTTP ERROR 404</p>

          {/* Heading */}
          <h1 className="nf-heading">We can't find that page</h1>

          {/* Description */}
          <p className="nf-desc">
            Sorry, we looked everywhere but couldn't find the page you're looking for. Try searching
            below or <a onClick={() => navigate('/')}>go back to the homepage</a>.
          </p>

          {/* Search */}
          <div className="nf-search">
            <input
              type="text"
              placeholder="Search Shopzy"
              onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
              autoFocus
            />
            <button className="nf-search-btn" onClick={() => navigate('/')}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#333"
                strokeWidth="2.5"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Buttons */}
          <div className="nf-buttons">
            <button className="nf-btn-home" onClick={() => navigate('/')}>
              Go to Homepage
            </button>
            <button className="nf-btn-back" onClick={() => navigate(-1)}>
              Go Back
            </button>
          </div>

          <hr className="nf-divider" />

          {/* Helpful links */}
          <p className="nf-links-title">You might be looking for:</p>
          <div className="nf-links">
            {[
              {
                label: '🛍️ Shop',
                path: '/',
              },
              {
                label: '🛒 Cart',
                path: '/cart',
              },
              {
                label: '❤️ Wishlist',
                path: '/wishlist',
              },
              {
                label: '👤 My Account',
                path: '/account',
              },
              {
                label: '📦 Orders',
                path: '/account/orders',
              },
            ].map(({ label, path }) => (
              <button key={path} className="nf-link-pill" onClick={() => navigate(path)}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="nf-footer">
          <div className="nf-footer-logo">Shopzy.</div>
          <div className="nf-footer-text">© 2026 Shopzy India. All rights reserved.</div>
        </div>
      </div>
    </>
  )
}
export default NotFound
