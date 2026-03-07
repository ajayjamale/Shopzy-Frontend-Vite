import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Divider, Typography
} from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import { Category } from "@mui/icons-material";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LogoutIcon from '@mui/icons-material/Logout';

const menu = [
  { name: "Manage Seller",            path: "/admin",                      icon: <DashboardIcon /> },
  { name: "Coupons",              path: "/admin/coupon",               icon: <IntegrationInstructionsIcon /> },
  { name: "Add New Coupon",       path: "/admin/add-coupon",           icon: <AddIcon /> },
  { name: "Home Page",            path: "/admin/home-grid",            icon: <HomeIcon /> },
  { name: "Electronics Category", path: "/admin/electronics-category", icon: <ElectricBoltIcon /> },
  { name: "Shop By Category",     path: "/admin/shop-by-category",     icon: <Category /> },
  { name: "Deals",                path: "/admin/deals",                icon: <LocalOfferIcon /> },
];

const menu2 = [
  { name: "Account", path: "/seller/account", icon: <AccountBoxIcon /> },
  { name: "Logout",  path: "/",               icon: <LogoutIcon /> },
];

interface DrawerListProps {
  toggleDrawer?: any;
}

const AdminDrawerList = ({ toggleDrawer }: DrawerListProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNav = (path: string) => {
    navigate(path);
    toggleDrawer?.();
  };

  const NavItem = ({ item }: { item: typeof menu[0] }) => {
    const isActive = location.pathname === item.path;
    return (
      <ListItem disablePadding sx={{ mb: 0.5 }}>
        <ListItemButton
          onClick={() => handleNav(item.path)}
          sx={{
            mx: 1,
            borderRadius: '4px',
            px: 1.5, py: 1,
            backgroundColor: isActive ? '#FF9900' : 'transparent',
            borderLeft: isActive ? '3px solid #fff' : '3px solid transparent',
            transition: 'all 0.15s ease',
            '&:hover': {
              backgroundColor: isActive ? '#e88b00' : 'rgba(255,153,0,0.12)',
            },
          }}
        >
          <ListItemIcon sx={{
            minWidth: 34,
            color: isActive ? '#131921' : '#adb5bd',
            '& svg': { fontSize: 19 },
          }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText
            primary={item.name}
            primaryTypographyProps={{
              fontSize: 13,
              fontWeight: isActive ? 700 : 400,
              fontFamily: '"Amazon Ember", Arial, sans-serif',
              color: isActive ? '#131921' : '#d5d9d9',
              letterSpacing: '0.1px',
            }}
          />
          {isActive && (
            <Box sx={{
              width: 6, height: 6, borderRadius: '50%',
              backgroundColor: '#131921', ml: 1,
            }} />
          )}
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Box sx={{
      width: 230,
      height: '100%',
      backgroundColor: '#131921',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Branding strip */}
      <Box sx={{
        px: 2.5, py: 2,
        borderBottom: '1px solid rgba(255,153,0,0.3)',
        display: 'flex', alignItems: 'center', gap: 1,
      }}>
        <Box sx={{
          width: 28, height: 28,
          backgroundColor: '#FF9900',
          borderRadius: '3px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Typography sx={{ fontSize: 14, fontWeight: 900, color: '#131921', fontFamily: 'Arial, sans-serif', lineHeight: 1 }}>
            a
          </Typography>
        </Box>
        <Box>
          <Typography sx={{
            fontSize: 13, fontWeight: 700,
            color: '#fff',
            fontFamily: '"Amazon Ember", Arial, sans-serif',
            lineHeight: 1.1,
          }}>
            Seller Central
          </Typography>
          <Typography sx={{ fontSize: 10, color: '#FF9900', fontFamily: '"Amazon Ember", Arial, sans-serif' }}>
            Admin Console
          </Typography>
        </Box>
      </Box>

      {/* Section label */}
      <Box sx={{ px: 2.5, pt: 2, pb: 0.5 }}>
        <Typography sx={{
          fontSize: 10, fontWeight: 700, letterSpacing: '1px',
          color: '#6c757d', textTransform: 'uppercase',
          fontFamily: '"Amazon Ember", Arial, sans-serif',
        }}>
          Main Menu
        </Typography>
      </Box>

      {/* Primary nav */}
      <List sx={{ flex: 1, py: 0.5 }}>
        {menu.map((item) => <NavItem key={item.path} item={item} />)}
      </List>

      {/* Divider */}
      <Divider sx={{ borderColor: 'rgba(255,153,0,0.2)', mx: 2 }} />

      {/* Section label */}
      <Box sx={{ px: 2.5, pt: 1.5, pb: 0.5 }}>
        <Typography sx={{
          fontSize: 10, fontWeight: 700, letterSpacing: '1px',
          color: '#6c757d', textTransform: 'uppercase',
          fontFamily: '"Amazon Ember", Arial, sans-serif',
        }}>
          Account
        </Typography>
      </Box>

      {/* Secondary nav */}
      <List sx={{ pb: 2 }}>
        {menu2.map((item) => <NavItem key={item.path} item={item} />)}
      </List>
    </Box>
  );
};

export default AdminDrawerList;