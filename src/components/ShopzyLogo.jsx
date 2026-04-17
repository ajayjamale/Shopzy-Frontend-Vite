import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
export const ShopzyLogo = ({
  size = 20,
  color = '#0F172A',
  textColor = '#0F172A',
  bg = 'linear-gradient(140deg, #14b8a6 0%, #0f766e 60%, #0b5f59 100%)',
}) => {
  return (
    <div className="flex items-center gap-2" style={{ userSelect: 'none' }} aria-label="Shopzy">
      <span
        style={{
          width: size * 1.9,
          height: size * 1.9,
          borderRadius: 13,
          background: bg,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 18px rgba(15, 118, 110, 0.25)',
          flexShrink: 0,
        }}
      >
        <StorefrontRoundedIcon sx={{ color, fontSize: size }} />
      </span>
      <span className="leading-none">
        <span
          style={{
            display: 'block',
            fontFamily: 'var(--font-display)',
            color: textColor,
            fontSize: size,
            fontWeight: 700,
            letterSpacing: '-0.01em',
          }}
        >
          Shopzy
        </span>
        <span
          style={{
            display: 'block',
            marginTop: 2,
            fontSize: Math.max(10, size * 0.45),
            letterSpacing: '0.18em',
            color: '#5B7281',
            textTransform: 'uppercase',
            fontWeight: 700,
          }}
        >
          curated commerce
        </span>
      </span>
    </div>
  )
}
