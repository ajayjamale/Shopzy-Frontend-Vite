import React from 'react';
import StorefrontIcon from '@mui/icons-material/Storefront';

export const ShopzyLogo = ({ 
  size = 18, 
  color = '#131921', 
  textColor = '#fff',
  bg = '#FFD814' 
}) => {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 group" style={{ userSelect: 'none' }}>
      <div 
        style={{ 
          width: size * 1.8, 
          height: size * 1.8, 
          background: bg, 
          borderRadius: 8, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          transition: 'transform 0.2s ease', 
          flexShrink: 0 
        }}
        className="group-hover:scale-110"
      >
        <StorefrontIcon sx={{ color: color, fontSize: size }} />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="font-bold tracking-wider" style={{ fontSize: size, color: textColor }}>Shopzy</span>
        <span className="hidden sm:block font-medium" style={{ fontSize: size * 0.5, color: bg, letterSpacing: '0.18em' }}>
          .inspired shopping
        </span>
      </div>
    </div>
  );
};
