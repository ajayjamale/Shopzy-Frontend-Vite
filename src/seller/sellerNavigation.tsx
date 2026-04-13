import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import type { ReactNode } from "react";

export type SellerLocationLike = {
  pathname: string;
  search?: string;
};

export type SellerNavItem = {
  label: string;
  shortLabel?: string;
  path: string;
  icon: ReactNode;
};

export type SellerNavGroup = {
  title: string;
  items: SellerNavItem[];
};

export const sellerMenuGroups: SellerNavGroup[] = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        shortLabel: "Overview",
        path: "/seller",
        icon: <DashboardRoundedIcon sx={{ fontSize: 18 }} />,
      },
    ],
  },
  {
    title: "Sales",
    items: [
      {
        label: "Orders",
        path: "/seller/orders",
        icon: <ShoppingBagRoundedIcon sx={{ fontSize: 18 }} />,
      },
      {
        label: "Returns",
        path: "/seller/returns",
        icon: <ReplayRoundedIcon sx={{ fontSize: 18 }} />,
      },
    ],
  },
  {
    title: "Catalog",
    items: [
      {
        label: "Inventory",
        path: "/seller/inventory",
        icon: <Inventory2RoundedIcon sx={{ fontSize: 18 }} />,
      },
      {
        label: "Products",
        path: "/seller/products",
        icon: <CategoryRoundedIcon sx={{ fontSize: 18 }} />,
      },
      {
        label: "Add Product",
        shortLabel: "New Product",
        path: "/seller/add-product",
        icon: <AddBoxRoundedIcon sx={{ fontSize: 18 }} />,
      },
    ],
  },
  {
    title: "Finance",
    items: [
      {
        label: "Payments",
        path: "/seller/payment",
        icon: <PaymentsRoundedIcon sx={{ fontSize: 18 }} />,
      },
      {
        label: "Settlements",
        path: "/seller/settlements",
        icon: <AccountBalanceWalletRoundedIcon sx={{ fontSize: 18 }} />,
      },
      {
        label: "Transactions",
        path: "/seller/transaction",
        icon: <ReceiptLongRoundedIcon sx={{ fontSize: 18 }} />,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        label: "Account",
        path: "/seller/account",
        icon: <PersonRoundedIcon sx={{ fontSize: 18 }} />,
      },
    ],
  },
];

export const isSellerNavItemActive = (location: SellerLocationLike, item: SellerNavItem) => {
  if (item.path === "/seller") {
    return location.pathname === "/seller" || location.pathname === "/seller/";
  }

  if (item.path === "/seller/inventory") {
    return (
      location.pathname === "/seller/inventory" ||
      location.pathname.startsWith("/seller/inventory/") ||
      location.pathname === "/seller/invetory" ||
      location.pathname.startsWith("/seller/invetory/")
    );
  }

  return location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
};

export const getSellerPageMeta = (location: SellerLocationLike) => {
  for (const group of sellerMenuGroups) {
    const item = group.items.find((candidate) => isSellerNavItemActive(location, candidate));
    if (item) {
      return {
        title: item.label,
        groupTitle: group.title,
        currentItem: item,
      };
    }
  }

  const fallback = location.pathname
    .replace(/^\/seller\/?/, "")
    .split("/")[0]
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: fallback || "Dashboard",
    groupTitle: "Overview",
    currentItem: null,
  };
};
