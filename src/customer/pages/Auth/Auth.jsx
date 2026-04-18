import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../../context/AppContext'
import { ShopzyLogo } from '../../../components/ShopzyLogo'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import './Auth.css'
const Auth = () => {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const jwt = useAppSelector((state) => state.auth.jwt)
  useEffect(() => {
    if (jwt) navigate('/')
  }, [jwt, navigate])
  return (
    <div className="auth-page">
      <div className="auth-shell">
        <aside className="auth-brand">
          <button
            className="bg-transparent border-0 p-0 text-left cursor-pointer"
            onClick={() => navigate('/')}
          >
            <ShopzyLogo size={23} textColor="#ffffff" color="#ffffff" />
          </button>
          <h2>Secure login built for seamless shopping.</h2>
          <p>
            Sign in with OTP, manage your orders, save your favorites, and enjoy a faster checkout.
          </p>
          <div className="auth-points">
            <span>� One-time password based authentication</span>
            <span>� Protected account and order history</span>
            <span>� Smooth access across customer and seller journeys</span>
          </div>
        </aside>

        <section className="auth-card">
          <div>
            <h1>{isLogin ? 'Welcome back' : 'Create your account'}</h1>
            <p>{isLogin ? 'Sign in using your email and OTP' : 'Register in under a minute'}</p>
          </div>

          {isLogin ? <LoginForm /> : <SignupForm />}

          <div className="auth-toggle">
            <span>{isLogin ? 'New to Shopzy?' : 'Already have an account?'}</span>
            <button onClick={() => setIsLogin((prev) => !prev)}>
              {isLogin ? 'Create account' : 'Sign in'}
            </button>
          </div>

          <p className="auth-legal">
            By continuing, you agree to our terms, privacy and account policy.
          </p>
        </section>
      </div>
    </div>
  )
}
export default Auth
