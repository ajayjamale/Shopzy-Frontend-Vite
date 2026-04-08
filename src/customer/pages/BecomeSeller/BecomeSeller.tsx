import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store";
import { resetSellerAuthState } from "../../../store/seller/sellerAuthenticationSlice";
import SellerAccountForm from "./SellerAccountForm";
import SellerLoginForm from "./SellerLoginForm";

const C = {
  ink: "#091627",
  panel: "#FFFFFF",
  panelSoft: "#F8FBFC",
  border: "#D8E6EA",
  text: "#0E1B2C",
  muted: "#607284",
  teal: "#0F766E",
  tealSoft: "#DDF3EF",
  promoA: "#0A223D",
  promoB: "#113C6B",
  success: "#157347",
  successBg: "#E9F8EF",
  error: "#B42318",
  errorBg: "#FEF0EE",
};

type ToastType = "success" | "error";

function Toast({
  msg,
  type,
  onClose,
}: {
  msg: string;
  type: ToastType;
  onClose: () => void;
}) {
  const fg = type === "error" ? C.error : C.success;
  const bg = type === "error" ? C.errorBg : C.successBg;

  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${fg}33`,
        color: fg,
        borderRadius: 12,
        padding: "10px 12px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        boxShadow: "0 8px 22px rgba(15,23,42,0.14)",
        fontSize: 13,
        fontWeight: 600,
        minWidth: 250,
      }}
    >
      <span style={{ flex: 1, lineHeight: 1.45 }}>{msg}</span>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: fg,
          fontSize: 16,
          lineHeight: 1,
          padding: 0,
        }}
      >
        x
      </button>
    </div>
  );
}

const promoItems = [
  {
    title: "Reach high-intent buyers",
    desc: "Launch your catalog where customers already come to buy.",
  },
  {
    title: "Simple weekly payouts",
    desc: "Track earnings and settlements in one seller dashboard.",
  },
  {
    title: "Operations support",
    desc: "Manage orders, returns, and inventory with seller tools.",
  },
];

const promoStats = [
  { value: "10L+", label: "Sellers" },
  { value: "19Cr+", label: "Shoppers" },
  { value: "160+", label: "Countries" },
];

const BecomeSeller = () => {
  const dispatch = useAppDispatch();
  const { sellerAuth } = useAppSelector((store) => store);

  const [isLoginPage, setIsLoginPage] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; msg: string; type: ToastType }[]>([]);
  const lastError = useRef<string>("");
  const lastSuccess = useRef<string>("");
  const lastOtp = useRef(false);

  const addToast = (msg: string, type: ToastType) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((current) => [...current, { id, msg, type }]);
  };

  const removeToast = (id: number) => setToasts((current) => current.filter((t) => t.id !== id));

  useEffect(() => {
    if (sellerAuth.error && sellerAuth.error !== lastError.current) {
      lastError.current = sellerAuth.error;
      addToast(sellerAuth.error, "error");
    }
  }, [sellerAuth.error]);

  useEffect(() => {
    const msg = sellerAuth.sellerCreated || "";
    if (msg && msg !== lastSuccess.current) {
      lastSuccess.current = msg;
      addToast(msg, "success");
    }
  }, [sellerAuth.sellerCreated]);

  useEffect(() => {
    if (sellerAuth.otpSent && !lastOtp.current) {
      addToast("OTP sent to your email.", "success");
    }
    lastOtp.current = sellerAuth.otpSent;
  }, [sellerAuth.otpSent]);

  const switchMode = (nextIsLogin: boolean) => {
    setIsLoginPage(nextIsLogin);
    dispatch(resetSellerAuthState());
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Sora:wght@600;700&display=swap"
        rel="stylesheet"
      />
      <style>{`
        .seller-auth-page {
          min-height: 100vh;
          background:
            radial-gradient(1200px 600px at 90% -10%, rgba(15, 118, 110, 0.18), transparent 55%),
            radial-gradient(900px 500px at -10% 10%, rgba(17, 60, 107, 0.2), transparent 55%),
            #f2f7f9;
          color: ${C.text};
          font-family: "Manrope", sans-serif;
          padding: 20px 0 26px;
        }
        .seller-auth-wrap {
          width: min(1220px, 95vw);
          margin: 0 auto;
          display: grid;
          gap: 14px;
        }
        .seller-auth-topbar {
          background: linear-gradient(110deg, ${C.ink}, #133154);
          border: 1px solid #183757;
          border-radius: 16px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .seller-auth-brand {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }
        .seller-auth-brand-name {
          font-family: "Sora", sans-serif;
          font-size: 20px;
          color: #f8fbfd;
          letter-spacing: -0.02em;
        }
        .seller-auth-brand-kicker {
          font-size: 10px;
          color: #82e4da;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .seller-auth-topbar-right {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #cfdae6;
          font-size: 12px;
        }
        .seller-auth-toggle-btn {
          border: 1px solid #41607f;
          color: #f8fbfd;
          background: rgba(255,255,255,0.06);
          border-radius: 999px;
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }
        .seller-auth-main {
          display: grid;
          grid-template-columns: minmax(0, 640px) minmax(0, 1fr);
          gap: 14px;
          align-items: stretch;
        }
        .seller-auth-card {
          background: ${C.panel};
          border: 1px solid ${C.border};
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.07);
          min-height: 720px;
          display: flex;
          flex-direction: column;
        }
        .seller-auth-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: ${C.panelSoft};
          border-bottom: 1px solid ${C.border};
          padding: 8px;
          gap: 8px;
        }
        .seller-auth-tab-btn {
          border: 1px solid transparent;
          border-radius: 12px;
          padding: 10px 12px;
          background: transparent;
          color: ${C.muted};
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
        }
        .seller-auth-tab-btn.active {
          background: #ffffff;
          border-color: ${C.border};
          color: ${C.text};
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.06);
        }
        .seller-auth-body {
          flex: 1;
          padding: 18px 18px 16px;
          overflow: auto;
        }
        .seller-auth-footer {
          border-top: 1px solid ${C.border};
          padding: 12px 18px 14px;
          color: ${C.muted};
          font-size: 11px;
          line-height: 1.6;
          text-align: center;
        }
        .seller-auth-footer a {
          color: #0f6094;
          text-decoration: none;
          font-weight: 700;
        }
        .seller-promo-panel {
          border-radius: 18px;
          border: 1px solid #1a4268;
          background:
            radial-gradient(600px 260px at 80% -5%, rgba(130, 228, 218, 0.18), transparent 60%),
            linear-gradient(145deg, ${C.promoA}, ${C.promoB});
          color: #f3f8fd;
          box-shadow: 0 16px 34px rgba(9, 22, 39, 0.35);
          padding: 24px;
          display: grid;
          gap: 16px;
          align-content: start;
        }
        .seller-promo-title {
          font-family: "Sora", sans-serif;
          font-size: clamp(24px, 2.4vw, 34px);
          line-height: 1.12;
          letter-spacing: -0.025em;
        }
        .seller-promo-sub {
          color: rgba(240, 247, 255, 0.82);
          font-size: 13px;
          line-height: 1.6;
          max-width: 55ch;
        }
        .seller-promo-item {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(201, 232, 255, 0.2);
          border-radius: 14px;
          padding: 12px 13px;
          display: grid;
          gap: 3px;
        }
        .seller-promo-item h4 {
          font-size: 13px;
          line-height: 1.4;
          margin: 0;
          color: #f6fbff;
        }
        .seller-promo-item p {
          font-size: 12px;
          line-height: 1.55;
          margin: 0;
          color: rgba(233, 245, 255, 0.82);
        }
        .seller-promo-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px;
          margin-top: 4px;
        }
        .seller-promo-stat {
          background: rgba(9, 22, 39, 0.35);
          border: 1px solid rgba(201, 232, 255, 0.24);
          border-radius: 11px;
          padding: 10px 8px;
          text-align: center;
        }
        .seller-promo-stat strong {
          display: block;
          font-size: 17px;
          line-height: 1;
          color: #80ebdf;
          margin-bottom: 4px;
        }
        .seller-promo-stat span {
          font-size: 11px;
          color: rgba(238, 248, 255, 0.76);
        }
        @media (max-width: 1080px) {
          .seller-auth-main {
            grid-template-columns: 1fr;
          }
          .seller-auth-card {
            min-height: unset;
          }
        }
        @media (max-width: 700px) {
          .seller-auth-topbar {
            flex-wrap: wrap;
            row-gap: 8px;
          }
          .seller-auth-topbar-right {
            margin-left: 0;
            width: 100%;
            justify-content: space-between;
          }
          .seller-promo-stats {
            grid-template-columns: 1fr 1fr 1fr;
          }
          .seller-auth-body {
            padding: 14px;
          }
        }
      `}</style>

      <div style={{ position: "fixed", top: 16, right: 16, zIndex: 9999, display: "grid", gap: 8 }}>
        {toasts.map((toast) => (
          <Toast key={toast.id} msg={toast.msg} type={toast.type} onClose={() => removeToast(toast.id)} />
        ))}
      </div>

      <div className="seller-auth-page">
        <div className="seller-auth-wrap">
          <header className="seller-auth-topbar">
            <div className="seller-auth-brand">
              <span className="seller-auth-brand-name">Shopzy</span>
              <span className="seller-auth-brand-kicker">Seller Central</span>
            </div>
            <div className="seller-auth-topbar-right">
              <span>{isLoginPage ? "New to Shopzy?" : "Already a seller?"}</span>
              <button className="seller-auth-toggle-btn" onClick={() => switchMode(!isLoginPage)}>
                {isLoginPage ? "Create account" : "Sign in"}
              </button>
            </div>
          </header>

          <section className="seller-auth-main">
            <div className="seller-auth-card">
              <div className="seller-auth-tabs">
                <button
                  className={`seller-auth-tab-btn ${!isLoginPage ? "active" : ""}`}
                  onClick={() => switchMode(false)}
                >
                  Register
                </button>
                <button
                  className={`seller-auth-tab-btn ${isLoginPage ? "active" : ""}`}
                  onClick={() => switchMode(true)}
                >
                  Login
                </button>
              </div>

              <div className="seller-auth-body">{isLoginPage ? <SellerLoginForm /> : <SellerAccountForm />}</div>

              <div className="seller-auth-footer">
                <a href="#">Conditions of Use</a> | <a href="#">Privacy Notice</a> | <a href="#">Help</a>
                <div>Copyright 2026 Shopzy.com, Inc. or its affiliates.</div>
              </div>
            </div>

            <aside className="seller-promo-panel">
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 11,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#86ebdf",
                    fontWeight: 700,
                  }}
                >
                  Grow With Shopzy
                </p>
                <h2 className="seller-promo-title" style={{ margin: "8px 0 10px" }}>
                  Sell smarter. Scale faster. Keep control.
                </h2>
                <p className="seller-promo-sub">
                  Build your brand with focused storefront tools, transparent settlements, and order workflows made
                  for multi-category sellers.
                </p>
              </div>

              {promoItems.map((item) => (
                <article key={item.title} className="seller-promo-item">
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </article>
              ))}

              <div className="seller-promo-stats">
                {promoStats.map((stat) => (
                  <div key={stat.label} className="seller-promo-stat">
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            </aside>
          </section>
        </div>
      </div>
    </>
  );
};

export default BecomeSeller;
