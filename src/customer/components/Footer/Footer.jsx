import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShopzyLogo } from '../../../components/ShopzyLogo'
import '../Navbar/Navbar.css'
const Footer = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const handleSubscribe = () => {
    if (!email.includes('@')) return
    setSubscribed(true)
    setEmail('')
  }
  const year = new Date().getFullYear()
  return (
    <footer className="footer-shell">
      <div className="footer-top">
        <div>
          <button
            className="bg-transparent border-0 p-0 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <ShopzyLogo size={20} textColor="#F8FAFC" color="#ffffff" />
          </button>
          <p className="mt-4 text-sm leading-6" style={{ color: '#A8BCCB', maxWidth: 380 }}>
            Shopzy is a premium ecommerce experience built for discovery, trusted checkout, and
            delightful shopping journeys across fashion, electronics, and home.
          </p>
          <div className="mt-5 flex gap-2 flex-wrap">
            {['Instagram', 'X', 'YouTube', 'LinkedIn'].map((social) => (
              <span
                key={social}
                className="px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ border: '1px solid rgba(207,222,233,0.26)', color: '#D2DEE7' }}
              >
                {social}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="footer-title">Shop</p>
          {[
            ['Men', '/catalog/men'],
            ['Women', '/catalog/women'],
            ['Electronics', '/catalog/electronics'],
            ['Home & Furniture', '/catalog/home_furniture'],
            ['Wishlist', '/wishlist'],
          ].map(([label, path]) => (
            <button
              key={label}
              className="footer-link bg-transparent border-0 p-0 cursor-pointer"
              onClick={() => navigate(path)}
            >
              {label}
            </button>
          ))}
        </div>

        <div>
          <p className="footer-title">Support</p>
          {['Help Center', 'Shipping & Delivery', 'Returns', 'Order Tracking', 'Contact'].map(
            (item) => (
              <span key={item} className="footer-link">
                {item}
              </span>
            ),
          )}
        </div>

        <div>
          <p className="footer-title">Newsletter</p>
          <p className="text-sm leading-6" style={{ color: '#A8BCCB' }}>
            New launches, member-only pricing, and curated picks every week.
          </p>
          {subscribed ? (
            <div
              className="mt-3 px-3 py-2 rounded-xl text-sm font-semibold"
              style={{ background: 'rgba(15,118,110,0.24)', color: '#9EE7DF' }}
            >
              You are subscribed.
            </div>
          ) : (
            <div className="footer-news">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                placeholder="you@example.com"
              />
              <button onClick={handleSubscribe}>Join</button>
            </div>
          )}
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <span>© {year} Shopzy Commerce. All rights reserved.</span>
          <div className="flex gap-4 flex-wrap">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Cookies</span>
            <span>Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
export default Footer
