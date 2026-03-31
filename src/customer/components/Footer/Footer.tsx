import React, { useState } from "react";
import {
  FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn,
  FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcAmex,
  FaApple, FaGooglePay, FaArrowRight, FaShieldAlt,
  FaTruck, FaUndo, FaHeadset,
} from "react-icons/fa";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { useNavigate } from "react-router-dom";
import "../Navbar/Navbar.css";
import { ShopzyLogo } from "../../../components/ShopzyLogo";

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const footerLinks = {
    shop: [
      { name: "Men's Collection",   path: "/products/men" },
      { name: "Women's Collection", path: "/products/women" },
      { name: "Electronics",        path: "/products/electronics" },
      { name: "Furniture",          path: "/products/furniture" },
      { name: "New Arrivals",       path: "/new-arrivals" },
      { name: "Best Sellers",       path: "/best-sellers" },
    ],
    support: [
      { name: "Help Center",          path: "/help" },
      { name: "Shipping Information", path: "/shipping" },
      { name: "Returns & Exchanges",  path: "/returns" },
      { name: "Order Tracking",       path: "/track-order" },
      { name: "FAQs",                 path: "/faqs" },
      { name: "Contact Us",           path: "/contact" },
    ],
    company: [
      { name: "About Us",       path: "/about" },
      { name: "Careers",        path: "/careers" },
      { name: "Blog",           path: "/blog" },
      { name: "Press",          path: "/press" },
      { name: "Affiliates",     path: "/affiliates" },
      { name: "Sustainability", path: "/sustainability" },
    ],
    legal: [
      { name: "Privacy Policy",  path: "/privacy" },
      { name: "Terms of Service",path: "/terms" },
      { name: "Cookie Policy",   path: "/cookies" },
      { name: "GDPR Compliance", path: "/gdpr" },
      { name: "Security",        path: "/security" },
    ],
  };

  const features = [
    { icon: <FaTruck size={22} />,    title: "Free Shipping",  desc: "On orders above ₹499" },
    { icon: <FaUndo size={22} />,     title: "Easy Returns",   desc: "10-day return policy" },
    { icon: <FaShieldAlt size={22} />,title: "Secure Payment", desc: "100% secure checkout" },
    { icon: <FaHeadset size={22} />,  title: "24/7 Support",   desc: "Dedicated customer service" },
  ];

  const socials = [
    { icon: <FaFacebookF size={15} />,  color: "#1877f2", name: "Facebook" },
    { icon: <FaTwitter size={15} />,    color: "#1da1f2", name: "Twitter" },
    { icon: <FaInstagram size={15} />,  color: "#e4405f", name: "Instagram" },
    { icon: <FaLinkedinIn size={15} />, color: "#0077b5", name: "LinkedIn" },
  ];

  const handleSubscribe = () => {
    if (email.includes("@")) { setSubscribed(true); setEmail(""); }
  };

  /* ── shared micro-styles ───────────────────── */
  const linkStyle: React.CSSProperties = {
    fontSize: 13, color: "#94a3b8", cursor: "pointer",
    display: "flex", alignItems: "center", gap: 8, padding: "2px 0",
    transition: "all 0.2s ease", listStyle: "none",
  };

  const smLinkStyle: React.CSSProperties = {
    fontSize: 12, color: "#64748b", cursor: "pointer", transition: "color 0.2s",
  };

  const sectionHead: React.CSSProperties = {
    fontSize: 11, fontWeight: 800, letterSpacing: "0.12em",
    color: "#FFD814", textTransform: "uppercase", margin: "0 0 20px",
  };

  const smHead: React.CSSProperties = {
    fontSize: 10, fontWeight: 800, letterSpacing: "0.12em",
    textTransform: "uppercase", color: "#64748b", margin: "0 0 14px",
  };

  return (
    <footer style={{ marginTop: 80, background: "#0d1117", color: "#e2e8f0", fontFamily: "system-ui, sans-serif" }}>

      {/* ── FEATURES STRIP ─────────────────────────────── */}
      <div style={{ background: "#FFD814", borderBottom: "3px solid #131921" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }} className="footer-features-padding">
          <div className="footer-features-grid">
            {features.map((f, i) => (
              <div
                key={i}
                className="footer-feature-item"
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "20px 20px",
                  borderRight: i < 3 ? "1px solid rgba(0,0,0,0.12)" : "none",
                  cursor: "default", transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.06)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "rgba(0,0,0,0.1)", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  color: "#131921", flexShrink: 0,
                }}>
                  {f.icon}
                </div>
                <div>
                  <p style={{ fontWeight: 800, fontSize: 13, color: "#131921", margin: 0, letterSpacing: "0.03em" }}>{f.title}</p>
                  <p style={{ fontSize: 11, color: "#374151", margin: "2px 0 0" }} className="category">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN FOOTER BODY ───────────────────────────── */}
      <div style={{ maxWidth: 1280, margin: "0 auto" }} className="footer-body-padding">

        <div className="footer-main-grid">

          {/* Brand column */}
          <div>
            <div
              onClick={() => navigate("/")}
              style={{ marginBottom: 20, cursor: "pointer" }}
            >
              <ShopzyLogo size={22} bg="#FFD814" color="#131921" textColor="#fff" />
            </div>

            <p style={{ fontSize: 13, lineHeight: 1.75, color: "#94a3b8", maxWidth: 320, marginBottom: 28 }} className="category">
              Discover premium quality fashion, electronics, and home essentials.
              Trusted delivery and secure checkout since 2024.
            </p>

            {/* Socials */}
            <div style={{ display: "flex", gap: 10, marginBottom: 32, flexWrap: "wrap" }}>
              {socials.map((s, i) => (
                <button
                  key={i} title={s.name}
                  style={{
                    width: 38, height: 38, borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.05)", color: "#94a3b8",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    const b = e.currentTarget as HTMLButtonElement;
                    b.style.background = s.color; b.style.color = "#fff";
                    b.style.borderColor = s.color; b.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    const b = e.currentTarget as HTMLButtonElement;
                    b.style.background = "rgba(255,255,255,0.05)"; b.style.color = "#94a3b8";
                    b.style.borderColor = "rgba(255,255,255,0.12)"; b.style.transform = "translateY(0)";
                  }}
                >
                  {s.icon}
                </button>
              ))}
            </div>

            {/* App badges */}
            <div className="footer-app-badges">
              {[
                { label: "App Store",    sub: "Download on", icon: <FaApple size={18} /> },
                { label: "Google Play",  sub: "Get it on",   icon: <FaGooglePay size={18} /> },
              ].map((app) => (
                <button
                  key={app.label}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 14px",
                    border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10,
                    background: "rgba(255,255,255,0.04)", color: "#ffffff",
                    cursor: "pointer", transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    const b = e.currentTarget as HTMLButtonElement;
                    b.style.background = "#FFD814"; b.style.color = "#131921"; b.style.borderColor = "#FFD814";
                  }}
                  onMouseLeave={(e) => {
                    const b = e.currentTarget as HTMLButtonElement;
                    b.style.background = "rgba(255,255,255,0.04)"; b.style.color = "#fff";
                    b.style.borderColor = "rgba(255,255,255,0.15)";
                  }}
                >
                  {app.icon}
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 9, letterSpacing: "0.1em", opacity: 0.7 }}>{app.sub}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, marginTop: 1 }}>{app.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h3 style={sectionHead}>Shop</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {footerLinks.shop.map((link) => (
                <li
                  key={link.name} onClick={() => navigate(link.path)}
                  style={linkStyle}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLLIElement).style.color = "#ffffff"; (e.currentTarget as HTMLLIElement).style.paddingLeft = "6px"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLLIElement).style.color = "#94a3b8"; (e.currentTarget as HTMLLIElement).style.paddingLeft = "0"; }}
                  className="category"
                >
                  <FaArrowRight size={9} style={{ color: "#FFD814", flexShrink: 0 }} />
                  {link.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h3 style={sectionHead}>Support</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {footerLinks.support.map((link) => (
                <li
                  key={link.name} onClick={() => navigate(link.path)}
                  style={linkStyle}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLLIElement).style.color = "#ffffff"; (e.currentTarget as HTMLLIElement).style.paddingLeft = "6px"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLLIElement).style.color = "#94a3b8"; (e.currentTarget as HTMLLIElement).style.paddingLeft = "0"; }}
                  className="category"
                >
                  <FaArrowRight size={9} style={{ color: "#FFD814", flexShrink: 0 }} />
                  {link.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 style={sectionHead}>Subscribe</h3>
            <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.65, marginBottom: 18 }} className="category">
              Get 10% off your first order and exclusive member offers.
            </p>

            {subscribed ? (
              <div style={{
                background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)",
                borderRadius: 10, padding: "14px 16px", fontSize: 13, color: "#4ade80",
                fontWeight: 600, textAlign: "center",
              }}>
                ✓ You're subscribed!
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,0.12)", marginBottom: 10 }}>
                  <input
                    type="email" placeholder="Enter your email"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                    style={{
                      flex: 1, padding: "12px 14px", background: "rgba(255,255,255,0.06)",
                      border: "none", outline: "none", color: "#fff",
                      fontSize: 13, fontFamily: "inherit", minWidth: 0,
                    }}
                  />
                  <button
                    onClick={handleSubscribe}
                    style={{
                      background: "#FFD814", border: "none", padding: "0 16px",
                      cursor: "pointer", fontWeight: 800, color: "#131921",
                      fontSize: 16, whiteSpace: "nowrap", transition: "background 0.15s", flexShrink: 0,
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#f0c400")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#FFD814")}
                  >
                    →
                  </button>
                </div>
                <p style={{ fontSize: 10, color: "#64748b", display: "flex", alignItems: "center", gap: 5 }} className="category">
                  <FaShieldAlt size={9} /> No spam. Unsubscribe anytime.
                </p>
              </div>
            )}

            {/* Payments */}
            <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#64748b", marginBottom: 12 }}>
                We Accept
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcAmex].map((Icon, i) => (
                  <Icon key={i} size={30}
                    style={{ color: "#94a3b8", cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={(e: any) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.transform = "scale(1.15) translateY(-2px)"; }}
                    onMouseLeave={(e: any) => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.transform = "scale(1) translateY(0)"; }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── SECONDARY LINKS ROW ────────────────────────── */}
        <div className="footer-secondary-grid">
          {/* Company */}
          <div>
            <h4 style={smHead}>Company</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {footerLinks.company.map((link) => (
                <li key={link.name} onClick={() => navigate(link.path)}
                  style={smLinkStyle}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLLIElement).style.color = "#e2e8f0")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLLIElement).style.color = "#64748b")}
                  className="category"
                >{link.name}</li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 style={smHead}>Legal</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {footerLinks.legal.map((link) => (
                <li key={link.name} onClick={() => navigate(link.path)}
                  style={smLinkStyle}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLLIElement).style.color = "#e2e8f0")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLLIElement).style.color = "#64748b")}
                  className="category"
                >{link.name}</li>
              ))}
            </ul>
          </div>

          {/* Contact — spans full width on tablet */}
          <div className="footer-contact-full">
            <h4 style={smHead}>Get in Touch</h4>
            <div className="footer-contact-grid">
              {[
                { title: "Email Us", lines: ["support@shopzy.com", "careers@shopzy.com"] },
                { title: "Call Us",  lines: ["+1 (800) 123-4567", "Mon–Fri 9am–6pm"] },
              ].map((box) => (
                <div
                  key={box.title}
                  style={{
                    padding: 16, borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.03)", transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => { const d = e.currentTarget as HTMLDivElement; d.style.background = "rgba(255,216,20,0.07)"; d.style.borderColor = "rgba(255,216,20,0.3)"; }}
                  onMouseLeave={(e) => { const d = e.currentTarget as HTMLDivElement; d.style.background = "rgba(255,255,255,0.03)"; d.style.borderColor = "rgba(255,255,255,0.08)"; }}
                >
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#FFD814", margin: "0 0 6px" }}>{box.title}</p>
                  {box.lines.map((l) => (
                    <p key={l} style={{ fontSize: 12, color: "#64748b", margin: "2px 0" }} className="category">{l}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ─────────────────────────────────── */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "#060a0f" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }} className="footer-bottom-inner">
          <p style={{ fontSize: 12, color: "#475569", margin: 0 }} className="category">
            © {currentYear}{" "}
            <span style={{ fontWeight: 700, color: "#94a3b8" }}>SHOPZY</span>
            . All rights reserved. Crafted with ♥
          </p>
          <div className="footer-bottom-links">
            {["Privacy", "Terms", "Cookies", "Accessibility"].map((item) => (
              <span
                key={item}
                style={{ fontSize: 11, color: "#475569", cursor: "pointer", transition: "color 0.2s" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLSpanElement).style.color = "#94a3b8")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLSpanElement).style.color = "#475569")}
                className="category"
              >{item}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;